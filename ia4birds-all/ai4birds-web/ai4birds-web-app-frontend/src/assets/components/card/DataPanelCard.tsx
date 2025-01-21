import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { CopyBlock } from "react-code-blocks";

export const CustomCard = ({ dataPanelData }) => (
  <>
    <Card className="my-3 py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{dataPanelData.name || "Details"}</h4>
      </CardHeader>
      <CardBody className="overflow-x py-2 h-[73vh]">
        <CopyBlock
          language="json"
          text={JSON.stringify(dataPanelData, null, 2)}
          codeBlock
          showLineNumbers={false}
        />
      </CardBody>
    </Card>
  </>
);
