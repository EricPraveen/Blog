package com.blogapp.backend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private String coverImage;
    private String genre;
    private String status;
    private Boolean isAnonymous;
}