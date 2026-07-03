package com.example.demo.repository;

import com.example.demo.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByCaseId(String caseId);
    List<Evidence> findByStatus(String status);
}