import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { CardHeader, CardBody, Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import auth from "../services/AuthDataService";

export const CustomCard = () => {
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [surnames, setSurnames] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [organization, setOrganization] = React.useState('');
    const [entity, setEntity] = React.useState('');
    const [ocupation, setOcupation] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const notify = () => toast.success('Registro correcto');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener email desde la URL
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get('email');
        const organizationParam = params.get('organization');
        const ocupationParam = params.get('ocupation');
        const entityParam = params.get('entity');
        // Decodifica caracteres
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));  
        }
        if (organizationParam) setOrganization(decodeURIComponent(organizationParam));
        if (ocupationParam) setOcupation(decodeURIComponent(ocupationParam));
        if (entityParam) setEntity(decodeURIComponent(entityParam));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        // if (!email || !name || !surnames || !username || !password || !passwordConfirmation || !organization) {
        //     setError('Please fill in all fields');
        //     return;
        // }
        if (!email || !name || !password || !passwordConfirmation || !organization) {
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

        // auth.register({email: email, name: name, surnames: surnames, username: username, password: password, organization: organization})
        //     .then((response) => {
        //         if (!response.data.error) {
        //             notify();
        //             navigate("/login-component");
        //         } else if (response.data.error) {
        //             setError(response.data.error);
        //         }
        //     })
        //     .catch(() => {
        //         setError('An error occurred while registering. Please try again.');
        //     });

        auth.register({email: email, name: name, password: password, organization: organization, entity: entity, ocupation: ocupation})
        .then((response) => {
            if (!response.data.error) {
                notify();
                navigate("/login-component");
            } else if (response.data.error) {
                setError(response.data.error);
            }
        })
        .catch(() => {
            setError('An error occurred while registering. Please try again.');
        });
    };

    return (
        <>
        <Card>
            <CardHeader>
                <h2>Formulario de registro</h2>
            </CardHeader>
            <CardBody>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="flex w-full flex-wrap gap-4">
                        <Input 
                            type="email" 
                            isReadOnly
                            label="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            />
                        <Input 
                            type="text" 
                            isRequired 
                            label="Nombre" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            />
                        {/* <Input 
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
                            placeholder="Nombre usuario" 
                            label="Nombre usuario" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            /> */}
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
                        <div className="relative w-full">
                            <Input type={showPassword ? "text" : "password"} isRequired label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} endContent={
                                <Button 
                                isIconOnly
                                onClick={() => setShowPassword(!showPassword)}
                                variant='light'
                                className=""
                            >
                                {showPassword ? <RxEyeOpen/> : <RxEyeClosed/>}
                            </Button>
                            }/>

                        </div>
                        <div className="relative w-full">
                            <Input type={showPasswordConfirmation ? "text" : "password"} isRequired label="Repite la Contraseña" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} endContent={
                                    <Button 
                                    isIconOnly
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    variant='light'
                                    className=""
                                >
                                    {showPasswordConfirmation ? <RxEyeOpen/> : <RxEyeClosed/>}
                                </Button>
                            }/>
                        </div>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="flex justify-end mt-4">
                    <Button color="primary" type="submit">
                        Registrarme
                    </Button>
                </div>
            </form>
            </CardBody>
        </Card>
        
        </>
    );    
};
