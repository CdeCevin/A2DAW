import Navbar from "../NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { getTratamientoApi, delTratamientoApi, crearTratamientoApi, editTratamientoApi} from "../../api/tratamientosApi";
import { getCitasApi} from "../../api/citasApi";

import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Card, Table, EmptyState, SearchField, Button } from "@heroui/react";
import { SquarePen, Trash2 } from "lucide-react";
import TratamientosModal from "./TratamientosModal";
import { useGlobalAlert } from "../../store/alert-context";

function TratamientosPage(){
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tratSeleccionado, setTratSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [citas, setCitas] = useState([]);
    const [datos, setDatos] = useState([]);

    const handleAbrirCrear = () => {
        setTratSeleccionado(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (trat) => {
        setTratSeleccionado(trat); // Datos de la fila a editar
        console.log(trat)
        setIsModalOpen(true);
    };

    const handleGuardarTrat = async (datosFormulario) => {
        console.log("Datos a guardar: ", datosFormulario);
            const payloadLimpio = {
            ...datosFormulario
        };

        console.log("Paquete limpio enviado al backend: ", payloadLimpio);

        try {
            if (tratSeleccionado?.id) {
                // MODO EDITAR
                const resp = await editTratamientoApi(tratSeleccionado.id, payloadLimpio);
                console.log("Respuesta Edición: ", resp);
            } else {
                // MODO CREAR
                const resp = await crearTratamientoApi(payloadLimpio);
                console.log("Respuesta Creación: ", resp);
            }
                
                showAlert("¡Éxito!", "El tratamiento se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const tratActualizados = await getTratamientoApi();
                setDatos(Array.isArray(tratActualizados) ? tratActualizados : []);

            } catch (error) {
                console.error("Error en handleGuardarTrat:", error);
                showAlert("Error", "No se pudo guardar el tratamiento.", "danger");
            }
        };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delTratamientoApi(id);
                console.log("Respuesta: ", resp);
            }
                
                showAlert("¡Éxito!", "El tratamiento se eliminó correctamente.", "success"); 
                const tratActualizados = await getTratamientoApi();
                setDatos(Array.isArray(tratActualizados) ? tratActualizados : []);

            } catch (error) {
                console.error("Error en handleDelete:", error);
                showAlert("Error", "No se pudo eliminar el tratamiento.", "danger");
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

    
    
    const getCitas = async () => {
    
        const resp = await getCitasApi()
        setCitas(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };    
    
    useEffect(() => {
        const getTratamientosInfo = async () => {
        getCitas()
        console.log('info')
        const resp = await getTratamientoApi()
        setDatos(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)
        console.log("citas")
        console.log(citas)
        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    getTratamientosInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos :  [];

    const tratFiltrados = listaAFiltrar.filter((trat) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreMascota = trat.mascota?.nombre?.toLowerCase() || "";
        const nombreVet = trat.veterinario?.name?.toLowerCase() || "";
        const descripcionTrat = trat.descripcion?.toLowerCase() || "";

        return nombreMascota.includes(termino) || 
               nombreVet.includes(termino) || 
               descripcionTrat.includes(termino);
    });

    // Renderizado condicional
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");
    const costoTotal = datos.reduce((total, tratamiento) => {
        return total + (Number(tratamiento.costo) || 0);
    }, 0);
    return(
        <>
        <Navbar />
            <div className=" pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
                <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-montserrat text-xl lg:text-2xl">Tratamientos</span>
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Tratamientos: {datos.length} - <br className="lg:hidden"/> Costo: {new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(costoTotal)} </span>
                </div>
                <Button onPress={handleAbrirCrear} className="rounded-md bg-accent-aqua-vg">+ Añadir</Button>
                </div>
                

            <div>
            <SearchField 
                name="search" 
                className="mt-5"
                value={busqueda}
                onChange={(e) => setBusqueda(e?.target?.value ?? e)}
            >
                <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input className="w-[280]" placeholder="Buscar mascota, veterinario, razón..."  />
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
                            <Table.Column isRowHeader>Mascota</Table.Column>
                            <Table.Column >Cita</Table.Column>
                            <Table.Column>Veterinario</Table.Column>
                            <Table.Column>Descripción</Table.Column>
                            <Table.Column>Costo</Table.Column>
                            <Table.Column>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados.</span>
                            </EmptyState>
                        )}>
                            {tratFiltrados.map((data, key) =>(
                                <Table.Row id={key} className="border-b">
                                    <Table.Cell>{data.cita.mascota?.nombre || ""}</Table.Cell>
                                    <Table.Cell>{new Date(data.cita.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })}</Table.Cell>
                                    
                                    <Table.Cell>{data.cita.veterinario?.name || ""}</Table.Cell>   
                                    <Table.Cell>{data.descripcion}</Table.Cell>
                                    <Table.Cell>{new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(data.costo)}</Table.Cell>
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
                    <Table className=" bg-white border mt-5" >
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Mascota</Table.Column>
                            <Table.Column >Cita</Table.Column>
                            <Table.Column>Veterinario</Table.Column>
                            <Table.Column>Descripción</Table.Column>
                            <Table.Column>Costo</Table.Column>
                            
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados.</span>
                            </EmptyState>
                        )}>
                            {tratFiltrados.map((data, key) =>(
                                <Table.Row id={key} className="border-b">
                                    <Table.Cell>{data.cita.mascota.nombre}</Table.Cell>
                                    <Table.Cell>{new Date(data.cita.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })}</Table.Cell>
                                    
                                    <Table.Cell>{data.cita.veterinario.name}</Table.Cell>   
                                    <Table.Cell>{data.descripcion}</Table.Cell>
                                    <Table.Cell>{new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(data.costo)}</Table.Cell>
                                      
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
            <TratamientosModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                tratActual={tratSeleccionado}
                onSave={handleGuardarTrat}
                citas={citas}
            />
            </>
        );
}

export default TratamientosPage;