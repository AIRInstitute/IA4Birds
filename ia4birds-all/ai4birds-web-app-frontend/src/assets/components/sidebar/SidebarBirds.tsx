import React from 'react';
import {Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader, Progress,Textarea,User} from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";

const Sidebar = ({ isOpen, onCancel, birdData }) => {
    const [selected, setSelected] = React.useState("login");

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="content">
      <div className="header">
            <h2>Latitudd</h2>
            <button onClick={onCancel}><RxCross1 style={{ height: '30px', width: '30px'}} /></button>
        </div>
        <p className='py-4'>Longitud</p>
        <div className="flex flex-col w-full">
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="birds" title="Aves">
                {birdData.map ((bird) => (
                <React.Fragment key={bird.id}>
                <div>
                <User
                className='py-3'   
                name={bird.name}
                description={bird.description}
                avatarProps={{
                    src: bird.url
                }}
                />
                </div>
                <Progress color="primary" aria-label="Loading..." value={bird.num}/>
                    </React.Fragment>
                ))}
            </Tab>
            <Tab key="eolicSensibility" title="Sensibilidad eólica">
              {/* <form className="flex flex-col gap-4 h-[300px]">
                <Input isRequired label="Name" placeholder="Enter your name" type="password" />
                <Input isRequired label="Email" placeholder="Enter your email" type="email" />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary">
                    Sign up
                  </Button>
                </div>
              </form> */}
              <p>Datos de la sensibilidad eólica</p>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
      </div>
    </div>
  );
};

export default Sidebar;