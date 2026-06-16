package cl.ucm.mantenedor.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@SQLDelete(sql = "UPDATE usuario SET activo = false WHERE id = ?")
@SQLRestriction("activo = true")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String correo;

    @Column(length = 50)
    private String name;
    @JsonIgnore
    @Column(length = 100)
    private String password;

    @JsonIgnore
    @Column(nullable = false)
    private Boolean activo = true;

    @Column(length = 100)
    private String especialidad;

    @ManyToMany
    @JoinTable(
            name = "user_rol",
            joinColumns = @JoinColumn(name = "usuario_id_fk"),
            inverseJoinColumns = @JoinColumn(name = "rol_fk")
    )
    private List<Rol> roles;
}
