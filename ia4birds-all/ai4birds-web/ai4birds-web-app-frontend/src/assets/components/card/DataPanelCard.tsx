import { Card,CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { CopyBlock } from "react-code-blocks";

export const CustomCard = ({ dataPanelData }) => (
    <>
        <Card className="my-3 py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">{dataPanelData.location}</p>
                <small className="text-default-500">{dataPanelData.views}</small>
                <h4 className="font-bold text-large">{dataPanelData.name}</h4>
            </CardHeader>
            <CardBody className="overflow-x py-2 h-[73vh]">
                <CopyBlock
                language="go"
                text={JSON.stringify(dataPanelData, null, 2)}
                codeBlock
                showLineNumbers={false}
                />
            </CardBody>
        </Card>
    </>
);