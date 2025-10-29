package com.d3vb4r0n.gestion.service;

import com.d3vb4r0n.gestion.dto.LoginRequest;
import com.d3vb4r0n.gestion.dto.RegisterRequest;
import com.d3vb4r0n.gestion.dto.UserResponse;
import com.d3vb4r0n.gestion.entity.User;
import com.d3vb4r0n.gestion.entity.UserRole;
import com.d3vb4r0n.gestion.exception.UserAlreadyExistsException;
import com.d3vb4r0n.gestion.exception.InvalidCredentialsException;
import com.d3vb4r0n.gestion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserResponse registerUser(RegisterRequest request, String ipAddress, String userAgent) {
        // Проверка на существование пользователя
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        
        // Создание нового пользователя
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setIpAddress(ipAddress);
        user.setUserAgent(userAgent);
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }
    
    @Transactional
    public UserResponse login(LoginRequest request, String ipAddress) {
        // Попытка найти пользователя по username или email
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
        
        if (!user.getIsActive()) {
            throw new InvalidCredentialsException("Account is disabled");
        }
        
        // Обновляем время последнего входа и IP
        user.setLastLogin(LocalDateTime.now());
        user.setIpAddress(ipAddress);
        userRepository.save(user);
        
        return mapToUserResponse(user);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }
    
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().toString());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLogin(user.getLastLogin());
        return response;
    }
}
