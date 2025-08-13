fx_version "cerulean"

description "Basic React (TypeScript) & Lua Game Scripts Boilerplate"
author "Project Error"
version '1.0.0'
repository 'https://github.com/project-error/fivem-react-boilerplate-lua'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

client_script {
  "config.lua",
  "client/**/*"
}
server_script {
  "config.lua",
  "server/**/*"
}

files {
	'web/build/index.html',
	'web/build/**/*',
  'weapons/*.meta',
	'weapons/components/*.meta',
	'weapons/weapons/*.meta'
}

data_file 'WEAPONCOMPONENTSINFO_FILE' 'weapons/*.meta'
data_file 'WEAPON_METADATA_FILE' 'weapons/weaponarchetypes.meta'
data_file 'WEAPONINFO_FILE_PATCH' 'weapons/weapons/*.meta'

escrow_ignore {
  "config.lua",
  "server/*.lua",
  "client/*.lua",
  "stream/skins/*.ydr",
  "stream/skins/*.ytd"
}

dependency '/assetpacks'
dependency '/assetpacks'