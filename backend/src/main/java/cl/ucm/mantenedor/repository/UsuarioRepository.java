package cl.ucm.mantenedor.repository;

import cl.ucm.mantenedor.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreo(String correo);

    @Query(value = "SELECT COUNT(*) > 0 FROM usuario WHERE correo = :correo", nativeQuery = true)
    boolean existsByCorreoIncludeInactive(@org.springframework.data.repository.query.Param("correo") String correo);

    @Query("select r.name from Usuario u join u.roles r where u.correo = :correo")
    List<String> getRoles(String correo);

    @Query("select u from Usuario u join u.roles r where upper(r.name) = 'ADMIN' or upper(r.name) = 'ROLE_ADMIN'")
    List<Usuario> findVeterinarios();

    @Query("select u from Usuario u join u.roles r where upper(r.name) = 'USER' or upper(r.name) = 'ROLE_USER'")
    List<Usuario> findRecepcionistas();
}
