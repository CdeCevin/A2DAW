package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Cita;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CitaResumenDto {
    private Integer id;
    private LocalDateTime fecha;
    private String motivo;
    private String diagnostico;

    public static CitaResumenDto fromEntity(Cita c) {
        if (c == null) return null;
        return new CitaResumenDto(c.getId(), c.getFecha(), c.getMotivo(), c.getDiagnostico());
    }
}
