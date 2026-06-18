import { Menu, X, LogOut } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Chip } from '@heroui/react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-bg-vg border-b-2 border-grey/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
                <div className="flex flex-row justify-between h-14 sm:h-16 md:h-20">
                    {/*Lado Izquierdo */}
                    <div className='flex justify-start'>
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            <Link to="/menu" className="flex items-center cursor-pointer">
                            <div className='flex flex-col items-center'>
                                <img 
                                    src="/img/logo_mientras.jpg"
                                    alt="VetGo"
                                    className="h-6 sm:h-8"
                                />
                                <span className='text-lg font-bold font-montserrat text-black'>VetGo</span>
                            </div>
                        </Link>
                            {isUser && (
                                <>
                                    <Link to="/menu" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Menú</Link>                                    {/*<Link to="/dashboard" className="font-poppins text-gray-500 text-sm lg:text-base hover:text-azul-sismmo/30">Dashboard</Link>*/}
                                    <Link to="/citas" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Citas</Link>
                                    <Link to="/duenos" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Dueños</Link>
                                    <Link to="/mascotas" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Mascotas</Link>
                                </>
                            )}
                            
                            {isAdmin && (
                                <>
                                    <Link to="/veterinarios" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Veterinarios</Link>
                                    <Link to="/tratamientos" className="font-poppins text-gray-500 text-sm lg:text-base px-4 py-2 rounded-full transition-colors duration-200 hover:bg-verde-claro-vg/50 hover:text-gray-800">Tratamientos</Link>
                                </>
                            )}   
                        </div>
                        <Link to="/menu" className="md:hidden flex items-center cursor-pointer">
                            <div className='flex flex-col items-center'>
                                <img 
                                    src="/img/logo_mientras.jpg"
                                    alt="VetGo"
                                    className="h-6 sm:h-8"
                                />
                                <span className='font-bold text-black'>VetGo</span>
                            </div>
                        </Link>
                        
                        
                    </div>
                
                <div className="flex items-center h-14 sm:h-16 md:h-20">
                    {/*Lado Derecho */}
                    <div className='flex justify-end'>
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            {roles.length > 0 && (
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
                                    <div className='flex flex-col justify-items-end'>
                                        <span className="text-sm font-semibold">{userName}</span>
                                        <Chip color="success" variant="soft" className='flex justify-center' >
                                            <Chip.Label>{isAdmin ? "Veterinario":"Recepcionista"}</Chip.Label>
                                    </Chip>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                                        title="Cerrar sesión"
                                    >
                                        <LogOut className="h-4 w-4 text-gray-900" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {roles.length > 0 && (
                                <div className="md:hidden flex items-center gap-4 mr-4 pl-4 ">
                                    <div className='flex flex-col justify-items-end items-center'>
                                        <span className="text-sm font-semibold">{userName}</span>
                                        <Chip color="success" variant="soft" className='flex justify-center' >
                                            <Chip.Label>{isAdmin ? "Veterinario":"Recepcionista"}</Chip.Label>
                                    </Chip>
                                    </div>
                                    
                                </div>
                            )}
                        <button 
                            className='md:hidden p-2 text-white hover:bg-verde-claro-vg bg-verde-vg rounded-md cursor-pointer' 
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                        > 
                        {mobileMenuOpen ? (<X className="w-5 h-5 sm:w-6 sm:h-6" />) : (<Menu className="w-5 h-5 sm:w-6 sm:h-6 font-blue"/>)}
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="md:hidden ml-3 flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-4 w-4 text-gray-900" />
                        </button>
                </div>
                </div>
                </div>
            </div>
            {/*Menu Movil */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-verde-vg backdrop-blur-lg animate-in slide-in-from-top duration-300'>
                    <div className='px-4 py-4 sm:py-6 space-y-3 sm:space-y-4'>
                        {isUser && (
                            <>
                                <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Menú</Link>
                                <Link to="/citas" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Citas</Link>
                                <Link to="/duenos" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Dueños</Link>
                                <Link to="/mascotas" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Mascotas</Link>
                            </>
                        )}
                        
                        {isAdmin && (
                            <>
                                <Link to="/veterinarios" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Veterinarios</Link>
                                <Link to="/tratamientos" onClick={() => setMobileMenuOpen(false)} className="block font-poppins text-white font-bold text-sm lg:text-base hover:text-white/30">Tratamientos</Link>
                            </>
                        )}

                        
                    </div>
                </div>
            )}
        </nav>
    );
}