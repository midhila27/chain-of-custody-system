package com.example.demo.controller;

import com.example.demo.model.CustodyRecord;
import com.example.demo.service.CustodyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/custody")
@CrossOrigin(origins = "*")
public class CustodyController {

    @Autowired
    private CustodyService custodyService;

    @PostMapping("/transfer")
    public CustodyRecord transfer(
            @RequestParam String evidenceId,
            @RequestParam String caseId,
            @RequestParam String fromOfficer,
            @RequestParam String fromBadge,
            @RequestParam String toOfficer,
            @RequestParam String toBadge,
            @RequestParam String location,
            @RequestParam String purpose,
            @RequestParam String signature,
            HttpServletRequest request) {
        return custodyService.transferCustody(
            evidenceId, caseId,
            fromOfficer, fromBadge,
            toOfficer, toBadge,
            location, purpose,
            request.getRemoteAddr(), signature);
    }

    @GetMapping("/all")
    public List<CustodyRecord> getAll() { 
        return custodyService.getAll(); 
    }

    @GetMapping("/case/{caseId}")
    public List<CustodyRecord> getByCase(@PathVariable String caseId) {
        return custodyService.getByCase(caseId);
    }
}