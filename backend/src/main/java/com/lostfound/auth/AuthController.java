package com.lostfound.auth;

import com.lostfound.entity.User;

import com.lostfound.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // REGISTER API
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {

        Map<String, Object> response = new HashMap<>();

        try {
            User savedUser = userService.register(user);

            response.put("status", "success");
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getUserId());
            response.put("email", savedUser.getEmail());

        } catch (Exception e) {
            response.put("status", "failed");
            response.put("message", e.getMessage());
        }

        return response;
    }

    // LOGIN API
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User request) {

        Optional<User> user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        Map<String, Object> response = new HashMap<>();

        if (user.isPresent()) {
            response.put("status", "success");
            response.put("message", "Login successful");
            response.put("userId", user.get().getUserId());
            response.put("fullName", user.get().getName());
            response.put("email", user.get().getEmail());
            response.put("token", "JWT-WILL-BE-ADDED-LATER");
        } else {
            response.put("status", "failed");
            response.put("message", "Invalid email or password");
        }

        return response;
    }
}
