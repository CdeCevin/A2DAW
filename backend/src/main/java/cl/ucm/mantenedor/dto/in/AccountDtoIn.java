package cl.ucm.mantenedor.dto.in;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDtoIn {
    private String rut;
    private String name;
    private String password;
    private int idRol;
}
