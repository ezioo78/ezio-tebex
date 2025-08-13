import React, {useState} from 'react'
import './YesNoModal.css'
import Locales from '../../../locales/Locales'

interface YesNoModalProps {
  title: string;
  question: string;
  active: boolean;
  yescb: () => void; // yescb prop'una uygun türü belirtin
  nocb: () => void;  // nocb prop'una uygun türü belirtin
}

const YesNoModal: React.FunctionComponent<YesNoModalProps> = ({ title, question, active, yescb, nocb }) => {
  const handleClickYes = () => {
    yescb()
  }

  const handleClickNo = () => {
    nocb()
  }

  return (
    active ? <div className='yes-no-modal'>
      <div className="yn-modal-box">
        <div className="yn-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="yn-modal-body">
          <p>{question}</p>
        </div>
        <div className="yn-modal-footer">
          <button onClick={handleClickYes} className="yn-modal-button yes">Yes</button>
          <button onClick={handleClickNo} className="yn-modal-button no">No</button>
        </div>
      </div>
    </div> : <></>
  )
}

export default YesNoModal