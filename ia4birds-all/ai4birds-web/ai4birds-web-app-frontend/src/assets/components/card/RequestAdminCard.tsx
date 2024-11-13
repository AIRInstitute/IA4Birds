import * as React from "react";
import  { useEffect } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState('');

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !description) {
            setError('Please fill in all fields');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('*Please enter a valid email');
            return;
        }
        setError('');
        onOpen();
        console.log("Submitted with:", { email, description });

    };

    useEffect(() => {
        // Esta función se ejecutará una vez cuando el componente se monte en el DOM
        console.log('La página se ha cargado RequestAdminComponent');
    }, []);
    

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
                        <Textarea 
                            className="max-w-xm" 
                            type="text" 
                            description="Por favor, introduce una razón válida" 
                            label="Description" 
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
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </>
    );
    
};
