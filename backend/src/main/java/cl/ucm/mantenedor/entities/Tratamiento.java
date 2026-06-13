package cl.ucm.mantenedor.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tratamientos")
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

    @ManyToOne
    @JoinColumn(name = "cita_id", nullable = false)
    private Cita cita;
}
