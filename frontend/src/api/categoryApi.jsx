export async function findAllCategoryApi(token){
    try{
        const res = await fetch(`http://localhost:8085/category`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
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

export async function saveCategoryApi(json, token){
    try{
        const res = await fetch(`http://localhost:8085/category`,{
            method:"POST",
            body:JSON.stringify(json),
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
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