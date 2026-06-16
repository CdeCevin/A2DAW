package cl.ucm.mantenedor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class MantenedorApplication {

	public static void main(String[] args) {
		System.out.println("BCRYPT HASH FOR 123456789: " + new BCryptPasswordEncoder().encode("123456789"));
		SpringApplication.run(MantenedorApplication.class, args);
	}

}
