package com.example.demo.repository;

import com.example.demo.model.CustodyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustodyRepository 
       extends JpaRepository<CustodyRecord, Long> {
    List<CustodyRecord> findByEvidenceId(String evidenceId);
    List<CustodyRecord> findByCaseId(String caseId);
}