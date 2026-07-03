package com.example.demo.service;

import com.example.demo.model.CustodyRecord;
import com.example.demo.repository.CustodyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class CustodyService {

    @Autowired
    private CustodyRepository custodyRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String AUDIT_URL = "http://localhost:8084/api/audit/log";

    public CustodyRecord transferCustody(
            String evidenceId, String caseId,
            String from, String fromBadge,
            String to, String toBadge,
            String location, String purpose,
            String ip, String signature) {

        CustodyRecord record = new CustodyRecord();
        record.setEvidenceId(evidenceId);
        record.setCaseId(caseId);
        record.setFromOfficer(from);
        record.setFromBadge(fromBadge);
        record.setToOfficer(to);
        record.setToBadge(toBadge);
        record.setTransferTime(LocalDateTime.now());
        record.setTransferLocation(location);
        record.setPurpose(purpose);
        record.setIpAddress(ip);
        record.setSignature(signature);
        record.setStatus("TRANSFERRED");

        CustodyRecord saved = custodyRepository.save(record);

        callAuditService(
            "TRANSFER_CUSTODY", from, fromBadge, ip,
            evidenceId, caseId,
            "Custody transferred from " + from + " [" + fromBadge + "]"
            + " to " + to + " [" + toBadge + "]"
            + " | Location: " + location
            + " | Purpose: " + purpose,
            "custody-service", "SUCCESS"
        );

        return saved;
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

    public List<CustodyRecord> getAll() {
        return custodyRepository.findAll();
    }

    public List<CustodyRecord> getByCase(String caseId) {
        return custodyRepository.findByCaseId(caseId);
    }

    public List<CustodyRecord> getByEvidence(String evidenceId) {
        return custodyRepository.findByEvidenceId(evidenceId);
    }
}