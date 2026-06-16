package cl.ucm.mantenedor.service;

import cl.ucm.mantenedor.dto.in.AccountDtoIn;
import cl.ucm.mantenedor.dto.in.LoginDtoIn;
import cl.ucm.mantenedor.dto.out.AccountDtoOut;
import cl.ucm.mantenedor.dto.out.LoginDtoOut;
import cl.ucm.mantenedor.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface AccountService {

    AccountDtoOut createAccount(AccountDtoIn in);
    LoginDtoOut login(LoginDtoIn in);
    List<Usuario> getVeterinarios();
    List<Usuario> getRecepcionistas();
    List<Usuario> getAllUsuarios();
    Optional<Usuario> getUsuarioById(Integer id);
    void updateUsuario(Integer id, AccountDtoIn details);
    void deleteUsuario(Integer id);
    boolean existsUsuarioById(Integer id);

}
