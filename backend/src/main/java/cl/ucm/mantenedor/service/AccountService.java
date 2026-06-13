package cl.ucm.mantenedor.service;

import cl.ucm.mantenedor.dto.in.AccountDtoIn;
import cl.ucm.mantenedor.dto.in.LoginDtoIn;
import cl.ucm.mantenedor.dto.out.AccountDtoOut;
import cl.ucm.mantenedor.dto.out.LoginDtoOut;

public interface AccountService {

    AccountDtoOut createAccount(AccountDtoIn in);
    LoginDtoOut login(LoginDtoIn in);

}
