local Users = {}

Citizen.CreateThread(function()
    local users = ExecuteSql('SELECT * FROM eziotebexstore_users')
    for k, v in pairs(users) do
        Users[v.id] = v
    end
end)

exports('GetPlayerTier', function(source)
    local id = GetPlayerIdentifiers(source)[1]
    local user = Users[id]
    return GetUserTier(user and user.tier)
end)

exports('GetPlayerCoins', function(source)
    local id = GetPlayerIdentifiers(source)[1]
    local user = Users[id]
    return user and user.coins or 0
end)

RegisterCallback('gfx-tebexshop:getPlayerSkins', function(source)
    local src = source
    local id = GetPlayerIdentifiers(src)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    return user[1] and json.decode(user[1].skins) or {}
end)

RegisterCallback('gfx-tebexshop:claimCode', function(source, code)
    local src = source
    Citizen.Wait(1000)
    local transactions = ExecuteSql('SELECT * FROM eziotebexstore_transactions WHERE id = @code', {
        ['@code'] = code
    })
    if transactions[1] then
        local transaction = transactions[1]
        local id = GetPlayerIdentifiers(src)[1]
        local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
            ['@id'] = id
        })

        if user[1] then
            local newCoins = user[1].coins + transaction.amount
            ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins WHERE id = @id', {
                ['@coins'] = newCoins,
                ['@id'] = id
            })
            ExecuteSql('DELETE FROM eziotebexstore_transactions WHERE id = @id', {
                ['@id'] = transaction.id
            })
            AddTransaction(src, "Claimed Code", "mocro-coin-icon.png", "Claimed Code", transaction.amount, "coin")
            Users[id].coins = newCoins
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
            DiscordLog(GetPlayerName(src) .. " has claimed a code: " .. code.. " and got " .. transaction.amount .. " coins")
            return {status = "accepted", coins = newCoins}
        else
            ExecuteSql('INSERT INTO eziotebexstore_users (id, skins, tier, coins, boost, refund_right) VALUES (@id, @skins, @tier, @coins, @boost, @refund_right)', {
                ['@id'] = id,
                ['@skins'] = json.encode({}),
                ['@tier'] = json.encode({tier = "user", bought = os.time()}),
                ['@coins'] = transaction.amount,
                ['@refund_right'] = DefaultRefundRight,
                ['@boost'] = nil
                
            })
            ExecuteSql('DELETE FROM eziotebexstore_transactions WHERE id = @id', {
                ['@id'] = transaction.id
            })
            AddTransaction(src, "Claimed Code", "mocro-coin-icon.png", "Claimed Code", transaction.amount, "coin")
            Users[id] = {id = id, skins = {}, tier = "user", coins = transaction.amount}
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, nil, Users[id])
            DiscordLog(GetPlayerName(src) .. " has claimed a code: " .. code.. " and got " .. transaction.amount .. " coins")
            return {status = "accepted", coins = transaction.amount}
        end
    else
        return {status = "error"}
    end
    -- return (code == "tbx-1234567890") and "accepted" or "error"
end)

RegisterCallback("gfx-tebexshop:getUserData", function(source)
    local src = source
    local id = GetPlayerIdentifiers(src)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    local tierData = user[1] and json.decode(user[1].tier) or {tier = "user", bought = os.time()}
    local userData = {
        name = GetPlayerName(src),
        coins = user[1] and user[1].coins or 0,
        image = GetSteamProfilePicture(src),
        skins = user[1] and json.decode(user[1].skins) or {},
        tier = tierData,
        boost = user[1] and json.decode(user[1].boost) or nil,
        refundRight = user[1] and user[1].refund_right or 0,
        boostRemaining = GetHoursRemaining(user[1] and json.decode(user[1].boost) or nil)
    }
    Users[id] = userData
    return userData
end)

function GetHoursRemaining(boostData)
    local now = os.time()
    local h = boostData and (boostData.expires < now and 0 or math.floor((boostData.expires - now) / 3600))
    local m = boostData and (boostData.expires < now and 0 or math.floor((boostData.expires - now) / 60) % 60)
    if h == 0 and m == 0 then
        return "Expired"
    end
    if h and m then
        return h.. "H " .. m .. "M"
    end
    return false
end

RegisterCallback('gfx-tebexshop:buyBoost', function(source, cardData)
    local src = source
    local boostData = GetStaticData('HomePagePackages', 'boosts', cardData.id)
    local hasCoins = HasEnoughCoins(src, boostData.price)
    if hasCoins then
        local id = GetPlayerIdentifiers(src)[1]
        local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
            ['@id'] = id
        })
        local boost = json.decode(user[1].boost)
        if user[1].boost then
            boost.expires = boost.expires < os.time() and os.time() + (boostData.hours * 3600) or boost.expires + (boostData.hours * 3600)
            ExecuteSql('UPDATE eziotebexstore_users SET boost = @boost WHERE id = @id', {
                ['@boost'] = json.encode(boost),
                ['@id'] = id
            })
        else
            ExecuteSql('UPDATE eziotebexstore_users SET boost = @boost WHERE id = @id', {
                ['@boost'] = json.encode({expires = os.time() + (boostData.hours * 3600)}),
                ['@id'] = id
            })
            boost = {expires = os.time() + (boostData.hours * 3600)}
        end
        local newCoins = user[1].coins - boostData.price
        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@id'] = id
        })
        AddTransaction(src, boostData.name, boostData.icon, boostData.hours.. " hours", boostData.price, "boost", boostData.id)
        Users[id].coins = newCoins
        Users[id].boost = boost
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "boost", boost)
        DiscordLog(GetPlayerName(src) .. " has bought a boost: " .. boostData.name)
        return {status = "success", coins = newCoins, boostRemaining = GetHoursRemaining(boost), boost = boost}
    else
        return {status = "error", error = "Not enough coins"}
    end
end)

RegisterCallback('gfx-tebexshop:buyTier', function(source, id)
    local src = source
    local tierData = GetStaticData('Tiers', nil, id)
        
    local id = GetPlayerIdentifiers(src)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    local userTier = user[1] and json.decode(user[1].tier) or {tier = "user", bought = os.time()}
    if userTier.tier ~= "user" and GetUserTier(userTier) == tierData.tier then
        return {status = "error", error = "You already have this tier"}
    end
    local hasCoins = HasEnoughCoins(src, tierData.price)
    if hasCoins then
        local tierObject = {tier = tierData.tier, bought = os.time()}
        local newCoins = user[1].coins - tierData.price
        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins, tier = @tier WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@tier'] = json.encode(tierObject),
            ['@id'] = id
        })
        AddTransaction(src, tierData.name, tierData.image, tierData.description, tierData.price, "tier", tierData.id)
        Users[id].coins = newCoins
        Users[id].tier = tierObject
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "tier", tierObject)
        DiscordLog(GetPlayerName(src) .. " has bought a tier: " .. tierData.tier)
        return {status = "success", coins = newCoins, tier = tierData.tier}
    else
        return {status = "error", error = "Not enough coins"}
    end
end)

RegisterCallback('gfx-tebexshop:buySkin', function(source, skinId)
    local src = source
    local id = GetPlayerIdentifiers(src)[1]
    local skinData = GetStaticData('Skins', nil, skinId)
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    local skins = user[1] and json.decode(user[1].skins) or {}
    if HasSkin(skins, skinData.weapon, skinData.skin) then
        return {status = "error", error = "You already have this skin!"}
    end
    local hasCoins = HasEnoughCoins(src, skinData.price)
    if hasCoins then
        table.insert(skins, {id = skinData.id, skin = skinData.skin, weapon = skinData.weapon, equipped = false})
        local newCoins = user[1].coins - skinData.price
        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins, skins = @skins WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@skins'] = json.encode(skins),
            ['@id'] = id
        })
        AddTransaction(src, skinData.name, skinData.image, skinData.weaponLabel, skinData.price, "skin", skinData.id)
        Users[id].coins = newCoins
        Users[id].skins = skins
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "skins", skins)
        DiscordLog(GetPlayerName(src) .. " has bought a skin: " .. skinData.name)
        return {status = "success", coins = newCoins, skins = skins}
    else
        return {status = "error", error = "Not enough coins!"}
    end
end)

RegisterCallback('gfx-tebexshop:equipSkin', function(source, skinId)
    local src = source
    local id = GetPlayerIdentifiers(src)[1]
    local skinData = GetStaticData('Skins', nil, skinId)
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    local skins = user[1].skins and json.decode(user[1].skins) or {}
    for k, v in pairs(skins) do
        if v.weapon == skinData.weapon then
            v.equipped = v.id == skinId
        end
    end
    Users[id].skins = skins
    TriggerClientEvent("gfx-tebexshop:updateUserData", src, "skins", skins)
    ExecuteSql('UPDATE eziotebexstore_users SET skins = @skins WHERE id = @id', {
        ['@skins'] = json.encode(skins),
        ['@id'] = id
    })
    return {status = "success", skins = skins}
end)

RegisterCallback('gfx-tebexshop:getTransactions', function(source)
    local id = GetPlayerIdentifiers(source)[1]
    local transactions = ExecuteSql('SELECT * FROM eziotebexstore_transactionLogs WHERE id = @id', {
        ['@id'] = id
    })
    return transactions[1] and {
        transactions = json.decode(transactions[1].transactions),
        refundRight = Users[id].refundRight
    } or {
        transactions = {},
        refundRight = Users[id].refundRight
    }
end)

RegisterCallback('gfx-tebexshop:refundTransaction', function(source, transactionId)
    local src = source
    local id = GetPlayerIdentifiers(src)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    user[1].tier = json.decode(user[1].tier)
    if user[1] and user[1].refund_right > 0 then
        local transactions = ExecuteSql('SELECT * FROM eziotebexstore_transactionLogs WHERE id = @id', {
            ['@id'] = id
        })
        local transactionData = json.decode(transactions[1].transactions)
        local transaction, index = GetTransactionById(transactionData, transactionId)

        local newCoins = user[1].coins + transaction.price
        transactionData[index].refundDate = os.date('%d/%m/%Y - %H:%M', os.time())
        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins, refund_right = @refund_right WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@refund_right'] = user[1].refund_right - 1,
            ['@id'] = id
        })
        ExecuteSql('UPDATE eziotebexstore_transactionLogs SET transactions = @transactions WHERE id = @id', {
            ['@transactions'] = json.encode(transactionData),
            ['@id'] = id
        })

        if transaction.type == "skin" then
            local skins = user[1].skins and json.decode(user[1].skins) or {}
            for k, v in pairs(skins) do
                if v.id == transaction.packageId then
                    table.remove(skins, k)
                    break
                end
            end
            Users[id].coins = newCoins
            Users[id].skins = skins
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "skins", skins)
        elseif transaction.type == "tier" then
            local tierData = {tier = "user", bought = os.time()}
            user[1].tier = tierData
            Users[id].coins = newCoins
            Users[id].tier = tierData
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "tier", tierData)
        elseif transaction.type == "boost" then
            local boost = user[1].boost and json.decode(user[1].boost) or nil
            if user[1].boost then
                local boostData = GetStaticData('HomePagePackages', 'boosts', transaction.packageId)
                boost.expires = boost.expires < os.time() and os.time() - (boostData.hours * 3600) or boost.expires - (boostData.hours * 3600)
            end
            Users[id].coins = newCoins
            Users[id].boost = boost
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
            TriggerClientEvent("gfx-tebexshop:updateUserData", src, "boost", boost)
        end

        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins, refund_right = @refund_right, boost = @boost, skins = @skins, tier = @tier WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@refund_right'] = user[1].refund_right - 1,
            ['@id'] = id,
            ['@boost'] = (Users[id] and Users[id].boost) and json.encode(Users[id].boost) or nil,
            ['@skins'] = Users[id] and json.encode(Users[id].skins) or nil,
            ['@tier'] = user[1].tier and json.encode(user[1].tier) or nil
        })

        Users[id].coins = newCoins
        Users[id].transactions = transactionData
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "coins", newCoins)
        TriggerClientEvent("gfx-tebexshop:updateUserData", src, "transactions", transactionData)
        return {status = "success", coins = newCoins, transactions = transactionData, refundRight = user[1].refund_right - 1, refundType = transaction.type, user = Users[id], boostRemaining = GetHoursRemaining(Users[id].boost)}
    else
        return {status = "error", error = "You don't have any refund rights left!"}
    end
end)

function GetTransactionById(transactions, id)
    for k, v in pairs(transactions) do
        if v.id == id then
            return v, k
        end
    end
end

function AddTransaction(source, package, image, description, price, transactionType, packageId)
    local id = GetPlayerIdentifiers(source)[1]
    local previousTransactions = ExecuteSql('SELECT * FROM eziotebexstore_transactionLogs WHERE id = @id', {
        ['@id'] = id
    })
    local transactionId
    if previousTransactions[1] then
        previousTransactions = json.decode(previousTransactions[1].transactions)
        transactionId = previousTransactions[#previousTransactions] and previousTransactions[#previousTransactions].id + 1 or 1
    else
        transactionId = 1
    end
    local transactionData = {
        id = transactionId,
        packageId = packageId,
        package = package,
        image = image,
        description = description,
        transactionDate = os.date('%d/%m/%Y - %H:%M', os.time()),
        price = price,
        type = transactionType
    }
    if transactionData.id == 1 then
        ExecuteSql('INSERT INTO eziotebexstore_transactionLogs (id, transactions) VALUES (@id, @transactions)', {
            ['@id'] = id,
            ['@transactions'] = json.encode({transactionData})
        })
    else
        table.insert(previousTransactions, transactionData)
        ExecuteSql('UPDATE eziotebexstore_transactionLogs SET transactions = @transactions WHERE id = @id', {
            ['@transactions'] = json.encode(previousTransactions),
            ['@id'] = id
        })
    end
end

function HasSkin(skins, weapon, skin)
    for k, v in pairs(skins) do
        if v.weapon == weapon and v.skin == skin then
            return true
        end
    end
    return false
end

function GetUserTier(userTierData)
    local now = os.time()
    if userTierData and userTierData.tier ~= "user" and userTierData.bought + 2592000 > now then
        return userTierData.tier
    else
        return "user"
    end
end

function GetStaticData(tableKey, alterKey, id)
    for k, v in pairs(alterKey and Config[tableKey][alterKey] or Config[tableKey]) do
        if v.id == id then
            return v
        end
    end
end

function HasEnoughCoins(src, amount)
    local id = GetPlayerIdentifiers(src)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    return user[1] and user[1].coins >= amount
end

-- steam profile

GetSteamProfilePicture = function(source)
    local identifier = GetIdent(source)
    if not identifier then
        return Config.NoImage
    end
    if identifier:match("steam") then
        local callback = promise:new()
        PerformHttpRequest('http://steamcommunity.com/profiles/' .. tonumber(GetIDFromSource('steam', identifier), 16) .. '/?xml=1', function(Error, Content, Head)
            local SteamProfileSplitted = stringsplit(Content, '\n')
            if SteamProfileSplitted ~= nil and next(SteamProfileSplitted) ~= nil then
                for i, Line in ipairs(SteamProfileSplitted) do
                    if Line:find('<avatarFull>') then
                        callback:resolve(Line:gsub('	<avatarFull><!%[CDATA%[', ''):gsub(']]></avatarFull>', ''))
                        break
                    end
                end
            end
        end)
        local avatar = Citizen.Await(callback)
        return avatar
    end
    return ""
end -- your framework doesn't support steam id : D I think yes IDK by the way what do you recommend now? for what? what do you think about script, i dont think so what is wrong with steam IDK i cant say nothing because i dont know but its 

function GetIDFromSource(Type, CurrentID)
	local ID = stringsplit(CurrentID, ':')
	if (ID[1]:lower() == string.lower(Type)) then
		return ID[2]:lower()
	end
	return nil
end

function stringsplit(input, seperator)
	if seperator == nil then
		seperator = '%s'
	end

	local t={} ; i=1
	if input ~= nil then
		for str in string.gmatch(input, '([^'..seperator..']+)') do
			t[i] = str
			i = i + 1
		end
		return t
	end
end

function GetIdent(source, idType)
    for i = 0, GetNumPlayerIdentifiers(source) - 1 do
        local id = GetPlayerIdentifier(source, i)
        if string.find(id, "steam:") then
            return id
        end
    end
    return false
end

RegisterCommand("packagebought", function(source, args)
    local transactionId = args[1]
    local packageId = args[2]
    local packageData = Packages[packageId]

    if source ~= 0 then return end

    if not packageData then
        return DiscordLog('Invalid package ID: ' .. packageId)
    end

    ExecuteSql('INSERT INTO eziotebexstore_transactions (id, amount) VALUES (@id, @amount)', {
        ['@id'] = transactionId,
        ['@amount'] = packageData.amount
    })
end)

function IsAdmin(source, identifier)
    if identifier == nil then
        identifier = GetPlayerIdentifiers(source)[1]
    end
    return Config.Admins[identifier] --or your admin function
end

RegisterCommand("givecoin", function(source, args)
    local target = args[1]
    local amount = args[2]

    if not IsAdmin(source) or GetPlayerIdentifiers(target)[1] == nil then return end
    local id = GetPlayerIdentifiers(target)[1]
    local user = ExecuteSql('SELECT * FROM eziotebexstore_users WHERE id = @id', {
        ['@id'] = id
    })
    if user[1] then
        print("This user has an account")
        local newCoins = tonumber(user[1].coins) + tonumber(amount)
        ExecuteSql('UPDATE eziotebexstore_users SET coins = @coins WHERE id = @id', {
            ['@coins'] = newCoins,
            ['@id'] = id
        })
        if Users[id] then
            Users[id].coins = newCoins
        end
    else
        print("This user does not have an account")
        ExecuteSql('INSERT INTO eziotebexstore_users (id, skins, tier, coins, boost, refund_right) VALUES (@id, @skins, @tier, @coins, @boost, @refund_right)', {
            ['@id'] = id,
            ['@skins'] = json.encode({}),
            ['@tier'] = json.encode({tier = "user", bought = os.time()}),
            ['@coins'] = tonumber(amount),
            ['@refund_right'] = DefaultRefundRight,
            ['@boost'] = nil
            
        })
    end
    DiscordLog(GetPlayerName(source) .. " has given " .. amount.. " coins to " .. GetPlayerName(target))
end)

function DiscordLog(message)
    PerformHttpRequest(DiscordWebhook, function(err, text, headers) end, 'POST', json.encode({content = message}), {['Content-Type'] = 'application/json'})
end
