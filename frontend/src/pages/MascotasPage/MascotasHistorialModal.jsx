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
            <Modal.Header>
                <div className="flex flex-row items-start lg:items-center gap-5">
                                <div className={` flex size-12 items-center justify-center rounded-xl bg-accent-aqua-vg/10`}>
                                    <PawPrint className={`w-6 h-6 sm:w-6 sm:h-6 text-accent-aqua-vg`}/>
                                </div>
                                <div className="flex flex-col-2 w-full justify-between">
                                    <div className='flex flex-col gap-2 justify-start'>
                                        <span className="font-bold text-lg">Historial Médico de {mascotaActual.nombre}</span>
                                        <div className="flex flex-row">
                                            <span className=" text-sm lg:text-md text-gray-600" >{mascotaActual.especie} • {mascotaActual.raza} • {mascotaActual.duenio.nombreCompleto}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 justify-end' >
                                        <span className="font-bold text-lg text-accent-aqua-vg ">Valor</span>
                                        <div className="flex flex-row">
                                            <span className=" text-sm text-gray-600" >total citas</span>
                                        </div>
                                        
                                    </div>
                                    
                                    
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                
                                <div className="flex flex-row">
                                    <span className="text-sm lg:text-md text-gray-600">Dueño:&nbsp;</span> 
                                    <span className="text-sm lg:text-md "> {mascotaActual.duenio.nombreCompleto}</span>
                                </div>
                                <hr className="border-t border-gray-300 my-2" />
                                
                                
                            </div>
            </Modal.Header>
            
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                    
                        
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                
                </Modal.Footer>
                
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);}