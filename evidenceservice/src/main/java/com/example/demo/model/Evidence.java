package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String caseId;
    private String evidenceType;
    private String fileName;
    private String filePath;
    private String fileHash;
    private Long fileSize;
    private String uploadedBy;
    private String uploadedByBadge;
    private String uploadedByIp;
    private LocalDateTime uploadedAt;
    private String status;

    @Column(name = "tampered_by")
    private String tamperedBy;

    @Column(name = "tampered_at")
    private LocalDateTime tamperedAt;

    @Column(name = "tamper_details")
    private String tamperDetails;

    private String description;
    private String location;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getUploadedByBadge() { return uploadedByBadge; }
    public void setUploadedByBadge(String uploadedByBadge) { this.uploadedByBadge = uploadedByBadge; }

    public String getUploadedByIp() { return uploadedByIp; }
    public void setUploadedByIp(String uploadedByIp) { this.uploadedByIp = uploadedByIp; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTamperedBy() { return tamperedBy; }
    public void setTamperedBy(String tamperedBy) { this.tamperedBy = tamperedBy; }

    public LocalDateTime getTamperedAt() { return tamperedAt; }
    public void setTamperedAt(LocalDateTime tamperedAt) { this.tamperedAt = tamperedAt; }

    public String getTamperDetails() { return tamperDetails; }
    public void setTamperDetails(String tamperDetails) { this.tamperDetails = tamperDetails; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}