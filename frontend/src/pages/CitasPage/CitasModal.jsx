import { useState, useEffect } from 'react';
import { Spinner, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDateTime } from "@internationalized/date";

export default function CitasModal({ isOpen, onClose, citaActual, onSave, mascotas, veterinarios }) {
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
            mascota: {id:""},
            fecha: "",
            motivo: "",
            veterinario: {id:""}
        });

        useEffect(() => {
            if (isOpen) {
                setLoading(false)
        if (citaActual) {
            console.log("cita: ", citaActual)
            // Si viene una cita se llena el formulario
            setFormData({
                fecha: citaActual.fecha || "",
                motivo: citaActual.motivo || "",
                mascota: { id: citaActual.mascota?.id ? String(citaActual.mascota.id) : "" },
                veterinario: { id: citaActual.veterinario?.id ? String(citaActual.veterinario.id) : "" }
            });
        } else {
            // Cita vacia limpia el formulario
            setFormData({ 
                fecha: "", 
                motivo: "",
                mascota: { id: "" },
                veterinario: { id: "" }
            });
        }
    }
    }, [citaActual, isOpen]);

    
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        
        try {
            // Envio de datos y espera a termino de guardado
            await onSave(formData);
        } finally {
            // Cambio de estado boton frente a guardado exitoso o no
            setLoading(false);
        }
    };
return (
<Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
    
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md lg:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className='font-montserrat text-xl'>{citaActual ? "Editar Cita" : "Agendar Nueva Cita"}</Modal.Heading>
            </Modal.Header>
            <form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                    <div className='flex flex-row gap-5 mb-4'>
                        <Select isRequired={!citaActual}  className="w-[256px]" placeholder="Seleccionar" selectedKey={formData.mascota.id || null} onSelectionChange={(key) => setFormData({ ...formData, mascota: { id: key } })}>
                            <Label>Mascota</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover >
                                <ListBox >
                                {mascotas.map((mascota, key) =>(
                                     <ListBox.Item key={mascota.id} id={`${mascota.id}`} textValue={`${mascota.nombre}`}>
                                    {mascota.nombre} ({mascota.especie})
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>   
                                ))}
                                </ListBox>
                            </Select.Popover>
                            </Select>
                            <Select isRequired={!citaActual} className="w-[256px]" placeholder="Seleccionar" selectedKey={formData.veterinario.id || null} onSelectionChange={(key) => setFormData({ ...formData, veterinario: { id: key } })}>
                            <Label>Veterinario</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                {veterinarios.map((vet, key) =>(
                                     <ListBox.Item key={vet.id} id={`${vet.id}`} textValue={`${vet.name}`}>
                                    Dr. {vet.name}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>   
                                ))}
                                </ListBox>
                            </Select.Popover>
                            </Select>
                        
                    </div>
                     <I18nProvider locale="es-cl">
                        <DatePicker 
                            className="w-full min-w-72 mb-4"
                            color="success"
                            granularity="minute"
                            hourCycle="24"
                            isRequired={!citaActual}
                            name="date"
                            value={formData.fecha ? parseDateTime(formData.fecha) : null}
                            // fecha parseada a string
                            onChange={(date) => setFormData({ ...formData, fecha: date ? date.toString() : "" })}
                        >
                            <Label>Fecha</Label>
                            <DateField.Group fullWidth className="border border-gray-100">
                                <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                <DateField.Suffix>
                                    <DatePicker.Trigger>
                                        <DatePicker.TriggerIndicator />
                                    </DatePicker.Trigger>
                                </DateField.Suffix>
                            </DateField.Group>
                            <DatePicker.Popover>
                                <Calendar aria-label="Event date">
                                    <Calendar.Header>
                                        <Calendar.YearPickerTrigger>
                                            <Calendar.YearPickerTriggerHeading />
                                            <Calendar.YearPickerTriggerIndicator />
                                        </Calendar.YearPickerTrigger>
                                        <Calendar.NavButton slot="previous" />
                                        <Calendar.NavButton slot="next" />
                                    </Calendar.Header>
                                    <Calendar.Grid>
                                        <Calendar.GridHeader>
                                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                        </Calendar.GridHeader>
                                        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                                    </Calendar.Grid>
                                    <Calendar.YearPickerGrid>
                                        <Calendar.YearPickerGridBody>
                                            {({year}) => <Calendar.YearPickerCell year={year} />}
                                        </Calendar.YearPickerGridBody>
                                    </Calendar.YearPickerGrid>
                                </Calendar>
                            </DatePicker.Popover>
                        </DatePicker>
                    </I18nProvider>
                  <TextField className="w-full" name="razon" variant="primary" value={formData.motivo} onChange={(value) => setFormData({ ...formData, motivo: value })}>
                    <Label>Razón de la visita</Label>
                    <Input className="border border-gray-100" placeholder="Ej. Checkeo anual" />
                  </TextField>
                  
                
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onPress={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" isPending={isLoading}>
                {({isPending}) => (
                    <>
                    {isPending ? <Spinner color="current" size="sm" /> : ""}
                    {isPending ? "Cargando..." : (citaActual? "Editar" : "Agendar")}
                    </>
                )}
                </Button>
                </Modal.Footer>
                </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);}