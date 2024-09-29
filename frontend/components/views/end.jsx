import "../../styles/end.css";
import {useState, useEffect} from 'react'
import Image from 'next/image'
import { toStart } from "../../store/exampleSlice";
import {useDispatch} from 'react-redux'

const BACKEND = "http://127.0.0.1:5000";

const End = () => {
  const [sessionId, setSessionId] = useState();
  var score = fetch `${BACKEND}/${sessionId}/score`

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // dropdown data
  const [dataArray, setDataArray] = useState([]);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND}/${sessionId}/submit`);
        if (!response.ok) {
        }
        const data = await response.json(); // Assume the backend sends JSON
        setDataArray(data); // Step 3: Update state with fetched data
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData(); // Call the function to fetch data when the component mounts
  }, []);

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
            <div style={{ marginTop: '8px' }} className="dropdown">
              {dataArray.map((item, index) => (
                // `${BACKEND}/image/${sessionId}`
                // `${BACKEND}/solution/${sessionId}`
                <li key={index}>{`${BACKEND}/image/${sessionId}`}</li>
              ))}
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