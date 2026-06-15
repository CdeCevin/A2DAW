package cl.ucm.mantenedor.repository;

import cl.ucm.mantenedor.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    @Query("select r.name from Usuario u join u.roles r where u.correo = :correo")
    List<String> getRoles(String correo);
}
