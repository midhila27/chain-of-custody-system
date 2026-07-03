package com.example.demo.service;

import com.example.demo.model.AuditLog;
import com.example.demo.repository.AuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditRepository auditRepository;

    public AuditLog log(String action, String performedBy,
                        String badge, String ip,
                        String evidenceId, String caseId,
                        String details, String service, 
                        String result) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setPerformedBy(performedBy);
        log.setBadgeNumber(badge);
        log.setIpAddress(ip);
        log.setEvidenceId(evidenceId);
        log.setCaseId(caseId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        log.setServiceName(service);
        log.setResult(result);
        return auditRepository.save(log);
    }

    public List<AuditLog> getAll() { 
        return auditRepository.findAll(); 
    }

    public List<AuditLog> getTamperLogs() { 
        return auditRepository.findByAction("TAMPER_DETECTED"); 
    }
}