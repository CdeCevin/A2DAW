import { useNavigate } from 'react-router-dom';
import { useGlobalAlert } from '../store/alert-context';

export const useErrorHandler = () => {
    const navigate = useNavigate();
    const { showAlert } = useGlobalAlert();

    const handleError = (error, mensajePorDefecto = "Ocurrió un error inesperado.") => {
        console.error("Error capturado:", error);
        let errorCode = error.status;

        //extraer codio desde el json de respuesta del backend si no fue entregado desde la pagina 
        if (!errorCode && error.message) {
            try {
                const errorBackend = JSON.parse(error.message);
                errorCode = errorBackend.status;
            } catch (e) {
                //si falla se ignora
                
            }
        }

        //Se evaluan los errores y se toman acciones
        if (errorCode === 401 || errorCode === 403) {
            showAlert("Sesión Expirada", "Tu sesión ha caducado o no tienes permisos. Vuelve a iniciar sesión.", "warning");
            
            localStorage.removeItem('token');
            
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
            
        } else if (errorCode === 404) {
            showAlert("No encontrado", "El registro no existe en el servidor.", "danger");
            
        } else if (errorCode === 500) {
            showAlert("Error del Servidor", "Hubo un problema interno en el servidor. Inténtalo más tarde.", "danger");
            localStorage.removeItem('token');
            
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
            
        } else {
            let textoMostrar = error.message;
            if (textoMostrar?.includes('{"timestamp"')) {
                textoMostrar = mensajePorDefecto; 
            }
            showAlert("Error", textoMostrar || mensajePorDefecto, "danger");
        }
    };

    return { handleError };
};