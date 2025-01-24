import { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

import user from "../services/UserDataService";

export const CustomCard = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ENTRO EN EL SUBMIT");
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      setError('Por favor, ingresa un correo electrónico');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
  
    console.log("email: ", email);
  
    // Llamada al servicio forgotPassword
    user.forgotPassword(email)
      .then((response) => {
        console.log("RESPONSE: ", response);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setSuccess('Correo de recuperación enviado exitosamente. Por favor revisa tu bandeja.');
        }
      })
      .catch((error) => {
        console.error("Error en la llamada forgotPassword: ", error);
        setError('Ocurrió un error al enviar el correo. Por favor, intenta nuevamente.');
      });
  };

  return (
    <Card>
      <CardHeader>
        <h2>Enviar correo de recuperación</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input 
              type="email" 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
          {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
          <div className="flex justify-end mt-4">
            <Button color="primary" type="submit">
              Enviar correo de recuperación
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};