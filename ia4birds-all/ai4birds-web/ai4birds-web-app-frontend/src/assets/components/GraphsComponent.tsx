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
    { id: 1, title: 'El papel de la IA en la observación de aves', description: 'La inteligencia artificial se ha convertido en un aliado poderoso para el estudio y la conservación de la biodiversidad. Con esa idea es con la que trabaja AIR Institute en el proyecto IA4Birds, teniendo en cuenta estudios previos como el realizado por un equipo de investigadores de la Universidad Internacional Daffodil en Dhaka, Bangladesh.',image:'https://ia4birds.air-institute.com/sites/default/files/2024-02/Observaci%C3%B3n%20IA4Birds.png',  url: 'https://ia4birds.air-institute.com/blog/el-papel-de-la-ia-en-la-observacion-de-aves', date: 'Feb 3, 2024'},
    { id: 2, title: 'El modelo más potente para el módulo de computación del cuadro eléctrico de IA4Birds', description: 'El Jetson AGX ORIN, el modelo más potente de Nvidia, es el módulo de computación AI elegido para el cuadro eléctrico que formará parte de la herramienta de detección de aves diseñada para el proyecto IA4BIRDS, coordinado por AIR Institute y financiado por Fundación Biodiversidad.', image:'https://ia4birds.air-institute.com/sites/default/files/2024-02/M%C3%B3dulo%202.jpg',url: 'https://ia4birds.air-institute.com/blog/el-modelo-mas-potente-para-el-modulo-de-computacion-del-cuadro-electrico-de-ia4birds', date: 'Ene 19, 2024'},
    { id: 3, title: 'Comienzan a llegar los equipos para la detección de aves', description: 'Los equipos tecnológicos son una parte esencial del proyecto IA4Birds. Entre ellos destacan las cámaras, ya que cuentan con una tecnología fundamental en la tarea de detección de las aves. A la oficina del AIR Institute acaba de llegar la primera cámara AXIS Q6225-LE PTZ, herramienta indispensable gracias a que combina una resolución excepcional, capacidades avanzadas de captura de imagen, tecnologías de vanguardia y robustez en condiciones adversas.',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-01/C%C3%A1mara%201.jpg', url: 'https://ia4birds.air-institute.com/blog/comienzan-llegar-los-equipos-para-la-deteccion-de-aves', date: 'Dic 3, 2023'},
    { id: 4, title: 'Audiomoth, una herramienta fundamental para detectar aves a través de sus sonidos', description: 'Uno de los aspectos técnicos más emocionantes del proyecto IA4BIRDS es la investigación en técnicas de fusión de información para el almacenamiento masivo de datos de conteos y transectos de aves. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-01/2.png', url: 'https://ia4birds.air-institute.com/blog/audiomoth-una-herramienta-fundamental-para-detectar-aves-traves-de-sus-sonidos', date: 'Nov 9, 2023'},
    { id: 5, title: 'IA4Birds: convergencia de tecnologías y metodologías', description: 'El proyecto IA4Birds, coordinado por AIR Institute y financiado por la Fundación Biodiversidad, supone la convergencia de diversas tecnologías y metodologías para abordar el desafío crucial que supone la gestión de recursos naturales y energía sostenible.. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-12/Mapa%20IA4Birds.jpg', url: 'https://ia4birds.air-institute.com/blog/ia4birds-convergencia-de-tecnologias-y-metodologias', date: 'Oct 23, 2023'},
    { id: 6, title: 'Una cámara de última generación para una detección precisa de las aves', description: 'El uso de tecnología puntera es clave para el éxito de IA4Birds, proyecto coordinado por AIR Institute y financiado por Fundación Biodiversidad que pretende utilizar la inteligencia artificial para, sirviéndose además de dispositivos audiovisuales, monitorizar las poblaciones de aves y así, a través de un mayor conocimiento, prevenir las amenazas y decidir si un lugar es apto o no para poner en marcha un parque eólico. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-12/C%C3%A1mara%20IA4Birds_0.jpg', url: 'https://ia4birds.air-institute.com/blog/una-camara-de-ultima-generacion-para-una-deteccion-precisa-de-las-aves', date: 'Sep 1, 2023'},
    { id: 7, title: 'El buitre negro consolida su población en Castilla y León con un máximo histórico de 661 parejas', description: 'El censo confirma la tendencia positiva que venía detectándose en los últimos años, con una situación esperanzadora pese a los riesgos para su bienestar que trata de minimizar el proyecto IA4Birds.', image:'https://ia4birds.air-institute.com/sites/default/files/2023-11/Buitre%20negro.jpg', url: 'https://ia4birds.air-institute.com/blog/el-buitre-negro-consolida-su-poblacion-en-castilla-y-leon-con-un-maximo-historico-de-661', date: 'Jul 29, 2023'},
    { id: 8, title: 'Los parques eólicos matan a casi un millón de murciélagos al año', description: 'La problemática, en consonancia con el objetivo principal del proyecto IA4Birds, es tratada por un estudio liderado por la Estación Biológica de Doñana (EBD), centro de investigación del Consejo Superior de Investigaciones Científicas (CSIC).',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-11/Parque%20e%C3%B3lico.jpg', url: 'https://ia4birds.air-institute.com/blog/los-parques-eolicos-matan-casi-un-millon-de-murcielagos-al-ano', date: 'Jun 26, 2023'},
  ];


  return (
    <>
    <div style={{height: '100%'}}>
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