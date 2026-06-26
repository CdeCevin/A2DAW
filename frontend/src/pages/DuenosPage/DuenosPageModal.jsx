import { useState, useEffect } from 'react';
import { FieldError, RadioGroup, Radio, Spinner, Description, NumberField, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDateTime } from "@internationalized/date";
import { useGlobalAlert } from "../../store/alert-context";

export default function DuenosPageModal({ isOpen, onClose, duenoActual, onSave }) {
    const [isLoading, setLoading] = useState(false);
    const { showAlert } = useGlobalAlert();
    const [formData, setFormData] = useState({
            email: "",
            nombreCompleto: "",
            telefono: "",
        });

        useEffect(() => {
            if (isOpen) {
                setLoading(false)
        if (duenoActual) {
            setFormData({
                email: duenoActual?.email || "",
                nombreCompleto: duenoActual?.nombreCompleto || "",
                telefono: duenoActual?.telefono || ""
            });
        } else {
            // Tratamiento vacio limpia el formulario
            setFormData({ 
                email: "",
                nombreCompleto: "",
                telefono: ""
            });
        }
    }
    }, [duenoActual, isOpen]);

    
    const handleSubmit = async (e)  => {
        
        setLoading(true)
        e.preventDefault()
        //preparacion payload
        const payloadFinal = {
            email: formData.email,
            nombreCompleto: formData.nombreCompleto,
            telefono: formData.telefono
        };
            
        try {
            // Envio de datos y espera a termino de guardado
            await onSave(payloadFinal);
        } finally {
            // Cambio de estado boton frente a guardado exitoso o no
            setLoading(false);
        }
    };
return (
<Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
    
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md lg:max-w-lg ">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className='font-montserrat text-xl'>{duenoActual ? "Editar Dueño" : "Añadir Nuevo Dueño"}</Modal.Heading>
            </Modal.Header>
            <form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                <TextField 
                        isRequired={!duenoActual}
                        className="w-full mb-4"
                        variant="primary"
                        value={formData.nombreCompleto} 
                        onChange={(value) => setFormData({ ...formData, nombreCompleto: value })}
                        name="nombre" 
                        type="text">
                        <Label>Nombre Completo</Label>
                        <Input maxLength={32} className="border border-gray-100"  placeholder="" variant="primary" />
                        <FieldError />
                </TextField>
                <TextField 
                        isRequired={!duenoActual}
                        className="w-full mb-4"
                        variant="primary"
                        value={formData.email} 
                        onChange={(value) => setFormData({ ...formData, email: value })}
                        name="correo" 
                        type="email" 
                        >
                        <Label>Correo Electrónico</Label>
                        <Input className="border border-gray-100"  placeholder="correo@ejemplo.com" variant="primary" />
                        <FieldError />
                        </TextField>
                        <TextField 
                            isRequired={!duenoActual}
                            className="w-full mb-4"
                            name="telefono"
                            variant="primary"
                            value={formData.telefono.substring(3)}
                            onChange={(value) => {
                                const soloNumeros = value.replace(/[^0-9]/g, '');
                                setFormData({ ...formData, telefono: `+56${soloNumeros}` });
                            }}
                            validate={(value) => {if (value && value.length !== 9) {
                                return "Ingresa un número de 9 dígitos después del +56";
                            }
                            return null;
                        }}>
                            <Label>Teléfono</Label>
                            <div className="flex items-center">
                                <span className="px-3 py-2 ">
                                    +56
                                </span>
                                <Input 
                                    type="tel"
                                    className="flex-1 px-3 py-2 bg-transparent border-none outline-none" 
                                    placeholder="912345678" 
                                    variant='primary'
                                    maxLength={9}
                                    minLength={9}
                                />
                            </div>
                            
                            <FieldError />
                        </TextField>
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                <Button  variant="secondary" onPress={onClose}>
                    <span>Cancelar</span>
                </Button>
                
                <Button type="submit" isPending={isLoading}>
                {({isPending}) => (
                    <span>
                    {isPending ? <Spinner color="current" size="sm" /> : ""}
                    {isPending ? "Cargando..." : (duenoActual? "Editar" : "Añadir")}
                    </span>
                )}
                </Button>
                </Modal.Footer>
                </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);
}