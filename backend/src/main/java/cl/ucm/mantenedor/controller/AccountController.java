package cl.ucm.mantenedor.controller;

import cl.ucm.mantenedor.dto.in.AccountDtoIn;
import cl.ucm.mantenedor.dto.in.LoginDtoIn;
import cl.ucm.mantenedor.error.ErrorInfo;
import cl.ucm.mantenedor.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "auth")
public class AccountController {

    @Autowired
    private AccountService service;

    @PostMapping(path = "create")
    public ResponseEntity<?> createAccount(@RequestBody AccountDtoIn in){
        try{
            return ResponseEntity.ok(service.createAccount(in));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorInfo(404, e.getMessage()));
        }
    }

    @PostMapping(path = "login")
    public ResponseEntity<?> login(@RequestBody LoginDtoIn in){
        try{
            return ResponseEntity.ok(service.login(in));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorInfo(404, e.getMessage()));
        }
    }

}
