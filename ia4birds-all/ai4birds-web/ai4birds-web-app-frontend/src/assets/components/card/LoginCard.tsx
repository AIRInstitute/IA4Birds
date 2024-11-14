import { useState, useEffect } from 'react';
import { Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";


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
  
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      setError('');
      console.log("Submitted with:", { email, password });
      
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