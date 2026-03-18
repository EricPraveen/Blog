package com.blogapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String bio;
    @Column(nullable = false)
    private String role = "user";
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}