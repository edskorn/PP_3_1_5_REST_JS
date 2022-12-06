package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;


public interface UserService {
    void saveUser(User user);
    void removeUserById(long id);
    List<User> getAllUsers();
    List<Role> getAllRoles();
    Optional<User> getUserById(long id);
    Optional<User> getUserByUsername(String username);

}
