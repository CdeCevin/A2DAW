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
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return "Ocurrió un error de servidor";
    }
}