package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VeterinarioResumenDto {
    private Integer id;
    private String name;
    private String especialidad;

    public static VeterinarioResumenDto fromEntity(Usuario u) {
        if (u == null) return null;
        return new VeterinarioResumenDto(u.getId(), u.getName(), u.getEspecialidad());
    }
}
