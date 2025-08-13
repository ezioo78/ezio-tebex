local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)
  SendReactMessage('setVisible', shouldShow)
end

local userData = {}

local playerSkins = {}

RegisterNetEvent("gfx-tebexshop:updateUserData", function(key, value)
  if key then
    userData[key] = value
  else
    userData = value
  end
  SendReactMessage("updateUserData", userData)
end)

exports('toggleNuiFrame', toggleNuiFrame)
exports('GetPlayerTier', function()
  return userData.tier
end)
exports('GetPlayerCoins', function()
  return userData.coins
end)

Citizen.CreateThread(function()
  local skins = TriggerCallback('gfx-tebexshop:getPlayerSkins')
  local user = TriggerCallback('gfx-tebexshop:getUserData')
  userData = user
  playerSkins = skins
  while true do
    Citizen.Wait(250)
    local ped = PlayerPedId()
    local weapon = GetSelectedPedWeapon(ped)
    for k, v in pairs(playerSkins) do
      if v.equipped and GetHashKey(v.weapon) == weapon then
        GiveWeaponComponentToPed(ped, weapon, GetHashKey(v.skin))
      end
    end
  end
end)

RegisterCommand('tebexshop', function()
  local userData = TriggerCallback('gfx-tebexshop:getUserData')
  SendReactMessage('boost', userData.boostRemaining)
  toggleNuiFrame(true)
end)

RegisterNUICallback("hideFrame", function(data, cb)
  toggleNuiFrame(false)
  cb('ok')
end)

RegisterNUICallback("claimCode", function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:claimCode', data.code)
  if result.coins then
    SendReactMessage("coins", result.coins)
  end
  cb(result.status)
end)

RegisterNUICallback("getTiers", function(data, cb)
  Citizen.Wait(500)
  cb(Config.Tiers)
end)

RegisterNUICallback("getShopData", function(data, cb)
  Citizen.Wait(500)
  cb(Config.HomePagePackages)
end)

RegisterNUICallback("getSkins", function(data, cb)
  local skins = TriggerCallback('gfx-tebexshop:getPlayerSkins')
  playerSkins = skins
  Citizen.Wait(500)
  cb(FormatSkins(skins))
end)

RegisterNUICallback("getUserData", function(data, cb)
  local userData = TriggerCallback('gfx-tebexshop:getUserData')
  cb(userData)
end)

RegisterNUICallback("buyBoost", function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:buyBoost', data.cardData)
  print(87, json.encode(result))
  if result.coins then
    SendReactMessage("coins", result.coins)
  end
  if result.boostRemaining ~= nil then
    Citizen.CreateThread(function()
      SendReactMessage("boost", result.boostRemaining)
    end)
  end
  Citizen.Wait(500)
  cb(result)
end)

RegisterNUICallback("buyTier", function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:buyTier', data)
  if result.coins then
    SendReactMessage("coins", result.coins)
  end
  if result.status == "success" then
    userData.tier = result.tier
    SendReactMessage("setTier", result.tier)
  end
  Citizen.Wait(500)
  cb(result)
end)

RegisterNUICallback("buySkin", function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:buySkin', data)
  if result.coins then
    SendReactMessage("coins", result.coins)
  end
  if result.skins then
    playerSkins = result.skins
    SendReactMessage("setSkins", FormatSkins(result.skins))
  end
  Citizen.Wait(500)
  cb(result)
end)

RegisterNUICallback("equipSkin", function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:equipSkin', data)
  local skin = GetSkinById(data)
  if skin.skin == "default" then
    skin.equipped = true
  else
    for k, v in pairs(Config.Skins) do
      if v.weapon == skin.weapon then
        v.equipped = false
      end
    end
    skin.equipped = true
  end
  if result.skins then
    playerSkins = result.skins
    SendReactMessage("setSkins", FormatSkins(result.skins))
  end
  Citizen.Wait(500)
  cb(result)
end)

RegisterNUICallback('getTransactions', function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:getTransactions')
  Citizen.Wait(500)
  cb(result)
end)

RegisterNUICallback('refundTransaction', function(data, cb)
  local result = TriggerCallback('gfx-tebexshop:refundTransaction', data)
  if result.coins then
    SendReactMessage("coins", result.coins)
  end
  if result.transactions then
    SendReactMessage("setTransactions", result.transactions)
  end
  if result.refundRight then
    SendReactMessage("setRefundRight", result.refundRight)
  end
  if result.refundType == "tier" then
    SendReactMessage("setTier", result.user.tier.tier)
  end
  if result.refundType == "boost" then
    SendReactMessage("boost", result.boostRemaining)
  end
  if result.refundType == "skin" then
    for k, v in pairs(Config.Skins) do
      v.owned = v.skin == "default"
      v.equipped = v.skin == "default"
      for i, j in pairs(result.user.skins) do
        if v.id == j.id then
          v.owned = true
          v.equipped = j.equipped
        end
      end
    end
    SendReactMessage("setSkins", FormatSkins(result.user.skins))
  end
  Citizen.Wait(500)
  cb(result)
end)

function GetStaticData(tableKey, alterKey, id)
  for k, v in pairs(alterKey and Config[tableKey][alterKey] or Config[tableKey]) do
      if v.id == id then
          return v
      end
  end
end

function FormatSkins(skins)
  local formattedSkins = {}

  for k, v in pairs(Config.Skins) do
    for i, j in pairs(skins) do
      if v.id == j.id then
        v.owned = true
        v.equipped = j.equipped
        if j.equipped then
          local default, k = FindDefaultOfWeapon(formattedSkins,j.weapon)
          if k then
            formattedSkins[k].equipped = false
          end
        end
      end
    end
    
    table.insert(formattedSkins, {
      id = v.id,
      type = v.type,
      name = v.name,
      weapon = v.weapon,
      skin = v.skin,
      price = v.price,
      image = v.image,
      owned = v.owned,
      equipped = v.equipped,
      visible = v.visible
    })
  end
  return formattedSkins
end

function GetSkinById(id)
  for k, v in pairs(Config.Skins) do
    if v.id == id then
      return v
    end
  end
end

function FindDefaultOfWeapon(t, weapon)
  for k, v in pairs(t) do
    if v.weapon == weapon and v.skin == "default" then
      return v, k
    end
  end
end