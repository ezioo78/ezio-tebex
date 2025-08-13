import React, {useState} from 'react'
import './NotifyModal.css'
import Locales from '../../../locales/Locales'
import errorIcon from '../../assets/exclamation.png'
import { error } from 'console'

interface NotifyModalProps {
  title: string;
  text: string;
  active: boolean;
}

const NotifyModal: React.FC<NotifyModalProps> = ({ title, text, active }) => {

  return (
    active ? <div className='yes-no-modal'>
      <div className="notify-modal-box">
        <div className="notify-modal-header">
          <img src={errorIcon} alt="" />
          <h3>{title}</h3>
        </div>
        <div className="notify-modal-body">
          <p>{text}</p>
        </div>
      </div>
    </div> : <></>
  )
}

export default NotifyModal
