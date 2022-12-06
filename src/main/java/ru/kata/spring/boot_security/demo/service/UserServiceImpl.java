package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.repositories.RoleDao;
import ru.kata.spring.boot_security.demo.repositories.UserDao;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao usersRepository;
    private final RoleDao rolesRepository;
    private PasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(UserDao usersRepository, RoleDao rolesRepository) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
    }

    @Autowired
    public void setbCryptPasswordEncoder(PasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Transactional
    public void saveUser(User user) {
        if (user.getRoles().isEmpty()) {
            user.setRoles(Collections.singleton(new Role(2L, "ROLE_USER")));
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        usersRepository.save(user);
    }

    @Transactional
    public void removeUserById(long id) {
        usersRepository.deleteById(id);
    }

    @Transactional
    public List<User> getAllUsers() {
        return usersRepository.getAllUsers();
    }

    @Transactional
    public List<Role> getAllRoles() {
        return rolesRepository.findAll();
    }

    @Transactional
    public Optional<User> getUserById(long id) {
        return usersRepository.findById(id);
    }

    @Transactional
    public Optional<User> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }
}
