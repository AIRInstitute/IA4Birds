import * as React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { CopyBlock } from "react-code-blocks";
import { Link } from "react-router-dom";

export const CustomCardData = ({ panelAdminData }) => {
  if (!panelAdminData || panelAdminData.length === 0) {
    return <p>Cargando datos...</p>;
  }

  return (
    <Card className="py-4 h-[83vh] overflow-hidden">
      <CardHeader className="pb-0 pt-2 px-4">
        <h1 className="font-bold text-xl">Panel de Datos</h1>
      </CardHeader>
      <CardBody className="overflow-auto py-2">
        <div className="flex gap-4 h-full">
          {panelAdminData.map((data) => (
            <Card key={data.id} className="w-full py-3">
              <h2 className="p-1 text-center font-bold">{data.name}</h2>
              <CardBody>
                <div className="max-w-full overflow-x-auto">
                  <CopyBlock
                    language="json"
                    text={JSON.stringify(data.data, null, 2)}
                    codeBlock
                    showLineNumbers={false}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <Link
                    to={`/data-panel-component?data=${data.id}`}
                    className="text-blue-500 underline"
                  >
                    Ver más...
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
