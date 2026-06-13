package cl.ucm.mantenedor.repository;

import cl.ucm.mantenedor.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    String QUERY="select r.name from usuario u " +
            "inner join user_rol ur on u.rut = ur.rut_fk " +
            "inner join rol r on r.id_rol = ur.rol_fk " +
            "where u.rut = :rut";

    @Query(value = QUERY, nativeQuery = true)
    List<String> getRoles(String rut);
}
