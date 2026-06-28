package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.out.MascotaDtoOut;
import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/historialmedico")
public class HistorialMedicoController {

    @Autowired
    private MascotaRepository mascotaRepository;

    @GetMapping("/{idMascota}")
    public ResponseEntity<?> getHistorialMedico(@PathVariable Integer idMascota) {
        return mascotaRepository.findById(idMascota)
                .map(mascota -> {
                    List<MascotaDtoOut.CitaResumen> citasDto = new ArrayList<>();
                    if (mascota.getCitas() != null) {
                        List<Cita> activeCitas = mascota.getCitas().stream()
                                .filter(c -> c.getActivo() == null || c.getActivo())
                                .collect(Collectors.toList());

                        if (!activeCitas.isEmpty()) {
                            Cita latestCita = activeCitas.stream()
                                    .max(java.util.Comparator.comparing(Cita::getFecha))
                                    .orElse(null);

                            for (Cita c : activeCitas) {
                                MascotaDtoOut.CitaResumen cr = MascotaDtoOut.CitaResumen.fromEntity(c);
                                if (latestCita != null && c.getId().equals(latestCita.getId())) {
                                    cr.setEsUltima(true);
                                } else {
                                    cr.setEsUltima(false);
                                }
                                citasDto.add(cr);
                            }
                            citasDto.sort((a, b) -> b.getFecha().compareTo(a.getFecha()));
                        }
                    }
                    return ResponseEntity.ok(citasDto);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
