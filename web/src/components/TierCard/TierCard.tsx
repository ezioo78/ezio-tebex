import React, {useState, useEffect} from 'react'
import './TierCard.css'
import { getImageUrl } from '../../utils/getImage'
import LoadingModal from '../../modals/LoadingModal/LoadingModal'
import NotifyModal from '../../modals/NotifyModal/NotifyModal'
import YesNoModal from '../../modals/YesNoModal/YesNoModal'
import { fetchNui } from '../../utils/fetchNui'

type Props = {
    tier: any
}

export default function TierCard({ tier }: Props) {

    const [loading, setLoading] = useState(false)
    const [notifyData, setNotifyData] = useState({title:'', text:'', visible: false})
    const [modalData, setModalData] = useState({title:'', text:'', visible: false, cb: () => {}})

    const handleClick = () => {
        setModalData({title: 'Are you sure?', text: `Are you sure you want to buy ${tier.name} for ${tier.price} coin?`, visible: true, cb: () => {
            setLoading(true)
            fetchNui('buyTier', tier.id)
            .then((res) => {
                if (res.status === 'success') {
                    setLoading(false)
                    setNotifyData({title: 'Success', text: `You have successfully bought ${tier.name} for ${tier.price} coin`, visible: true})
                    setTimeout(() => {
                        setNotifyData({title: '', text: '', visible: false})
                        document.body.classList.remove('modal-active');
                    }, 3000);
                } else {
                    setLoading(false)
                    setNotifyData({title: 'Error', text: res.error, visible: true})
                    setTimeout(() => {
                        setNotifyData({title: '', text: '', visible: false})
                        document.body.classList.remove('modal-active');
                    }, 3000);
                }
            })
            .catch((err) => {
                setLoading(false)
                setNotifyData({title: 'Error', text: `You don't have enough coin to buy this tier`, visible: true})
                setTimeout(() => {
                    setNotifyData({title: '', text: '', visible: false})
                    document.body.classList.remove('modal-active');
                }, 3000);
            })
        }})
    }

    return (
        <React.Fragment>

            <LoadingModal active={loading} />

            <NotifyModal title={notifyData.title} text={notifyData.text} active={notifyData.visible} />

            <YesNoModal title={modalData.title} question={modalData.text} active={modalData.visible}
                yescb={()=> {
                    modalData.cb()
                    setModalData({title:'', text:'', visible: false, cb: () => {}})
                }}
                nocb={()=> {
                    setModalData({title:'', text:'', visible: false, cb: () => {}})
                }}
            />

            <div className={`tier-card ${tier.color}-tier`}>
            <div className="tier-header">
                    <h1>{tier.name}</h1>
                    <h2>{tier.description}</h2>
                    <p>Most Popular</p>
                </div>
                <div className="tier-price-section">
                <img src={getImageUrl(`coin-${tier.color}.png`)} alt="" />
                    <h1 className="tier-price">{tier.price}</h1>
                    <p className="tier-price-date">/month</p>
                </div>
                <div className="tier-item-list">
                    {
                        tier.items.map((item: any) => {
                            return (
                                <div className="tier-item">
                                    <img src={getImageUrl("checkmark.png")} alt="" />
                                    <p>{item.text}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="tier-button-contain" onClick={handleClick}>
                    <button className="tier-button">Select</button>
                </div>
            </div>
        </React.Fragment>
        
    )
}