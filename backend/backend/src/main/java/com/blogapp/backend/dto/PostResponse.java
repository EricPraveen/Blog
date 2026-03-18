package com.blogapp.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String coverImage;
    private String genre;
    private String authorName;
    private String status;
    private Boolean isAnonymous;
    private Boolean isFeatured;
    private Integer likeCount;
    private LocalDateTime createdAt;
}
