import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue, Spacer, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import HeaderComponent from '../components/HeaderComponent';
import {BlogCard} from "./card/BlogCard";

const GraphsComponent = () =>{
  const [page, setPage] = React.useState(1);
  const users = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    }]
    

  const rowsPerPage = 10;
  const blogData = [
    { id: 1, title: 'Investigadores del proyecto IoTalentum se reúnen en Eindhoven (Países Bajos) para discutir sobre IoT y ciberseguridad', description: 'Dentro del Programa Centr@Tec, del Instituto para la Competitividad Empresarial de Castilla y León (ICE) en colaboración con el  AIR Institute, ha tenido lugar una nueva formación orientada a pymes interesadas en conocer las oportunidades de financiación y las principales herramientas de IA Generativa. ',image: 'https://bisite.usal.es/archivos/styles/large/public/network_meeting_7_winter_school_1.jpeg?itok=jZxmg7uS',  url: 'nextui.org'},
    { id: 2, title: 'El programa Centr@tec celebra una formación sobre el Kit Digital y herramientas de IA Generativa', description: 'Dentro del Programa Centr@Tec, del Instituto para la Competitividad Empresarial de Castilla y León (ICE) en colaboración con el  AIR Institute, ha tenido lugar una nueva formación orientada a pymes interesadas en conocer las oportunidades de financiación y las principales herramientas de IA Generativa. ',image: 'https://bisite.usal.es/archivos/styles/large/public/projecto_smart_farming.jpg?itok=YFHPPU5t', url: 'nextui.org'},
    { id: 3, title: 'Deep Farming: aplicación de IA, IoT y Edge Computing en la agriculturaCamera 3', description: 'La revolución tecnológica no se detiene, y en la agricultura, la aplicación de tecnologías como el Internet de las Cosas (IoT), la Inteligencia Artificial (IA) y la Computación en la Nube está redefiniendo el panorama. El Grupo de Investigación BISITE de la Universidad de Salamanca es consciente de esta realidad y por ello, trabaja en proyectos como Deep Farming, una iniciativa desarrollada bajo el paraguas del Plan de Transferencia de Conocimiento Universidad-Empresa TCUE.',image: 'https://bisite.usal.es/archivos/styles/large/public/centrtec_26-1-24_5.jpg?itok=R9hP9swA', url: 'nextui.org'},
    
  ];


  return (
    <>
    <div>
      {blogData.map ((blog) => (
          <React.Fragment key={blog.id}>
            <BlogCard blogData = {blog}/>
            <Spacer y={4}/>
          </React.Fragment>
        ))}
    </div>

    </>
  );
}

export default GraphsComponent;