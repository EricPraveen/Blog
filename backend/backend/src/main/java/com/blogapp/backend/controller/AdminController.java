package com.blogapp.backend.controller;

import com.blogapp.backend.model.Post;
import com.blogapp.backend.model.Report;
import com.blogapp.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/posts/pending")
    public ResponseEntity<List<Post>> getPendingPosts() {
        return ResponseEntity.ok(adminService.getPendingPosts());
    }

    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<Post> approvePost(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approvePost(id));
    }

    @PutMapping("/posts/{id}/feature")
    public ResponseEntity<Post> featurePost(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.featurePost(id));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getPendingReports() {
        return ResponseEntity.ok(adminService.getPendingReports());
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<Report> resolveReport(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.resolveReport(id));
    }
}
