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
public class CitaDtoOut {
    private Integer id;
    private LocalDateTime fecha;
    private String motivo;
    private String diagnostico;
    private MascotaResumenDto mascota;
    private VeterinarioResumenDto veterinario;

    public static CitaDtoOut fromEntity(Cita c) {
        if (c == null) return null;
        return new CitaDtoOut(
            c.getId(),
            c.getFecha(),
            c.getMotivo(),
            c.getDiagnostico(),
            MascotaResumenDto.fromEntity(c.getMascota()),
            VeterinarioResumenDto.fromEntity(c.getVeterinario())
        );
    }
}
