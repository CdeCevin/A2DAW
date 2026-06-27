package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Cita;
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
    private List<CitaResumen> citas;

    public static MascotaDtoOut fromEntity(Mascota m) {
        if (m == null) return null;

        List<CitaResumen> citasDto = new ArrayList<>();
        if (m.getCitas() != null) {
            List<Cita> activeCitas = m.getCitas().stream()
                    .filter(c -> c.getActivo() == null || c.getActivo())
                    .collect(Collectors.toList());

            if (!activeCitas.isEmpty()) {
                Cita latestCita = activeCitas.stream()
                        .max(java.util.Comparator.comparing(Cita::getFecha))
                        .orElse(null);

                for (Cita c : activeCitas) {
                    CitaResumen cr = CitaResumen.fromEntity(c);
                    if (latestCita != null && c.getId().equals(latestCita.getId())) {
                        cr.setEsUltima(true);
                    } else {
                        cr.setEsUltima(false);
                    }
                    citasDto.add(cr);
                }
            }
        }

        return new MascotaDtoOut(
            m.getId(),
            m.getNombre(),
            m.getEspecie(),
            m.getRaza(),
            m.getFechaNacimiento(),
            DuenioResumenDto.fromEntity(m.getDuenio()),
            citasDto
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
        private VeterinarioResumenDto veterinario;

        public static CitaResumen fromEntity(Cita c) {
            if (c == null) return null;
            return new CitaResumen(
                c.getId(),
                c.getFecha(),
                c.getMotivo(),
                c.getDiagnostico(),
                false,
                VeterinarioResumenDto.fromEntity(c.getVeterinario())
            );
        }
    }
}
