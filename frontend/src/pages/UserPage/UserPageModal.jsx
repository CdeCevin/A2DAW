import { useState, useEffect } from 'react';
import { FieldError, RadioGroup, Radio, Spinner, Description, NumberField, DatePicker, DateField, Calendar, Modal, Button, Surface, TextField, Label, Input, Select, ListBox   } from "@heroui/react";
import { Mail } from 'lucide-react';
import {I18nProvider} from "react-aria-components";
import { parseDateTime } from "@internationalized/date";
import { User, ShieldCheck  } from 'lucide-react';
import { useGlobalAlert } from "../../store/alert-context";


const especialidades = ["Medicina General", "Ortopedia", "Dermatología", "Cardiología", "Oncología", "Neurología", "Odontología", "Urgencias"]

export default function UserPageModal({ isOpen, onClose, userActual, onSave }) {
    const [isLoading, setLoading] = useState(false);
    const { showAlert } = useGlobalAlert();
    const [formData, setFormData] = useState({
            correo: "",
            name: "",
            especialidad: "",
            idRol: undefined,
            password: ""
        });

        useEffect(() => {
            if (isOpen) {
                setLoading(false)
        if (userActual) {
            const esAdmin = userActual.roles && userActual.roles.includes("admin");
            const rolUI = esAdmin ? "Veterinario" : "Recepcionista";
            const rolId = esAdmin ? 1 : 2;
            // Si viene un tratamiento se llena el formulario
            setFormData({
                correo: userActual?.correo || "",
                name: userActual?.name || "",
                especialidad: userActual?.especialidad || "",
                roles: rolUI,
                idRol: rolId,
            
            });
        } else {
            // Tratamiento vacio limpia el formulario
            setFormData({ 
                correo: "",
                name: "",
                especialidad: "",
                roles: "",
                idRol: undefined,
                password: ""
                
            });
        }
    }
    }, [userActual, isOpen]);

    
    const handleSubmit = async (e)  => {
        
        setLoading(true)
        e.preventDefault();
        if (!formData.roles) {
            showAlert("", "Por favor, seleccione el tipo de usuario (Recepcionista o Veterinario) antes de continuar.", "warning");
            setLoading(false)
            return;
        }
        //preparacion payload para el formato idrol esperado
        const payloadFinal = {
            correo: formData.correo,
            name: formData.name,
            idRol: formData.idRol,
            ...(formData.password && { password: formData.password }),
            especialidad: formData.idRol === 2 ? null : (formData.especialidad || null) 
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
          <Modal.Dialog className="sm:max-w-md lg:max-w-lg overflow-y-scroll">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className='font-montserrat text-xl'>{userActual ? "Editar Usuario" : "Añadir Nuevo Usuario"}</Modal.Heading>
            </Modal.Header>
            <form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Modal.Body className="p-2 lg:p-6">
              <Surface variant="default">
                <Label>Tipo de Usuario</Label>
                <div className='flex flex-col sm:flex-row gap-2 lg:gap-4 mb-4 mt-1'>
                    {/* RECEP */}
                    <button
                        type="button"
                       onClick={() => setFormData({ ...formData, roles: "Recepcionista", idRol: 2, especialidad: "" })}
                        className={`w-full sm:flex-1 lg:w-full flex flex-col items-start p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                            formData.roles === "Recepcionista"
                                ? "border-verde-vg  text-accent-aqua-vg"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                    <div className="flex items-center gap-2 mb-1 text-md font-semibold">
                        <User className="size-5" />
                        Recepcionista
                    </div>
                    <span className={`text-sm ${formData.roles === "Recepcionista" ? "text-teal-600/80" : "text-gray-500"}`}>
                        Solo ver y agendar
                    </span>
                </button>

                {/* VETERINARIO */}
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, roles: "Veterinario", idRol: 1 })}
                    className={`w-full sm:flex-1 flex flex-col items-start p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                        formData.roles === "Veterinario"
                                ? "border-verde-vg  text-accent-aqua-vg"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1 text-md font-semibold">
                        <ShieldCheck className="size-5" />
                        Veterinario
                    </div>
                    <span className={`text-sm ${formData.roles === "Veterinario" ? "text-teal-600/80" : "text-gray-500"}`}>
                        Acceso clínico total
                    </span>
                </button>
                </div>
                <TextField 
                        isRequired={!userActual}
                        className="w-full mb-4"
                        variant="primary"
                        value={formData.name} 
                        onChange={(value) => setFormData({ ...formData, name: value })}
                        name="nombre" 
                        type="text">
                        <Label>Nombre</Label>
                        <Input maxLength={32} className="border border-gray-100"  placeholder="" variant="primary" />
                        <FieldError />
                        </TextField>
                <TextField 
                        isRequired={!userActual}
                        className="w-full mb-4"
                        variant="primary"
                        value={formData.correo} 
                        onChange={(value) => setFormData({ ...formData, correo: value })}
                        name="correo" 
                        type="email" 
                        >
                        <Label>Correo Electrónico</Label>
                        <Input className="border border-gray-100"  placeholder="correo@ejemplo.com" variant="primary" />
                        <FieldError />
                        </TextField>
                        <TextField 
                            isRequired={!userActual}
                            className="w-full mb-4"
                            name="password"
                            variant="primary"
                           
                            onChange={(value) => setFormData({ ...formData, password: value })}
                            validate={(value) => {
                            if (value && (value.length < 8 || value.length > 16)) {
                                return "La contraseña debe tener mínimo 8 caracteres y máximo 16";
                            }
                            return null;
                        }}>
                            <Label>Contraseña </Label>
                            <Input type="password" className="border border-gray-100" placeholder="••••••••" />
                             <Description>{userActual ? "Dejar en blanco para no cambiar" : ""}</Description>
                        <FieldError />
                        
                        </TextField>
                        {formData.roles === "Veterinario" && (
                        <Select 
                            isRequired={!userActual?.especialidad}
                            className="w-full" 
                            placeholder="Seleccionar especialidad..." 
                            selectedKey={formData.especialidad || null} 
                            onSelectionChange={(id) => setFormData({ ...formData, especialidad: id})}
                        >
                            <Label>Especialidad Médica</Label>
                            <Select.Trigger className="border border-gray-100">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {especialidades.map((esp, key) => (
                                    <ListBox.Item id={esp}>{esp}</ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                        )}


              </Surface>
            </Modal.Body>
            <Modal.Footer>
                <Button  variant="secondary" onPress={onClose}>
                    Cancelar
                </Button>
                
                <Button type="submit" isPending={isLoading}>
                {({isPending}) => (
                    <>
                    {isPending ? <Spinner color="current" size="sm" /> : ""}
                    {isPending ? "Cargando..." : (userActual? "Editar" : "Añadir")}
                    </>
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