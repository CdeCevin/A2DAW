package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Duenio;
import cl.ucm.mantenedor.entities.Mascota;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DuenioDtoOut {
    private Integer id;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private List<MascotaResumen> mascotas;

    public static DuenioDtoOut fromEntity(Duenio duenio) {
        if (duenio == null) return null;

        List<MascotaResumen> mascotasDto = new ArrayList<>();
        if (duenio.getMascotas() != null) {
            mascotasDto = duenio.getMascotas().stream()
                .map(MascotaResumen::fromEntity)
                .collect(Collectors.toList());
        }

        return new DuenioDtoOut(
            duenio.getId(),
            duenio.getNombreCompleto(),
            duenio.getEmail(),
            duenio.getTelefono(),
            mascotasDto
        );
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MascotaResumen {
        private Integer id;
        private String nombre;
        private String especie;
        private String raza;
        private LocalDate fechaNacimiento;

        public static MascotaResumen fromEntity(Mascota m) {
            if (m == null) return null;
            return new MascotaResumen(
                m.getId(),
                m.getNombre(),
                m.getEspecie(),
                m.getRaza(),
                m.getFechaNacimiento()
            );
        }
    }
}
