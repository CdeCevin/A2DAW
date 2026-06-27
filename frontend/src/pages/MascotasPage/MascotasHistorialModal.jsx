import { useState, useEffect } from 'react';
import { FieldError, Spinner, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { PawPrint } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import { useGlobalAlert } from "../../store/alert-context";



const especies = ["Perro", "Gato", "Ave", "Conejo", "Reptil", "Hamster", "Otro"]

export default function MascotasHistorialModal({ isOpen, onClose, mascotaActual}) {
    const [isLoading, setLoading] = useState(false);
    
return (
<Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
    
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md lg:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header className='sticky'>
                <div className="flex flex-row items-start lg:items-center gap-5 pr-5">
                    
                    <div className="flex flex-row w-full justify-between items-start px-4 pt-4 ">
                            <div className="flex flex-col gap-2 text-left">
                                <div className='flex flex-row gap-2'>
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
                            <div className="flex flex-col text-right">
                                <span className="font-bold text-lg text-accent-aqua-vg">
                                    Valor
                                </span>
                                <span className="text-sm text-gray-600">
                                    total citas
                                </span>
                            </div>
                            
                        </div>
                        
                    </div>
                <hr className="border-t border-gray-300 my-2 pr-5" />  
            </Modal.Header>
            
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                    <div className='flex flex-col items-center justify-center'>
                            {mascotaActual.historial ? mascotaActual.historial.map((mascota, key) =>(                     
                                <Card key={key} className="w-full max-w-md bg-white border">
                                    <Card.Content>
                                        <div className="flex flex-row items-start lg:items-center gap-5">
                                            <div className={` flex size-12 items-center justify-center rounded-xl bg-accent-aqua-vg/10`}>
                                                <PawPrint className={`w-6 h-6 sm:w-6 sm:h-6 text-accent-aqua-vg`}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg">{mascota.nombre}</span>
                                                
                                                <span className=" text-sm lg:text-md text-gray-600" >{mascota.especie} • {mascota.raza}</span>
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