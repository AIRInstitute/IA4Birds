import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './assets/components/HeaderComponent';
import CameraComponent from './assets/components/CameraComponent';
import MapComponent from './assets/components/MapComponent';
import GraphsComponent from './assets/components/GraphsComponent';


function App() {
  
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
      </Routes>
    </Router>
    </>
  )
}

export default App
