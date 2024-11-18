import { Card,CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

export const CustomCard = ({ cameraPanelData }) => (
    <>
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">{cameraPanelData.location}</p>
                <small className="text-default-500">{cameraPanelData.views}</small>
                <h4 className="font-bold text-large">{cameraPanelData.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex">
                <div className="flex gap-4">
                    <div className="flex-3/4 w-3/4 p-2">
                        <video
                            className="h-[69vh] w-full rounded-xl"
                            controls
                            autoPlay
                        >
                            <source src="live-video-source.mp4" type="video/mp4" />
                            Su navegador no soporta el elemento video.
                        </video>
                    </div>
                    
                    <div className="flex-1/4 w-1/4 p-2 h-[69vh]">
                        <h2 className="text-lg font-bold">Video Data</h2>
                        <p>Datos GPS</p>
                        <p>Datos estado cam</p>
                        <p>Datos almacenamiento</p>
                        {/* <Card className="my-6">
                            <p>Datos GPS</p>
                        </Card>
                        <Card className="my-6">
                            <p>Datos estado cam</p>
                        </Card>
                        <Card className="my-6">
                            <p>Datos almacenamiento</p>
                        </Card> */}
                    </div>
                </div>
            </CardBody>
        </Card>
    </>
);