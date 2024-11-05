import React, { useEffect } from "react";
import {Spacer, Input} from "@nextui-org/react"


const RequestAdminComponent = () => {
    const sendRequest = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log("Event.target:", event.target);
        console.log("DATA:", data);
        
    };
    useEffect(() => {
        // Esta función se ejecutará una vez cuando el componente se monte en el DOM
        console.log('La página se ha cargado RequestAdminComponent');
    }, []);

    return (
        <>
        <div className="request-admin-component">
            <Spacer y={5} />
            <div className="flex flex-wrap justify-center gap-6">
                <h1>Request Admin Component</h1>
                <form onSubmit={sendRequest}>
                    <Input isRequired type="text" label="Gmail"  placeholder="Enter uour email." name="gmail" errorMessage="Please enter valid email" />
                    <Input isRequired type="text" label="Description" placeholder="Enter your reason for asking for private access." name="description"/>
                    <button type="submit" value="Submit">Send Request</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default RequestAdminComponent;