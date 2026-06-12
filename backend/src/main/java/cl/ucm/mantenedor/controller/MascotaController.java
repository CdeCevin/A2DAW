package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Duenio;
import cl.ucm.mantenedor.repository.MascotaRepository;
import cl.ucm.mantenedor.repository.DuenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mascota")
public class MascotaController {

    @Autowired
    private MascotaRepository repository;

    @Autowired
    private DuenioRepository duenioRepository;

    @GetMapping
    public List<Mascota> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Mascota mascota) {
        if (mascota.getDuenio() == null || mascota.getDuenio().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar un dueño con un ID válido");
        }
        Duenio duenio = duenioRepository.findById(mascota.getDuenio().getId()).orElse(null);
        if (duenio == null) {
            return ResponseEntity.badRequest().body("El dueño especificado no existe");
        }
        mascota.setDuenio(duenio);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(mascota));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Mascota details) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNombre(details.getNombre());
                    existing.setEspecie(details.getEspecie());
                    existing.setRaza(details.getRaza());
                    existing.setFechaNacimiento(details.getFechaNacimiento());
                    if (details.getDuenio() != null && details.getDuenio().getId() != null) {
                        Duenio duenio = duenioRepository.findById(details.getDuenio().getId()).orElse(null);
                        if (duenio == null) {
                            return ResponseEntity.badRequest().body("El dueño especificado no existe");
                        }
                        existing.setDuenio(duenio);
                    }
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
