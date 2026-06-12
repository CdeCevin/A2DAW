package cl.ucm.mantenedor.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Usuario {
    @Id
    @Column(length = 20)
    private String rut;
    @Column(length = 50)
    private String name;
    @Column(length = 100)
    private String password;

    @ManyToMany
    @JoinTable(
            name = "user_rol",
            joinColumns = @JoinColumn(name = "rut_fk"),
            inverseJoinColumns = @JoinColumn(name = "rol_fk")
    )
    private List<Rol> roles;
}
