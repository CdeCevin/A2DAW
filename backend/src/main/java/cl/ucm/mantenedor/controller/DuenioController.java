package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.out.DuenioDtoOut;
import cl.ucm.mantenedor.entities.Duenio;
import cl.ucm.mantenedor.repository.DuenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/duenio")
public class DuenioController {

    @Autowired
    private DuenioRepository repository;

    @GetMapping
    public List<DuenioDtoOut> getAll() {
        return repository.findAll().stream()
                .map(DuenioDtoOut::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DuenioDtoOut> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(DuenioDtoOut::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Duenio duenio) {
        if (duenio.getActivo() == null) {
            duenio.setActivo(true);
        }
        repository.save(duenio);
        return ResponseEntity.status(HttpStatus.CREATED).body("Dueño ingresado con éxito");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Duenio details) {
        return repository.findById(id)
                .map(existing -> {
                    if (details.getNombreCompleto() != null) {
                        existing.setNombreCompleto(details.getNombreCompleto());
                    }
                    if (details.getEmail() != null) {
                        existing.setEmail(details.getEmail());
                    }
                    if (details.getTelefono() != null) {
                        existing.setTelefono(details.getTelefono());
                    }
                    repository.save(existing);
                    return ResponseEntity.ok("Dueño actualizado con éxito");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
