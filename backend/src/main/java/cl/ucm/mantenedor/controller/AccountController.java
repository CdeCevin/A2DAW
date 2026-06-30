package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.in.AccountDtoIn;
import cl.ucm.mantenedor.dto.in.LoginDtoIn;
import cl.ucm.mantenedor.dto.out.UsuarioDtoOut;
import cl.ucm.mantenedor.error.ErrorInfo;
import cl.ucm.mantenedor.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "auth")
public class AccountController {

    @Autowired
    private AccountService service;

    @PostMapping(path = "create")
    public ResponseEntity<?> createAccount(@RequestBody AccountDtoIn in){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(service.createAccount(in));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorInfo(400, e.getMessage()));
        }catch (org.springframework.dao.DataIntegrityViolationException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorInfo(409, "El correo electrónico ya está registrado."));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorInfo(500, "Error interno del servidor: " + e.getMessage()));
        }
    }

    @PostMapping(path = "login")
    public ResponseEntity<?> login(@RequestBody LoginDtoIn in){
        try{
            return ResponseEntity.ok(service.login(in));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorInfo(404, e.getMessage()));
        }catch (org.springframework.security.core.AuthenticationException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorInfo(401, "Correo: o contraseña incorrecta"));
        }
    }

    @GetMapping(path = "veterinarios")
    public ResponseEntity<?> getVeterinarios(){
        return ResponseEntity.ok(service.getVeterinarios().stream()
                .map(UsuarioDtoOut::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping(path = "recepcionistas")
    public ResponseEntity<?> getRecepcionistas(){
        return ResponseEntity.ok(service.getRecepcionistas().stream()
                .map(UsuarioDtoOut::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping(path = "usuarios")
    public ResponseEntity<?> getUsuarios(){
        return ResponseEntity.ok(service.getAllUsuarios().stream()
                .map(UsuarioDtoOut::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping(path = "usuarios/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Integer id){
        return service.getUsuarioById(id)
                .map(UsuarioDtoOut::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(path = "usuarios/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Integer id, @RequestBody AccountDtoIn details){
        try{
            service.updateUsuario(id, details);
            return ResponseEntity.ok("Usuario actualizado con éxito");
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorInfo(400, e.getMessage()));
        }catch (org.springframework.dao.DataIntegrityViolationException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorInfo(409, "El correo electrónico ya está en uso."));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorInfo(500, "Error interno del servidor: " + e.getMessage()));
        }
    }

    @DeleteMapping(path = "usuarios/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Integer id){
        if (service.existsUsuarioById(id)) {
            service.deleteUsuario(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
