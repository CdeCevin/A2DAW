import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { findAllCategoryApi } from "../../api/categoryApi"
import { AuthContext } from "../../store/auth-context"

function CategoriaPage(){
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const {token} = useContext(AuthContext)

useEffect(()=>{
    async function getCategories(){
        const data = await findAllCategoryApi(token)
        console.log(data)
        setCategories(data)
    }
    getCategories()


},[])

    return <>
        <h3>Categoria</h3>
        <button onClick={()=>{navigate('/menu',{replace:true})}}>Menu</button>
        <h4>Lista de categorias</h4>
        <ul>
            {categories?.map((item, index)=>(
                <li key={index}>[{item.id}] {item.name}</li>
            ))}
        </ul>


        
    </>
}


export default CategoriaPage