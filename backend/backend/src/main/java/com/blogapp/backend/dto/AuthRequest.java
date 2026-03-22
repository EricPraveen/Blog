package com.blogapp.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AuthRequest {
    private String name;
    private String email;
    private String password;
    private String username;
    private String gender;
    private String country;
    private LocalDate dateOfBirth;
}