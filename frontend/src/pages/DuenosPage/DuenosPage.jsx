import Navbar from "../NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { getDuenosApi, delDuenosApi, editDuenosApi, buscarDuenosApi, crearDuenosApi} from "../../api/duenosApi";
import { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from "jwt-decode";
import { Card, Table, EmptyState, SearchField, Button, Chip, Avatar, Tabs, Spinner } from "@heroui/react";
import { SquarePen, Trash2 } from "lucide-react";
import  DuenosPageModal from "./DuenosPageModal";
import { useGlobalAlert } from "../../store/alert-context";
import { useErrorHandler } from "../../api/errorHandler";

function DuenosPage(){
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [duenoSeleccionado, setDuenoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [datos, setDatos] = useState([]);
    const [tabActivo, setTabActivo] = useState("all");
    const { handleError } = useErrorHandler();
    const [isLoading, setIsLoading] = useState(true); 

    const handleAbrirCrear = () => {
        setDuenoSeleccionado(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (dueno) => {
        setDuenoSeleccionado(dueno); // Datos de la fila a editar
        setIsModalOpen(true);
    };

    const handleGuardarDueno = async (datosFormulario) => {
            const payloadLimpio = {
            ...datosFormulario
        };

        try {
            if (duenoSeleccionado?.id) {
                // MODO EDITAR
                const resp = await editDuenosApi(duenoSeleccionado.id, payloadLimpio);
            } else {
                // MODO CREAR
                const resp = await crearDuenosApi(payloadLimpio);
            }
                
                showAlert("¡Éxito!", "El dueño se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const duenosActualizados = await getDuenosApi();
                setDatos(Array.isArray(duenosActualizados) ? duenosActualizados : []);

            } catch (error) {
                handleError(error, "No se pudo guardar el dueño.");

            }
        };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delDuenosApi(id);
            }
                
                showAlert("¡Éxito!", "El dueño se eliminó correctamente.", "success"); 
                const duenosActualizados = await getDuenosApi();
                setDatos(Array.isArray(duenosActualizados) ? duenosActualizados : []);

            } catch (error) {
                handleError(error, "No se pudo eliminar el dueño.");

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
  
    
    useEffect(() => {
        const getDuenosInfo = async () => {
            setIsLoading(true)
            try{
                const resp = await getDuenosApi()
                setDatos(resp)
            } catch(error){
                handleError(error, "No se pudieron cargar los dueños.");
            } finally{
                setIsLoading(false)
            }
    };
    getDuenosInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos :  [];

    const duenosFiltrados = listaAFiltrar.filter((dueno) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreDueno = dueno.nombreCompleto?.toLowerCase() || "";
        const emailDueno = dueno.email?.toLowerCase() || "";
        const telefDueno = dueno.telefono?.toLowerCase() || "";

        return nombreDueno.includes(termino) || 
               emailDueno.includes(termino) || 
               telefDueno.includes(termino);
    });
    

    // Renderizado condicional
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isUser = roles.includes("ROLE_USER");
    
    return(
        <>
        <Navbar />
            <div className=" pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
                {isAdmin && (
                <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-montserrat text-xl lg:text-2xl">Dueños</span>
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Dueños: {datos.length} </span>
                </div>
                <Button onPress={handleAbrirCrear} className="rounded-md bg-accent-aqua-vg">+ Añadir</Button>
                </div>)}
                {isUser && (
                <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-montserrat text-xl lg:text-2xl"> Dueños</span>
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Dueños: {datos.length} </span>
                </div>
                </div>)}

            <div>
            <SearchField 
                name="search" 
                className="mt-5"
                value={busqueda}
                onChange={(e) => setBusqueda(e?.target?.value ?? e)}
                aria-label="Buscador de dueños"
                >
                <SearchField.Group className="border border-gray-100">
                    <SearchField.SearchIcon />
                    <SearchField.Input className="w-[280] " placeholder="Buscar nombre, correo.."  />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-2 ustify-evenly max-w-screen">
            {isAdmin && (
                    <>
                    <Table className=" bg-white border mt-4 mb-4 lg:mt-5" >
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Nombre</Table.Column>
                            <Table.Column >Email</Table.Column>
                            <Table.Column>Teléfono</Table.Column>
                            <Table.Column>Mascotas</Table.Column>
                            <Table.Column>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                {isLoading ? (
                                    <div className="flex flex-row items-center gap-1">
                                    <Spinner color="current" size="sm"/>
                                    <span className="text-sm text-muted">Cargando..</span>
                                </div>
                                ) : (
                                <span className="text-sm text-muted">No se encontraron resultados</span>
                                )}
                            </EmptyState>
                        )}>
                            {duenosFiltrados.map((data, key) =>(
                                <Table.Row id={key} key={key} className="border-b">
                                    <Table.Cell>
                                        <div className="flex flex-row gap-2 items-center">
                                            <Avatar color="primary" variant="soft" >
                                                <Avatar.Fallback>{data.nombreCompleto?.match(/\b(\w)/g)?.join('') || "U"}</Avatar.Fallback>
                                            </Avatar>
                                            {data.nombreCompleto}
                                            
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{data.email}</Table.Cell>
                                    
                                    <Table.Cell>{data.telefono}</Table.Cell> 

                                    <Table.Cell>
                                        <Button 
                                            variant="light" 
                                            className="p-0 min-w-0 h-auto hover:bg-transparent"
                                            onPress={() => navigate("/mascotas", { state: { filtrarPorDueno: data.nombreCompleto } })}
                                        >
                                            <Chip 
                                                color="success" 
                                                variant="soft"  
                                                className="flex justify-center w-16 cursor-pointer hover:scale-105 transition-transform" 
                                            >
                                                <Chip.Label>{data.mascotas ? data.mascotas.length : "0"}</Chip.Label>
                                            </Chip>
                                        </Button>
                                    </Table.Cell> 
                                    <Table.Cell>
                                        <div className="flex items-center gap-1">
                                            <Button aria-label="Editar Dueño" isIconOnly size="sm" variant="tertiary" onPress={() => handleAbrirEditar(data)}>
                                            <SquarePen className="size-4"/>
                                            </Button>
                                            <Button aria-label="Eliminar Dueño" isIconOnly size="sm" variant="danger-soft" onPress={() => handleDelete(data.id)}>
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
                    <Table className=" bg-white border mt-4 mb-4 lg:mt-5" >
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Nombre</Table.Column>
                            <Table.Column >Email</Table.Column>
                            <Table.Column>Teléfono</Table.Column>
                            <Table.Column>Mascotas</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                {isLoading ? (
                                    <div className="flex flex-row items-center gap-1">
                                    <Spinner color="current" size="sm"/>
                                    <span className="text-sm text-muted">Cargando..</span>
                                </div>
                                ) : (
                                <span className="text-sm text-muted">No se encontraron resultados</span>
                                )}
                            </EmptyState>
                        )}>
                            {duenosFiltrados.map((data, key) =>(
                                <Table.Row id={key} key={key} className="border-b">
                                    <Table.Cell>
                                        <div className="flex flex-row gap-2 items-center">
                                            <Avatar color="primary" variant="soft" >
                                                <Avatar.Fallback>{data.nombreCompleto.match(/\b(\w)/g).join('')}</Avatar.Fallback>
                                            </Avatar>
                                            {data.nombreCompleto}
                                            
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{data.email}</Table.Cell>
                                    
                                    <Table.Cell>{data.telefono}</Table.Cell> 

                                    <Table.Cell>
                                         <Button 
                                            variant="light" 
                                            className="p-0 min-w-0 h-auto hover:bg-transparent"
                                            onPress={() => navigate("/mascotas", { state: { filtrarPorDueno: data.nombreCompleto } })}
                                        >
                                            <Chip 
                                                color="success" 
                                                variant="soft"  
                                                className="flex justify-center w-16 cursor-pointer hover:scale-105 transition-transform" 
                                            >
                                                <Chip.Label>{data.mascotas ? data.mascotas.length : "0"}</Chip.Label>
                                            </Chip>
                                        </Button>
                                    </Table.Cell> 
                                      
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
            
            <DuenosPageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                duenoActual={duenoSeleccionado}
                onSave={handleGuardarDueno}
               
            />
            </>
        );
}


export default DuenosPage;