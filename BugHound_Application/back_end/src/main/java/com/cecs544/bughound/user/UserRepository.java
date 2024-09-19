package com.cecs544.bughound.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    @Query("SELECT u.username FROM User u WHERE u.userType = 'DEVELOPER'")
    List<String> findDeveloperUsernames();

    @Query("SELECT u.username FROM User u")
    List<String> findAllUsernames();

    boolean existsByUsername(String username);

    boolean existsByEmailId(String emailId);
}
