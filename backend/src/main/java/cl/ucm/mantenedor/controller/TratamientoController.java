package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Tratamiento;
import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.repository.TratamientoRepository;
import cl.ucm.mantenedor.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tratamiento")
public class TratamientoController {

    @Autowired
    private TratamientoRepository repository;

    @Autowired
    private CitaRepository citaRepository;

    @GetMapping
    public List<Tratamiento> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tratamiento> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tratamiento tratamiento) {
        if (tratamiento.getCita() == null || tratamiento.getCita().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar una cita con un ID válido");
        }

        Cita cita = citaRepository.findById(tratamiento.getCita().getId()).orElse(null);
        if (cita == null) {
            return ResponseEntity.badRequest().body("La cita especificada no existe");
        }

        tratamiento.setCita(cita);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(tratamiento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Tratamiento details) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setDescripcion(details.getDescripcion());
                    existing.setCosto(details.getCosto());

                    if (details.getCita() != null && details.getCita().getId() != null) {
                        Cita cita = citaRepository.findById(details.getCita().getId()).orElse(null);
                        if (cita == null) {
                            return ResponseEntity.badRequest().body("La cita especificada no existe");
                        }
                        existing.setCita(cita);
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
