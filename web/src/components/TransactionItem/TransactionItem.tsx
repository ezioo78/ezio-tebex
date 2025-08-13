import React, {useState, useEffect} from 'react'
import './TransactionItem.css'
import { getImageUrl } from '../../utils/getImage'
import LoadingModal from '../../modals/LoadingModal/LoadingModal'
import NotifyModal from '../../modals/NotifyModal/NotifyModal'
import YesNoModal from '../../modals/YesNoModal/YesNoModal'
import { fetchNui } from '../../utils/fetchNui'

type Props = {
    key: any,
    transaction: any
}

export default function TransactionItem({ key, transaction }: Props) {
    const [loading, setLoading] = useState(false)
    const [notifyData, setNotifyData] = useState({title:'', text:'', visible: false})
    const [modalData, setModalData] = useState({title:'', text:'', visible: false, yescb: () => {}, nocb: () => {}})
    const [refunded, setRefunded] = useState(transaction.type == "coin" || transaction.refundDate)


    const handleClick = () => {
        setModalData({
            title: 'Are you sure?',
            text: `Are you sure you want to refund ${transaction.package} for ${transaction.price} coin?`,
            visible: true,
            yescb: () => {
                setLoading(true)
                fetchNui('refundTransaction', transaction.id)
                .then((res) => {
                    if (res.status === 'success') {
                        setLoading(false)
                        setNotifyData({title: 'Success', text: `You have successfully refunded ${transaction.package} for ${transaction.price} coin`, visible: true})
                        setTimeout(() => {
                            setNotifyData({title: '', text: '', visible: false})
                            document.body.classList.remove('modal-active');
                        }, 3000);
                        setRefunded(true)
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
                    setNotifyData({title: 'Error', text: `Action could't not executed, try again later!`, visible: true})
                    setTimeout(() => {
                        setNotifyData({title: '', text: '', visible: false})
                        document.body.classList.remove('modal-active');
                    }, 3000);
                })
            },
            nocb: () => {}
        })
    }

    return (
        <>
            <LoadingModal active={loading} />

            <NotifyModal title={notifyData.title} text={notifyData.text} active={notifyData.visible} />

            <YesNoModal title={modalData.title} question={modalData.text} active={modalData.visible}
                yescb={()=> {
                    modalData.yescb()
                    setModalData({title:'', text:'', visible: false, yescb: () => {}, nocb: () => {}})
                }}
                nocb={()=> {
                    modalData.nocb()
                    setModalData({title:'', text:'', visible: false, yescb: () => {}, nocb: () => {}})
                }}
            />

            <div className="transaction-item">
                
                <div className="package-details">
                    <div className="transaction-image">
                        {
                            transaction.type == "tier" ? <div className={`transaction-tier-section ${transaction.package.toLowerCase()}`}>
                                <p>{transaction.package.toUpperCase()}</p>
                            </div>
                            : <img src={getImageUrl(transaction.type == "skin" ? `weapons/${transaction.image}` : transaction.image)} className={transaction.type == "skin" ? "skin-image" : ""} alt="" />
                        }
                    </div>
                    <div className="detail-texts">
                        <p className="package-name">{transaction.package}</p>
                        <div className="package-descriptions">
                            {transaction.type == "boost" && <img src={getImageUrl('clock-icon.png')} alt="" />}
                            <p>{transaction.description.toUpperCase()}</p>
                        </div>
                    </div>
                    
                </div>
                <div className="transaction-date">
                    <h1>Transaction Date</h1>
                    <div className="date-text">
                        <img src={getImageUrl('calender-icon.png')} alt="" />
                        <p>{transaction.transactionDate}</p>
                    </div>
                </div>
                <div className="refund-date">
                    {
                        transaction.refundDate && 
                        <>
                            <h1>Refund Date</h1>
                            <div className="date-text">
                                <img src={getImageUrl('calender-icon.png')} alt="" />
                                <p>{transaction.refundDate}</p>
                            </div>
                        </>
                    }
                </div>
                <div className="transaction-buttons">
                    <div className={`coin-area ${refunded && "refunded"}`}>
                        <p>{transaction.price}</p>
                        <img src={getImageUrl('coin.png')} alt="" />
                    </div>
                    <div className="apart"></div>
                    <button className={`refund-button ${refunded && "refunded"}`} onClick={handleClick}>
                        {!refunded && <img src={getImageUrl('refresh-icon.png')} alt="" />}
                        <p>{transaction.type == "coin" ? "Claimed" : (refunded ? "Refunded" : "Refund")}</p>
                    </button>
                </div>
            </div>
        </>
        
    )
}