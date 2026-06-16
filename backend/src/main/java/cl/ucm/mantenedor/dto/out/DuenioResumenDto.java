package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Duenio;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DuenioResumenDto {
    private Integer id;
    private String nombreCompleto;

    public static DuenioResumenDto fromEntity(Duenio duenio) {
        if (duenio == null) return null;
        return new DuenioResumenDto(duenio.getId(), duenio.getNombreCompleto());
    }
}
