import { useContext, useState } from "react";
import { loginApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import {Button, Card, Form, Input, Label, Link, TextField, FieldError} from "@heroui/react";
import { useGlobalAlert } from "../../store/alert-context";

function LoginPage(){
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const {saveToken} = useContext(AuthContext)
    const { showAlert } = useGlobalAlert();

    const loginAction = async(e) => {
        e.preventDefault();
        console.log('login')
        const resp = await loginApi({correo:correo, password:password})
        console.log(resp)
        if(resp?.token){
            await saveToken(resp.token)
            navigate('/menu', {replace:true})
        }else if(resp.message){
            console.log(resp)
            showAlert("Error",resp.message, "danger");
        }
        else{
            showAlert("Error","Ocurrió un error inesperado", "danger");
        }
        console.log(resp)
    }


    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-16 sm:py-20 px-10 sm:px-6 lg:px-8 relative bg-bg-vg">
            <div>
                <img 
                    src="/img/logo_mientras.jpg"
                    alt="VetGo"
                    className="h-8 sm:h-16"
                />
            </div>
            <span className="font-montserrat text-2xl font-bold text-gray-700">VetGo</span>
            <span className="font-poppins text-md text-gray-500">Ingrese a su cuenta</span>
        
        <Form validationBehavior="native" onSubmit={loginAction}>
            
        <Card className="w-full lg:min-w-md max-w-md mt-5 bg-white">
            
            <Card.Content>
            <div className="flex flex-col gap-4">
                
                <TextField 
                name="correo" 
                type="email" 
                value={correo} 
                
                validate={(value) => {
                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                        return "Por favor ingrese un correo válido";
                    }
                    return null;
                }}
                onChange={setCorreo}>
                <Label>Correo Electrónico</Label>
                <Input className="border-neutral-300 focus:border-verde-vg focus:ring-verde-vg" placeholder="correo@ejemplo.com" variant="secondary" />
                <FieldError />
                </TextField>
                <TextField name="password" type="password" value={password} onChange={setPassword}>
                <Label>Contraseña</Label>
                <Input className="border-neutral-300 focus:border-verde-vg focus:ring-verde-vg" placeholder="••••••••" variant="secondary" />
                </TextField>
            </div>
            </Card.Content>
            <Card.Footer className="mt-4 flex flex-col gap-2">
            <Button className="w-full bg-aqua-vg text-white font-semibold" type="submit">
            Ingresar
          </Button>
            </Card.Footer>
        
        </Card>
        </Form>
    </div>
);}

export default LoginPage;