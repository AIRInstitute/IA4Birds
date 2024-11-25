import { useState, useEffect } from 'react';
import { Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { Link } from "react-router-dom";

import auth from "../services/ExclusionEolicService";

export const CustomCard = ()=> {
    const [user, setUser] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("ENTRO EN EL SUBMIT");
      console.log("e: ", e);
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

      if (!email || !password) {
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

      console.log("email: ", email);
      console.log("password: ", password);

      auth.login({email: email, password: password})
        .then((response) => {
            console.log("RESPONSE: ", response);
            if (response.data.accessToken) {
                //Deberia devolver un token y la informacion del usuario
                localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
                //No se si esto es correcto y ya valdría o deberia crearlo tambien un item en localStorage
                setUser(response.data.user);
            } else if (response.data.error) {
                setError(response.data.error);
            }
        })
        .catch(() => {
            setError('An error occurred. Please try again.');
        });
    };

   return (
    <>
  <Card>
    <CardHeader>
        <h2>Iniciar Sesión</h2>
    </CardHeader>
    <CardBody>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="flex w-full flex-wrap gap-4">
                    <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="relative w-full">
                        <Input type={showPassword ? "text" : "password"} label="Password" value={password} onChange={(e) => setPassword(e.target.value)} endContent={
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
                </div>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="">
                <Link to={"/forgot-password-component"} className="text-xs"> ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <div className="flex justify-end mt-4">
                <Button color="primary" type="submit">
                Iniciar Sesión
                </Button>
            </div>
        </form>
    </CardBody>
  </Card>  
</>
);
}