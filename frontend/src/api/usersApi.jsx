export async function getUsersApi(){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/usuarios`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}

export async function delUsersApi(id){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/usuarios/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}

export async function editUsersApi(id,payload){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/usuarios/${id}`,{
            method:"PUT",
            body:JSON.stringify(payload),
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}

export async function buscarUsersApi(id){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/usuarios/${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}

export async function crearUsersApi(payload){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/create`,{
            method:"POST",
            body:JSON.stringify(payload),
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}

export async function getVetsApi(){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/auth/veterinarios`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorMsg = await res.text(); 
            throw new Error(errorMsg || `Error en servidor: ${res.status}`);
        }
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        throw error;
    }
}