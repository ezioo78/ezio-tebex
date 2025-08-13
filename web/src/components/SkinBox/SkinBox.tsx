import React, { useState, useEffect } from 'react'
import './SkinBox.css'
import skinCoin from '../../assets/skin-coin.png'
import { getImageUrl } from '../../utils/getImage'
import YesNoModal from '../../modals/YesNoModal/YesNoModal'
import NotifyModal from '../../modals/NotifyModal/NotifyModal'
import { fetchNui } from '../../utils/fetchNui'
import LoadingModal from '../../modals/LoadingModal/LoadingModal'

type Props = {
    skinData: any,
    key: number
}

export default function SkinBox({ key, skinData }: Props) {
    const [modalData, setModalData] = useState({title:'', text:'', visible: false, cb: () => {}})
    const [notifyData, setNotifyData] = useState({title:'', text:'', visible: false})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (modalData.visible || loading || notifyData.visible) {
            document.body.classList.add('modal-active');
        }

        if (!modalData.visible && !loading && !notifyData.visible) {
            document.body.classList.remove('modal-active');
        }

        return () => {
            if (!modalData.visible && !loading && !notifyData.visible) {
                document.body.classList.remove('modal-active');
            }
        }
    }, [modalData.visible])


    const handleClick = () => {
        if (!skinData.owned) {
            setModalData({title: 'Are you sure?', text: `Are you sure you want to buy this skin for ${skinData.price} coin?`, visible: true, cb: () => {
                    setLoading(true)
                    fetchNui('buySkin', skinData.id)
                    .then((res) => {
                        if (res.status === 'success') {
                            setLoading(false)
                            setNotifyData({title: 'Success', text: `You have successfully bought ${skinData.name} for ${skinData.price} coin`, visible: true})
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
                        setNotifyData({title: 'Error', text: `You don't have enough coin to buy this skin`, visible: true})
                        setTimeout(() => {
                            setNotifyData({title: '', text: '', visible: false})
                            document.body.classList.remove('modal-active');
                        }, 3000);
                    })
                }
            })
        } else {
            setModalData({title: 'Are you sure?', text: `Are you sure you want to equip this skin?`, visible: true, cb: () => {
                    setLoading(true)
                    fetchNui('equipSkin', skinData.id)
                    .then((res) => {
                        if (res.status === 'success') {
                            setLoading(false)
                            setNotifyData({title: 'Success', text: `You have successfully equipped ${skinData.name} skin!`, visible: true})
                            setTimeout(() => {
                                setNotifyData({title: '', text: '', visible: false})
                                document.body.classList.remove('modal-active');
                            }, 3000);
                        } else {
                            setLoading(false)
                            setNotifyData({title: 'Error', text: `You don't have this skin!`, visible: true})
                            setTimeout(() => {
                                setNotifyData({title: '', text: '', visible: false})
                                document.body.classList.remove('modal-active');
                            }, 3000);
                        }
                    })
                    .catch((err) => {
                        setLoading(false)
                        setNotifyData({title: 'Error', text: `You don't have this skin!`, visible: true})
                        setTimeout(() => {
                            setNotifyData({title: '', text: '', visible: false})
                            document.body.classList.remove('modal-active');
                        }, 3000);
                    })
                }
            })
        }
    }

    return (
        <>

            <LoadingModal active={loading} />

            <NotifyModal
                title={notifyData.title}
                text={notifyData.text}
                active={notifyData.visible}
            />

            <YesNoModal
                title={modalData.title}
                question={modalData.text}
                yescb={() => 
                {
                    modalData.cb()
                    setModalData({title:'', text:'', visible: false, cb: () => {}})
                
                }}
                nocb={() => 
                {
                    setModalData({title:'', text:'', visible: false, cb: () => {}})
                }
                }
                active={modalData.visible}
            />

            <div className='skin-box' onClick={handleClick} key={key}>
                <div className="skin-box-header">
                    <div className="skin-box-header-child -start">
                        {skinData.equipped && <div className="skin-box-equipped">Equipped</div>}
                    </div>
                    <div className="skin-box-header-child -end">
                        {skinData.type && <p className={skinData.type + "-text"}>{skinData.type.toUpperCase()}</p>}
                    </div>
                </div>
                <div className="skin-box-image">
                    <img src={getImageUrl(skinData.image.startsWith("http") ? skinData.image : `weapons/${skinData.image}`)} alt="skin" />
                </div>
                <div className="skin-box-footer">
                    <p>{skinData.name}</p>
                    {((!skinData.owned && skinData.price > 0)) && <div className="skin-price-contain">
                        <img src={skinCoin} alt="" />
                        <p className="skin-price">{skinData.price}</p>
                    </div>}
                </div>
            </div>
        </>

    )
}
