package cl.ucm.mantenedor.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "veterinarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Veterinario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    private String especialidad;

    @OneToMany(mappedBy = "veterinario", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cita> citas;
}
