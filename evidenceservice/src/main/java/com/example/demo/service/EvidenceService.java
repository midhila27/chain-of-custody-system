package com.example.demo.service;
import com.example.demo.model.Evidence;
import com.example.demo.repository.EvidenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EvidenceService {

    @Autowired
    private EvidenceRepository evidenceRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String AUDIT_URL = "http://localhost:8084/api/audit/log";

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Evidence uploadEvidence(MultipartFile file, String caseId,
                                   String uploadedBy, String badge,
                                   String ip, String description,
                                   String location) throws Exception {

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" 
                          + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, 
                   StandardCopyOption.REPLACE_EXISTING);

        String hash = computeFileHash(filePath.toFile());
        String type = file.getContentType().startsWith("video") 
                      ? "VIDEO" : "PHOTO";

        Evidence evidence = new Evidence();
        evidence.setCaseId(caseId);
        evidence.setEvidenceType(type);
        evidence.setFileName(fileName);
        evidence.setFilePath(filePath.toString());
        evidence.setFileHash(hash);
        evidence.setFileSize(file.getSize());
        evidence.setUploadedBy(uploadedBy);
        evidence.setUploadedByBadge(badge);
        evidence.setUploadedByIp(ip);
        evidence.setUploadedAt(LocalDateTime.now());
        evidence.setStatus("ACTIVE");
        evidence.setDescription(description);
        evidence.setLocation(location);

        Evidence saved = evidenceRepository.save(evidence);

        callAuditService(
            "UPLOAD_EVIDENCE", uploadedBy, badge, ip,
            String.valueOf(saved.getId()), caseId,
            "Evidence uploaded: " + fileName,
            "evidence-service", "SUCCESS"
        );

        return saved;
    }

    public Evidence checkTampering(Long evidenceId, String checkedBy,
                                   String checkedByBadge, 
                                   String ip) throws Exception {

        Optional<Evidence> opt = evidenceRepository.findById(evidenceId);
        if (opt.isEmpty()) throw new RuntimeException("Evidence not found");

        Evidence evidence = opt.get();
        String currentHash = computeFileHash(
                             new File(evidence.getFilePath()));

        if (!currentHash.equals(evidence.getFileHash())) {
            evidence.setStatus("TAMPERED");
            evidence.setTamperedBy(checkedBy + " | Badge: " 
                                   + checkedByBadge + " | IP: " + ip);
            evidence.setTamperedAt(LocalDateTime.now());
            evidence.setTamperDetails(
                "ORIGINAL HASH: " + evidence.getFileHash() +
                " || CURRENT HASH: " + currentHash +
                " || DETECTED BY: " + checkedBy +
                " || TIME: " + LocalDateTime.now()
            );
            evidenceRepository.save(evidence);

            callAuditService(
                "TAMPER_DETECTED", checkedBy, checkedByBadge, ip,
                String.valueOf(evidenceId), evidence.getCaseId(),
                "HASH MISMATCH on file: " + evidence.getFileName(),
                "evidence-service", "FAILED"
            );
        } else {
            callAuditService(
                "INTEGRITY_CHECK", checkedBy, checkedByBadge, ip,
                String.valueOf(evidenceId), evidence.getCaseId(),
                "Evidence verified intact: " + evidence.getFileName(),
                "evidence-service", "SUCCESS"
            );
        }
        return evidence;
    }

    private void callAuditService(String action, String performedBy,
            String badge, String ip,
            String evidenceId, String caseId,
            String details, String service,
            String result) {
try {
String url = AUDIT_URL +
"?action=" + action +
"&performedBy=" + performedBy +
"&badge=" + badge +
"&ip=" + ip +
"&evidenceId=" + evidenceId +
"&caseId=" + caseId +
"&details=" + details.replace(" ", "%20") +
"&service=" + service +
"&result=" + result;

restTemplate.postForObject(url, null, String.class);
} catch (Exception e) {
System.err.println("Audit call failed: " + e.getMessage());
}
}

    public String computeFileHash(File file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }
        }
        byte[] hashBytes = digest.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) 
            sb.append(String.format("%02x", b));
        return sb.toString();
    }

    public List<Evidence> getAllEvidence() { 
        return evidenceRepository.findAll(); 
    }

    public Optional<Evidence> getById(Long id) {
        return evidenceRepository.findById(id);
    }
}