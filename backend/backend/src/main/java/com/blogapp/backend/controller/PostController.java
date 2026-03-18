package com.blogapp.backend.controller;

import com.blogapp.backend.dto.PostRequest;
import com.blogapp.backend.dto.PostResponse;
import com.blogapp.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPublishedPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<PostResponse>> getPostsByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(postService.getPostsByGenre(genre));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> searchPosts(@RequestParam String q) {
        return ResponseEntity.ok(postService.searchPosts(q));
    }

    @GetMapping("/random")
    public ResponseEntity<PostResponse> getRandomPost() {
        return ResponseEntity.ok(postService.getRandomPost());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PostResponse>> getFeaturedPosts() {
        return ResponseEntity.ok(postService.getFeaturedPosts());
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody PostRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(postService.createPost(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestBody PostRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(postService.updatePost(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        postService.deletePost(id, authentication.getName());
        return ResponseEntity.ok("Post deleted successfully");
    }
}