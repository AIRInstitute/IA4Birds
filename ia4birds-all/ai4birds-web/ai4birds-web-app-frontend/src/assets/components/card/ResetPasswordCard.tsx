import * as React from "react";
import { useState, useEffect } from 'react';
import { Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; 

import user from "../services/UserDataService";


export const CustomCard = ()=> {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState(""); // Token from the query
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const location = useLocation();

   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromQuery = queryParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    } else {
      setError("Token is missing from the URL.");
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !passwordConfirmation) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");

    user
      .resetPassword(token, password)
      .then((response) => {
        console.log("RESPONSE: ", response);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setSuccess("Password reset successfully!");
        }
      })
      .catch((error) => {
        console.error("Error en la llamada resetPassword: ", error);
        setError("An error occurred while resetting the password. Please try again.");
      });
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
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
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