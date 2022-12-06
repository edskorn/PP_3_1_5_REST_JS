package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(User user) {
        entityManager.merge(user);
    }

    @Override
    public void deleteById(long id) {
        Optional<User> user = findById(id);
        user.ifPresent(value -> entityManager.remove(value));
    }

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("SELECT u FROM User u ORDER BY u.lastName ASC", User.class)
                .getResultList();
    }

    @Transactional
    @Override
    public Optional<User> findById(long id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.of(entityManager.createQuery("SELECT u FROM User u WHERE u.username=:usr", User.class).
                setParameter("usr", username).getSingleResult());
    }
}
