import Navbar from "../NavBar/NavBar";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Card } from "@heroui/react";
import { Users, PawPrint, CalendarDays,ClipboardList } from "lucide-react";


const cards = [
    {
        desc: "Total Dueños",
        icon: Users,
        color:"text-azul-vg",
        colorfondo: "bg-azul-vg/20"

    },
    {
        desc: "Total Mascotas",
        icon: PawPrint,
        color: "text-aqua-vg",
        colorfondo: "bg-aqua-vg/20"
    },
    {
        desc: "Citas de Hoy",
        icon: CalendarDays,
        color: "text-accent-morado-vg",
        colorfondo: "bg-accent-morado-vg/20"
    },
    {
        desc: "Tratamientos",
        icon: ClipboardList,
        color: "text-accent-naranjo-vg",
        colorfondo: "bg-accent-naranjo-vg/20"
        
    },
    ]

    const links = [
    {
        desc: "Agendar Cita",
        icon: CalendarDays,
        lnk: "/citas",
        role: "public"
    },
    {
        desc: "Ver Mascotas",
        icon: PawPrint,
        lnk: "/mascotas",
        role: "public"
        
    },
    {
        desc: "Ver Dueños",
        icon: Users,
        color:"text-azul-vg",
        lnk: "/duenos",
        role: "public"

    },
    {
        desc: "Tratamientos",
        icon: ClipboardList,
        lnk: "/tratamientos",
        role: "admin"
        
    },
    ]

export default function DashbdPage() {

    const navigate = useNavigate();
    
    // Información del usuario
    const [roles, setRoles] = useState([]);
    const [userName, setUserName] = useState("");

    // Leer y decodificar el token al cargar el Navbar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try { //Obtener info desde el token 
                const decoded = jwtDecode(token);
                const subString = decoded.sub || "";
                const partes = subString.split('#');
                
                if (partes.length >= 3) {
                    setUserName(partes[1]); 
                    setRoles(partes[2].split(',')); 
                }
            } catch (error) {
                console.error("Error al decodificar token en Navbar:", error);
            }
        }
    }, []);

    // Renderizado condicional
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER") || isAdmin;
    return(
        <>
        <Navbar />
        <div className=" pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
                <span className="font-montserrat text-lg lg:text-2xl">Bienvenido, {userName}</span>
                    
                    <div className="flex flex-col gap-2">
                        {/*cards arriba */}
                    <div className="grid grid-cols-2 lg:flex lg:flex-row gap-2 justify-evenly max-w-screen">
                        {cards.map((card, key) =>(
                            <Card key={key} className="w-full max-w-md mt-5 bg-white border">

                                <Card.Content>
                                    <div className="flex flex-row items-center gap-5">
                                        <div className={` flex size-12 items-center justify-center rounded-xl ${card.colorfondo}`}>
                                            <card.icon className={`w-6 h-6 sm:w-6 sm:h-6 ${card.color}  `}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-2xl">N</span>
                                            <span className=" text-sm lg:text-md text-gray-600" >{card.desc}</span>
                                        </div>
                                    </div>
                                
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2 ustify-evenly max-w-screen">
                            <Card className="w-full max-w-md mt-5 bg-white border">

                                <Card.Content>
                                    <div className="flex flex-row items-center gap-5">
                                        <div className={` flex size-12 items-center justify-center rounded-xl `}>
                                            {/*<card.icon className={`w-6 h-6 sm:w-6 sm:h-6   `}/>*/}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-2xl">N</span>
                                            <span className=" text-sm lg:text-md text-gray-600" ></span>
                                        </div>
                                    </div>
                                
                                </Card.Content>
                            </Card>
                        <Card className="w-full max-w-md mt-5 bg-white border mb-5">
                            <Card.Header className="border-b border-solid">
                            <span className="p-3 text-md lg:text-lg font-semibold">Enlaces Rápidos</span>
                            </Card.Header>
                                <Card.Content>
                                    <div className="flex flex-col items-left gap-5">
                                        {links
                                            .filter((link) => {
                                                if (link.role === "admin") return isAdmin;
                                                return true; 
                                            }).map((link, key) =>(
                                            <Link to={link.lnk}  className="block font-poppins text-sm lg:text-base px-4 py-2 rounded-md transition-colors duration-200 hover:bg-aqua-vg/20 hover:text-gray-800">
                                                <div className="flex flex-row items-center gap-5">
                                                    
                                                    <div className={` flex size-12 items-center justify-center rounded-xl `}>
                                                        <link.icon className={`w-6 h-6 sm:w-6 sm:h-6 text-aqua-vg `}/>
                                                    </div>
                                                    <div className="flex flex-row">
                                                        <span className=" text-sm lg:text-md text-gray-800 font-semibold" >{link.desc}</span>
                                                    </div>
                                                    
                                                </div>
                                            </Link>
                                        ))}
                                        
                                    </div>
                                
                                </Card.Content>
                            </Card>
                    </div>
                    </div>
                </div>
        
        
        </>
    );
}

