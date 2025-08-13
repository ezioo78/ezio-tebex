Config = {
    SQLScript = "oxmysql", -- mysql-async, oxmysql, ghmattimysql
    NoImage = "https://cdn.discordapp.com/attachments/736562375062192199/995301291976831026/noimage.png", -- Image to display when no image is found
    HomePagePackages = {
        boosts = {
            { id = 1, name = "Boost 1", price = 100, icon = "tebexshop-icon4.png", hours = 1, visible = false },
            { id = 2, name = "Boost 2", price = 200, icon = "tebexshop-icon4.png", hours = 2, visible = false },
            { id = 3, name = "Boost 3", price = 500, icon = "tebexshop-icon1.png", hours = 4, visible = false },
            { id = 4, name = "Boost 4", price = 1000, icon = "tebexshop-icon2.png", hours = 8, visible = false }
        },
        coins = {
            { id = 1, amount = "500", icon = "mocro-coin-icon.png", link = "https://ezio.tebex.io/package/6959904" , visible = true },
            { id = 2, amount = "1000", icon = "mocro-coin-icon.png", link = "https://ezio.tebex.io/package/6959904", visible = true },
            { id = 3, amount = "2000", icon = "mocro-coin-icon.png", link = "https://ezio.tebex.io/package/6959904", visible = true },
            { id = 4, amount = "5000", icon = "mocro-coin-icon.png", link = "https://ezio.tebex.io/package/6959904", visible = true }
        }
    },
    Admins = {
        ["steam:1100001671ea135"] = true,
    },
    Tiers = {
        {
            id = 1,
            tier = "bronze",
            name = 'Bronze',
            color = 'blue',
            description = 'Basic Tier',
            price = 500,
            items = {
                { id = 1, text = 'Speed Running' },
                { id = 2, text = 'Extra Stash' },
                { id = 3, text = '1 Vehicle' }
            },
            visible = true
        },
        {
            id = 2,
            tier = "silver",
            name = 'Silver',
            color = 'red',
            description = 'Intermediate Tier',
            price = 1000,
            items = {
                { id = 1, text = 'Speed Running' },
                { id = 2, text = 'Extra Stash' },
                { id = 3, text = '1 Vehicle' }
            },
            visible = true
        },
        {
            id = 3,
            tier = "gold",
            name = 'Gold',
            color = 'yellow',
            description = 'Advanced Tier',
            price = 2000,
            items = {
                { id = 1, text = 'Speed Running' },
                { id = 2, text = 'Extra Stash' },
                { id = 3, text = '1 Vehicle' }
            },
            visible = true
        }
    },
    Skins = {
        {
            id = 1,
            name = "M4 Default",
            weapon = "weapon_assaultrifle",
            weaponLabel = "M4",
            skin = "default",
            owned = false,
            equipped = true,
            price = 0,
            image = "https://cdn.discordapp.com/attachments/610776060744957953/1208775644809535498/weapon_carbinerifle_mk2.png?ex=65e4830b&is=65d20e0b&hm=64c8807e77f84f5dee7f0de537a6a8fc917d49a1db96d8e265ac3f6d99305066&",
            visible = false
            
        },
        {
            id = 2,
            type = "common",
            name = "M4 Anime Skin",
            weapon = "weapon_carbinerifle_mk2",
            weaponLabel = "M4",
            skin = "COMPONENT_CARBINERIFLE_MK2_ANIME",
            price = 16,
            image = "COMPONENT_CARBINERIFLE_MK2_ANIME.png",
            visible = false
        },
        {
            id = 3,
            type = "rare",
            name = "M4 Jordan Skin",
            weapon = "weapon_carbinerifle_mk2",
            weaponLabel = "M4",
            skin = "COMPONENT_CARBINERIFLE_MK2_JORDAN",
            price = 30,
            image = "COMPONENT_CARBINERIFLE_MK2_JORDAN.png",
            visible = false
        },

        {
            id = 4,
            name = "Assault Rifle Default",
            weapon = "weapon_assaultrifle_mk2",
            weaponLabel = "Assault Rifle",
            skin = "default",
            owned = false,
            equipped = true,
            price = 0,
            image = "https://cdn.discordapp.com/attachments/610776060744957953/1208775644574384149/weapon_assaultrifle_mk2.png?ex=65e4830b&is=65d20e0b&hm=dec7ecb96fde07fc3bafa50592fc6d99ff54a3cebef6c884dcded7b17f9ccb7a&",
            visible = false
        },

        {
            id = 5,
            type = "rare",
            name = "Assault Rifle KITTY",
            weapon = "weapon_assaultrifle_mk2",
            weaponLabel = "Assault Rifle",
            skin = "COMPONENT_ASSAULTRIFLE_MK2_KITTY",
            price = 32,
            image = "COMPONENT_ASSAULTRIFLE_MK2_KITTY.png",
            visible = false
        },
    
        {
            id = 6,
            type = "rare",
            name = "Assault Rifle Hoho",
            weapon = "weapon_assaultrifle_mk2",
            weaponLabel = "Assault Rifle",
            skin = "COMPONENT_ASSAULTRIFLE_MK2_HOHOHO",
            price = 50,
            image = "COMPONENT_ASSAULTRIFLE_MK2_HOHOHO.png",
            visible = false
        }
    }
}
