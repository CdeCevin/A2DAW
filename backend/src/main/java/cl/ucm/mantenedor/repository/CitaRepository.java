package cl.ucm.mantenedor.repository;

import cl.ucm.mantenedor.entities.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    List<Cita> findByOrderByFechaDesc(Pageable pageable);
    List<Cita> findByFechaAfterOrderByFechaAsc(LocalDateTime fecha, Pageable pageable);
}
