function TriggerCallback(name, ...)
    local id = GetRandomIntInRange(0, 999999)
    local eventName = "gfx-tebexshop:triggerCallback:" .. id
    local eventHandler
    local promise = promise:new()
    RegisterNetEvent(eventName)
    local eventHandler = AddEventHandler(eventName, function(...)
        promise:resolve(...)
    end)

    SetTimeout(15000, function()
        promise:resolve("timeout")
        RemoveEventHandler(eventHandler)
    end)
    local args = {...}
    TriggerServerEvent(name, id, args)

    local result = Citizen.Await(promise)
    RemoveEventHandler(eventHandler)
    return result
end