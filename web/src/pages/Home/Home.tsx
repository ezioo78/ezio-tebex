import React, { useState, useEffect } from 'react';
import './Home.css'
import { fetchNui } from "../../utils/fetchNui";
import HomeSection from '../../components/HomeSection/HomeSection';
import icon1 from '../../assets/tebexshop-icon4.png'
import icon2 from '../../assets/tebexshop-icon1.png'
import icon3 from '../../assets/tebexshop-icon2.png'
import { getImageUrl } from '../../utils/getImage';
import { stat } from 'fs';
import DotLoader from "react-spinners/DotLoader";

const Home: React.FC = () => {
  const [text, setText] = useState("")
  const [status, setStatus] = useState("waiting")
  const [loading, setLoading] = useState(false)

  const handleInput = (text: string) => {
    setText(text)
  }

  const handleClickClaim = () => {
    if (text === "") return
    setLoading(true)
    setText("")
    fetchNui('claimCode', { code: text })
      .then((data) => {
        setStatus(data)
        setLoading(false)
        setTimeout(() => {
          setStatus("waiting")
        }, 3500);
      })
      .catch((error) => {
        setStatus("error")
        setLoading(false)
        setTimeout(() => {
          setStatus("waiting")
        }, 3500);
      })
  }

  return (
    <>
      <div className="homepage">
        <HomeSection isFirst={true} />
        <div className="mid-section">

          <div className="center-image">
            {
              loading ?
                <span>

                  <img src={getImageUrl(`center-empty.png`)} alt="empty" />
                  <DotLoader color={"#4322CA"} loading={loading} size={50} style={{ position: "absolute" }} />
                </span>
                : <img src={getImageUrl(`${status}.png`)} alt="" className="center-image" />
            }
          </div>

          <input type="text" placeholder='tbx-xxxxxxxxx' value={text} onChange={(e) => handleInput(e.target.value)} className='transaction-id-input' />
          <button onClick={handleClickClaim} className="claim-code">
            <p>Claim Code</p>
          </button>
        </div>
        <HomeSection isFirst={false} />
      </div>
    </>
  );
}

export default Home;
