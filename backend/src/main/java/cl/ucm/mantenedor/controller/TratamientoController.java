package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.out.TratamientoDtoOut;
import cl.ucm.mantenedor.entities.Tratamiento;
import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.repository.TratamientoRepository;
import cl.ucm.mantenedor.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tratamiento")
public class TratamientoController {

    @Autowired
    private TratamientoRepository repository;

    @Autowired
    private CitaRepository citaRepository;

    @GetMapping
    public List<TratamientoDtoOut> getAll() {
        return repository.findAll().stream()
                .map(TratamientoDtoOut::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TratamientoDtoOut> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(TratamientoDtoOut::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Tratamiento tratamiento) {
        if (tratamiento.getActivo() == null) {
            tratamiento.setActivo(true);
        }
        if (tratamiento.getCita() == null || tratamiento.getCita().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar una cita con un ID válido");
        }

        Cita cita = citaRepository.findById(tratamiento.getCita().getId()).orElse(null);
        if (cita == null) {
            return ResponseEntity.badRequest().body("La cita especificada no existe");
        }

        tratamiento.setCita(cita);
        repository.save(tratamiento);
        return ResponseEntity.status(HttpStatus.CREATED).body("Tratamiento registrado con éxito");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Tratamiento details) {
        return repository.findById(id)
                .map(existing -> {
                    if (details.getDescripcion() != null) {
                        existing.setDescripcion(details.getDescripcion());
                    }
                    if (details.getCosto() != null) {
                        existing.setCosto(details.getCosto());
                    }

                    if (details.getCita() != null && details.getCita().getId() != null) {
                        Cita cita = citaRepository.findById(details.getCita().getId()).orElse(null);
                        if (cita == null) {
                            return ResponseEntity.badRequest().body("La cita especificada no existe");
                        }
                        existing.setCita(cita);
                    }

                    repository.save(existing);
                    return ResponseEntity.ok("Tratamiento actualizado con éxito");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Tratamiento eliminado con éxito");
        }
        return ResponseEntity.notFound().build();
    }
}
