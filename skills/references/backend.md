# Backend / SDE — MNC Skill Reference

## Core Languages
| Skill | SDE-1 | SDE-2 |
|---|---|---|
| Java or Go or Python (one deeply) | Proficient | Expert — idiomatic, performant code |
| OOP principles (SOLID, design patterns) | Understands | Applies naturally |
| Concurrency & threading | Awareness | Proficient — race conditions, deadlocks |
| Memory management (GC, heap/stack) | Awareness | Understands and optimizes |

## APIs & Services
| Skill | SDE-1 | SDE-2 |
|---|---|---|
| REST API design | Proficient | Idempotency, versioning, pagination |
| gRPC | Awareness | Proficient |
| GraphQL | Awareness | Proficient |
| API security (auth, rate limiting, CORS) | Implements | Designs |
| Async processing (queues, workers) | Awareness | Proficient |

## Databases
| Skill | SDE-1 | SDE-2 |
|---|---|---|
| PostgreSQL / MySQL | CRUD, joins, indexing | Query plans, sharding, replication |
| MongoDB or Cassandra | Awareness | Proficient |
| Redis | Caching basics | Pub/sub, distributed locks, TTL patterns |
| Database design & normalization | Proficient | Advanced — handles N:M, soft deletes, audit logs |
| Transactions & ACID | Understands | Designs around them |

## Infrastructure & DevOps
| Skill | SDE-1 | SDE-2 |
|---|---|---|
| Docker | Proficient | Optimized multi-stage builds |
| Kubernetes | Awareness | Deploys and manages services |
| Cloud (AWS/GCP) | Basic (EC2, S3, RDS) | Serverless, managed services, cost-aware |
| CI/CD | Uses pipelines | Builds and maintains them |
| Logging & monitoring (Datadog, ELK, Prometheus) | Awareness | Proficient |

## Distributed Systems (Critical for Tier 1)
- CAP theorem — knows and applies it
- Eventual consistency vs strong consistency trade-offs
- Distributed transactions (2PC, saga pattern)
- Leader election, consensus (Raft/Paxos at concept level)
- Message queues: Kafka architecture, consumer groups, offset management

## Must-Have for Tier 1
- Has debugged a production incident — knows how to trace, identify, fix
- Has designed or significantly contributed to a service used at scale
- Can walk through the full lifecycle of a request in a distributed system

## Green Flags on Resume
- Open source contributions to backend frameworks or libraries
- Written about a technical challenge solved (blog, internal doc)
- Contributed to observability tooling or developer productivity
- Experience with high-throughput systems (>1k RPS)