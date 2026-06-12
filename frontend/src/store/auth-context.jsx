import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

export const AuthContext=createContext({
    token:null,
    saveToken: async(token)=>{},
    logout:()=>{}
})

 export default function AuthContextProvider({children}){
    const [token, setToken]=useState(()=>{
        return localStorage.getItem("token") || null;
    });

    async function saveToken(tokenIn){
        localStorage.setItem("token", tokenIn)
        setToken(tokenIn)
    }

    function logout(){
        localStorage.removeItem("token")
        setToken(null)
    }

    const value={
        token:token,
        saveToken:saveToken,
        logout:logout
    }

    return <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

}

