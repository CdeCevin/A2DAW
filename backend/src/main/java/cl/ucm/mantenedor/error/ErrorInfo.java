package cl.ucm.mantenedor.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ErrorInfo {
    private int code;
    private String message;
}
