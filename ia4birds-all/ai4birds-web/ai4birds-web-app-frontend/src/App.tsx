import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './assets/components/HeaderComponent';
import CameraComponent from './assets/components/CameraComponent';
import MapComponent from './assets/components/MapComponent';
import GraphsComponent from './assets/components/GraphsComponent';
import LoginComponent from './assets/components/LoginComponent';
import RequestAdminComponent from './assets/components/RequestAdminComponent';
import RegisterFormComponent from './assets/components/RegisterFormComponent';
import AcceptDeclineComponent from './assets/components/AcceptDeclineComponent';
import AdminPanelComponent from './assets/components/AdminPanelComponent';
import CameraPanelComponent from './assets/components/CameraPanelComponent';
import DataPanelComponent from './assets/components/DataPanelComponent';



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
        <Route path="/register-form-component" element={<RegisterFormComponent/>}>
        </Route>
        <Route path="/accept-decline-component" element={<AcceptDeclineComponent/>}>
        </Route>
        <Route path="/admin-panel-component" element={<AdminPanelComponent/>}>
        </Route>
        <Route path="/camera-panel-component" element={<CameraPanelComponent/>}>
        </Route>
        <Route path="/data-panel-component" element={<DataPanelComponent/>}>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
