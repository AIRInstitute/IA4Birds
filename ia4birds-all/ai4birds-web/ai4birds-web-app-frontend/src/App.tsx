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
import ResetPasswordComponent from './assets/components/ResetPasswordComponent';
import ForgotPasswordComponent from './assets/components/ForgotPasswordComponent';
import PrivateRoutes from './assets/components/PrivateRoutes';

import { Toaster } from 'react-hot-toast';

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
    <Toaster position='top-center'/>
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
        <Route path="/admin-panel-component" element={<PrivateRoutes><AdminPanelComponent/></PrivateRoutes>}>
        </Route>
        <Route path="/camera-panel-component" element={<PrivateRoutes><CameraPanelComponent/></PrivateRoutes>}>
        </Route>
        <Route path="/data-panel-component" element={<PrivateRoutes><DataPanelComponent/></PrivateRoutes>}>
        </Route>
        <Route path="/reset-password-component" element={<ResetPasswordComponent/>}>
        </Route>
        <Route path="/forgot-password-component" element={<ForgotPasswordComponent/>}>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
