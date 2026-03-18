package com.blogapp.backend.service;

import com.blogapp.backend.model.Post;
import com.blogapp.backend.model.Report;
import com.blogapp.backend.repository.PostRepository;
import com.blogapp.backend.repository.ReportRepository;
import com.blogapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Post> getPendingPosts() {
        return postRepository.findByStatus("pending");
    }

    public Post approvePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setStatus("published");
        return postRepository.save(post);
    }

    public Post featurePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setIsFeatured(!post.getIsFeatured());
        return postRepository.save(post);
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("pending");
    }

    public Report resolveReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus("resolved");
        return reportRepository.save(report);
    }
}
