import * as React from 'react';
import { Spacer } from "@nextui-org/spacer";
import { CustomCardCamera } from './card/AdminPanelCameraCard';
import { CustomCardData } from './card/AdminPanelDataCard';

const AdminPanelComponent = () => {

  const panelAdminData = [
    { 
      id: 1, 
      name: 'Xenocanto', 
      data:  {
        description: 'A platform for sharing bird sounds.',
        recordings: 15230,
        regionsCovered: ['Americas', 'Europe', 'Asia', 'Africa'],
        website: 'https://xenocanto.org',
        a: 'A global birdwatching database.',
        b: 950000,
        c: 52000,
        d: 'https://ebird.org',
        e: 'A global birdwatching database.',
        f: 950000,
        g: 52000,
        h: 'https://ebird.org',
        i: 'A global birdwatching database.',
        k: 950000,
        j: 52000,
        l: 'https://ebird.org',
        m: 'A global birdwatching database.',
        n: 950000,
        o: 52000,
        p: 'https://ebird.org',
        q: 'A global birdwatching database.',
        r: 950000,
        s: 52000,
        t: 'https://ebird.org',
      }
    },
    {
      id: 2,
      name: 'eBird',
      data: {
        description: 'A global birdwatching database.',
        sightingsLogged: 950000,
        contributors: 52000,
        website: 'https://ebird.org',
        a: 'A global birdwatching database.',
        b: 950000,
        c: 52000,
        d: 'https://ebird.org',
        e: 'A global birdwatching database.',
        f: 950000,
        g: 52000,
        h: 'https://ebird.org',
        i: 'A global birdwatching database.',
        k: 950000,
        j: 52000,
        l: 'https://ebird.org',
        m: 'A global birdwatching database.',
        n: 950000,
        o: 52000,
        p: 'https://ebird.org',
        q: 'A global birdwatching database.',
        r: 950000,
        s: 52000,
        t: 'https://ebird.org',
      }
    },
  ];
  const cameraAdminData = [
    { id: 1, name: 'Camera 1', location: '', views: '23 views', url: '/public/Buitre negro.jpg'},
    { id: 2, name: 'Camera 2', location: '', views: '100 views', url: '/public/Buitre negro.jpg'},
    { id: 3, name: 'Camera 3', location: '', views: '50 views', url: '/public/Buitre negro.jpg'},
    { id: 4, name: 'Camera 4', location: '', views: '500 views', url: '/public/Buitre negro.jpg'},
    
  ];

  return (
    <div className="admin-panel">
      <Spacer y={5} />
      <div className="flex justify-between gap-2 w-full px-6 lg:flex-row flex-col">
        
        <div className="card-container flex-grow lg:w-1/2 w-full">
          <CustomCardCamera cameraAdminData={cameraAdminData} />
        </div>

        <div className="card-container flex-grow lg:w-1/2 w-full">
          <CustomCardData panelAdminData={panelAdminData} />
        </div>
      </div>
    </div>

  );
};

export default AdminPanelComponent;
