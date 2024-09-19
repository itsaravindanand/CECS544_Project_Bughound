package com.cecs544.bughound.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "username", nullable = false, length = 32)
    private String username;

    @Column(name = "first_name", nullable = false, length = 32)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 32)
    private String lastName;

    @Column(name = "email_id", nullable = false, unique = true, length = 32)
    private String emailId;

    @Column(name = "password", nullable = false, length = 32)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public enum UserType {
        TESTER, DEVELOPER, ADMIN
    }
}
