# Chain of Custody - Digital Evidence Management System

A microservices-based digital evidence management system for law enforcement.

## Tech Stack
- Backend: Java Spring Boot (4 Microservices)
- Frontend: React.js
- Database: MySQL
- Containerization: Docker + Docker Compose
- Orchestration: Kubernetes

## Microservices
| Service | Port | Description |
|---|---|---|
| evidenceservice | 8081 | Upload and manage digital evidence with SHA-256 hashing |
| custodyservice | 8082 | Track chain of custody transfers between officers |
| userservice | 8083 | Officer registration and authentication |
| auditservice | 8084 | System-wide audit logging |

## Features
- SHA-256 tamper detection
- Role-based access control (Admin/Officer/Investigator/Forensic Officer)
- Auto badge number generation
- Suspect window investigation
- Full audit trail

## How to Run

### Using Docker
    docker-compose up --build

### Using Kubernetes
    kubectl apply -f k8s/

## Architecture
4 independent Spring Boot services communicate via REST APIs.
Each service has its own MySQL database.
All services are containerized using Docker and orchestrated with Kubernetes.
