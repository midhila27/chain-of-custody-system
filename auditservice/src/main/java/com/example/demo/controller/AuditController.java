package com.example.demo.controller;

import com.example.demo.model.AuditLog;
import com.example.demo.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @PostMapping("/log")
    public AuditLog log(
            @RequestParam String action,
            @RequestParam String performedBy,
            @RequestParam String badge,
            @RequestParam String ip,
            @RequestParam String evidenceId,
            @RequestParam String caseId,
            @RequestParam String details,
            @RequestParam String service,
            @RequestParam String result) {
        return auditService.log(action, performedBy, badge,
                                ip, evidenceId, caseId,
                                details, service, result);
    }

    @GetMapping("/all")
    public List<AuditLog> getAll() { 
        return auditService.getAll(); 
    }

    @GetMapping("/tamper-alerts")
    public List<AuditLog> getTamperAlerts() { 
        return auditService.getTamperLogs(); 
    }
}