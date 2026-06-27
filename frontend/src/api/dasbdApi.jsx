export async function dashbdApi(){
    const token = localStorage.getItem('token');
    try{
        const res = await fetch(`http://localhost:8085/dashboard`,{
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