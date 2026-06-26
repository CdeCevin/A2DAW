import { useState, useEffect } from 'react';
import { FieldError, Spinner, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDate } from "@internationalized/date";
import { useGlobalAlert } from "../../store/alert-context";


const especies = ["Perro", "Gato", "Ave", "Conejo", "Reptil", "Hamster", "Otro"]

export default function MascotasPageModal({ isOpen, onClose, mascotaActual, onSave, duenos }) {
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
            nombre: "",
            especie: "",
            raza:"",
            fechaNacimiento: "",
            duenio: {id:""}
        });

        useEffect(() => {
            if (isOpen) {
                setLoading(false)
        if (mascotaActual) {
            console.log("mascota: ", mascotaActual)
            // Si viene una mascota se llena el formulario
            setFormData({
                nombre: mascotaActual.nombre || "",
                especie: mascotaActual.especie || "",
                raza: mascotaActual.raza || "",
                fechaNacimiento: mascotaActual.fechaNacimiento ? mascotaActual.fechaNacimiento.split("T")[0] : null,
                duenio: { id:mascotaActual.duenio?.id ? String(mascotaActual.duenio.id) : "" },

            });
        } else {
            // Mascota vacia limpia el formulario
            setFormData({ 
                nombre: "",
                especie: "",
                raza:"",
                fechaNacimiento: "",
                duenio: {id:""}
            });
        }
    }
    }, [mascotaActual, isOpen]);

    
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
              <Modal.Heading className='font-montserrat text-xl'>{mascotaActual ? "Editar Mascota" : "Añadir Mascota"}</Modal.Heading>
            </Modal.Header>
            <form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                    
                        <TextField 
                            isRequired={!mascotaActual}
                            className="w-full mb-4"
                            variant="primary"
                            value={formData.nombre} 
                            onChange={(value) => setFormData({ ...formData, nombre: value })}
                            name="nombre" 
                            type="text">
                            <Label>Nombre</Label>
                            <Input maxLength={32} className="border border-gray-100"  placeholder="" variant="primary" />
                            <FieldError />
                        </TextField>
                        <div className='flex flex-row gap-5 mb-4'>
                            <Select 
                            isRequired={!mascotaActual}
                            className="w-1/2" 
                            placeholder="Seleccionar..." 
                            selectedKey={formData.especie || null} 
                            onSelectionChange={(id) => setFormData({ ...formData, especie: id})}
                        >
                            <Label>Especie</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {especies.map((esp, key) => (
                                    <ListBox.Item key={key}id={esp}>{esp}</ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                        <TextField 
                            isRequired={!mascotaActual}
                            className="mb-4 w-1/2"
                            variant="primary"
                            value={formData.raza} 
                            onChange={(value) => setFormData({ ...formData, raza: value })}
                            name="raza" 
                            type="text">
                            <Label>Raza</Label>
                            <Input maxLength={32} className="border border-gray-100"  placeholder="" variant="primary" />
                            <FieldError />
                        </TextField>

                        </div>
                        <I18nProvider locale="es-cl">
                        <DatePicker 
                            className="w-full min-w-72 mb-4"
                            color="success"
                            granularity="day"
                            isRequired={!mascotaActual}
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento ? parseDate(formData.fechaNacimiento) : null}
                            onChange={(date) => setFormData({ ...formData, fechaNacimiento: date ? date.toString() : null })}
                        >
                            <Label>Fecha de Nacimiento</Label>
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
                        
                        <Select isRequired={!mascotaActual} className="w-full" placeholder="Seleccionar Dueño" selectedKey={formData.duenio.id || null} onSelectionChange={(key) => setFormData({ ...formData, duenio: { id: key } })}>
                            <Label>Dueño</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                {duenos.map((dueno, key) =>(
                                     <ListBox.Item key={dueno.id} id={`${dueno.id}`} textValue={`${dueno.nombreCompleto}`}>
                                    {dueno.nombreCompleto}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>   
                                ))}
                                </ListBox>
                            </Select.Popover>
                            </Select>
              </Surface>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onPress={onClose}>
                    <span>Cancelar</span>
                </Button>
                <Button type="submit" isPending={isLoading}>
                {({isPending}) => (
                    <span>
                    {isPending ? <Spinner color="current" size="sm" /> : ""}
                    {isPending ? "Cargando..." : (mascotaActual? "Editar" : "Añadir")}
                    </span>
                )}
                </Button>
                </Modal.Footer>
                </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
);}