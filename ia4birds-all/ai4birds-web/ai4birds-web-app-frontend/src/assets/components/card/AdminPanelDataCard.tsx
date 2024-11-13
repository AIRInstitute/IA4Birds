import * as React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Textarea } from "@nextui-org/input";
import { Snippet } from "@nextui-org/snippet";
import { CopyBlock } from "react-code-blocks";
import { Link } from "@nextui-org/link";
// import { Text } from "@nextui-org/react";

export const CustomCardData = ({ panelAdminData }) => {
//   if (!data) {
//     return <Text>Loading data...</Text>;
//   }

  return (
    <Card className="py-4 h-[83vh] overflow-hidden">
      <CardHeader className="pb-0 pt-2 px-4">
        <h1 className="font-bold text-xl">Panel de Datos</h1>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
          <Card className="w-full py-4 my-4">
            <h2 className="p-1 text-center">Datos Xenocanto</h2>
            <CardBody>
                <div>
                    <CopyBlock
                      language="go"
                      text={panelAdminData[0].data}
                      codeBlock
                      showLineNumbers={false}
                    />
                </div>
                <Link href="/data-panel-component" 
                      style={location.pathname== "/data-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} } className="place-content-end cursor-pointer" >
                        Ver más...
                </Link>
            </CardBody>
          </Card>
          <Card className="w-full py-4">
            <h2 className="p-1 text-center">Datos eBird</h2>
            <CardBody>
                <div>
                    <CopyBlock
                      language="go"
                      text={panelAdminData[1].data}
                      codeBlock
                      showLineNumbers={false}
                    />
                </div>
                <Link href="/data-panel-component" 
                      style={location.pathname== "/data-panel-component" ? { textDecoration: 'underline', color:'#55436F'} : {textDecoration: 'none'} } className="place-content-end cursor-pointer" >
                        Ver más...
                </Link>
            </CardBody>
          </Card>
      </CardBody>
    </Card>
  );
};