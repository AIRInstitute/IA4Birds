import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './assets/components/HeaderComponent';
import CameraComponent from './assets/components/CameraComponent';
import MapComponent from './assets/components/MapComponent';
import GraphsComponent from './assets/components/GraphsComponent';
import LoginComponent from './assets/components/LoginComponent';
import RequestAdminComponent from './assets/components/RequestAdminComponent';



function App() {
  // const [facts, setFacts] = useState([]);
  // const [listening, setListening] = useState(false);

  // useEffect(() => {
  //   if (!listening) {
  //     const events = new EventSource('http://localhost:5030/exclusionmap/stream-exclusion-data');

  //     events.onmessage = (event) => {
  //       const parsedData = JSON.parse(event.data);

  //       setFacts((facts) => facts.concat(parsedData));
  //     };

  //     setListening(true);
  //   }
  // }, [listening, facts]);

  return (
    <>
     <Router>
      <HeaderComponent/>
      <Routes>
        <Route path="/" element={<CameraComponent/>}>
        </Route>
        <Route path="/camera-component" element={<CameraComponent/>}>
        </Route>
        <Route path="/map-component" element={<MapComponent/>}>
        </Route>
        <Route path="/blog-component" element={<GraphsComponent/>}>
        </Route>
        <Route path="/login-component" element={<LoginComponent/>}>
        </Route>
        <Route path="/request-admin-component" element={<RequestAdminComponent/>}>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
