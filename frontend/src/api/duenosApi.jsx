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
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
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
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
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
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
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
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
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
        const data = await res.text();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
    }
}
