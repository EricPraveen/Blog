package com.blogapp.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.backend.dto.ChangePasswordRequest;
import com.blogapp.backend.dto.ErrorResponse;
import com.blogapp.backend.dto.PostResponse;
import com.blogapp.backend.dto.UpdateProfileRequest;
import com.blogapp.backend.model.User;
import com.blogapp.backend.service.PostService;
import com.blogapp.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostsByUserId(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        try {
            System.out.println("[UserController] Update profile request from: " + authentication.getName());
            System.out.println("[UserController] Request data: " + request);
            User updatedUser = userService.updateProfile(
                    authentication.getName(), request);
            System.out.println("[UserController] Profile updated successfully for: " + authentication.getName());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            System.err.println("[UserController] RuntimeException: " + e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("[UserController] Error updating profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to update profile: " + e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            String result = userService.changePassword(
                    authentication.getName(), request);
            return ResponseEntity.ok(new ErrorResponse(result));
        } catch (RuntimeException e) {
            System.err.println("[UserController] Password change error: " + e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("[UserController] Unexpected error changing password: " + e.getMessage());
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to change password: " + e.getMessage()));
        }
    }
}
