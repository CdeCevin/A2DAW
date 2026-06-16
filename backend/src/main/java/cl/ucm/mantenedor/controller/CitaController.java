package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Veterinario;
import cl.ucm.mantenedor.repository.CitaRepository;
import cl.ucm.mantenedor.repository.MascotaRepository;
import cl.ucm.mantenedor.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cita")
public class CitaController {

    @Autowired
    private CitaRepository repository;

    @Autowired
    private MascotaRepository mascotaRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @GetMapping
    public List<Cita> getAll() {
        return repository.findAll();
    }

    // Obtener Cita mediante ID
    @GetMapping("/{id}")
    public ResponseEntity<Cita> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Crear cita
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Cita cita) {
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

        Veterinario veterinario = veterinarioRepository.findById(cita.getVeterinario().getId()).orElse(null);
        if (veterinario == null) {
            return ResponseEntity.badRequest().body("El veterinario especificado no existe");
        }

        cita.setMascota(mascota);
        cita.setVeterinario(veterinario);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(cita));
    }

    // Actualizar Cita
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Cita details) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setFecha(details.getFecha());
                    existing.setMotivo(details.getMotivo());
                    existing.setDiagnostico(details.getDiagnostico());

                    if (details.getMascota() != null && details.getMascota().getId() != null) {
                        Mascota mascota = mascotaRepository.findById(details.getMascota().getId()).orElse(null);
                        if (mascota == null) {
                            return ResponseEntity.badRequest().body("La mascota especificada no existe");
                        }
                        existing.setMascota(mascota);
                    }

                    if (details.getVeterinario() != null && details.getVeterinario().getId() != null) {
                        Veterinario veterinario = veterinarioRepository.findById(details.getVeterinario().getId()).orElse(null);
                        if (veterinario == null) {
                            return ResponseEntity.badRequest().body("El veterinario especificado no existe");
                        }
                        existing.setVeterinario(veterinario);
                    }
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //Eliminar Cita
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
