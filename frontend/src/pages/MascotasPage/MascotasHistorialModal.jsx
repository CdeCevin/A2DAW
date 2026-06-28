import { useState, useEffect } from 'react';
import { Card, Modal, Surface, Chip   } from "@heroui/react";
import { PawPrint } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import { useGlobalAlert } from "../../store/alert-context";
import { getHistorialMascotasApi } from '../../api/mascotasApi';
import { useErrorHandler } from "../../api/errorHandler";



const especies = ["Perro", "Gato", "Ave", "Conejo", "Reptil", "Hamster", "Otro"]

export default function MascotasHistorialModal({ isOpen, onClose, mascotaActual}) {
    const [isLoading, setLoading] = useState(false);
    const [historial, setHistorial] =useState([]);
    const { handleError } = useErrorHandler();

    useEffect(() => {
    if (!mascotaActual.id) return;
        const fetchHistorial = async () => {
            setLoading(true);
            try {
                const data = await getHistorialMascotasApi(mascotaActual.id);
                setHistorial(data);
            } catch (error) {
                handleError(error, "No se pudo cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

    fetchHistorial();
}, [mascotaActual.id]);

const costoTotal = historial.reduce((totalAcumulado, evento) => {
    const subtotalEvento = evento.tratamientos.reduce((subtotal, trat) => {
        return subtotal + (Number(trat.costo) || 0);
    }, 0);

    return totalAcumulado + subtotalEvento;
}, 0);

return (
<Modal isOpen={isOpen} onOpenChange={onClose} placement="center" >
    
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md lg:max-w-xl min-h-[50vh]">
            <Modal.CloseTrigger />
            <Modal.Header className='sticky'>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 mr-5">
                    
                    <div className="flex flex-col lg:flex-row w-full justify-between items-start px-4 pt-4 ">
                            <div className="flex flex-col gap-2 text-left">
                                <div className='flex lg:flex-row gap-2'>
                                    <div className={` flex size-12 items-center justify-center rounded-xl bg-accent-aqua-vg/10`}>
                                        <PawPrint className={`w-6 h-6 sm:w-6 sm:h-6 text-accent-aqua-vg`}/>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold text-lg">
                                            Historial Médico de {mascotaActual.nombre}
                                        </span>
                                        <div className="flex flex-row">
                                            <span className="text-sm lg:text-md text-gray-600">
                                                {mascotaActual.especie} • {mascotaActual.raza} • {mascotaActual.duenio?.nombreCompleto}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col text-right">
                                <span className="font-bold text-lg text-accent-aqua-vg">
                                    {new Intl.NumberFormat("es-CL", {style: "currency",currency: "CLP" }).format(costoTotal)}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {historial.length} citas
                                </span>
                            </div>
                            
                        </div>
                        
                    </div>
                <hr className="border-t border-gray-300 my-2 pr-5" />  
            </Modal.Header>
            
            <Modal.Body className="p-2 lg:p-6 overflow-y-auto">
              <Surface variant="default" className='w-full'>
                    <div className='flex flex-col gap-4  items-center justify-center'>
                            {historial ? historial.map((evento, key) =>(                     
                                <Card key={key} className={`p-0 w-full bg-white border ${evento.esUltima ? "border-accent-aqua-vg/50" : "border-gray-200"}`}>
                                    <Card.Header className={`w-full p-3 rounded-t-3xl ${evento.esUltima ? "bg-accent-aqua-vg/20" : "bg-gray-200"}`}>
                                        <div className='flex flex-col lg:flex-row items-center justify-between'>
                                            <div className='flex flex-col items-start justify-start gap-1'>
                                                {new Date(evento.fecha).toLocaleDateString('es-CL', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',  
                                                })}
                                                {evento.esUltima && (
                                                <Chip 
                                                    
                                                    variant="soft"  
                                                    className="flex bg-accent-aqua-vg/70 text-white justify-center w-16 " 
                                                >
                                                    <Chip.Label>Última</Chip.Label>
                                                </Chip>)}
                                            </div>
                                            <div className='flex flex-col items-center gap-2'>
                                                <span className='text-gray-600 text-xs'>Dr. {evento.veterinario.name}</span>
                                                <Chip 
                                                    
                                                    variant="soft"  
                                                    className={`flex justify-center text-xs ${evento.esUltima ? "bg-accent-aqua-vg/20 text-accent-aqua-vg" : "bg-gray-300 text-gray-500 "}`}
                                                >
                                                    <Chip.Label>{evento.veterinario.especialidad}</Chip.Label>
                                                </Chip>
                                            </div>

                                        </div>
                                    </Card.Header>
                                    <Card.Content className='p-2 w-full'>
                                        <div className='flex flex-col lg:flex-col-2 gap-4 pr-2 pl-2'>
                                            <div className='flex flex-col '>
                                                <span className='text-gray-400 font-semibold text-md'>Razón de la Visita</span>
                                                <span className='text-md'>{evento.motivo}</span>
                                            </div>
                                            <div className='flex flex-col '>
                                                <span className='text-gray-400 font-semibold text-md'>Diagóstico </span>
                                                <span className='text-md'>{evento.diagnostico ? evento.diagnostico : "-"}</span>
                                            </div>
                                        </div>
                                        <div className='mt-2 mb-2 flex flex-col gap-2 pr-2 pl-2'>
                                                <span className='text-gray-400 font-semibold text-md'>Tratamiento</span>
                                                {evento.tratamientos.length > 0 ? (
                                                evento.tratamientos.map((trat, key) => (
                                                    <div key={trat.id} className="flex items-start justify-between mb-2 gap-4 px-3.5 py-2.5 rounded-lg bg-gray-300/20">
                                                        <span className='text-md'>{trat.descripcion}</span>
                                                        <span className='text-md text-accent-aqua-vg font-semibold'>${trat.costo}</span>
                                                    </div>
                                                ))) : ("No existen tratamientos asociados.")}

                                        </div>
                                    </Card.Content>
                                </Card>
                            )) : `No existe historial médico para ${mascotaActual.nombre}.`}
                        </div>
                        
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                
                </Modal.Footer>
                
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);}