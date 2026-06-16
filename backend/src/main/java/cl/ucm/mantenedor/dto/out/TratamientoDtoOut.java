package cl.ucm.mantenedor.dto.out;

import cl.ucm.mantenedor.entities.Tratamiento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoDtoOut {
    private Integer id;
    private String descripcion;
    private Double costo;
    private CitaResumenDto cita;

    public static TratamientoDtoOut fromEntity(Tratamiento t) {
        if (t == null) return null;
        return new TratamientoDtoOut(
            t.getId(),
            t.getDescripcion(),
            t.getCosto(),
            CitaResumenDto.fromEntity(t.getCita())
        );
    }
}
