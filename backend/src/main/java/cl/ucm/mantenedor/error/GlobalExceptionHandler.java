package cl.ucm.mantenedor.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
import org.hibernate.exception.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorInfo> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorInfo(400, ex.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorInfo> handleConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorInfo(400, "Error de validación: " + ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorInfo> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String msg = "Violación de integridad de datos en la base de datos.";
        if (ex.getRootCause() != null && ex.getRootCause().getMessage().contains("duplicate key")) {
            msg = "El registro ya existe en el sistema o tiene campos duplicados.";
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorInfo(409, msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorInfo(500, "Ocurrió un error inesperado en el servidor."));
    }
}
