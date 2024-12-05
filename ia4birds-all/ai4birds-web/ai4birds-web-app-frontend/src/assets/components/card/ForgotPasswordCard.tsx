import { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

import user from "../services/UserDataService";

export const CustomCard = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor, ingresa un correo electrónico');
      return;
    }

    try {
        setError('');
        setSuccess('');
  
        const response = await user.forgotPassword(email);
  
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setSuccess('Correo de recuperación enviado exitosamente. Por favor revisa tu bandeja.');
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Hubo un problema al enviar el correo');
        } else {
          setError('Hubo un problema al enviar el correo');
        }
    }
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
