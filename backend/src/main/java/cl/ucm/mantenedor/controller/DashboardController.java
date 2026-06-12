package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.entities.Cita;
import cl.ucm.mantenedor.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DuenioRepository duenioRepository;

    @Autowired
    private MascotaRepository mascotaRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private TratamientoRepository tratamientoRepository;

    @GetMapping
    public Map<String, Object> getDashboardData(@RequestParam(defaultValue = "5") int limit) {
        Map<String, Object> data = new HashMap<>();

        long totalDuenos = duenioRepository.count();
        long totalMascotas = mascotaRepository.count();
        long totalCitas = citaRepository.count();
        long totalTratamientos = tratamientoRepository.count();

        // Obtenemos todas las citas
        List<Cita> todasLasCitas = citaRepository.findAll();

        // Citas recientes (ordenadas por fecha descendente)
        List<Cita> recientes = todasLasCitas.stream()
                .sorted((c1, c2) -> c2.getFecha().compareTo(c1.getFecha()))
                .limit(limit)
                .collect(Collectors.toList());

        // Citas próximas (futuras, ordenadas por fecha ascendente)
        LocalDateTime ahora = LocalDateTime.now();
        List<Cita> proximas = todasLasCitas.stream()
                .filter(c -> c.getFecha().isAfter(ahora))
                .sorted((c1, c2) -> c1.getFecha().compareTo(c2.getFecha()))
                .limit(limit)
                .collect(Collectors.toList());

        data.put("totalDuenos", totalDuenos);
        data.put("totalMascotas", totalMascotas);
        data.put("totalCitas", totalCitas);
        data.put("totalTratamientos", totalTratamientos);
        data.put("citasRecientes", recientes);
        data.put("citasProximas", proximas);

        return data;
    }
}
