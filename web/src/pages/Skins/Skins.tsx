import React, { useState, useEffect } from 'react'
import './Skins.css'
import SkinMenuButton from '../../components/SkinMenuButton/SkinMenuButton'
import SkinBox from '../../components/SkinBox/SkinBox'
import { getImageUrl } from '../../utils/getImage'
import { fetchNui } from '../../utils/fetchNui'
import PropagateLoader from "react-spinners/PropagateLoader";
import { useNuiEvent } from '../../hooks/useNuiEvent'

type Props = {}

export default function Skins({ }: Props) {
  const [type, setType] = useState<string>("all")
  const [checked, setChecked] = useState<boolean>(false)
  const [skins, setSkins] = useState<any[]>([])
  const [types, setTypes] = useState<string[]>(["all", "legendary", "epic", "rare", "uncommon", "common"])
  const [loading, setLoading] = useState<boolean>(true)

  const handleClick = (type: string) => {
    setType(type)
  }

  useNuiEvent('setSkins', (data) => {
    setSkins(data)
    setLoading(false)
  })

  useEffect(() => {
    fetchNui("getSkins")
      .then((data) => {
        setSkins(data)
        setLoading(false)
      })
      .catch((err) => {
        const skinObject = [
          {
            id: 1,
            type: "common",
            name: "Weapon Name",
            weapon: "weapon_assaultrifle",
            owned: true,
            skin: "skin_assaultrifle_1",
            price: 31,
            image: "weapon.png"
          },
          {
            id: 2,
            type: "uncommon",
            name: "Weapon Name",
            price: 1000,
            image: "weapon_carbinerifle.png"
          },
          {
            id: 3,
            type: "epic",
            name: "Weapon Name",
            price: 350,
            image: "weapon.png"
          },
          {
            id: 4,
            type: "legendary",
            name: "Weapon Name",
            price: 1000,
            image: "weapon.png"
          },
          {
            id: 5,
            type: "rare",
            name: "Weapon Name",
            price: 1000,
            image: "weapon.png"
          },
          {
            id: 6,
            type: "legendary",
            name: "Weapon Name",
            price: 1000,
            image: "weapon.png"
          }
        ]
        setSkins(skinObject)
        const types: string[] = ["all"]
        skinObject.forEach((skin) => {
          if (!types.includes(skin.type)) {
            types.push(skin.type)
          }
        })
        setTypes(types)
        setLoading(false)

      })
  }, [type])

  return (
    <div className='skins-page'>
      <div className="skins-menu">
        <div className="skins-buttons">
          {types.map((element) => {
            return <SkinMenuButton key={element} active={type == element} cb={() => handleClick(element)} label={element.toUpperCase()} />
          })}
        </div>
        <div className="skins-checkbox">
          {/* <input className="skins-checkbox-input" type="checkbox" id="show-owned" name="show-owned" checked={checked} onChange={() => setChecked(!checked)} /> */}

          <button onClick={() => setChecked(!checked)} className="skins-checkboxmadebynitrosxd">
            {
              checked ? <img src={getImageUrl("checkbox-tick.png")} alt="" /> : ""
            }
          </button>

          <div className="skins-checkbox-label">
            <h1>Show</h1>
            <p>Only Owned</p>
          </div>
        </div>
      </div>
      <div className={!loading ? "skin-list" : "skin-list loading"}>
        {
          loading ?
            <PropagateLoader color={"#4322CA"} loading={loading} size={15} />
            : skins.map((skin) => {
              if (skin.visible || skin.owned) {
                if ((skin.owned || !checked) && (type == "all" || skin.type == type)) {
                  return <SkinBox key={skin.id} skinData={skin} />
                }
              }
              
            })
        }

      </div>
    </div>
  )
}
