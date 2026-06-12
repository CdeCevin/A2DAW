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
        return new AccountDtoOut(u.getRut(), u.getName(), u.getRoles().get(0).getName());
    }

    @Override
    public AccountDtoOut createAccount(AccountDtoIn in) {
        if(repository.existsById(in.getRut())){
            throw new IllegalArgumentException("rut ya registrado");
        }

        Rol rol = rolRepository.findById(in.getIdRol()).orElseThrow(()->new IllegalArgumentException("rol not found"));

        Usuario u = new Usuario();
        u.setRut(in.getRut());
        u.setPassword(encoder.encode(in.getPassword()));
        u.setName(in.getName());
        u.setRoles(List.of(rol));

        return toDto(repository.save(u));
    }

    @Override
    public LoginDtoOut login(LoginDtoIn in) {
        Usuario usuario = repository.findById(in.getRut()).orElseThrow(()->new IllegalArgumentException("rut not found"));

        UsernamePasswordAuthenticationToken login = new UsernamePasswordAuthenticationToken(in.getRut(), in.getPassword());

        Authentication authentication = authenticationManager.authenticate(login);

        String rolesStr = authentication.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.joining(","));

        String jwt = jwtUtil.create(usuario.getRut()+"#"+usuario.getName(), rolesStr);

        return new LoginDtoOut(jwt);
    }
}
