package cl.ucm.mantenedor.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "duenios")
@SQLDelete(sql = "UPDATE duenios SET activo = false WHERE id = ?")
@SQLRestriction("activo = true")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Duenio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(nullable = false, unique = true)
    private String email;

    private String telefono;

    @JsonIgnore
    @Column(nullable = false)
    private Boolean activo = true;

    @OneToMany(mappedBy = "duenio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Mascota> mascotas;
}
