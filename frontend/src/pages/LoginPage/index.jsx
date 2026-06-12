import { useContext, useState } from "react";
import { loginApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

function LoginPage(){
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const {saveToken} = useContext(AuthContext)

    const loginAction = async()=>{
        console.log('login')
        navigate('/menu')
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


    return <>
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-16 sm:py-20 px-10 sm:px-6 lg:px-8 relative bg-bg-vg">
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
        </div>
        </div>

    </>
}

export default LoginPage;