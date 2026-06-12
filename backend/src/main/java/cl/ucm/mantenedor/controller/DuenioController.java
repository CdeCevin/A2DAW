package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Duenio;
import cl.ucm.mantenedor.repository.DuenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/duenio")
public class DuenioController {

    @Autowired
    private DuenioRepository repository;

    @GetMapping
    public List<Duenio> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Duenio> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Duenio> create(@RequestBody Duenio duenio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(duenio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Duenio> update(@PathVariable Integer id, @RequestBody Duenio details) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNombreCompleto(details.getNombreCompleto());
                    existing.setEmail(details.getEmail());
                    existing.setTelefono(details.getTelefono());
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
