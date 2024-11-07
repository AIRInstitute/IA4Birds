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
                <h2>Datos de la solicitud de admin</h2>
            </CardHeader>
            <CardBody>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input  
                            isReadOnly
                            type="email"  
                            label="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            />
                        <Textarea
                            isReadOnly
                            className="max-w-xm" 
                            type="text" 
                            label="Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            />
                    </div>
                </div>
                {/* {error && <p className="error">{error}</p>} */}
                <div className="flex justify-between mt-4">
                    <Button style={{ backgroundColor: "#ac1919", color: 'white' }} type="submit">
                        Rechazar
                    </Button>
                    <Button style={{ backgroundColor: "#1b9316", color: 'white' }} type="submit">
                        Aceptar
                    </Button>
                </div>
            </form>
            </CardBody>
        </Card>
        </>
    );
    
};
