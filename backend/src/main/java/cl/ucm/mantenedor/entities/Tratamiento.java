package cl.ucm.mantenedor.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "tratamientos")
@SQLDelete(sql = "UPDATE tratamientos SET activo = false WHERE id = ?")
@SQLRestriction("activo = true")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tratamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Double costo;

    @JsonIgnore
    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "cita_id", nullable = false)
    private Cita cita;
}
