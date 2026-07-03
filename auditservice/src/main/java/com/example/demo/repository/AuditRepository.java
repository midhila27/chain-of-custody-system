package com.example.demo.repository;

import com.example.demo.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditRepository 
       extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByAction(String action);
    List<AuditLog> findByCaseId(String caseId);
}