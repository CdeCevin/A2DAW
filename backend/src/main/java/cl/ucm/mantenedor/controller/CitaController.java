package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.out.CitaDtoOut;
import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Usuario;
import cl.ucm.mantenedor.repository.CitaRepository;
import cl.ucm.mantenedor.repository.MascotaRepository;
import cl.ucm.mantenedor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cita")
public class CitaController {

    @Autowired
    private CitaRepository repository;

    @Autowired
    private MascotaRepository mascotaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<CitaDtoOut> getAll() {
        java.time.LocalDateTime startOfToday = java.time.LocalDate.now().atStartOfDay();
        return repository.findByFechaGreaterThanEqualOrderByFechaAsc(startOfToday).stream()
                .map(CitaDtoOut::fromEntity)
                .collect(Collectors.toList());
    }

    // Obtener Cita mediante ID
    @GetMapping("/{id}")
    public ResponseEntity<CitaDtoOut> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(CitaDtoOut::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Crear cita
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Cita cita) {
        if (cita.getActivo() == null) {
            cita.setActivo(true);
        }
        if (cita.getMascota() == null || cita.getMascota().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar una mascota con un ID válido");
        }
        if (cita.getVeterinario() == null || cita.getVeterinario().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar un veterinario con un ID válido");
        }

        Mascota mascota = mascotaRepository.findById(cita.getMascota().getId()).orElse(null);
        if (mascota == null) {
            return ResponseEntity.badRequest().body("La mascota especificada no existe");
        }

        Usuario veterinario = usuarioRepository.findById(cita.getVeterinario().getId()).orElse(null);
        if (veterinario == null) {
            return ResponseEntity.badRequest().body("El veterinario especificado no existe");
        }

        List<String> roles = usuarioRepository.getRoles(veterinario.getCorreo());
        boolean isAdmin = roles.stream().anyMatch(r -> r.equalsIgnoreCase("admin"));
        if (!isAdmin) {
            return ResponseEntity.badRequest().body("El usuario especificado no es un veterinario (no tiene rol de administrador)");
        }

        cita.setMascota(mascota);
        cita.setVeterinario(veterinario);
        repository.save(cita);
        return ResponseEntity.status(HttpStatus.CREATED).body("Cita programada con éxito");
    }

    // Actualizar Cita
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Cita details) {
        return repository.findById(id)
                .map(existing -> {
                    if (details.getFecha() != null) {
                        existing.setFecha(details.getFecha());
                    }
                    if (details.getMotivo() != null) {
                        existing.setMotivo(details.getMotivo());
                    }
                    if (details.getDiagnostico() != null) {
                        existing.setDiagnostico(details.getDiagnostico());
                    }

                    if (details.getMascota() != null && details.getMascota().getId() != null) {
                        Mascota mascota = mascotaRepository.findById(details.getMascota().getId()).orElse(null);
                        if (mascota == null) {
                            return ResponseEntity.badRequest().body("La mascota especificada no existe");
                        }
                        existing.setMascota(mascota);
                    }

                    if (details.getVeterinario() != null && details.getVeterinario().getId() != null) {
                        Usuario veterinario = usuarioRepository.findById(details.getVeterinario().getId()).orElse(null);
                        if (veterinario == null) {
                            return ResponseEntity.badRequest().body("El veterinario especificado no existe");
                        }
                        List<String> roles = usuarioRepository.getRoles(veterinario.getCorreo());
                        boolean isAdmin = roles.stream().anyMatch(r -> r.equalsIgnoreCase("admin"));
                        if (!isAdmin) {
                            return ResponseEntity.badRequest().body("El usuario especificado no es un veterinario");
                        }
                        existing.setVeterinario(veterinario);
                    }
                    repository.save(existing);
                    return ResponseEntity.ok("Cita actualizada con éxito");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //Eliminar Cita
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Cita eliminada con éxito");
        }
        return ResponseEntity.notFound().build();
    }
}
