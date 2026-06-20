import Navbar from "../NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { getUsersApi, delUsersApi, editUsersApi, buscarUsersApi, crearUsersApi} from "../../api/usersApi";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Card, Table, EmptyState, SearchField, Button, Chip } from "@heroui/react";
import { SquarePen, Trash2 } from "lucide-react";
import  UserPageModal from "./UserPageModal";
import { useGlobalAlert } from "../../store/alert-context";

function VetPage(){
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userSeleccionado, setUserSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [datos, setDatos] = useState([]);

    const handleAbrirCrear = () => {
        setUserSeleccionado(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (user) => {
        setUserSeleccionado(user); // Datos de la fila a editar
        console.log(user)
        setIsModalOpen(true);
    };

    const handleGuardarUser = async (datosFormulario) => {
        console.log("Datos a guardar: ", datosFormulario);
            const payloadLimpio = {
            ...datosFormulario
        };

        console.log("Paquete limpio enviado al backend: ", payloadLimpio);

        try {
            if (userSeleccionado?.id) {
                // MODO EDITAR
                const resp = await editUsersApi(userSeleccionado.id, payloadLimpio);
                console.log("Respuesta Edición: ", resp);
            } else {
                // MODO CREAR
                const resp = await crearUsersApi(payloadLimpio);
                console.log("Respuesta Creación: ", resp);
            }
                
                showAlert("¡Éxito!", "El usuario se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const usersActualizados = await getTratamientoApi();
                setDatos(Array.isArray(usersActualizados) ? usersActualizados : []);

            } catch (error) {
                console.error("Error en handleGuardarTrat:", error);
                showAlert("Error", "No se pudo guardar el usuario.", "danger");
            }
        };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delUsersApi(id);
                console.log("Respuesta: ", resp);
            }
                
                showAlert("¡Éxito!", "El usuario se eliminó correctamente.", "success"); 
                const usersActualizados = await getUsersApi();
                setDatos(Array.isArray(usersActualizados) ? usersActualizados : []);

            } catch (error) {
                console.error("Error en handleDelete:", error);
                showAlert("Error", "No se pudo eliminar el usuario.", "danger");
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
        const getUsersInfo = async () => {
        console.log('info')
        const resp = await getUsersApi()
        setDatos(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)

        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    getUsersInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos :  [];

    const userFiltrados = listaAFiltrar.filter((user) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreUsuario = user.nombre?.toLowerCase() || "";
        const correoUsuario = user.correo?.toLowerCase() || "";
        const especialidadUsuario = user.especialidad?.toLowerCase() || "";

        return nombreUsuario.includes(termino) || 
               correoUsuario.includes(termino) || 
               especialidadUsuario.includes(termino);
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
                    <span className="font-montserrat text-xl lg:text-2xl"> Usuarios</span>
                    <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Usuarios: {datos.length} </span>
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
                    <SearchField.Input className="w-[280]" placeholder="Buscar nombre, correo, especialidad.."  />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
            
            </div>
            
            <div className="flex flex-col lg:flex-row gap-2 ustify-evenly max-w-screen">

                    <>
                    <Table className=" bg-white border mt-5" >
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Custom styled table">
                        <Table.Header className="bg-gray-100">
                            <Table.Column isRowHeader>Usuario</Table.Column>
                            <Table.Column >Email</Table.Column>
                            <Table.Column>Rol</Table.Column>
                            <Table.Column>Acciones</Table.Column>
                        </Table.Header>
                        <Table.Body 
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <span className="text-sm text-muted">No se encontraron resultados.</span>
                            </EmptyState>
                        )}>
                            {userFiltrados.map((data, key) =>(
                                <Table.Row id={key} className="border-b">
                                    <Table.Cell>{data.name}</Table.Cell>
                                    <Table.Cell>{data.correo}</Table.Cell>
                                    
                                    <Table.Cell>
                                        <Chip color="success" variant="soft" className='flex justify-center' >
                                                <Chip.Label>{data.roles = "admin" ? "Veterinario":"Recepcionista"}</Chip.Label>
                                        </Chip>
                                    </Table.Cell>   
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
                </div>
                
            </div>
            <UserPageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                tratActual={userSeleccionado}
                onSave={handleGuardarUser}
            />
            </>
        );
}


export default VetPage;