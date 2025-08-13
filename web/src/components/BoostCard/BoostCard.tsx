import React, { useEffect, useState } from 'react'
import clockIcon from '../../assets/clock-icon.png'
import cartIcon from '../../assets/cart-icon.png'
import { getImageUrl } from '../../utils/getImage'
import YesNoModal from '../../modals/YesNoModal/YesNoModal'
import NotifyModal from '../../modals/NotifyModal/NotifyModal'
import LoadingModal from '../../modals/LoadingModal/LoadingModal'
import './BoostCard.css'
import { fetchNui } from '../../utils/fetchNui'
type Props = {
    cardData: any
}

export default function BoostCard({ cardData }: Props) {
    const [showModal, setShowModal] = useState(false)
    const [notifyData, setNotifyData] = useState({ title: '', text: '', active: false })
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        setShowModal(true)
    }

    useEffect(() => {
        if (showModal || loading || notifyData.active) {
            document.body.classList.add('modal-active');
        }

        if (!showModal && !loading && !notifyData.active) {
            document.body.classList.remove('modal-active');
        }

        return () => {
            if (!showModal && !loading && !notifyData.active) {
                document.body.classList.remove('modal-active');
            }
        }
    }, [showModal])

    return (
        <>
            <LoadingModal active={loading} />
            <YesNoModal
                title="XP Boost"
                question={`Are you sure you want to buy ${cardData.price} coins?`}
                yescb={() => { 
                    setShowModal(false)
                    setLoading(true)
                    fetchNui('buyBoost', {cardData})
                    .then((data) => {
                        setLoading(false)
                        if (data.status === 'success') {
                            setNotifyData({ title: 'Success', text: 'You have successfully bought the boost!', active: true })
                        } else {
                            setNotifyData({ title: 'Error', text: data.error, active: true })
                        }
                        setTimeout(() => {
                            setNotifyData({ title: '', text: '', active: false })
                            document.body.classList.remove('modal-active');
                        }, 3000);
                    })
                    .catch((error) => {
                        setLoading(false)
                        setNotifyData({ title: 'Error', text: 'An error occured while buying the boost!', active: true })
                        setTimeout(() => {
                            setNotifyData({ title: '', text: '', active: false })
                            document.body.classList.remove('modal-active');
                        }, 3000);
                    })
                }}
                nocb={() => { 
                    setShowModal(false)
                }}
                active={showModal}
            />
            <NotifyModal
                title={notifyData.title}
                text={notifyData.text}
                active={notifyData.active}
            />
            <div className='boost-card'>
                <div className="image-section">
                    <img src={getImageUrl(cardData.icon)} alt="boost" />
                </div>
                <div className="card-infos">
                    <h1>XP BOOST</h1>
                    <div className="clock-info">
                        <img src={clockIcon} alt="clock" />
                        <p>{cardData.hours} hours</p>
                    </div>
                    <div className="price-section">
                        <button className="boost-buy" onClick={handleClick}>
                            <img src={cartIcon} alt="cart" />
                            <p>BUY</p>
                        </button>
                        <p> <strong>{cardData.price}</strong> COIN</p>
                    </div>
                </div>
            </div>
        </>
    )
}