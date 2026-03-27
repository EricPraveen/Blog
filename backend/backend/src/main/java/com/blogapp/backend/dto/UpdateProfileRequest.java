package com.blogapp.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String username;
    private String bio;
    private String country;
    
    @Override
    public String toString() {
        return "UpdateProfileRequest{" +
                "name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", bio='" + bio + '\'' +
                ", country='" + country + '\'' +
                '}';
    }
}