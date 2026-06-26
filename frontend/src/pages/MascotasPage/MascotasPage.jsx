import Navbar from "../NavBar/NavBar";
import { getMascotasApi, delMascotasApi, editMascotasApi, buscarMascotasApi, crearMascotasApi} from "../../api/mascotasApi";
import { getDuenosApi} from "../../api/duenosApi";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Card, SearchField, Button } from "@heroui/react";
import { SquarePen, Trash2, PawPrint } from "lucide-react";
import  MascotasPageModal from "./MascotasPageModal";
import  MascotasHistorialModal from "./MascotasHistorialModal";
import { useGlobalAlert } from "../../store/alert-context";

function MascotasPage(){
    const { showAlert } = useGlobalAlert();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [datos, setDatos] = useState([]);
    const [duenos, setDuenos] = useState([]);
    const [isModalHMOpen, setIsModalHMOpen] = useState(false);

    const handleAbrirCrear = () => {
        setMascotaSeleccionada(null); // Null para crear
        setIsModalOpen(true);
    };

    const handleAbrirEditar = (masc) => {
        setMascotaSeleccionada(masc); // Datos de la fila a editar
        console.log(masc)
        setIsModalOpen(true);
    };

    const handleAbrirHistorial = (masc) => {
        setMascotaSeleccionada(masc); // Null para crear
        setIsModalHMOpen(true);
    };

    const handleGuardarMascota = async (datosFormulario) => {
        console.log("Datos a guardar: ", datosFormulario);
            const payloadLimpio = {
            ...datosFormulario
        };

        console.log("Paquete limpio enviado al backend: ", payloadLimpio);

        try {
            if (mascotaSeleccionada?.id) {
                // MODO EDITAR
                const resp = await editMascotasApi(mascotaSeleccionada.id, payloadLimpio);
                console.log("Respuesta Edición: ", resp);
            } else {
                // MODO CREAR
                const resp = await crearMascotasApi(payloadLimpio);
                console.log("Respuesta Creación: ", resp);
            }
                
                showAlert("¡Éxito!", "La mascota se guardó correctamente.", "success");
                setIsModalOpen(false); 
                
                const mascotasActualizadas = await getMascotasApi();
                setDatos(Array.isArray(mascotasActualizadas) ? mascotasActualizadas : []);

            } catch (error) {
                console.error("Error en handleGuardarMascota:", error);
                showAlert("Error", "No se pudo guardar la mascota.", "danger");
            }
        };

    const getDuenos = async () => {
            console.log('dueños')
            const resp = await getDuenosApi()
            setDuenos(resp)
            //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
            console.log(resp)
            if(resp.message){
                alert(resp.message)
            }
            console.log(resp)
        };
    const handleDelete = async (id) => {
        try {
            if (id) {
                const resp = await delMascotasApi(id);
                console.log("Respuesta: ", resp);
            }
                
                showAlert("¡Éxito!", "La mascota se eliminó correctamente.", "success"); 
                const mascotasActualizadas = await getMascotasApi();
                setDatos(Array.isArray(mascotasActualizadas) ? mascotasActualizadas : []);

            } catch (error) {
                console.error("Error en handleDelete:", error);
                showAlert("Error", "No se pudo eliminar la mascota.", "danger");
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
        const getMascotasInfo = async () => {
        getDuenos()
        console.log('info')
        const resp = await getMascotasApi()
        setDatos(resp)
        //setDatos(prevItems => [...resp, ...resp, ...prevItems]); //prueba para datos multiples
        console.log(resp)

        if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    };
    getMascotasInfo();
    }, []);

    const listaAFiltrar = Array.isArray(datos) ? datos :  [];

    const mascotasFiltradas = listaAFiltrar.filter((masc) => {
        if (!busqueda) return true;

        const termino = busqueda.toLowerCase();
        
        const nombreMascota = masc.nombre?.toLowerCase() || "";
        const especieMascota = masc.especie?.toLowerCase() || "";
        const duenoMascota = masc.duenio?.nombreCompleto?.toLowerCase() || "";

        return nombreMascota.includes(termino) || 
               especieMascota.includes(termino) || 
               duenoMascota.includes(termino);
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
                        <span className="font-montserrat text-xl lg:text-2xl">Mascotas</span>
                        <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Mascotas: {datos.length} </span>
                    </div>
                    <Button onPress={handleAbrirCrear} className="rounded-md bg-accent-aqua-vg">+ Añadir</Button>
                    </div>
                )}
                {isUser && (
                    <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <span className="font-montserrat text-xl lg:text-2xl"> Dueñps</span>
                        <span className="font-montserrat font-semibold text-gray-500 text-sm lg:text-md">Total Dueños: {datos.length} </span>
                    </div>
                    </div>
                )}

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
                        <SearchField.Input className="w-[280] " placeholder="Buscar nombre, especie, dueño.."  />
                        <SearchField.ClearButton />
                    </SearchField.Group>
                </SearchField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:justify-evenly max-w-screen mt-4 mb-4">
                {mascotasFiltradas.map((mascota, key) =>( 
                    
                    <Card key={key} className="w-full max-w-md bg-white border">
                        <Card.Content>
                            <div className="flex flex-row items-start lg:items-center gap-5">
                                <div className={` flex size-12 items-center justify-center rounded-xl bg-accent-aqua-vg/10`}>
                                    <PawPrint className={`w-6 h-6 sm:w-6 sm:h-6 text-accent-aqua-vg`}/>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">{mascota.nombre}</span>
                                    
                                    <span className=" text-sm lg:text-md text-gray-600" >{mascota.especie} - {mascota.raza}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row">
                                    <span className="text-sm lg:text-md text-gray-600">Nacimiento:&nbsp;</span> 
                                    <span className="text-sm lg:text-md "> {mascota.fechaNacimiento.split("T")[0].split("-").reverse().join('-')}</span>
                                </div>
                                <div className="flex flex-row">
                                    <span className="text-sm lg:text-md text-gray-600">Dueño:&nbsp;</span> 
                                    <span className="text-sm lg:text-md "> {mascota.duenio.nombreCompleto}</span>
                                </div>
                                <hr className="border-t border-gray-300 my-2" />
                                {isAdmin && (
                                    <div className="flex flex-row gap-2 items-center justify-between">
                                    <Button className="bg-success-soft text-accent-aqua-vg w-full" onPress={() => handleAbrirHistorial(mascota)}>
                                        Ver Historial Médico
                                    </Button>
                                    <Button aria-label="Editar Mascota" isIconOnly size="lg"  className="bg-white text-accent-aqua-vg hover:bg-success-soft" onPress={() => handleAbrirEditar(mascota)}>
                                        <SquarePen className="size-4"/>
                                    </Button>
                                    <Button aria-label="Eliminar Mascota" isIconOnly size="lg" className="bg-white text-accent-aqua-vg hover:bg-danger-soft hover:text-danger" onPress={() => handleDelete(mascota.id)}>
                                        <Trash2 className="size-4"/>
                                    </Button>
                                </div>
                                )}
                                {isUser && (
                                <div className="flex flex-row gap-2 items-center justify-between">
                                    <Button className="bg-success-soft text-accent-aqua-vg w-full" onPress={() => handleAbrirHistorial(mascota)}>
                                        Ver Historial Médico
                                    </Button>
                                </div>
                                )}
                            </div>
                        </Card.Content>
                    </Card>
                ))}
            </div>
                
            </div>
            {mascotaSeleccionada && (
            <MascotasPageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mascotaActual={mascotaSeleccionada}
                onSave={handleGuardarMascota}
                duenos={duenos}
               
            />)}
            {mascotaSeleccionada && (
            <MascotasHistorialModal 
                isOpen={isModalHMOpen} 
                onClose={() => setIsModalHMOpen(false)} 
                mascotaActual={mascotaSeleccionada}
            />)}
            </>
        );
}


export default MascotasPage;