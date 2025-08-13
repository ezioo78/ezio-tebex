import React, { useState, useEffect } from 'react';
import './HomeSection.css'
import { fetchNui } from "../../utils/fetchNui";
import BoostCard from '../BoostCard/BoostCard';
import CoinCard from '../CoinCard/CoinCard';
import { BarLoader } from 'react-spinners';

type Props = {
  isFirst: boolean
}

const HomeSection: React.FC<Props> = ({isFirst}) => {
  // const [text, setText] = useState<ReturnData | "">("")
  const [shopData, setShopData] = useState<any>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNui("getShopData")
    .then((data) => {
      
      setLoading(false)
      setShopData(data)
    })
    .catch((err) => {
      const data = {
        "boosts": [
          {
            "name": "Boost 1",
            "price": 100,
            "icon": "tebexshop-icon4.png",
            "visible": true,
            "hours": 1
          },
          {
            "name": "Boost 2",
            "price": 200,
            "icon": "tebexshop-icon4.png",
            "visible": true,
            "hours": 2
          },
          {
            "name": "Boost 3",
            "price": 500,
            "icon": "tebexshop-icon1.png",
            "visible": true,
            "hours": 4
          },
          {
            "name": "Boost 4",
            "price": 1000,
            "icon": "tebexshop-icon2.png",
            "visible": true,
            "hours": 8
          }
        ],
        "coins": [
          {
            "amount": "500",
            "icon": "mocro-coin-icon.png",
            "link": "https://gfx.tebex.io",
            "visible": true,
          },
          {
            "amount": "1000",
            "icon": "mocro-coin-icon.png",
            "link": "https://gfx.tebex.io",
            "visible": true,
          },
          {
            "amount": "2000",
            "icon": "mocro-coin-icon.png",
            "link": "https://gfx.tebex.io",
            "visible": true,
          },
          {
            "amount": "5000",
            "icon": "mocro-coin-icon.png",
            "link": "https://gfx.tebex.io",
            "visible": true,
          }
        ]
      }
      setShopData(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="home-section">
      <div className="upper-section">
        {
          loading ? <BarLoader color={"#D0A163"} loading={loading} /> : <React.Fragment>
            {shopData.boosts.map((boost: any, index: number) => {
              if (((isFirst && index < 2) || (!isFirst && index > 1)) && boost.visible) {
                return <BoostCard key={index} cardData={boost} />
              }
            })}
          </React.Fragment>
        }
        
      </div>
      <div className="lower-section">
        {
          loading ? <BarLoader color={"#D0A163"} loading={loading} /> : <React.Fragment>
            {shopData.coins.map((coin: any, index: number) => {
              if (((isFirst && index < 2) || (!isFirst && index > 1)) && coin.visible) {
                return <CoinCard key={index} cardData={coin} />
              }
            })}
          </React.Fragment>
        }
      </div>
    </div>
  );
}

export default HomeSection;
