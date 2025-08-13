import React, { useState, useEffect } from 'react'
import './Tiers.css'
import TierCard from '../../components/TierCard/TierCard'
import { fetchNui } from '../../utils/fetchNui'
import PropagateLoader from "react-spinners/PropagateLoader";

type Props = {}

type Tier = {
  id: number;
  name: string;
  color?: string;
  description: string;
  price: number;
  items: { id: number; text: string; }[];
  visible?: boolean;
}

export default function Tiers({ }: Props) {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchNui('getTiers').then((data: Tier[]) => {
      setTiers(data)
      setLoading(false)
    })
    .catch((err) => {
      
      const tiersData: Tier[] = [
        {
          id: 1,
          name: 'Bronze',
          color: 'blue',
          description: 'Basic Tier',
          price: 500,
          items: [
            { id: 1, text: 'Speed Running' },
            { id: 2, text: 'Extra Stash' },
            { id: 3, text: '1 Vehicle' }
          ]
        },
        {
          id: 2,
          name: 'Silver',
          color: 'red',
          description: 'Intermediate Tier',
          price: 1000,
          items: [
            { id: 1, text: 'Speed Running' },
            { id: 2, text: 'Extra Stash' },
            { id: 3, text: '1 Vehicle' }
          ]
        },
        {
          id: 3,
          name: 'Gold',
          color: 'yellow',
          description: 'Advanced Tier',
          price: 2000,
          visible: true,
          items: [
            { id: 1, text: 'Speed Running' },
            { id: 2, text: 'Extra Stash' },
            { id: 3, text: '1 Vehicle' }
          ]
        }
      ]
      setTiers(tiersData)
      setLoading(false)
    })
  }, [])

  return (
    <div className='tiers-page'>
      {
        loading ? <PropagateLoader color={"#63A9D3"} loading={loading} size={15} /> :

        tiers.map((tier) => {
          if (tier.visible) {
            return <TierCard key={tier.id} tier={tier} />
          }
        })
      }
    
        
    </div>
  )
}
