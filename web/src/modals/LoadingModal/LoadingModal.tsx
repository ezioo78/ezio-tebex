import './LoadingModal.css'
import { ClipLoader } from 'react-spinners'



interface LoadingModalProps {
  active: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ active }) => {
  return (
    active ? <div className='loading-modal'>
      <ClipLoader color={'#E97FF3'} loading={active} size={150} />
    </div> : <></>
  )
}

export default LoadingModal
