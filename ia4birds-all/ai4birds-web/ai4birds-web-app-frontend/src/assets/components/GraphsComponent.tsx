import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue, Spacer, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
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
    { id: 1,title: 'Conoce la plataforma IA4Birds: ¿Qué zonas son adecuadas para instalar parques eólicos?',description: 'La plataforma se ha concebido como una herramienta de apoyo a la toma de decisiones ambientales en procesos de planificación e implantación de energías renovables...',image: 'https://ia4birds.air-institute.com/sites/default/files/2025-08/Captura%20de%20pantalla%202025-08-07%20133738.png',url: 'https://ia4birds.air-institute.com/blog/conoce-la-plataforma-ia4birds-que-zonas-son-adecuadas-para-instalar-parques-eolicos',date: 'Jul 30, 2025'},
    { id: 2,title: 'IA4Birds incorpora un sistema de detección visual de aves con inteligencia artificial',description: 'El modelo desarrollado detecta las aves, calcula su posición espacial en cada fotograma y ajusta automáticamente la posición de la cámara...',image: 'https://ia4birds.air-institute.com/sites/default/files/2025-06/Detecciones.jpg',url: 'https://ia4birds.air-institute.com/blog/ia4birds-incorpora-un-sistema-de-deteccion-visual-de-aves-con-inteligencia-artificial',date: 'Jun 17, 2025'},
    { id: 3,title: 'Los investigadores de IA4Birds crean un novedoso modelo para la clasificación de audio mediante inteligencia artificial',description: 'El proyecto IA4Birds ha logrado avances destacados en el desarrollo de sistemas de IA enfocados en la protección y monitorización de aves...',image: 'https://ia4birds.air-institute.com/sites/default/files/2025-05/major_train_133_268.png',url: 'https://ia4birds.air-institute.com/blog/los-investigadores-de-ia4birds-crean-un-novedoso-modelo-para-la-clasificacion-de-audio',date: 'May 28, 2025'},
    { id: 4,title: 'El proyecto IA4birds organiza una sesión especial sobre el análisis de audio y vídeo con enfoques de IA durante DCAI 2025',description: 'Un foro destinado a compartir los últimos avances en el análisis de vídeo y audio, basado en enfoques de IA...',image: 'https://ia4birds.air-institute.com/sites/default/files/2025-03/blog-dcai-IA4BIRBDS.png',url: 'https://ia4birds.air-institute.com/blog/el-proyecto-ia4birds-organiza-una-sesion-especial-sobre-el-analisis-de-audio-y-video-con',date: 'Mar 4, 2025'},
    { id: 5,title: 'Avances significativos en la captación de imágenes de aves con IA del proyecto IA4Birds',description: 'La avanzada cámara y el uso de IA han permitido grandes avances en el módulo de imagen para monitorizar aves.',image: 'https://ia4birds.air-institute.com/sites/default/files/2025-01/Captura%20de%20pantalla%202025-01-17%20115150.png',url: 'https://ia4birds.air-institute.com/blog/avances-significativos-en-la-captacion-de-imagenes-de-aves-con-ia-del-proyecto-ia4birds',date: 'Jan 17, 2025'},
    { id: 6,title: 'IA4Birds en el Encuentro Tecnológico Burgos 2024 Industria 4.0: Innovación y Alianzas para un futuro sostenible',description: 'Desde IA4Birds nos enorgullece haber sido parte de esta enriquecedora experiencia...',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-10/IMG_5180.jpg',url: 'https://ia4birds.air-institute.com/blog/ia4birds-en-el-encuentro-tecnologico-burgos-2024-industria-40-innovacion-y-alianzas-para-un',date: 'Oct 8, 2024'},
    { id: 7,title: 'IA4Birds transforma la protección de las aves con tecnología de vanguardia. ¿No te lo crees? ¡Echa un vistazo a nuestro nuevo vídeo!',description: 'Conoce cómo IA4Birds está revolucionando la conservación de aves con una plataforma innovadora...',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-08/Captura%20de%20pantalla_5-8-2024_105227_www.youtube.com_.jpeg',url: 'https://ia4birds.air-institute.com/blog/ia4birds-transforma-la-proteccion-de-las-aves-con-tecnologia-de-vanguardia-no-te-lo-crees-echa',date: 'Aug 5, 2024'},
    { id: 8,title: '¡Con IA4Birds, la información vuela! Descubre nuestro proyecto con un simple vistazo a nuestra infografía',description: 'Gracias a nuestra infografía, comprenderás rápidamente la arquitectura de nuestra plataforma aún en pruebas...',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-05/infografia-IA4birds%20%283%29_page-0001.jpg',url: 'https://ia4birds.air-institute.com/blog/con-ia4birds-la-informacion-vuela-descubre-nuestro-proyecto-con-un-simple-vistazo-nuestra',date: 'May 14, 2024'},
    { id: 9,title: 'Inicio de las pruebas para innovar en la detección de aves con inteligencia artificial',description: 'IA4Birds ya tiene instalada la cámara AXIS Q6225-LE PTZ en un entorno natural ideal para la observación de aves...',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-04/DSC_3469-Mejorado-NR.jpg',url: 'https://ia4birds.air-institute.com/blog/inicio-de-las-pruebas-para-innovar-en-la-deteccion-de-aves-con-inteligencia-artificial',date: 'Apr 16, 2024'},
    { id: 10, title: 'El papel de la IA en la observación de aves', description: 'La inteligencia artificial se ha convertido en un aliado poderoso para el estudio y la conservación de la biodiversidad. Con esa idea es con la que trabaja AIR Institute en el proyecto IA4Birds, teniendo en cuenta estudios previos como el realizado por un equipo de investigadores de la Universidad Internacional Daffodil en Dhaka, Bangladesh.',image:'https://ia4birds.air-institute.com/sites/default/files/2024-02/Observaci%C3%B3n%20IA4Birds.png',  url: 'https://ia4birds.air-institute.com/blog/el-papel-de-la-ia-en-la-observacion-de-aves', date: 'Feb 3, 2024'},
    { id: 11, title: 'El modelo más potente para el módulo de computación del cuadro eléctrico de IA4Birds', description: 'El Jetson AGX ORIN, el modelo más potente de Nvidia, es el módulo de computación AI elegido para el cuadro eléctrico que formará parte de la herramienta de detección de aves diseñada para el proyecto IA4BIRDS, coordinado por AIR Institute y financiado por Fundación Biodiversidad.', image:'https://ia4birds.air-institute.com/sites/default/files/2024-02/M%C3%B3dulo%202.jpg',url: 'https://ia4birds.air-institute.com/blog/el-modelo-mas-potente-para-el-modulo-de-computacion-del-cuadro-electrico-de-ia4birds', date: 'Ene 19, 2024'},
    { id: 12, title: 'Comienzan a llegar los equipos para la detección de aves', description: 'Los equipos tecnológicos son una parte esencial del proyecto IA4Birds. Entre ellos destacan las cámaras, ya que cuentan con una tecnología fundamental en la tarea de detección de las aves. A la oficina del AIR Institute acaba de llegar la primera cámara AXIS Q6225-LE PTZ, herramienta indispensable gracias a que combina una resolución excepcional, capacidades avanzadas de captura de imagen, tecnologías de vanguardia y robustez en condiciones adversas.',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-01/C%C3%A1mara%201.jpg', url: 'https://ia4birds.air-institute.com/blog/comienzan-llegar-los-equipos-para-la-deteccion-de-aves', date: 'Dic 3, 2023'},
    { id: 13, title: 'Audiomoth, una herramienta fundamental para detectar aves a través de sus sonidos', description: 'Uno de los aspectos técnicos más emocionantes del proyecto IA4BIRDS es la investigación en técnicas de fusión de información para el almacenamiento masivo de datos de conteos y transectos de aves. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2024-01/2.png', url: 'https://ia4birds.air-institute.com/blog/audiomoth-una-herramienta-fundamental-para-detectar-aves-traves-de-sus-sonidos', date: 'Nov 9, 2023'},
    { id: 14, title: 'IA4Birds: convergencia de tecnologías y metodologías', description: 'El proyecto IA4Birds, coordinado por AIR Institute y financiado por la Fundación Biodiversidad, supone la convergencia de diversas tecnologías y metodologías para abordar el desafío crucial que supone la gestión de recursos naturales y energía sostenible.. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-12/Mapa%20IA4Birds.jpg', url: 'https://ia4birds.air-institute.com/blog/ia4birds-convergencia-de-tecnologias-y-metodologias', date: 'Oct 23, 2023'},
    { id: 15, title: 'Una cámara de última generación para una detección precisa de las aves', description: 'El uso de tecnología puntera es clave para el éxito de IA4Birds, proyecto coordinado por AIR Institute y financiado por Fundación Biodiversidad que pretende utilizar la inteligencia artificial para, sirviéndose además de dispositivos audiovisuales, monitorizar las poblaciones de aves y así, a través de un mayor conocimiento, prevenir las amenazas y decidir si un lugar es apto o no para poner en marcha un parque eólico. ',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-12/C%C3%A1mara%20IA4Birds_0.jpg', url: 'https://ia4birds.air-institute.com/blog/una-camara-de-ultima-generacion-para-una-deteccion-precisa-de-las-aves', date: 'Sep 1, 2023'},
    { id: 16, title: 'El buitre negro consolida su población en Castilla y León con un máximo histórico de 661 parejas', description: 'El censo confirma la tendencia positiva que venía detectándose en los últimos años, con una situación esperanzadora pese a los riesgos para su bienestar que trata de minimizar el proyecto IA4Birds.', image:'https://ia4birds.air-institute.com/sites/default/files/2023-11/Buitre%20negro.jpg', url: 'https://ia4birds.air-institute.com/blog/el-buitre-negro-consolida-su-poblacion-en-castilla-y-leon-con-un-maximo-historico-de-661', date: 'Jul 29, 2023'},
    { id: 17, title: 'Los parques eólicos matan a casi un millón de murciélagos al año', description: 'La problemática, en consonancia con el objetivo principal del proyecto IA4Birds, es tratada por un estudio liderado por la Estación Biológica de Doñana (EBD), centro de investigación del Consejo Superior de Investigaciones Científicas (CSIC).',image: 'https://ia4birds.air-institute.com/sites/default/files/2023-11/Parque%20e%C3%B3lico.jpg', url: 'https://ia4birds.air-institute.com/blog/los-parques-eolicos-matan-casi-un-millon-de-murcielagos-al-ano', date: 'Jun 26, 2023'},
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