import { useState, useEffect } from 'react';
import { DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDateTime } from "@internationalized/date";

export default function TratamientosModal({ isOpen, onClose, tratActual, onSave, citas }) {
    const [formData, setFormData] = useState({
            cita: {id:""},
            descripcion: "",
            costo: "",
        });

        useEffect(() => {
            if (isOpen) {
        if (tratActual) {
            console.log("tratamiento: ", tratActual)
            // Si viene una cita se llena el formulario
            setFormData({
                cita: { id: tratActual.cita?.id ? String(tratActual.cita.id) : "" },
                descripcion: tratActual.descripcion || "",
                costo: tratActual.costo || "",
                
            });
        } else {
            // Cita vacia limpia el formulario
            setFormData({ 
                costo: "", 
                descripcion: "",
                cita: { id: "" },
                
            });
        }
    }
    }, [tratActual, isOpen]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        // enviamos datos de vuelta al componente padre
        onSave(formData);
    };
return (
<Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
    
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md lg:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className='font-montserrat text-xl'>{tratActual ? "Editar Tratamiento" : "Añadir Nuevo Tratamiento"}</Modal.Heading>
            </Modal.Header>
            <form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                    <div className=' mb-4'>
                        <Select isRequired={!tratActual}  className="w-full" placeholder="Seleccionar" selectedKey={formData.cita.id || null} onSelectionChange={(key) => setFormData({ ...formData, cita: { id: key } })}>
                            <Label>Cita</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover >
                                <ListBox >
                                {citas.map((cita, key) =>(
                                     <ListBox.Item key={cita.id} id={`${cita.id}`} textValue={`${cita.motivo}`}>
                                    {cita.mascota.nombre} - ({new Date(cita.fecha).toLocaleString("es-CL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false 
                                    })})
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>   
                                ))}
                                </ListBox>
                            </Select.Popover>
                            </Select>
                                                    
                    </div>
                     
                  <TextField isRequired={!tratActual}  className="w-full mb-4" name="razon" variant="primary" value={formData.descripcion} onChange={(value) => setFormData({ ...formData, descripcion: value })}>
                    <Label>Descripcion</Label>
                    <Input className="border border-gray-100" placeholder="Descripción del tratamiento..." />
                  </TextField>
                  <TextField isRequired={!tratActual}  className="w-full" name="razon" variant="primary" value={formData.costo} onChange={(value) => setFormData({ ...formData, costo: value })}>
                    <Label>Costo ($)</Label>
                    <Input type='number' className="border border-gray-100" placeholder="0" />
                  </TextField>
                  
                
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                <Button slot="close" variant="secondary" onPress={onClose}>
                    Cancelar
                </Button>
                <Button type="submit">{tratActual ? "Editar" : "Añadir"}</Button>
                </Modal.Footer>
                </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);}