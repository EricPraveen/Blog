package com.blogapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "cover_image")
    private String coverImage;
    private String genre;
    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
    @Column(nullable = false)
    private String status = "draft";
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}