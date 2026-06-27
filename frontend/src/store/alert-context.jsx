import { createContext, useState, useContext } from 'react';
import { AlertDialog, Button } from "@heroui/react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        status: '', //opciones: "danger", "warning","success","accent"
    });

    const showAlert = (title, description = '', status = 'danger') => {
        // extrae el mensaje del formato objeto {code, message}
        let safeDescription = description;
        if (typeof description === 'object' && description !== null) {
            safeDescription = description.message || JSON.stringify(description);
        }

        setAlertConfig({ isOpen: true, title, description: safeDescription, status });
    };

    const closeAlert = () => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            
            <AlertDialog 
                isOpen={alertConfig.isOpen} 
                onOpenChange={(isOpen) => {
                    if (!isOpen) closeAlert();
                }}
            >
                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className="sm:max-w-100">                            
                            <AlertDialog.Header>
                                <AlertDialog.Icon status={alertConfig.status} />
                                <AlertDialog.Heading>{alertConfig.title}</AlertDialog.Heading>
                            </AlertDialog.Header>
                            
                            <AlertDialog.Body>
                                <p className="text-gray-600 text-sm md:text-base">
                                    {alertConfig.description}
                                </p>
                            </AlertDialog.Body>
                            
                            <AlertDialog.Footer>
                                <Button 
                                    variant={alertConfig.status === "danger" ? "danger" : "primary"}
                                    onPress={closeAlert}
                                >
                                    <span>Aceptar</span>
                                </Button>
                            </AlertDialog.Footer>
                            
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
            
        </AlertContext.Provider>
    );
};

export const useGlobalAlert = () => useContext(AlertContext);