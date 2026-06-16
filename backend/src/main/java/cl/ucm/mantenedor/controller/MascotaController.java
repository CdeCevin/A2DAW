package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.out.MascotaDtoOut;
import cl.ucm.mantenedor.entities.Mascota;
import cl.ucm.mantenedor.entities.Duenio;
import cl.ucm.mantenedor.repository.MascotaRepository;
import cl.ucm.mantenedor.repository.DuenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mascota")
public class MascotaController {

    @Autowired
    private MascotaRepository repository;

    @Autowired
    private DuenioRepository duenioRepository;

    @GetMapping
    public List<MascotaDtoOut> getAll() {
        return repository.findAll().stream()
                .map(MascotaDtoOut::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MascotaDtoOut> getById(@PathVariable Integer id) {
        return repository.findById(id)
                .map(MascotaDtoOut::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<?> create(@RequestBody Mascota mascota) {
        if (mascota.getActivo() == null) {
            mascota.setActivo(true);
        }
        if (mascota.getDuenio() == null || mascota.getDuenio().getId() == null) {
            return ResponseEntity.badRequest().body("Debe especificar un dueño con un ID válido");
        }
        Duenio duenio = duenioRepository.findById(mascota.getDuenio().getId()).orElse(null);
        if (duenio == null) {
            return ResponseEntity.badRequest().body("El dueño especificado no existe");
        }
        mascota.setDuenio(duenio);
        repository.save(mascota);
        return ResponseEntity.status(HttpStatus.CREATED).body("Mascota ingresada con exito");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Mascota details) {
        return repository.findById(id)
                .map(existing -> {
                    if (details.getNombre() != null) {
                        existing.setNombre(details.getNombre());
                    }
                    if (details.getEspecie() != null) {
                        existing.setEspecie(details.getEspecie());
                    }
                    if (details.getRaza() != null) {
                        existing.setRaza(details.getRaza());
                    }
                    if (details.getFechaNacimiento() != null) {
                        existing.setFechaNacimiento(details.getFechaNacimiento());
                    }
                    if (details.getDuenio() != null && details.getDuenio().getId() != null) {
                        Duenio duenio = duenioRepository.findById(details.getDuenio().getId()).orElse(null);
                        if (duenio == null) {
                            return ResponseEntity.badRequest().body("El dueño especificado no existe");
                        }
                        existing.setDuenio(duenio);
                    }
                    repository.save(existing);
                    return ResponseEntity.ok("Mascota actualizada con éxito");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Mascota eliminada con éxito");
        }
        return ResponseEntity.notFound().build();
    }
}
