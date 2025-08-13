declare global {
  interface Window {
    invokeNative: (command: string, url: string) => void;
  }
}

import React from 'react'
import { getImageUrl } from '../../utils/getImage'
import './CoinCard.css'
type Props = {
    cardData: any
}

export default function CoinCard({ cardData }: Props) {

  const redirect = () => {
    window.invokeNative('openUrl', cardData.link)
  }

  return (
    <div className='coin-card' onClick={redirect}>
        <div className="coin-image-section">
            <img src={getImageUrl(cardData.icon)} alt="coin" />
        </div>
        <div className="coin-card-infos">
            <h1><strong>{cardData.amount}</strong> COIN</h1>
            <p>CLICK TO BUY</p>
        </div>
    </div>
  )
}
