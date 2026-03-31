# System Design by Level

---

## SDE-1 System Design

At SDE-1 level, companies test **awareness and fundamentals**, not deep expertise.

### Core Concepts to Know

| Concept                        | What to understand                               |
| ------------------------------ | ------------------------------------------------ |
| Client-server model            | How browsers and APIs talk                       |
| Load balancers                 | Why they exist, round-robin vs least-connections |
| Horizontal vs vertical scaling | Trade-offs                                       |
| SQL vs NoSQL                   | When to use which                                |
| Caching basics                 | What to cache, cache invalidation strategies     |
| CDN                            | What it does and when to use                     |
| REST vs GraphQL                | Trade-offs and use cases                         |
| Basic database design          | Normalization, indexing, primary/foreign keys    |
| Message queues                 | Why async processing matters                     |
| API rate limiting              | Protecting services                              |

### Common SDE-1 Design Questions

- Design a URL shortener (Bit.ly)
- Design a simple chat application
- Design a parking lot system
- Design a library management system
- Design a basic notification system

### Resources

- Grokking the System Design Interview (Educative)
- System Design Primer (GitHub)
- ByteByteGo newsletter (free tier)

---

## SDE-2 System Design

At SDE-2, companies test **depth, trade-offs, and real-world decision-making**.

### Additional Concepts (beyond SDE-1)

| Concept                         | What to understand                               |
| ------------------------------- | ------------------------------------------------ |
| CAP theorem                     | Consistency vs availability trade-offs           |
| Database replication + sharding | Read replicas, shard keys, hot shards            |
| Consistent hashing              | Used in distributed caches (Cassandra, DynamoDB) |
| Event-driven architecture       | Kafka, outbox pattern, exactly-once semantics    |
| Distributed transactions        | 2PC, SAGA pattern                                |
| Service mesh + API gateway      | Microservice communication                       |
| Search systems                  | Elasticsearch, inverted index, relevance ranking |
| Rate limiting algorithms        | Token bucket, sliding window                     |
| Idempotency                     | Critical for payment systems                     |
| Observability                   | Logs, metrics, traces (the three pillars)        |

### Common SDE-2 Design Questions by Role

**Full Stack / Backend**

- Design Twitter / Instagram feed
- Design WhatsApp / Slack
- Design Uber / Swiggy (real-time location + matching)
- Design a payment system (Razorpay/PhonePe)
- Design YouTube / Netflix

**AI / ML**

- Design a recommendation system (Netflix/Amazon)
- Design a real-time fraud detection system
- Design an ML feature store
- Design a search ranking system

**Frontend / Full Stack**

- Design a Google Docs-style collaborative editor
- Design a dashboard with real-time updates
- Design a large-scale design system

### Framework to Answer SD Questions

1. **Clarify requirements** (functional + non-functional, scale)
2. **High-level design** (components, data flow)
3. **Data model** (schema, storage choices)
4. **Deep dive** (the hardest/most interesting component)
5. **Trade-offs** (what you chose and why)
6. **Failure handling + scaling**

### Resources

| Resource                                     | Level              |
| -------------------------------------------- | ------------------ |
| Grokking System Design (Educative)           | SDE-1 to SDE-2     |
| ByteByteGo (Alex Xu's book)                  | SDE-2              |
| DDIA (Designing Data-Intensive Applications) | SDE-2 deep dive    |
| Jordan has no life (YouTube)                 | SDE-2 walkthroughs |
| System Design Fight Club (YouTube)           | Mock interviews    |
