package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Usuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDtoOut {
    private Integer id;
    private String correo;
    private String name;
    private String especialidad;
    private List<String> roles;

    public static UsuarioDtoOut fromEntity(Usuario u) {
        if (u == null) return null;
        return new UsuarioDtoOut(
            u.getId(),
            u.getCorreo(),
            u.getName(),
            u.getEspecialidad(),
            u.getRoles() == null ? List.of() : u.getRoles().stream().map(r -> r.getName()).collect(Collectors.toList())
        );
    }
}
