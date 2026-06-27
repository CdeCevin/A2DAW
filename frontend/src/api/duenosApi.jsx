export async function getDuenosApi(){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/duenio`,{
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

export async function delDuenosApi(id){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/duenio/${id}`,{
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

export async function editDuenosApi(id,payload){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/duenio/${id}`,{
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

export async function buscarDuenosApi(id){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/duenio/${id}`,{
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

export async function crearDuenosApi(payload){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/duenio`,{
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
