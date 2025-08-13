import React, { useState, useEffect } from 'react'
import './Transactions.css'
import { fetchNui } from '../../utils/fetchNui'
import PropagateLoader from "react-spinners/PropagateLoader";
import TransactionItem from '../../components/TransactionItem/TransactionItem';
import { useNuiEvent } from '../../hooks/useNuiEvent';

interface Props {
}

export default function Transactions({ }: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [refundRight, setRefundRight] = useState<number>(0)

  useNuiEvent('setRefundRight', (data) => {
    setRefundRight(data)
  })

  useNuiEvent('setTransactions', (data) => {
    setTransactions(data)
  })

  useEffect(() => {
    setLoading(true)
    fetchNui('getTransactions')
      .then((res) => {
        setLoading(false)
        setTransactions(res.transactions)
        setRefundRight(res.refundRight)
      })
      .catch((err) => {
        setLoading(false)
        const fakeData = [
          {
            id: 1,
            package: 'XP BOOST',
            image: 'tebexshop-icon1.png',
            description: '3 hours',
            transactionDate: '18/02/2024 - 19:30',
            price: 100,
            type: "boost"
          },
          {
            id: 2,
            package: 'Coins',
            image: 'mocro-coin-icon.png',
            description: 'tbx-49392913321GFX',
            transactionDate: '15/02/2024 - 19:30',
            price: 1000,
            type: 'coin'
          },
          {
            id: 3,
            package: 'M4 Anime Skin',
            image: 'weapons/COMPONENT_CARBINERIFLE_MK2_ANIME.png',
            description: 'M4 Anime Skin',
            transactionDate: '18/02/2024 - 19:30',
            refundDate: '11/02/2024 - 19:30',
            price: 250,
            type: "skin"
          },
          {
            id: 4,
            package: 'Gold',
            image: 'tebexshop-icon2.png',
            description: 'Tier',
            transactionDate: '18/02/2024 - 19:30',
            refundDate: '11/02/2024 - 19:30',
            price: 250,
            type: 'tier'
          },
        ]
        setTransactions(fakeData)
      })
  }, [])

  return (
    <div className='transactions-page'>
      {
        loading ?
          <div className="loading">
            <PropagateLoader color={"#fff"} loading={loading} size={15} />
          </div>
          :
          <>
            <div className="header-title">
              <p>Transaction History</p>
              <p>{refundRight} Refund Right</p>
            </div>
            <div className="transactions-list">
              {
                transactions.reverse().map((transaction, index) => {
                  return <TransactionItem key={index} transaction={transaction} />
                })
              }
            </div>
          </>
      }

    </div>
  )
}
