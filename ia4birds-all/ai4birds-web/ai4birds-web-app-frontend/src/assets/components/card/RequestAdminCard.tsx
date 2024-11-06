import React, { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import { Button } from "@nextui-org/react";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("ENTRO EN EL SUBMIT");
        console.log("e: ", e);

        if (!email || !description) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
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
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input className="description-input h-full"  type="text" label="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
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
        
        </>
    );
    
};
