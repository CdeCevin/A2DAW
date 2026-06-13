import { useContext, useState } from "react";
import { loginApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import {Button, Card, Form, Input, Label, Link, TextField} from "@heroui/react";

function LoginPage(){
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const {saveToken} = useContext(AuthContext)

    const loginAction = async()=>{
        console.log('login')
        const resp = await loginApi({rut:rut, password:password})
        console.log(resp)
        navigate('/menu')
        if(resp?.token){
            await saveToken(resp.token)
            navigate('/menu', {replace:true})
        }else if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    }


    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-16 sm:py-20 px-10 sm:px-6 lg:px-8 relative bg-bg-vg">
            {/* 
            <div className="flex flex-col items-center justify-center pb-5">
                <img></img>
                <span className="text-2xl font-bold"> VetGo</span>
                <span className="text-md text-gray-400"> Ingrese a su cuenta</span>
            </div>
            
            <div className="p-3 relative flex flex-col items-start justify-center bg-white border border-gray-100 rounded-lg shadow-sm shadow-black/20 sm:rounded-2xl sm:p-6 z-10">
                <span className="text-sm text-gray-700 font-semibold ">Correo Electrónico</span>
                <input type="text" onChange={(e)=> setRut(e.target.value)} />
                <span className="text-sm text-gray-700 font-semibold">Contraseña</span>
                <input type="password" onChange={(e)=> setPassword(e.target.value)} />
                <button onClick={loginAction}>login</button>
        </div>*/}
        

        <Card className="w-full max-w-md bg-white">
        <Card.Header>
            <Card.Title>Login</Card.Title>
            <Card.Description>Enter your credentials to access your account</Card.Description>
        </Card.Header>
        <Form onSubmit={loginAction}>
            <Card.Content>
            <div className="flex flex-col gap-4">
                <TextField name="email" type="email" type="text" onChange={(e)=> setCorreo(e.target.value)}>
                <Label>Correo Electronico</Label>
                <Input placeholder="correo@ejemplo.com" variant="secondary" />
                </TextField>
                <TextField name="password" type="password" onChange={(e)=> setPassword(e.target.value)}>
                <Label>Contraseña</Label>
                <Input placeholder="••••••••" variant="secondary" />
                </TextField>
            </div>
            </Card.Content>
            <Card.Footer className="mt-4 flex flex-col gap-2">
            <Button className="w-full bg-aqua-vg" type="submit">
                Ingresar
            </Button>
            </Card.Footer>
        </Form>
        </Card>
    </div>
);}

export default LoginPage;