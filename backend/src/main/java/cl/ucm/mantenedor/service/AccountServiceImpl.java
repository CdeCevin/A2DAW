package cl.ucm.mantenedor.service;

import cl.ucm.mantenedor.dto.in.AccountDtoIn;
import cl.ucm.mantenedor.dto.in.LoginDtoIn;
import cl.ucm.mantenedor.dto.out.AccountDtoOut;
import cl.ucm.mantenedor.dto.out.LoginDtoOut;
import cl.ucm.mantenedor.entities.Rol;
import cl.ucm.mantenedor.entities.Usuario;
import cl.ucm.mantenedor.repository.RolRepository;
import cl.ucm.mantenedor.repository.UsuarioRepository;
import cl.ucm.mantenedor.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService{

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;


    private AccountDtoOut toDto(Usuario u){
        return new AccountDtoOut(u.getCorreo(), u.getName(), u.getRoles().get(0).getName());
    }

    @Override
    public AccountDtoOut createAccount(AccountDtoIn in) {
        if(repository.findByCorreo(in.getCorreo()).isPresent()){
            throw new IllegalArgumentException("correo ya registrado");
        }

        if (in.getIdRol() == null) {
            throw new IllegalArgumentException("rol not found");
        }
        Rol rol = rolRepository.findById(in.getIdRol()).orElseThrow(()->new IllegalArgumentException("rol not found"));

        Usuario u = new Usuario();
        u.setCorreo(in.getCorreo());
        u.setPassword(encoder.encode(in.getPassword()));
        u.setName(in.getName());
        u.setRoles(List.of(rol));
        u.setEspecialidad(in.getEspecialidad());

        return toDto(repository.save(u));
    }

    @Override
    public LoginDtoOut login(LoginDtoIn in) {
        Usuario usuario = repository.findByCorreo(in.getCorreo()).orElseThrow(()->new IllegalArgumentException("correo not found"));

        UsernamePasswordAuthenticationToken login = new UsernamePasswordAuthenticationToken(in.getCorreo(), in.getPassword());

        Authentication authentication = authenticationManager.authenticate(login);

        String rolesStr = authentication.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.joining(","));

        String jwt = jwtUtil.create(usuario.getCorreo()+"#"+usuario.getName(), rolesStr);

        return new LoginDtoOut(jwt);
    }

    @Override
    public List<Usuario> getVeterinarios() {
        return repository.findVeterinarios();
    }

    @Override
    public List<Usuario> getRecepcionistas() {
        return repository.findRecepcionistas();
    }

    @Override
    public List<Usuario> getAllUsuarios() {
        return repository.findAll();
    }

    @Override
    public Optional<Usuario> getUsuarioById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public void updateUsuario(Integer id, AccountDtoIn details) {
        Usuario existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (details.getCorreo() != null && !details.getCorreo().equalsIgnoreCase(existing.getCorreo())) {
            if (repository.findByCorreo(details.getCorreo()).isPresent()) {
                throw new IllegalArgumentException("El correo ya está registrado por otro usuario");
            }
            existing.setCorreo(details.getCorreo());
        }
        if (details.getName() != null) {
            existing.setName(details.getName());
        }
        if (details.getPassword() != null && !details.getPassword().isEmpty()) {
            existing.setPassword(encoder.encode(details.getPassword()));
        }
        if (details.getIdRol() != null && details.getIdRol() > 0) {
            Rol rol = rolRepository.findById(details.getIdRol())
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));
            existing.setRoles(List.of(rol));
        }
        if (details.getEspecialidad() != null) {
            existing.setEspecialidad(details.getEspecialidad());
        }
        repository.save(existing);
    }

    @Override
    public void deleteUsuario(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsUsuarioById(Integer id) {
        return repository.existsById(id);
    }
}
