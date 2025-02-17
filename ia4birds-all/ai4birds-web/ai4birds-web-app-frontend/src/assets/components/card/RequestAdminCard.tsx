import * as React from "react";
import { Input, Textarea } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import auth from "../services/AuthDataService";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState('');
    const [organization, setOrganization] = React.useState('');
    const [entity, setEntity] = React.useState(new Set([""]));
    const [ocupation, setOcupation] = React.useState('');

    const {isOpen, onOpenChange} = useDisclosure();
    
    const notify = () => toast.success('Solicitud enviada correctamente');
    const navigate = useNavigate();

    const options = [
      { value: "public", label: "Pública" },
      { value: "private", label: "Privada" },
      { value: "external", label: "Externa" }
    ];
    const selectedValue = options.find(option => entity.has(option.value))?.label || "Selecciona una entidad";

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !description) {
            setError('Rellene todos los campos');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Introduzca una dirección de correo electrónico válida');
            return;
        }

        auth.requestAdmin({email: email, organization: organization, entity: Array.from(entity).join(', '), ocupation: ocupation, description: description})
            .then((response) => {
                if (!response.data.error) {
                  notify();
                  navigate("/");
                } else if (response.data.error) {
                    setError(response.data.error);
                }
            })
            .catch(() => {
                setError('Se ha producido un error al realizar la solicitud. Por favor, inténtelo de nuevo.');
            });
    };

    return (
        <>
        <Card>
            <CardHeader>
                <h2>Solicitar rol admin</h2>
            </CardHeader>
            <CardBody>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="flex w-full flex-wrap gap-4">
                    <Input  
                            type="email" 
                            isRequired 
                            isClearable 
                            onClear={() => {
                                setEmail('');
                                console.log("Input email cleared")
                            }} 
                            placeholder="ejemplo@ejemplo.com" 
                            label="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            />
                        <Input
                            type="text"
                            label="Organización"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                        />
                        {/* <select
                            value={entity}
                            onChange={(e) => setEntity(e.target.value)}
                        >
                            <option value="" disabled>Selecciona una entidad</option>
                            <option value="public">Pública</option>
                            <option value="private">Privada</option>
                            <option value="external">Externa</option>
                        </select> */}
                        <div className="flex items-center space-x-2">
                          <p>Entidad: </p>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button className="capitalize" variant="bordered">{selectedValue}</Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Entity Selection"
                              selectedKeys={entity}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => setEntity(new Set(Array.from(keys).map(String)))}
                            >
                              {options.map((option) => (
                                <DropdownItem key={option.value}>{option.label}</DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                        <Input
                            type="text"
                            label="Ocupación"
                            value={ocupation}
                            onChange={(e) => setOcupation(e.target.value)}
                        />
                        <Textarea 
                            className="max-w-xm" 
                            type="text"
                            placeholder="Ejemplo: Somos la Junta de Castilla y León y queremos solicitar una cuenta para ver la información de las aves..." 
                            description="Por favor, introduce una razón válida" 
                            label="Descripción" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            />
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="flex justify-end mt-4">
                    <Button color="primary" type="submit">
                        Enviar solicitud
                    </Button>
                </div>
            </form>
            </CardBody>
        </Card>
        <Modal 
        backdrop={"blur"} 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        className="fixed top-0"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          closeButton: "hover:bg-white/5 active:bg-primary/10",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Aviso</ModalHeader>
              <ModalBody>
                <p> 
                  Ya se ha enviado la solicitud de rol de administrador. 
                  En un plazo determinado, en caso de que su solicitud sea aceptada, recibirá un correo electrónico de confirmación.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </>
    );
    
};
