import { useNavigate } from 'react-router-dom';
import { useGlobalAlert } from '../store/alert-context';

export const useErrorHandler = () => {
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();

    const handleError = (error, mensajePorDefecto = "Ocurrió un error inesperado.") => {
        console.error("Error capturado:", error);
        
        let errorCode = error.status;
        let mensajeBackend = null; 

        // Extrae código y mensaje desde el JSON de respuesta del backend
        if (error.message) {
            try {
                const errorParsed = JSON.parse(error.message);
                
                // buscar "status" o "code" dependiendo de como lo envia spring boot
                errorCode = errorCode || errorParsed.status || errorParsed.code;
                
                // buscar "message" o "error" dependiendo de como lo envia spring boot
                mensajeBackend = errorParsed.message || errorParsed.error; 
            } catch (e) {
                // Si falla: el mensaje no era JSON
            }
        }

        // evalua errores y se toman acciones
        if (errorCode === 401 || errorCode === 403) {
            showAlert("Sesión Expirada", "Tu sesión ha caducado o no tienes permisos. Vuelve a iniciar sesión.", "warning");
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
            
        } else if (errorCode === 404) {
            // mensaje del backend o generico si no viene
            showAlert("Aviso", mensajeBackend || "El registro no existe en el servidor.", "warning");
            
        } else if (errorCode === 500) {
            showAlert("Error del Servidor", mensajeBackend || "Hubo un problema interno en el servidor. Inténtalo más tarde.", "danger");
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
            
        } else {
            // Si no es ninguno de los anteriores
            let textoMostrar = mensajeBackend || error.message;
            
            // si no se pudo parsear el error generico de spring boot
            if (typeof textoMostrar === 'string' && textoMostrar.includes('{"timestamp"')) {
                textoMostrar = mensajePorDefecto; 
            }
            
            showAlert("Error", textoMostrar || mensajePorDefecto, "danger");
        }
    };

    return { handleError };
};