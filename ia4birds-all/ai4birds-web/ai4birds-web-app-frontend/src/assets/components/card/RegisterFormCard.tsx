import * as React from "react";
import { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [surnames, setSurnames] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!email || !name || !surnames || !password || !passwordConfirmation) {
            setError('Please fill in all fields');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('Password must contain at least one number and one uppercase and lowercase letter, and at least 6 characters');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        console.log("Submitted with:", { email, name, surnames, password, passwordConfirmation });

    };

    useEffect(() => {
        // Esta función se ejecutará una vez cuando el componente se monte en el DOM
        console.log('La página se ha cargado RegisterFormComponent');
    }, []);
    

    return (
        <>
        <Card>
            <CardHeader>
                <h2>Formulario de registro</h2>
            </CardHeader>
            <CardBody>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
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
                            isRequired 
                            placeholder="Nombre" 
                            label="Nombre" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            />
                        <Input 
                            type="text" 
                            isRequired 
                            placeholder="Apellidos" 
                            label="Apellidos" 
                            value={surnames} 
                            onChange={(e) => setSurnames(e.target.value)} 
                            />
                        <Input 
                            type="text" 
                            isRequired 
                            placeholder="Contraseña" 
                            label="Contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            />
                        <Input 
                            type="text" 
                            isRequired 
                            placeholder="Repite contraseña" 
                            label="Confirmación contraseña" 
                            value={passwordConfirmation} 
                            onChange={(e) => setPasswordConfirmation(e.target.value)} 
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
        
        </>
    );    
};
