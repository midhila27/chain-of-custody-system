package com.example.demo.controller;

import com.example.demo.model.Evidence;
import com.example.demo.service.EvidenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {

    @Autowired
    private EvidenceService evidenceService;

    @PostMapping("/upload")
    public ResponseEntity<Evidence> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caseId") String caseId,
            @RequestParam("uploadedBy") String uploadedBy,
            @RequestParam("badge") String badge,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            HttpServletRequest request) {
        try {
            Evidence ev = evidenceService.uploadEvidence(
                file, caseId, uploadedBy, badge,
                request.getRemoteAddr(), description, location);
            return ResponseEntity.ok(ev);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/check-tamper/{id}")
    public ResponseEntity<Evidence> checkTamper(
            @PathVariable Long id,
            @RequestParam("checkedBy") String checkedBy,
            @RequestParam("badge") String badge,
            HttpServletRequest request) {
        try {
            Evidence ev = evidenceService.checkTampering(
                id, checkedBy, badge, 
                request.getRemoteAddr());
            return ResponseEntity.ok(ev);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/all")
    public List<Evidence> getAll() {
        return evidenceService.getAllEvidence();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evidence> getById(
            @PathVariable Long id) {
        return evidenceService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/case/{caseId}")
    public List<Evidence> getByCase(
            @PathVariable String caseId) {
        return evidenceService.getAllEvidence()
               .stream()
               .filter(e -> e.getCaseId().equals(caseId))
               .toList();
    }
}