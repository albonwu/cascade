import "../../styles/end.css";
import {useState} from 'react'
import Image from 'next/image'
import { toStart } from "../../store/exampleSlice";
import {useDispatch} from 'react-redux'


const End = () => {
  var score = 17; // temp value for now

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  function handleReturn() {
    dispatch(toStart())
  }

  return (
    <div>
      <div style={{textAlign: "center", marginTop: "20px" }}>
        <Image src="/logo.png" width={300} height={300}/>
        <h1>your score was {score}</h1>
      </div>
      <div style={{textAlign: "center", marginBottom: "20px"}}>
          <span
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            onClick={toggleDropdown}
          >
            review what you missed?
            <span
              style={{
                marginLeft: '8px',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              ▼
            </span>
          </span>
          {/* Content that gets toggled */}
          {isOpen && (
            <div style={{ marginTop: '8px' }}>
              <p>toggle</p>
            </div>
          )}
      </div>
      <div style={{textAlign: "center"}}>
        <button style={{ position:"relative", fontWeight: "bold", color:"FDFAE0"}} className="returnButton" onClick={handleReturn}>Home</button> 
      </div>
    </div>
  )
}

export default End;