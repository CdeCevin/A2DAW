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

import org.springframework.data.domain.PageRequest;

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

        PageRequest pageRequest = PageRequest.of(0, limit);

        // Citas recientes (ordenadas por fecha descendente)
        List<Cita> recientes = citaRepository.findByOrderByFechaDesc(pageRequest);

        // Citas próximas (futuras, ordenadas por fecha ascendente)
        LocalDateTime ahora = LocalDateTime.now();
        List<Cita> proximas = citaRepository.findByFechaAfterOrderByFechaAsc(ahora, pageRequest);


        data.put("totalDuenos", totalDuenos);
        data.put("totalMascotas", totalMascotas);
        data.put("totalCitas", totalCitas);
        data.put("totalTratamientos", totalTratamientos);
        data.put("citasRecientes", recientes);
        data.put("citasProximas", proximas);

        return data;
    }
}
