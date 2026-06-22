import Navbar from "../NavBar/NavBar";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Card, Table, EmptyState } from "@heroui/react";
import { Users, PawPrint, CalendarDays,ClipboardList } from "lucide-react";
import { dashbdApi } from "../../api/dasbdApi";




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
    const [datos, setDatos] = useState([]);

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

    useEffect(() => {
        const getDashbdInfo = async () => {
        console.log('info')
        const resp = await dashbdApi()
        setDatos(resp)
        console.log(resp)
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    getDashbdInfo();

    }, []);

    // Renderizado condicional
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");
    const cards = [
    {
        desc: "Total Dueños",
        icon: Users,
        color:"text-azul-vg",
        colorfondo: "bg-azul-vg/20",
        dataKey: "totalDuenos"

    },
    {
        desc: "Total Mascotas",
        icon: PawPrint,
        color: "text-aqua-vg",
        colorfondo: "bg-aqua-vg/20",
        dataKey: "totalMascotas"
    },
    {
        desc: isAdmin ? "Citas Recientes" : "Citas Próximas",
        icon: CalendarDays,
        color: "text-accent-morado-vg",
        colorfondo: "bg-accent-morado-vg/20",
        dataKey: "totalCitas"
    },
    {
        desc: "Tratamientos",
        icon: ClipboardList,
        color: "text-accent-naranjo-vg",
        colorfondo: "bg-accent-naranjo-vg/20",
        dataKey: "totalTratamientos"
        
    },
    ]

    return(
        <>
        <Navbar />
        <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto min-h-screen flex flex-col pb-6">
            <span className="font-montserrat text-lg lg:text-2xl mb-4">Bienvenido, {userName}</span>
            <div className="flex flex-col gap-4 flex-1">
                {/* cards arriba*/}
                <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 justify-evenly max-w-screen">
                    {cards.map((card, key) =>(
                        <Card key={key} className="w-full max-w-md bg-white border">
                            <Card.Content>
                                <div className="flex flex-row items-center gap-5">
                                    <div className={` flex size-12 items-center justify-center rounded-xl ${card.colorfondo}`}>
                                        <card.icon className={`w-6 h-6 sm:w-6 sm:h-6 ${card.color}  `}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-2xl">{datos?.[card.dataKey] ?? "..."}</span>
                                        <span className=" text-sm lg:text-md text-gray-600" >{card.desc}</span>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}
                </div>

                {/* cards abajo*/}
                <div className="flex flex-col lg:flex-row gap-4 justify-evenly w-full flex-1">
                    <Card className="flex flex-col flex-1 w-full bg-white border overflow-hidden">
                        <Card.Header className="flex flex-row items-center justify-between border-b border-solid">
                            <span className="p-3 text-md lg:text-lg font-semibold">{isAdmin ? "Citas Recientes" : "Próximas Citas"}</span>
                            <Link to="/citas" className="font-poppins font-semibold text-accent-aqua-vg/70 text-sm lg:md px-4 py-2 hover:underline">Ver Todas</Link>
                        </Card.Header>
                        <Card.Content className="flex-1 overflow-auto p-0">
                            {isAdmin && (
                                <Table className="bg-white h-full min-h-full" >
                                    <Table.ScrollContainer>
                                        <Table.Content aria-label="Custom styled table" selectionMode="single" onSelectionChange={(keys) => {navigate("/citas")}}>
                                            <Table.Header className="bg-gray-100">
                                                <Table.Column isRowHeader>Fecha</Table.Column>
                                                <Table.Column>Mascota</Table.Column>
                                                <Table.Column>Razón</Table.Column>
                                                <Table.Column>Veterinario</Table.Column>
                                            </Table.Header>
                                            <Table.Body renderEmptyState={() => (
                                                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                                    <span className="text-sm text-muted">No se encontraron resultados</span>
                                                </EmptyState>
                                            )}>
                                                {datos?.citasRecientes?.map((data, key) =>(
                                                    <Table.Row key={key} className="border-b cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <Table.Cell>{new Date(data.fecha).toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}</Table.Cell>
                                                        <Table.Cell className="font-semibold text-accent-aqua-vg/70">{data.mascota.nombre}</Table.Cell>
                                                        <Table.Cell className=" text-slate-600">{data.motivo ? data.motivo : "-"}</Table.Cell>
                                                        <Table.Cell>{"Dr. "+data.veterinario.name}</Table.Cell>    
                                                    </Table.Row>
                                                ))}     
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            )}
                            {isUser && (
                                <Table className="bg-white h-full min-h-full">
                                    <Table.ScrollContainer>
                                        <Table.Content aria-label="Custom styled table" selectionMode="single" onSelectionChange={(keys) => {navigate("/citas")}}>
                                            <Table.Header className="bg-gray-100">
                                                <Table.Column isRowHeader>Fecha</Table.Column>
                                                <Table.Column>Mascota</Table.Column>
                                                <Table.Column>Razón</Table.Column>
                                                <Table.Column>Veterinario</Table.Column>
                                            </Table.Header>
                                            <Table.Body renderEmptyState={() => (
                                                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                                    <span className="text-sm text-muted">No se encontraron resultados</span>
                                                </EmptyState>
                                            )}>
                                                {datos?.citasProximas?.map((data, key) =>(
                                                    <Table.Row key={key} className="border-b cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <Table.Cell>{new Date(data.fecha).toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}</Table.Cell>
                                                        <Table.Cell>{data.mascota.nombre}</Table.Cell>
                                                        <Table.Cell className=" text-slate-600">{data.motivo ? data.motivo : "-"}</Table.Cell>
                                                        <Table.Cell>{"Dr. "+data.veterinario.name}</Table.Cell>
                                                    </Table.Row>
                                                ))}     
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            )}
                        </Card.Content>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-80 bg-white border">
                        <Card.Header className="border-b border-solid">
                            <span className="p-3 text-md lg:text-lg font-semibold">Enlaces Rápidos</span>
                        </Card.Header>
                        <Card.Content className="flex-1 overflow-auto">
                            <div className="flex flex-col gap-2">
                                {links
                                    .filter((link) => {
                                        if (link.role === "admin") return isAdmin;
                                        return true; 
                                    }).map((link, key) =>(
                                    <Link key={key} to={link.lnk} className="block font-poppins text-sm lg:text-base px-4 py-2 rounded-md transition-colors duration-200 hover:bg-aqua-vg/20 hover:text-gray-800">
                                        <div className="flex flex-row items-center gap-5">
                                            <div className="flex size-12 items-center justify-center rounded-xl">
                                                <link.icon className="w-6 h-6 sm:w-6 sm:h-6 text-aqua-vg"/>
                                            </div>
                                            <div className="flex flex-row">
                                                <span className="text-sm lg:text-md text-gray-800 font-semibold">{link.desc}</span>
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

