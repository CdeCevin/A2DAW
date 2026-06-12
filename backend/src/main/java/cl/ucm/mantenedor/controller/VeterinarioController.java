package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Veterinario;
import cl.ucm.mantenedor.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/veterinario")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository repository;

    @GetMapping
    public List<Veterinario> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veterinario> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Veterinario> create(@RequestBody Veterinario veterinario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(veterinario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veterinario> update(@PathVariable Integer id, @RequestBody Veterinario details) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNombreCompleto(details.getNombreCompleto());
                    existing.setEspecialidad(details.getEspecialidad());
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
