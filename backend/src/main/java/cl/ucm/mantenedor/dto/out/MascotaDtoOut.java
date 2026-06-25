package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Mascota;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MascotaDtoOut {
    private Integer id;
    private String nombre;
    private String especie;
    private String raza;
    private LocalDate fechaNacimiento;
    private DuenioResumenDto duenio;

    public static MascotaDtoOut fromEntity(Mascota m) {
        if (m == null) return null;
        return new MascotaDtoOut(
            m.getId(),
            m.getNombre(),
            m.getEspecie(),
            m.getRaza(),
            m.getFechaNacimiento(),
            DuenioResumenDto.fromEntity(m.getDuenio())
        );
    }
}
