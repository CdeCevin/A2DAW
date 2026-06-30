package cl.ucm.mantenedor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class MantenedorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MantenedorApplication.class, args);
	}

}
