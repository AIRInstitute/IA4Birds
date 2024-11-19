import { useState, useEffect } from 'react';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Switch } from "@nextui-org/switch";
import imagen from '../images/IA4birds-1500px.png';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { set } from 'ol/transform';
const MoonIcon = (props) => (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
  
  const SunIcon = (props) => (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
  
const HeaderComponent = () => {
    const location = useLocation();
    // const isAdmin = user.role === 'admin';
    //DARK MODE
    const storedMode = localStorage.getItem('isLightModeLocal');
    const defaultMode = true;
    const [isLightMode, setIsLightMode] = useState(storedMode ? storedMode === 'true' : defaultMode);

  const toggleMode = () => {
    document.body.classList.toggle('dark');
    setIsLightMode(!isLightMode);
    localStorage.setItem('isLightModeLocal', isLightMode.valueOf().toString() );
  };
  return (
    <>
    <Navbar maxWidth='full' 
    classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}>
      <NavbarBrand>
      <img src={imagen} alt="Descripción de la imagen" style={{ width: '200px', height: 'auto' }} />
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem isActive={location.pathname == "/map-component"}>
          <Link  
          to="/map-component" 
          color={location.pathname == "/map-component" ? '#55436F': 'foreground'} 
          style={location.pathname == "/map-component" ? { textDecoration: 'underline',color:'#55436F'} : {textDecoration: 'none'} }
        // Add more styles as needed
             aria-current="page">
            Mapa
          </Link>
        </NavbarItem>
        <Divider orientation="vertical" className='h-30' />
        <NavbarItem isActive={location.pathname == "/camera-component"}>
          <Link  to="/camera-component" 
          style={location.pathname== "/camera-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} }  >
            Cámaras
          </Link>
        </NavbarItem>
        <Divider orientation="vertical" className='h-30'/>
        <NavbarItem isActive={location.pathname == "/blog-component"}>
          <Link to="/blog-component" color={location.pathname == "/blog-component" ? '#55436F': 'foreground'} 
          style={location.pathname == "/blog-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} }>
            Blog
          </Link>
        </NavbarItem>
        {/* {isAdmin && ( */}
        <Divider orientation="vertical" className='h-30'/>
        <NavbarItem isActive={location.pathname == "/admin-panel-component"}>
          <Link to="/admin-panel-component" color={location.pathname == "/admin-panel-component" ? '#55436F': 'foreground'} 
          style={location.pathname == "/admin-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} }>
            Panel de Admin
          </Link>
        </NavbarItem>
        {/* )} */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          {location.pathname !== '/login-component' && (
            <Link to="/login-component"><Button>Login</Button></Link>
          )}
        </NavbarItem>
        <NavbarItem className="lg:flex">
          {location.pathname !== '/request-admin-component' && (
            <Link to="/request-admin-component"><Button>Solicitud Admin</Button></Link>
          )}
        </NavbarItem>
        {/* <Switch
        defaultSelected
        size="lg"
        color="secondary"
        isSelected={isLightMode}
        onClick={toggleMode}
        thumbIcon={({ isSelected, className }) =>
            isSelected ? (
            <SunIcon className={className} />
            ) : (
            <MoonIcon className={className} />
            )
        }
        >
        </Switch> */}
        
        {/* <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Iniciar sesión
          </Button>
        </NavbarItem> */}
      </NavbarContent>
    </Navbar>
    <footer className="fixed bottom-0 w-full bg-background/80 py-4" style={{zIndex: '100'}}>
      <div className="container mx-auto flex justify-center items-center">
      <img src="https://ia4birds.air-institute.com/sites/default/files/footer-logos/IA4birds-footer.png" alt="" style={{width: '400px', height: 'auto'}} />
        {/* <p className="text-gray-600">© 2022 Your Company. All rights reserved.</p> */}
      </div>
    </footer>
    </>
  );
};

export default HeaderComponent;