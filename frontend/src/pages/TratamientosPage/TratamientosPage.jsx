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
import { useErrorHandler } from "../../api/errorHandler";


function TratamientosPage(){
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tratSeleccionado, setTratSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [citas, setCitas] = useState([]);
    const [datos, setDatos] = useState([]);
    const { handleError } = useErrorHandler();


    const handleAbrirCrear = () => {
        setTratSeleccionado(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (trat) => {
        setTratSeleccionado(trat); // Datos de la fila a editar
        setIsModalOpen(true);
    };

    const handleGuardarTrat = async (datosFormulario) => {
        const payloadLimpio = {
            ...datosFormulario
        };

        try {
            if (tratSeleccionado?.id) {
                // MODO EDITAR
                const resp = await editTratamientoApi(tratSeleccionado.id, payloadLimpio);
            } else {
                // MODO CREAR
                const resp = await crearTratamientoApi(payloadLimpio);
            }
                
                showAlert("¡Éxito!", "El tratamiento se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const tratActualizados = await getTratamientoApi();
                setDatos(Array.isArray(tratActualizados) ? tratActualizados : []);

            } catch (error) {
                handleError(error, "No se pudo guardar el tratamiento.");

            }
        };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delTratamientoApi(id);
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
    
    //Mejorado con Primise all para que las llamadas a las apis no recargaran
    // el useeffect
    useEffect(() => {
        const getTratamientosInfo = async () => {
            try{
                const[citas, trat] = await Promise.all([
                    getCitasApi(),
                    getTratamientoApi()
                ]);
                setCitas(citas)
                setDatos(trat)
            } catch(error) {
                handleError(error, "No se pudieron cargar los datos de la página.");
            }
    };
    getTratamientosInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos :  [];

    const tratFiltrados = listaAFiltrar.filter((trat) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreMascota = trat.cita.mascota?.nombre?.toLowerCase() || "";
        const nombreVet = trat.cita.veterinario?.name?.toLowerCase() || "";
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
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Tratamientos: {datos.length} • <br className="lg:hidden"/> Valor Total: {new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(costoTotal)} </span>
                </div>
                <Button onPress={handleAbrirCrear} className="rounded-md bg-accent-aqua-vg">+ Añadir</Button>
                </div>
                

            <div>
            <SearchField 
                aria-label="Buscar Tratamiento"
                name="search" 
                className="mt-5"
                value={busqueda}
                onChange={(e) => setBusqueda(e?.target?.value ?? e)}
            >
                <SearchField.Group className="border border-gray-100">
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
                            <Table.Column>Valor</Table.Column>
                            <Table.Column>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados.</span>
                            </EmptyState>
                        )}>
                            {tratFiltrados.map((data, key) =>(
                                <Table.Row id={key} key={key} className="border-b">
                                    <Table.Cell className="font-semibold text-accent-aqua-vg/70">{data.cita.mascota?.nombre || ""}</Table.Cell>
                                    <Table.Cell className=" text-slate-600">{new Date(data.cita.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })}</Table.Cell>
                                    
                                    <Table.Cell className=" text-slate-600">{"Dr. "+ data.cita.veterinario?.name || ""}</Table.Cell>   
                                    <Table.Cell>{data.descripcion}</Table.Cell>
                                    <Table.Cell>{new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(data.costo)}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-1">
                                            <Button isIconOnly aria-label="Editar Tratamiento" size="sm" variant="tertiary" onPress={() => handleAbrirEditar(data)}>
                                            <SquarePen className="size-4"/>
                                            </Button>
                                            <Button isIconOnly aria-label="Eliminar Tratamiento" size="sm" variant="danger-soft" onPress={() => handleDelete(data.id)}>
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