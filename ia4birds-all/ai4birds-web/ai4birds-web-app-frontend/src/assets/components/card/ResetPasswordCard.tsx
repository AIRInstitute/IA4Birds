import * as React from "react";
import { useState, useEffect } from 'react';
import { Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { Link } from "react-router-dom";


export const CustomCard = ()=> {
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("ENTRO EN EL SUBMIT");
      console.log("e: ", e);
  
      if (!password || !passwordConfirmation) {
        setError('Please fill in all fields');
        return;
      }
      setError('');
      console.log("Submitted with:", { password, passwordConfirmation });
      
    };
  
   return (
    <>
  <Card>
    <CardHeader>
        <h2>Resetear Contraseña</h2>
    </CardHeader>
    <CardBody>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <div className="flex w-full flex-wrap gap-4">
                    <div className="relative w-full">
                        <Input type={showPassword ? "text" : "password"} isRequired label="Password" value={password} onChange={(e) => setPassword(e.target.value)} endContent={
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
                        <Input type={showPasswordConfirmation ? "text" : "password"} isRequired label="Repeat Password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} endContent={
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
                Resetear Contraseña
                </Button>
            </div>
        </form>
    </CardBody>
  </Card>  
</>
);
}