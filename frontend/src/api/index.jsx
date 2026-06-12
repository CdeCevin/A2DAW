export async function loginApi(payload){
    try{
        const res = await fetch(`http://localhost:8085/auth/login`,{
            method:"POST",
            body:JSON.stringify(payload),
            headers:{
                "Content-Type":"application/json"
            }
        });
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}