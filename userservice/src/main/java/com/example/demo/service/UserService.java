package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus("ACTIVE");
        user.setBadgeNumber(generateBadgeNumber(user.getRole()));
        return userRepository.save(user);
    }

    private String generateBadgeNumber(String role) {
        String prefix;
        switch (role) {
            case "OFFICER":          prefix = "OFC"; break;
            case "INVESTIGATOR":     prefix = "INV"; break;
            case "FORENSIC_OFFICER": prefix = "FOR"; break;
            case "ADMIN":            prefix = "ADM"; break;
            default:                 prefix = "GEN"; break;
        }
        long countForRole = userRepository.findByRole(role).size() + 1;
        String sequence = String.format("%03d", countForRole);
        return "TN-PD-" + prefix + "-" + sequence;
    }

    public Optional<User> login(String badge, 
                                String password, String ip) {
        Optional<User> user = 
            userRepository.findByBadgeNumber(badge);
        if (user.isPresent() && 
            user.get().getPassword().equals(password)) {
            user.get().setLastLoginIp(ip);
            user.get().setLastLoginAt(LocalDateTime.now());
            userRepository.save(user.get());
            return user;
        }
        return Optional.empty();
    }

    public List<User> getAllUsers() { 
        return userRepository.findAll(); 
    }
}