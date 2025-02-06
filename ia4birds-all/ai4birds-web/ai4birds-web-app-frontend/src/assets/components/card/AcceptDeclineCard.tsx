import * as React from "react";
import  { useEffect } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import AuthDataService from "../services/AuthDataService";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [organization, setOrganization] = React.useState('');
    const [entity, setEntity] = React.useState('');
    const [ocupation, setOcupation] = React.useState('');

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    const handleAccept = async () => {
        try {
            const response = await AuthDataService.acceptRequestAdmin({ email, organization, entity, ocupation, description });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setSuccessMessage("¡Solicitud aceptada con éxito!");
                console.log("Accept response:", response.data);
            }
        } catch (err) {
            console.error("Error accepting request:", err);
            setError("Se ha producido un error al aceptar la solicitud.");
        }
    };

    const handleDecline = async () => {
        try {
            const response = await AuthDataService.declineRequestAdmin({ email });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setSuccessMessage("¡Solicitud rechazada con éxito!");
                console.log("Decline response:", response.data);
            }
        } catch (err) {
            console.error("Error declining request:", err);
            setError("Se ha producido un error al rechazar la solicitud.");
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const descriptionParam = params.get('description');
        const organizationParam = params.get('organization');
        const ocupationParam = params.get('ocupation');
        const entityParam = params.get('entity');
 
        //Decodifica los valores de la URL
        if (emailParam) setEmail(decodeURIComponent(emailParam));
        if (descriptionParam) setDescription(decodeURIComponent(descriptionParam));
        if (organizationParam) setOrganization(decodeURIComponent(organizationParam));
        if (ocupationParam) setOcupation(decodeURIComponent(ocupationParam));
        if (entityParam) setEntity(decodeURIComponent(entityParam));


        console.log('La página se ha cargado RequestAdminComponent');
    }, []);
    

    return (
        <>
            <Card>
                <CardHeader>
                    <h2>Datos de la solicitud de admin</h2>
                </CardHeader>
                <CardBody>
                    <div className="form-group">
                        <div className="flex w-full flex-wrap gap-4">
                            <Input
                                isReadOnly
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                isReadOnly
                                type="text"
                                label="Organización"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                            />
                            <Input
                                isReadOnly
                                type="text"
                                label="Entidad"
                                value={entity}
                                onChange={(e) => setEntity(e.target.value)}
                            />
                            <Input
                                isReadOnly
                                type="text"
                                label="Ocupación"
                                value={ocupation}
                                onChange={(e) => setOcupation(e.target.value)}
                            />
                            <Textarea
                                isReadOnly
                                className="max-w-xm"
                                type="text"
                                label="Descripción"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    {error && <p className="error text-red-500">{error}</p>}
                    {successMessage && <p className="success text-green-500">{successMessage}</p>}
                    <div className="flex justify-between mt-4">
                        <Button
                            style={{ backgroundColor: "#ac1919", color: "white" }}
                            onClick={handleDecline}
                        >
                            Rechazar
                        </Button>
                        <Button
                            style={{ backgroundColor: "#1b9316", color: "white" }}
                            onClick={handleAccept}
                        >
                            Aceptar
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
    
};
