// import {Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
// import { RxCross1 } from "react-icons/rx";
// import { Divider } from "@nextui-org/divider";
// import { Link } from "@nextui-org/link";
// import { Image } from "@nextui-org/image";
// import { Chip } from "@nextui-org/chip";

// const SidebarEolic = ({ isOpen, onCancel,eolicdata}) => {

//     console.log('Estoy dentro de SidebarEolic');
//     console.log('EolicData dentro del SideBarEolic: ', eolicdata);

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''} z-50`}>
//       <div className="content">
//       <div className="header py-3">
//             <h2>Datos de la exclusión eólica</h2>
//             <button onClick={onCancel}><RxCross1 style={{ height: '30px', width: '30px'}} /></button>
//         </div>
//       <Card className="w-full h-[30vh]">
//       <CardHeader className="flex gap-3">
//         <div className="flex flex-col gap-2">
//         {/* <p className="text-md">Latitud: <Chip>{eolicdata.coordenadas[0][0]}</Chip></p>
//         <p className="text-md">Longitud: <Chip>{eolicdata.coordenadas[0][1]}</Chip></p> */}
//           <p className="text-md">Ámbito: <Chip>{eolicdata.ambito}</Chip></p>
//           <p className="text-md">Área de exclusión: <Chip>{eolicdata.area_excl}</Chip></p>
//           <p className="text-md">Criterio: <Chip>{eolicdata.criterio}</Chip> </p>
//           <p className="text-md">Espacio : <Chip>{eolicdata.espacio}</Chip></p>
//           <p className="text-md">Identificación: <Chip>{eolicdata.identific}</Chip></p>
//           <p className="text-md">Instalaciones: <Chip>{eolicdata.t_instalac}</Chip></p>
//         </div>
//       </CardHeader>
//       {/* <Divider/>
//       <CardBody>
//         <p>Make beautiful websites regardless of your design experience.</p>
//       </CardBody>
//       <Divider/>
//       <CardFooter>
//         <Link
//           isExternal
//           showAnchorIcon
//           href="https://github.com/nextui-org/nextui"
//         >
//           Visit source code on GitHub.
//         </Link>
//       </CardFooter> */}
//     </Card>
//       </div>
//     </div>
//   );
// };

// export default SidebarEolic;


import { Card, CardHeader } from "@nextui-org/card";
import { RxCross1 } from "react-icons/rx";
import { Chip } from "@nextui-org/chip";

// const SidebarEolic = ({ isOpen, onCancel, eolicdata, onSelectCircle, maxDistance }) => {
const SidebarEolic = ({ isOpen, onCancel, eolicdata, maxDistance }) => {
  console.log("Estoy dentro de SidebarEolic");
  console.log("EolicData dentro del SideBarEolic: ", eolicdata);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} z-50`}>
      <div className="content">
        <div className="header py-3">
          <h2>Datos de la exclusión eólica ({(maxDistance / 1000).toFixed(1)} km)</h2>
          <button onClick={onCancel}>
            <RxCross1 style={{ height: "30px", width: "30px" }} />
          </button>
        </div>

        {Array.isArray(eolicdata) ? (
          eolicdata.map((data, index) => (
            // <Card key={index} className="w-full h-[30vh] mb-4 cursor-pointer hover:bg-gray-100 transition"  onClick={() => onSelectCircle(data)}>
            <Card key={index} className="w-full h-[30vh] mb-4 cursor-pointer hover:bg-gray-100 transition">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-md">
                    Ámbito: <Chip>{data.ambito}</Chip>
                  </p>
                  <p className="text-md">
                    Área de exclusión: <Chip>{data.area_excl}</Chip>
                  </p>
                  <p className="text-md">
                    Criterio: <Chip>{data.criterio}</Chip>
                  </p>
                  <p className="text-md">
                    Espacio: <Chip>{data.espacio}</Chip>
                  </p>
                  <p className="text-md">
                    Identificación: <Chip>{data.identific}</Chip>
                  </p>
                  <p className="text-md">
                    Instalaciones: <Chip>{data.t_instalac}</Chip>
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card className="w-full h-[30vh]">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-md">
                  Ámbito: <Chip>{eolicdata?.ambito || "N/A"}</Chip>
                </p>
                <p className="text-md">
                  Área de exclusión: <Chip>{eolicdata?.area_excl || "N/A"}</Chip>
                </p>
                <p className="text-md">
                  Criterio: <Chip>{eolicdata?.criterio || "N/A"}</Chip>
                </p>
                <p className="text-md">
                  Espacio: <Chip>{eolicdata?.espacio || "N/A"}</Chip>
                </p>
                <p className="text-md">
                  Identificación: <Chip>{eolicdata?.identific || "N/A"}</Chip>
                </p>
                <p className="text-md">
                  Instalaciones: <Chip>{eolicdata?.t_instalac || "N/A"}</Chip>
                </p>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SidebarEolic;
