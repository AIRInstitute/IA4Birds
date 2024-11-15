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
  <CardBody className="overflow-auto py-2">
    <div className="flex gap-4 h-full">
      <Card className="flex-1 h-full overflow-hidden">
        <h2 className="p-1 text-center">Datos Xenocanto</h2>
        <CardBody className="h-full overflow-auto">
          <div className="max-w-full overflow-x-auto">
            <CopyBlock
              language="go"
              text={JSON.stringify(panelAdminData[0].data, null, 2)}
              codeBlock
              showLineNumbers={false}
            />
          </div>
          <div className="w-full flex justify-end mt-4">
            <Link 
              href="/data-panel-component"
              style={
                location.pathname === "/data-panel-component" 
                  ? { textDecoration: 'underline', color: '#55436F' } 
                  : { textDecoration: 'none' }
              }
              className="place-content-end cursor-pointer"
            >
              Ver más...
            </Link>
          </div>
        </CardBody>
      </Card>
      <Card className="flex-1 h-full overflow-hidden">
        <h2 className="p-1 text-center">Datos eBird</h2>
        <CardBody className="h-full overflow-auto">
          <div className="max-w-full overflow-x-auto">
            <CopyBlock
              language="go"
              text={JSON.stringify(panelAdminData[1].data, null, 2)}
              codeBlock
              showLineNumbers={false}
            />
          </div>
          <div className="w-full flex justify-end mt-4">
            <Link 
              href="/data-panel-component"
              style={
                location.pathname === "/data-panel-component" 
                  ? { textDecoration: 'underline', color: '#55436F' } 
                  : { textDecoration: 'none' }
              }
              className="place-content-end cursor-pointer"
            >
              Ver más...
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  </CardBody>
</Card>
  );
};