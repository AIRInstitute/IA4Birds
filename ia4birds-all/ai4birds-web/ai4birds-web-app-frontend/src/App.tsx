import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HeaderComponent from './assets/components/HeaderComponent';
import CameraComponent from './assets/components/CameraComponent';
import MapComponent from './assets/components/MapComponent';
import GraphsComponent from './assets/components/GraphsComponent';


function App() {
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('http://localhost:5030/exclusionmap');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setFacts((facts) => facts.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, facts]);

  return (
    <>
    {/* <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact.info}</td>
              <td>{fact.source}</td>
            </tr>
          )
        }
      </tbody>
    </table> */}
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
