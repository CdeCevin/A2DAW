import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../store/auth-context"
import { jwtDecode } from "jwt-decode"


function MenuPage(){
    const navigate = useNavigate()
    const {logout, token} = useContext(AuthContext)


    const [name, setName] = useState(token?jwtDecode(token)?.sub.split('#')[1]:'');
    const [rol, setRol] = useState(token?jwtDecode(token)?.sub.split('#')[2]:'');

    const salir = ()=>{
        logout();
        navigate('/', {replace:true})
    }
    const toCategoria=()=>{
        navigate('/categoria',{replace:true})
    }


    return <>
        <h3>Menu de {name} con rol de {rol}</h3>
        <button onClick={toCategoria}>Categoria</button>
        <button onClick={salir}>Salir</button>
    </>
}

export default MenuPage