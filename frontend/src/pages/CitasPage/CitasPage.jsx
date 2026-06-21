import Navbar from "../NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { getCitasApi, delCitasApi, editCitasApi, buscarCitasApi, crearCitasApi} from "../../api/citasApi";
import { getVetsApi} from "../../api/usersApi";
import { getMascotasApi} from "../../api/mascotasApi";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Card, Table, EmptyState, SearchField, Button } from "@heroui/react";
import { SquarePen, Trash2 } from "lucide-react";
import CitasModal from "./CitasModal";
import { useGlobalAlert } from "../../store/alert-context";


function CitasPage(){
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [veterinarios, setVeterinarios] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [datos, setDatos] = useState([]);

    const handleAbrirCrear = () => {
        setCitaSeleccionada(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (cita) => {
        setCitaSeleccionada(cita); // Datos de la fila a editar
        console.log(cita)
        setIsModalOpen(true);
    };

    const handleGuardarCita = async (datosFormulario) => {
        console.log("Datos a guardar: ", datosFormulario);
            const payloadLimpio = {
            ...datosFormulario,
            mascota: { id: parseInt(datosFormulario.mascota.id) },
            veterinario: { id: parseInt(datosFormulario.veterinario.id) }
        };

        console.log("Paquete limpio enviado al backend: ", payloadLimpio);

        try {
            if (citaSeleccionada?.id) {
                // MODO EDITAR
                const resp = await editCitasApi(citaSeleccionada.id, payloadLimpio);
                console.log("Respuesta Edición: ", resp);
            } else {
                // MODO CREAR
                const resp = await crearCitasApi(payloadLimpio);
                console.log("Respuesta Creación: ", resp);
            }
                
                showAlert("¡Éxito!", "La cita se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const citasActualizadas = await getCitasApi();
                setDatos(Array.isArray(citasActualizadas) ? citasActualizadas : []);

            } catch (error) {
                console.error("Error en handleGuardarCita:", error);
                showAlert("Error", "No se pudo guardar la cita.", "danger");
            }
        };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delCitasApi(id);
                console.log("Respuesta: ", resp);
            }
                
                showAlert("¡Éxito!", "La cita se eliminó correctamente.", "success"); 
                const citasActualizadas = await getCitasApi();
                setDatos(Array.isArray(citasActualizadas) ? citasActualizadas : []);

            } catch (error) {
                console.error("Error en handleDelete:", error);
                showAlert("Error", "No se pudo eliminar la cita.", "danger");
            }
        };
    
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

    
    
    const getVeterinario = async () => {
        console.log('usuarios')
        const resp = await getVetsApi()
        setVeterinarios(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    
    const getMascotas = async () => {
        console.log('mascotas')
        const resp = await getMascotasApi()
        setMascotas(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };

    
    
    
    useEffect(() => {
        const getCitasInfo = async () => {
        getVeterinario()
        getMascotas()
        console.log('info')
        const resp = await getCitasApi()
        setDatos(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    getCitasInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos : (datos?.citasProximas || []);

    const citasFiltradas = listaAFiltrar.filter((cita) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreMascota = cita.mascota?.nombre?.toLowerCase() || "";
        const nombreVet = cita.veterinario?.name?.toLowerCase() || "";
        const motivoCita = cita.motivo?.toLowerCase() || "";

        return nombreMascota.includes(termino) || 
               nombreVet.includes(termino) || 
               motivoCita.includes(termino);
    });

    // Renderizado condicional
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");
    return(
        <>
        <Navbar />
            <div className=" pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
                <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-montserrat text-xl lg:text-2xl">Citas</span>
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Citas totales: {datos.length} </span>
                </div>
                <Button onPress={handleAbrirCrear} className="rounded-md bg-accent-aqua-vg">+ Agendar</Button>
                </div>
                

            <div>
            <SearchField 
                name="search" 
                className="mt-5 mb-5 "
                value={busqueda}
                onChange={(e) => setBusqueda(e?.target?.value ?? e)}
            >
                <SearchField.Group className="border border-gray-100">
                    <SearchField.SearchIcon />
                    <SearchField.Input  className="w-[280]" placeholder="Buscar mascota, veterinario, razón..."  />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
            
            </div>
            
            <div className="flex flex-col lg:flex-row gap-2 ustify-evenly max-w-screen">
                        
                {isAdmin && (
                    <>
                    <Table className=" bg-white border mt-5" >
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Fecha</Table.Column>
                            <Table.Column>Mascota</Table.Column>
                            <Table.Column>Razón</Table.Column>
                            <Table.Column>Veterinario</Table.Column>
                            <Table.Column>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados</span>
                            </EmptyState>
                        )}>
                            {citasFiltradas.map((data, key) =>(
                                <Table.Row id={key} className="border-b">
                                    <Table.Cell>{new Date(data.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })}</Table.Cell>
                                    <Table.Cell>{data.mascota.nombre}</Table.Cell>
                                    <Table.Cell>{data.motivo}</Table.Cell>
                                    <Table.Cell>{data.veterinario.name}</Table.Cell>   
                                    <Table.Cell>
                                        <div className="flex items-center gap-1">
                                            <Button isIconOnly size="sm" variant="tertiary" onPress={() => handleAbrirEditar(data)}>
                                            <SquarePen className="size-4"/>
                                            </Button>
                                            <Button isIconOnly size="sm" variant="danger-soft" onPress={() => handleDelete(data.id)}>
                                            <Trash2 className="size-4"/>
                                            </Button>
                                            
                                        </div>    
                                    </Table.Cell>  
                                </Table.Row>
                            ))}     
                        </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                    </Table>
                    </>
                )}
                {isUser && (
                    <>
                    <Table className=" bg-white">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Fecha</Table.Column>
                            <Table.Column>Mascota</Table.Column>
                            <Table.Column>Razón</Table.Column>
                            <Table.Column>Veterinario</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados</span>
                            </EmptyState>
                        )}>
                            {citasFiltradas.map((data, key) =>(
                                
                                <Table.Row id={key} className="border">
                                    <Table.Cell>{new Date(data.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })}</Table.Cell>
                                    <Table.Cell>{data.mascota.nombre}</Table.Cell>
                                    <Table.Cell>{data.motivo}</Table.Cell>
                                    <Table.Cell>{data.veterinario.name}</Table.Cell>
                                </Table.Row>
                                
                            ))}     
                        </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                    </Table>
                    </>
                )}     
                </div>
                
            </div>
            <CitasModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                citaActual={citaSeleccionada}
                onSave={handleGuardarCita}
                veterinarios={veterinarios}
                mascotas={mascotas}
            />
            </>
        );
}

export default CitasPage;