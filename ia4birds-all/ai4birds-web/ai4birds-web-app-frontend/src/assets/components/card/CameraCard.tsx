import { Card, CardHeader, CardBody } from "@nextui-org/card";
import ReactPlayer from "react-player";

export const CustomCard = ({ cameraData }) => (
  <Card className="my-3 py-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <p className="text-tiny uppercase font-bold">{cameraData.location}</p>
      <small className="text-default-500">{cameraData.views}</small>
      <h4 className="font-bold text-large">{cameraData.name}</h4>
    </CardHeader>
    <CardBody className="overflow-hidden py-2 flex justify-center">
      <ReactPlayer
        url={cameraData.url}
        controls
        playing
        width="100%"
        height="200px"
      />
    </CardBody>
  </Card>
);
