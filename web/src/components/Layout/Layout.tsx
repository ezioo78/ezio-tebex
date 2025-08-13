import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Layout.css'
import coinImage from '../../assets/coin.png'
import { useNuiEvent } from '../../hooks/useNuiEvent'
import { fetchNui } from '../../utils/fetchNui'
import documentIcon from '../../assets/document-icon.png'
import { getImageUrl } from '../../utils/getImage'

type Props = {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const activeFunction = (active: any) => {
        return active.isActive ? 'nav-link link-active' : 'nav-link'
    }

    const [userData, setUserData] = useState<any>({})
    const [coins, setCoins] = useState<number>(0)
    const [tier, setTier] = useState<string>('user')
    const [boost, setBoost] = useState<number>(0)
    const navigate = useNavigate()

    useNuiEvent<any>('coins', setCoins)
    useNuiEvent<any>('setTier', setTier)

    useNuiEvent<any>('boost', (data) => {
        setBoost(data)
    })

    useEffect(() => {
        navigate('/')
        fetchNui('getUserData')
        .then((data) => {
            setUserData(data)
            setCoins(data.coins)
            setTier(data.tier.tier)
        })
        .catch((err) => {
            const userData = {
                username: 'fizzfau',
                coins: 465,
                image: "https://media.discordapp.net/attachments/610776060744957953/1029899309665243187/3131.png?width=400&height=400&ex=65d687fa&is=65c412fa&hm=900cf0a8aaeb23d23ebc6f3e7c14f093d50fda829984db284e1bbe15240ce976&",
                tier: "silver"
            }
            setUserData(userData)
            setCoins(userData.coins)
            setTier(userData.tier)
        })
    }, [])

    return (
        <div className='navbar-container'>
            <div className="navbar">
                <div className="navbar-buttons">
                    <NavLink to="/" className={(active) => {return activeFunction(active)}}>XP PACKS</NavLink>
                    <NavLink to="/skins" className={(active) => {return activeFunction(active)}}>SKINS</NavLink>
                    <NavLink to="/tiers" className={(active) => {return activeFunction(active)}}>TIERS</NavLink>
                    <NavLink to="/transactions" className={(active) => {return activeFunction(active)}} style={{
                        width: "5vh"
                    }}>
                        <img src={documentIcon} alt="Transactions" />
                    </NavLink>

                </div>
                <div className="profile-info">
                    {
                        boost ? <div className="boost-timer">
                        <div className="boost-timer-title">
                            <img src={getImageUrl('tebexshop-icon1.png')} alt="" />
                            <p>XP BOOST</p>
                        </div>
                        <div className="boost-timer-minutes">
                            <p>{boost}</p>
                            <img src={getImageUrl('clock-icon.png')} alt="" />
                        </div>
                    </div> : <></>
                    }
                    
                    
                    {
                        (tier && tier != 'user') && <div className={`tier-section ${tier}`}>
                            <p>{tier.toUpperCase()}</p>
                        </div>
                    }
                    
                    <div className="text-section">
                        <p>{userData?.name}</p>
                        <div className="coin">
                            <p className="coin-count">{coins}</p>
                            <img src={coinImage} alt="" className="coin-image" />
                        </div>
                    </div>
                    <div className="image">
                        <img src={userData?.image} alt="Profile" />
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}