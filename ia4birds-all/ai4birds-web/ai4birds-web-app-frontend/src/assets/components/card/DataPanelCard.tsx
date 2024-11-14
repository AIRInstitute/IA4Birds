import { Card,CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const CustomCard = ({ dataPanelData }) => (
    <>
        <Card className="my-3 py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">{dataPanelData.location}</p>
                <small className="text-default-500">{dataPanelData.views}</small>
                <h4 className="font-bold text-large">{dataPanelData.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={dataPanelData.url}
                width={270}
                />
            </CardBody>
        </Card>
    </>
);