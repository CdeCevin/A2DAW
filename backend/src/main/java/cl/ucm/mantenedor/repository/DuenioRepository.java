package cl.ucm.mantenedor.repository;

import cl.ucm.mantenedor.entities.Duenio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DuenioRepository extends JpaRepository<Duenio, Integer> {
}
