package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custody_records")
public class CustodyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String evidenceId;
    private String caseId;
    private String fromOfficer;
    private String fromBadge;
    private String toOfficer;
    private String toBadge;
    private LocalDateTime transferTime;
    private String transferLocation;
    private String purpose;
    private String ipAddress;
    private String signature;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEvidenceId() { return evidenceId; }
    public void setEvidenceId(String evidenceId) { this.evidenceId = evidenceId; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getFromOfficer() { return fromOfficer; }
    public void setFromOfficer(String fromOfficer) { this.fromOfficer = fromOfficer; }

    public String getFromBadge() { return fromBadge; }
    public void setFromBadge(String fromBadge) { this.fromBadge = fromBadge; }

    public String getToOfficer() { return toOfficer; }
    public void setToOfficer(String toOfficer) { this.toOfficer = toOfficer; }

    public String getToBadge() { return toBadge; }
    public void setToBadge(String toBadge) { this.toBadge = toBadge; }

    public LocalDateTime getTransferTime() { return transferTime; }
    public void setTransferTime(LocalDateTime transferTime) { this.transferTime = transferTime; }

    public String getTransferLocation() { return transferLocation; }
    public void setTransferLocation(String transferLocation) { this.transferLocation = transferLocation; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}