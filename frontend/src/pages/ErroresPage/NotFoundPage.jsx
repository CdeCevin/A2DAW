import { Menu, X, LogOut, TriangleAlert } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Button, Card } from '@heroui/react';
import Navbar from '../NavBar/NavBar';

function NotFoundPage(){
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try { //Obtener info desde el token 
                const decoded = jwtDecode(token);
                const subString = decoded.sub || "";
                const partes = subString.split('#');
                
                if (partes.length >= 3) {
                    setRoles(partes[2].split(','));
                }
            } catch (error) {
                console.error("Error al decodificar token en Navbar:", error);
            }
        }
    }, []);

    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");
    return(
        <>
            <div className="h-screen max-w-8xl flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-white border">
                    <Card.Content>
                        
                        <div className='max-w-md lg:max-w-lg flex flex-col justify-center items-center'>
                            <div className="flex w-full flex-row gap-4 items-center justify-center">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-accent-aqua-vg/10">
                                <TriangleAlert className="w-6 h-6 sm:w-6 sm:h-6 text-accent-aqua-vg" />
                            </div>
                            <div className="flex justify-center items-center">
                                <span className="text-6xl font-bold font-montserrat text-accent-aqua-vg">404</span>
                            </div>
                        </div>
                    <span className="text-gray-500 mt-5"> No encontramos la página que buscabas. Revisa el URL o vuelve a una página conocida.</span>
                    <div className='flex flex-row gap-4 mt-4'>
                        <Button onClick={()=>navigate(-1)} className="font-poppins bg-white text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-accent-aqua-vg/30 hover:text-gray-800">
                            🡐 Volver
                        </Button>

                        <Button onClick={()=>navigate((isAdmin || isUser) ? '/menu' : '/')} className=" bg-accent-aqua-vg">
                            {(isAdmin || isUser) ? "Volver al menú" : "Ir al Login"}
                        </Button>

                    </div>

                </div>
                    </Card.Content>
                </Card>
                
            </div>
                
            </>
        );
}

export default NotFoundPage;