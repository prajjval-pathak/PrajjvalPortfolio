export interface TableOfContentItem {
  id: string;
  title: string;
  level?: number;
}

export interface CalloutBox {
  type: "note" | "tip" | "warning" | "architecture";
  title?: string;
  text: string;
}

export interface CodeSnippet {
  language: string;
  title?: string;
  code: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs?: string[];
  diagram?: string;
  postDiagramParagraphs?: string[];
  bulletPoints?: string[];
  callout?: CalloutBox;
  codeSnippet?: CodeSnippet;
  subsections?: {
    id: string;
    title: string;
    paragraphs?: string[];
    codeSnippet?: CodeSnippet;
  }[];
}

export interface LearningArticle {
  slug: string;
  title: string;
  category: "LLD" | "HLD" | "DS" | "AI" | ".NET" | "JS";
  date: string;
  readTime: string;
  difficulty: "Fundamentals" | "Intermediate" | "Advanced" | "Deep Dive";
  summary: string;
  tags: string[];
  sections: ArticleSection[];
  keyTakeaways?: string[];
}

export interface LearningCategoryMeta {
  id: "LLD" | "HLD" | "DS" | "AI" | ".NET" | "JS";
  label: string;
  fullName: string;
  description: string;
  accentColor: string;
}

export const LEARNING_CATEGORIES: LearningCategoryMeta[] = [
  {
    id: "LLD",
    label: "LLD",
    fullName: "Low-Level Design & Design Patterns",
    description: "Clean code, SOLID principles, thread-safety, and object-oriented modeling.",
    accentColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  },
  {
    id: "HLD",
    label: "HLD",
    fullName: "High-Level & Distributed Systems",
    description: "Multi-tenancy, partitioning, caching, message queues, and horizontal scaling.",
    accentColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  },
  {
    id: "DS",
    label: "DS",
    fullName: "Data Structures & Algorithms",
    description: "Real-world data structures, complexity trade-offs, and concurrent structures.",
    accentColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  {
    id: "AI",
    label: "AI",
    fullName: "Artificial Intelligence & GenAI",
    description: "LLM integration, Retrieval-Augmented Generation (RAG), embeddings, and agentic workflows.",
    accentColor: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  },
  {
    id: ".NET",
    label: ".NET",
    fullName: ".NET Core & C# Internals",
    description: "ASP.NET Core internals, async/await mechanics, Span<T>, and memory optimization.",
    accentColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
  {
    id: "JS",
    label: "JS",
    fullName: "JavaScript, TypeScript & React",
    description: "Event loop internals, microtasks, React concurrent mode, and state optimization.",
    accentColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  },
];

export const learningArticles: LearningArticle[] = [
  // 1. LLD ARTICLE
  {
    slug: "designing-scalable-rate-limiter-csharp-lld",
    title: "Designing a Scalable Rate Limiter in C# & Redis (LLD)",
    category: "LLD",
    date: "Oct 2026",
    readTime: "8 min read",
    difficulty: "Advanced",
    summary:
      "A complete object-oriented breakdown of rate limiting algorithms (Token Bucket vs Leaky Bucket vs Sliding Window Counter), with a production-grade, thread-safe C# implementation and distributed Redis fallback.",
    tags: ["LLD", "C#", ".NET", "Redis", "Concurrency", "System Design"],
    keyTakeaways: [
      "Token Bucket permits burst traffic while maintaining an average rate, making it ideal for REST APIs.",
      "In single-node setups, Interlocked and reader-writer spin locks prevent lock contention across thread pool threads.",
      "In distributed setups, atomic Redis Lua scripts guarantee race-condition-free token replenishing without multi-roundtrip network overhead.",
      "Gracefully return HTTP 429 Too Many Requests along with Retry-After and X-RateLimit headers.",
    ],
    sections: [
      {
        id: "core-problem-requirements",
        title: "1. Problem Statement & Functional Requirements",
        paragraphs: [
          "Rate limiting is a foundational building block for protecting backend services from denial of service (DoS), brute-force attacks, and abusive scraping. When designing a low-level rate limiter for enterprise APIs, we must balance accurate quota enforcement against sub-millisecond execution overhead.",
          "Our functional and non-functional requirements are as follows:",
        ],
        bulletPoints: [
          "Enforce limits based on IP address, Tenant ID, or API Key (e.g., 100 requests per minute per tenant).",
          "Extensible architecture allowing multiple algorithms (Token Bucket, Sliding Window Log, Fixed Window).",
          "Thread-safe execution under high concurrent load with zero lock starvation.",
          "Low memory footprint with automatic cleanup of expired client buckets.",
        ],
        callout: {
          type: "architecture",
          title: "Design Pattern Choice: Strategy Pattern",
          text: "We decouple the rate-limiting algorithm from the consumer middleware using the Strategy Pattern. The IRateLimiterStrategy interface allows switching between Token Bucket and Sliding Window without modifying API interceptors.",
        },
      },
      {
        id: "algorithm-comparison",
        title: "2. Algorithm Trade-offs: Token Bucket vs Sliding Window",
        paragraphs: [
          "Before writing code, let's understand why Token Bucket is favored by platforms like AWS API Gateway, Stripe, and GitHub:",
        ],
        diagram: `+-----------------------+--------------------+------------------------+
| Algorithm             | Burst Tolerance    | Memory Complexity      |
+-----------------------+--------------------+------------------------+
| Token Bucket          | High (Up to Cap)   | O(1) per client        |
| Leaky Bucket          | Smooth (No Bursts) | O(1) per client        |
| Sliding Window Counter| Moderate           | O(1) per client        |
| Sliding Window Log    | Strict Accuracy    | O(N requests in window)|
+-----------------------+--------------------+------------------------+`,
        postDiagramParagraphs: [
          "Token Bucket stores two numbers per client: currentTokens and lastRefillTimestamp. Instead of running a background timer to add tokens every second, we calculate tokens dynamically on each incoming request: elapsedSeconds * refillRate.",
        ],
      },
      {
        id: "csharp-implementation",
        title: "3. Thread-Safe Token Bucket Implementation in C#",
        paragraphs: [
          "Here is the low-level implementation. Notice the lazy token replenishment logic and lock acquisition to safeguard state against concurrent threads.",
        ],
        codeSnippet: {
          language: "csharp",
          title: "TokenBucketRateLimiter.cs",
          code: `public interface IRateLimiter
{
    bool AllowRequest(string clientKey, int tokensRequested = 1);
}

public class TokenBucketRateLimiter : IRateLimiter
{
    private readonly long _capacity;
    private readonly double _refillTokensPerSecond;
    private readonly ConcurrentDictionary<string, ClientBucket> _buckets = new();

    public TokenBucketRateLimiter(long capacity, double refillTokensPerSecond)
    {
        _capacity = capacity;
        _refillTokensPerSecond = refillTokensPerSecond;
    }

    public bool AllowRequest(string clientKey, int tokensRequested = 1)
    {
        var bucket = _buckets.GetOrAdd(clientKey, _ => new ClientBucket(_capacity));

        lock (bucket.SyncRoot)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var elapsedSeconds = (now - bucket.LastRefillTimestampMs) / 1000.0;

            if (elapsedSeconds > 0)
            {
                var newTokens = elapsedSeconds * _refillTokensPerSecond;
                bucket.Tokens = Math.Min(_capacity, bucket.Tokens + newTokens);
                bucket.LastRefillTimestampMs = now;
            }

            if (bucket.Tokens >= tokensRequested)
            {
                bucket.Tokens -= tokensRequested;
                return true;
            }

            return false;
        }
    }

    private class ClientBucket
    {
        public object SyncRoot { get; } = new();
        public double Tokens { get; set; }
        public long LastRefillTimestampMs { get; set; }

        public ClientBucket(long initialCapacity)
        {
            Tokens = initialCapacity;
            LastRefillTimestampMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        }
    }
}`,
        },
        callout: {
          type: "tip",
          title: "Memory Leak Prevention",
          text: "In production, use an IMemoryCache with SlidingExpiration or a background clean-up worker (like a periodic Timer) to prune dormant client buckets so inactive clients do not consume unbounded memory.",
        },
      },
      {
        id: "distributed-redis",
        title: "4. Scaling to Distributed Deployments with Redis & Lua",
        paragraphs: [
          "When scaling your ASP.NET Core service across 10 horizontal container instances, an in-memory dictionary is no longer sufficient. Clients hitting different nodes would bypass the rate limit. We resolve this by delegating the check to Redis using an atomic Lua script.",
        ],
        codeSnippet: {
          language: "lua",
          title: "token_bucket.lua (Atomic Redis Script)",
          code: `-- KEYS[1]: Rate limit key (e.g., ratelimit:tenant:123)
-- ARGV[1]: Bucket capacity
-- ARGV[2]: Refill rate per second
-- ARGV[3]: Current timestamp (Unix epoch in seconds)
-- ARGV[4]: Requested tokens (usually 1)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local data = redis.call("HMGET", key, "tokens", "last_updated")
local tokens = tonumber(data[1])
local last_updated = tonumber(data[2])

if not tokens then
    tokens = capacity
    last_updated = now
else
    local elapsed = math.max(0, now - last_updated)
    tokens = math.min(capacity, tokens + (elapsed * refill_rate))
    last_updated = now
end

if tokens >= requested then
    tokens = tokens - requested
    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)
    redis.call("EXPIRE", key, math.ceil(capacity / refill_rate) * 2)
    return 1 -- Allowed
else
    redis.call("HMSET", key, "tokens", tokens, "last_updated", last_updated)
    return 0 -- Rejected (429)
end`,
        },
      },
    ],
  },

  // 2. HLD ARTICLE
  {
    slug: "scaling-multi-tenant-saas-rbac-sharding-hld",
    title: "Scaling Multi-Tenant Enterprise SaaS with RBAC & Sharding (HLD)",
    category: "HLD",
    date: "Oct 2026",
    readTime: "11 min read",
    difficulty: "Deep Dive",
    summary:
      "How to architect enterprise-grade multi-tenant backends serving thousands of concurrent businesses. Covers data isolation strategies, tenant context propagation, dynamic connection routing, and granular RBAC.",
    tags: ["HLD", "Multi-Tenancy", "RBAC", "Architecture", "SQL Server", "Oracle"],
    keyTakeaways: [
      "Select your isolation tier based on compliance: Hybrid Pooled-with-Partitioning offers the sweet spot between cloud cost and security.",
      "Tenant context must be resolved deterministically at API Gateway / Middleware layer and propagated through AsyncLocal<T>.",
      "Enforce tenant filtering at the ORM / Database level via EF Core Global Query Filters or Oracle VPD (Virtual Private Database).",
      "Granular RBAC is modeled cleanly as Users -> Roles -> Permissions, cached with short-lived distributed Redis tokens.",
    ],
    sections: [
      {
        id: "multi-tenancy-models",
        title: "1. The 3 Multi-Tenancy Architecture Models",
        paragraphs: [
          "Enterprise platforms (such as Oracle ERP and B2B SaaS) face a fundamental architectural choice when storing client data: How isolated should each tenant be?",
        ],
        diagram: `Model 1: Database-per-Tenant (Highest Isolation, Highest Cost)
[Tenant A] ---> [DB A]
[Tenant B] ---> [DB B]

Model 2: Schema-per-Tenant (Good Balance, Schema Migration Overhead)
[Shared Database]
   |--> [Schema_TenantA]
   |--> [Schema_TenantB]

Model 3: Shared Database + Shared Schema with TenantId (Cost Efficient, Requires Strict RBAC)
[Shared Database]
   |--> [Table: Orders (TenantId, OrderId, Amount...)]`,
        postDiagramParagraphs: [
          "For massive enterprise platforms, a hybrid approach is often best: small to mid-tier tenants share pooled tables partitioned by TenantId, while premium enterprise clients receive dedicated databases to satisfy strict regulatory and data sovereignty mandates.",
        ],
      },
      {
        id: "tenant-context-propagation",
        title: "2. Tenant Context Resolution & AsyncLocal Pipeline",
        paragraphs: [
          "To guarantee that no tenant ever sees another tenant's data, the tenant identifier must never be trusted from the request body. Instead, it must be cryptographically verified from the signed JWT claims or matched against verified subdomains.",
        ],
        codeSnippet: {
          language: "csharp",
          title: "TenantContextMiddleware.cs",
          code: `public class TenantContext
{
    private static readonly AsyncLocal<TenantInfo?> _currentTenant = new();

    public static TenantInfo? Current => _currentTenant.Value;

    public static IDisposable SetCurrent(TenantInfo tenant)
    {
        _currentTenant.Value = tenant;
        return new DisposableAction(() => _currentTenant.Value = null);
    }
}

public class TenantIdentificationMiddleware
{
    private readonly RequestDelegate _next;

    public TenantIdentificationMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ITenantResolver tenantResolver)
    {
        // 1. Extract from JWT claims or X-Tenant-ID header
        var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;

        if (string.IsNullOrEmpty(tenantIdClaim))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Missing tenant identification.");
            return;
        }

        var tenantInfo = await tenantResolver.ResolveTenantAsync(tenantIdClaim);
        if (tenantInfo == null || !tenantInfo.IsActive)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        // 2. Set ambient context across async execution flow
        using (TenantContext.SetCurrent(tenantInfo))
        {
            await _next(context);
        }
    }
}`,
        },
      },
      {
        id: "rbac-architecture",
        title: "3. Granular Role-Based Access Control (RBAC)",
        paragraphs: [
          "Hardcoding role checks like [Authorize(Roles = \"Admin\")] leads to brittle code when enterprise customers require customized role definitions. The correct architecture relies on Claim/Permission-Based Access Control (PBAC).",
        ],
        bulletPoints: [
          "Entities: User has one or more TenantRoles; TenantRole maps to a set of Granular Permissions (e.g. Risk:Read, Risk:Approve, Report:Export).",
          "Policy Handlers: ASP.NET Core IAuthorizationHandler evaluates user permissions dynamically from decrypted JWT or Redis cache.",
          "Hierarchical scoping: Org-level Admin vs Branch Manager vs Read-Only Auditor.",
        ],
        callout: {
          type: "warning",
          title: "Database Defense in Depth",
          text: "Never rely purely on application code for data isolation! Always pair software-level filters (like EF Core Global Query Filters) with database-level security policies (e.g., Row-Level Security in SQL Server or Oracle Virtual Private Database).",
        },
      },
    ],
  },

  // 3. DS ARTICLE
  {
    slug: "lru-cache-concurrency-hash-doubly-linked-list-ds",
    title: "LRU Cache Internals: O(1) Lookups & Concurrency Safeguards (DS)",
    category: "DS",
    date: "Oct 2026",
    readTime: "7 min read",
    difficulty: "Intermediate",
    summary:
      "Deconstructing the Least Recently Used (LRU) Cache from first principles. How combining a Hash Table with a Doubly Linked List achieves O(1) Get and Put, and how to handle thread safety under high throughput.",
    tags: ["Data Structures", "Algorithms", "C#", "LRU Cache", "Big-O"],
    keyTakeaways: [
      "A Hash Map gives O(1) lookup by key, but lacks ordering.",
      "A Doubly Linked List maintains temporal usage order in O(1) node detachment and insertion.",
      "Dummy Head and Tail sentinel nodes eliminate null pointer edge cases when removing or inserting nodes.",
      "Fine-grained striped locking beats a single global mutex under multi-threaded read/write workloads.",
    ],
    sections: [
      {
        id: "why-lru",
        title: "1. The Anatomy of an LRU Cache",
        paragraphs: [
          "Caches operate under finite memory bounds. When the capacity limit is breached, the cache must evict an item to accommodate new data. The LRU eviction policy asserts that items accessed most recently are most likely to be accessed again soon.",
          "To make every operation O(1), we coordinate two cooperating data structures:",
        ],
        diagram: `+---------------------------------------------------------------+
|                    Hash Map: Key -> Node Pointer              |
+---------------------------------------------------------------+
                               |
                               v
[Head Sentinel] <--> [Node A] <--> [Node B] <--> [Node C] <--> [Tail Sentinel]
  (Most Recent)                                                 (Least Recent)`,
      },
      {
        id: "complete-csharp-code",
        title: "2. Clean C# Implementation with Sentinel Nodes",
        paragraphs: [
          "Using pseudo-nodes (head and tail) simplifies our code dramatically by eliminating conditional checks for list boundary updates:",
        ],
        codeSnippet: {
          language: "csharp",
          title: "LruCache.cs",
          code: `public class LruCache<TKey, TValue> where TKey : notnull
{
    private class Node
    {
        public TKey Key;
        public TValue Value;
        public Node? Prev;
        public Node? Next;

        public Node(TKey key, TValue value)
        {
            Key = key;
            Value = value;
        }
    }

    private readonly int _capacity;
    private readonly Dictionary<TKey, Node> _map;
    private readonly Node _head;
    private readonly Node _tail;
    private readonly object _lock = new();

    public LruCache(int capacity)
    {
        if (capacity <= 0) throw new ArgumentException("Capacity must be > 0");
        _capacity = capacity;
        _map = new Dictionary<TKey, Node>(capacity);

        // Dummy Sentinels
        _head = new Node(default!, default!);
        _tail = new Node(default!, default!);
        _head.Next = _tail;
        _tail.Prev = _head;
    }

    public bool TryGet(TKey key, out TValue? value)
    {
        lock (_lock)
        {
            if (_map.TryGetValue(key, out var node))
            {
                MoveToHead(node);
                value = node.Value;
                return true;
            }

            value = default;
            return false;
        }
    }

    public void Put(TKey key, TValue value)
    {
        lock (_lock)
        {
            if (_map.TryGetValue(key, out var existingNode))
            {
                existingNode.Value = value;
                MoveToHead(existingNode);
                return;
            }

            if (_map.Count >= _capacity)
            {
                // Evict least recently used (tail.Prev)
                var lru = _tail.Prev!;
                RemoveNode(lru);
                _map.Remove(lru.Key);
            }

            var newNode = new Node(key, value);
            _map[key] = newNode;
            InsertAtHead(newNode);
        }
    }

    private void MoveToHead(Node node)
    {
        RemoveNode(node);
        InsertAtHead(node);
    }

    private void InsertAtHead(Node node)
    {
        node.Next = _head.Next;
        node.Prev = _head;
        _head.Next!.Prev = node;
        _head.Next = node;
    }

    private void RemoveNode(Node node)
    {
        node.Prev!.Next = node.Next;
        node.Next!.Prev = node.Prev;
    }
}`,
        },
      },
    ],
  },

  // 4. AI ARTICLE
  {
    slug: "building-production-enterprise-rag-gemini-ai",
    title: "Building Enterprise RAG with Google Gemini API & Vector Search (AI)",
    category: "AI",
    date: "Oct 2026",
    readTime: "9 min read",
    difficulty: "Advanced",
    summary:
      "A hands-on engineering guide to building accurate Retrieval-Augmented Generation (RAG) systems for enterprise documents. Covers chunking strategies, hybrid vector + keyword search, prompt engineering, and guardrails with Gemini 1.5 / 2.0 Flash.",
    tags: ["AI", "GenAI", "Gemini API", "RAG", "Embeddings", "Python", ".NET"],
    keyTakeaways: [
      "Chunking matters more than embedding model choice: semantic markdown-aware chunking prevents context fragmentation.",
      "Hybrid search (BM25 keyword search + Dense Vector cosine similarity) outperforms pure vector search for domain jargon and acronyms.",
      "Use System Instructions to restrict the model from answering beyond retrieved grounding citations.",
      "Streaming responses dramatically improve perceived UI latency for end users.",
    ],
    sections: [
      {
        id: "rag-architecture-pipeline",
        title: "1. The Enterprise RAG Architecture",
        paragraphs: [
          "While LLMs excel at reasoning, they lack access to private enterprise repositories, internal documentation, and real-time database state. RAG bridges this gap by querying an indexed vector database for relevant snippets and injecting them as context into the prompt.",
        ],
        diagram: `[Document Ingestion]
  Markdown/PDF/Doc -> Text Chunker -> text-embedding-004 -> Vector DB (Pinecone / PgVector)

[Query Pipeline]
  User Query -> Embed -> Top-K Nearest Neighbors (Context)
                             |
                             v
               +------------------------------+
               | System: "Answer grounded in  |
               | the context below only..."   |
               | Context: [Top-K Snippets]    | -> Gemini 2.0 / 1.5 Flash -> Grounded Answer
               | Query: User question         |
               +------------------------------+`,
      },
      {
        id: "implementation-gemini-sdk",
        title: "2. Executing RAG with the Gemini API",
        paragraphs: [
          "Here is a clean implementation demonstrating grounded generation using the official Google Gen AI SDK. We configure low temperature for deterministic answers and enforce structured formatting.",
        ],
        codeSnippet: {
          language: "typescript",
          title: "enterpriseRagService.ts",
          code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GroundedQueryRequest {
  query: string;
  retrievedContextChunks: string[];
}

export async function generateGroundedAnswer({ query, retrievedContextChunks }: GroundedQueryRequest) {
  const formattedContext = retrievedContextChunks
    .map((chunk, i) => \`[Citation \${i + 1}]:\\n\${chunk}\`)
    .join("\\n\\n");

  const systemInstruction = \`
You are an enterprise AI assistant for financial and compliance analysis.
Rules:
1. ONLY answer using facts explicitly supported by the provided citations.
2. If the context does not contain enough evidence, state: "The provided documents do not contain sufficient information to answer this."
3. Always include bracketed citations like [Citation 1] when referencing facts.
\`;

  const prompt = \`
Context Information:
\${formattedContext}

User Query:
\${query}
\`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.1, // Low temperature for high factual accuracy
      maxOutputTokens: 1024,
    },
  });

  return response.text;
}`,
        },
        callout: {
          type: "tip",
          title: "Handling Hallucinations",
          text: "Always provide an explicit escape hatch in the prompt instructions: 'If the retrieved citations are insufficient, state you do not know'. This drops hallucination rates by over 90%.",
        },
      },
    ],
  },

  // 5. .NET ARTICLE
  {
    slug: "aspnet-core-middleware-async-internals-dotnet",
    title: "ASP.NET Core Internals: Middleware Pipeline, Span<T> & Async (.NET)",
    category: ".NET",
    date: "Oct 2026",
    readTime: "10 min read",
    difficulty: "Deep Dive",
    summary:
      "Under the hood of modern .NET. How the ASP.NET Core RequestDelegate chain operates, why async/await does not allocate threads, and how Span<T> and Memory<T> eliminate zero-copy allocations in high-volume APIs.",
    tags: [".NET", "C#", "ASP.NET Core", "Performance", "Memory", "Async"],
    keyTakeaways: [
      "The middleware pipeline is constructed as a reverse-nested Russian doll of RequestDelegate functions during application startup.",
      "await does not block a thread; it registers a callback state machine on the ThreadPool task scheduler.",
      "Avoid async void at all costs: unhandled exceptions will crash the entire process and bypass global exception middleware.",
      "Span<T> represents contiguous memory on the stack, allowing zero-allocation string parsing and buffer slicing.",
    ],
    sections: [
      {
        id: "middleware-pipeline-mechanics",
        title: "1. How Middleware Actually Executes",
        paragraphs: [
          "In Program.cs, every call to app.Use(...) registers a middleware component. Internally, ASP.NET Core compiles these components into a single composed delegate: Func<HttpContext, Task>.",
        ],
        diagram: `Request --> [Logging Middleware]
                 |--> [Auth Middleware]
                         |--> [Rate Limiter]
                                 |--> [Routing & Controller Action]
                         |<-- [Rate Limiter Response Headers]
                 |<-- [Auth Token Refresh]
Response <-- [Logging Response Timing]`,
        postDiagramParagraphs: [
          "Notice how each middleware controls whether execution proceeds to the next component or short-circuits. If authentication fails, the pipeline immediately returns without evaluating downstream controllers.",
        ],
      },
      {
        id: "span-memory-optimization",
        title: "2. Zero-Allocation High Performance with Span<T>",
        paragraphs: [
          "When parsing high-volume HTTP headers or CSV/JSON payloads, traditional string.Substring creates heap allocations that trigger Garbage Collection (GC) pauses. Span<T> provides a type-safe view into contiguous memory without heap allocation.",
        ],
        codeSnippet: {
          language: "csharp",
          title: "ZeroAllocStringParsing.cs",
          code: `// Traditional approach: 3 Heap Allocations (GC pressure)
public (string Year, string Month, string Day) ParseDateOld(string dateStr)
{
    var year = dateStr.Substring(0, 4);   // Allocates new string
    var month = dateStr.Substring(5, 2);  // Allocates new string
    var day = dateStr.Substring(8, 2);    // Allocates new string
    return (year, month, day);
}

// Modern .NET 8 / 9 Span approach: 0 Heap Allocations
public (int Year, int Month, int Day) ParseDateOptimized(ReadOnlySpan<char> dateSpan)
{
    // Slice produces a Span pointing to original memory block
    var yearSpan = dateSpan.Slice(0, 4);
    var monthSpan = dateSpan.Slice(5, 2);
    var daySpan = dateSpan.Slice(8, 2);

    int year = int.Parse(yearSpan);
    int month = int.Parse(monthSpan);
    int day = int.Parse(daySpan);

    return (year, month, day);
}`,
        },
        callout: {
          type: "architecture",
          title: "Why Span<T> is a ref struct",
          text: "Because Span<T> can point directly to stack memory or unmanaged buffers, the C# compiler restricts it to being a 'ref struct'. It can never be boxed, stored as a field on a regular class on the heap, or captured inside an async state machine.",
        },
      },
    ],
  },

  // 6. JS ARTICLE
  {
    slug: "javascript-event-loop-microtasks-react19-js",
    title: "JavaScript Event Loop, Microtasks & React 19 Concurrent Rendering (JS)",
    category: "JS",
    date: "Oct 2026",
    readTime: "8 min read",
    difficulty: "Advanced",
    summary:
      "Demystifying the browser execution model: Call Stack, Web APIs, Microtask Queue vs Macrotask Queue, and how React 19 leverages fibers and cooperative multitasking to keep interfaces fluid.",
    tags: ["JavaScript", "React", "TypeScript", "Event Loop", "Performance"],
    keyTakeaways: [
      "Microtasks (Promises, queueMicrotask, MutationObserver) always drain completely before the browser executes the next macrotask (setTimeout).",
      "Long tasks exceeding 50ms block the UI thread, delaying frame rendering and triggering poor INP (Interaction to Next Paint) scores.",
      "React 19 Concurrent Mode breaks synchronous rendering trees into interruptible fibers scheduled via MessageChannel / scheduler.",
      "useTransition enables non-blocking background state transitions that can be paused if higher priority user typing occurs.",
    ],
    sections: [
      {
        id: "event-loop-breakdown",
        title: "1. The JavaScript Runtime Execution Hierarchy",
        paragraphs: [
          "JavaScript is single-threaded. It processes one operation at a time on its Call Stack. Understanding execution order prevents common async timing bugs:",
        ],
        diagram: `+-------------------------------------------------------+
|                      Call Stack                       |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|  Microtask Queue: Promises, queueMicrotask (Drained!) |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|      Render Steps: Style Calc, Layout, Paint          |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|  Macrotask Queue: setTimeout, setInterval, I/O Events |
+-------------------------------------------------------+`,
        postDiagramParagraphs: [
          "Key rule: The microtask queue will be completely emptied before the browser renders or processes the next macrotask. Starving the macrotask queue with continuous recursive microtasks will freeze the page.",
        ],
      },
      {
        id: "react-19-concurrent-mode",
        title: "2. React 19: Time-Slicing with useTransition",
        paragraphs: [
          "In older versions of React, a heavy state update would freeze user inputs until the entire component tree rendered. React 19's concurrent scheduler splits rendering into chunks using time-slicing:",
        ],
        codeSnippet: {
          language: "tsx",
          title: "NonBlockingSearch.tsx",
          code: `import React, { useState, useTransition } from "react";

export function FastFilteringList({ rawItems }: { rawItems: string[] }) {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(rawItems);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;

    // 1. High priority: Update input immediately (0ms user latency)
    setQuery(nextVal);

    // 2. Low priority: Mark expensive filtering as interruptible transition
    startTransition(() => {
      const results = rawItems.filter((item) =>
        item.toLowerCase().includes(nextVal.toLowerCase())
      );
      setFilteredList(results);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleInputChange}
        placeholder="Type to filter 50,000 records..."
        className="px-4 py-2 bg-navy-card text-white border border-slate-dark rounded"
      />

      {isPending && <span className="ml-3 text-xs text-teal animate-pulse">Filtering...</span>}

      <ul>
        {filteredList.slice(0, 100).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}`,
        },
      },
    ],
  },
];
