function RegisterCallback(name, cb)
    RegisterNetEvent(name, function(id, args)
        local src = source
        local eventName = "gfx-tebexshop:triggerCallback:" .. id
        CreateThread(function()
            local result = cb(src, table.unpack(args))
            TriggerClientEvent(eventName, src, result)
        end)
    end)
end

function TriggerOnPolice(eventName, ...)
    local players = GetPlayers()
    for i = 1, #players do
        local player = players[i]
        local job = GetJob(player)
        if Config.AuthorizedJobs then
            TriggerClientEvent(eventName, player, ...)
        end
    end
end