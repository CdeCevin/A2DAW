package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.entities.Tratamiento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CitaResumen {
        private Integer id;
        private LocalDateTime fecha;
        private String motivo;
        private String diagnostico;
        private Boolean esUltima;
        private List<TratamientoResumen> tratamientos;
        private VeterinarioResumenDto veterinario;

        public static CitaResumen fromEntity(Cita c) {
            if (c == null) return null;

            List<TratamientoResumen> tDto = new ArrayList<>();
            if (c.getTratamientos() != null) {
                tDto = c.getTratamientos().stream()
                    .filter(t -> t.getActivo() == null || t.getActivo())
                    .map(TratamientoResumen::fromEntity)
                    .collect(Collectors.toList());
            }

            return new CitaResumen(
                c.getId(),
                c.getFecha(),
                c.getMotivo(),
                c.getDiagnostico(),
                false,
                tDto,
                VeterinarioResumenDto.fromEntity(c.getVeterinario())
            );
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TratamientoResumen {
        private Integer id;
        private String descripcion;
        private Double costo;

        public static TratamientoResumen fromEntity(Tratamiento t) {
            if (t == null) return null;
            return new TratamientoResumen(
                t.getId(),
                t.getDescripcion(),
                t.getCosto()
            );
        }
    }
}
