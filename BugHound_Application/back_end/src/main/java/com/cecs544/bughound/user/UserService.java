package com.cecs544.bughound.user;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDTO addNewUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists: " + userDTO.getUsername());
        }

        if (userRepository.existsByEmailId(userDTO.getEmailId())) {
            throw new RuntimeException("Email ID already exists: " + userDTO.getEmailId());
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmailId(userDTO.getEmailId());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setUserType(User.UserType.valueOf(userDTO.getUserType().toUpperCase()));

        userRepository.save(user);
        userDTO.setPassword(""); // Clear the password before returning
        return userDTO;
    }

    public Optional<UserDTO> getUser(String username) {
        return userRepository.findById(username).map(UserService::getUserDTO);
    }

    public List<String> findDeveloperUsernames() {
        return userRepository.findDeveloperUsernames();
    }

    public List<String> findAllUsernames() {
        return userRepository.findAllUsernames();
    }

    public void deleteUser(String username) {
        userRepository.deleteById(username);
    }

    public Optional<User.UserType> authenticateUser(String username, String rawPassword) {
        Optional<User> user = userRepository.findById(username);
        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return Optional.of(user.get().getUserType());
        }
        return Optional.empty();
    }

    @Transactional
    public User updateUser(String username, UserUpdateDto userUpdateDto) {
        if (userRepository.existsByEmailId(userUpdateDto.getEmailId())) {
            throw new RuntimeException("Email ID already exists: " + userUpdateDto.getEmailId());
        }
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        if (userUpdateDto.getFirstName() != null) {
            user.setFirstName(userUpdateDto.getFirstName());
        }
        if (userUpdateDto.getLastName() != null) {
            user.setLastName(userUpdateDto.getLastName());
        }
        if (userUpdateDto.getEmailId() != null) {
            user.setEmailId(userUpdateDto.getEmailId());
        }
        if (userUpdateDto.getUserType() != null) {
            user.setUserType(User.UserType.valueOf(userUpdateDto.getUserType().toUpperCase()));
        }
        if (userUpdateDto.getPassword() != null && !userUpdateDto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
        }

        return userRepository.save(user);
    }

    public List<UserDTO> getAllUserDetails() {
        // Using stream to fetch and map data in one go
        return userRepository.findAll().stream()
                .map(UserService::getUserDTO)
                .collect(Collectors.toList());
    }

    private static UserDTO getUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmailId(user.getEmailId());
        dto.setUserType(user.getUserType().name()); // Ensuring the userType is transformed to String
        return dto;
    }
}
