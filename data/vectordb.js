window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["vectordb"] = {
  "kind": "design",
  "notes": [
    {
      "title": "What a vector database is",
      "layers": [
        [
          {
            "label": "Text / image"
          }
        ],
        [
          {
            "label": "Embedding model"
          }
        ],
        [
          {
            "label": "Vector DB",
            "tone": "store"
          }
        ],
        [
          {
            "label": "App / LLM"
          }
        ]
      ],
      "flow": [
        "Chunk",
        "Embed",
        "Store vector",
        "Query embed",
        "Top-k similar"
      ],
      "body": "A vector database stores lists of numbers (embeddings) and finds the nearest ones. 'Nearest' means similar meaning, not the same letters. You use it for search that understands 'bike' ≈ 'bicycle', for recommendations, and for RAG (give an LLM the right paragraphs). It does not replace Postgres for users and orders. It sits beside them."
    },
    {
      "title": "What an embedding is",
      "body": "An embedding model turns text (or an image) into a fixed-length vector, say 384 or 1536 floats. Nearby vectors mean nearby meaning. The same model must be used for insert and for query. Mixing models (or mixing versions) makes distances meaningless. Store the source text and the vector together so you can show the chunk, not only an id."
    },
    {
      "title": "Similarity: cosine, L2, dot",
      "body": "Cosine similarity cares about angle, not length — common for text. L2 (Euclidean) is straight-line distance. Inner product is used when vectors are already normalized. Pick one metric and keep it. ANN indexes (HNSW, IVF) find approximate nearest neighbors fast. Approximate means you may miss a slightly better neighbor to stay fast."
    },
    {
      "title": "Chunking",
      "flow": [
        "Document",
        "split ~300–800 tokens",
        "overlap",
        "embed each"
      ],
      "body": "A whole book as one vector is useless: the average meaning is mush. Split into chunks (paragraphs or 300–800 tokens) with a little overlap so a sentence is not cut in half. Too small and you lose context. Too big and retrieval is noisy. Chunking quality matters as much as the database brand."
    },
    {
      "title": "RAG (retrieval-augmented generation)",
      "flow": [
        "User question",
        "embed",
        "top-k chunks",
        "prompt + chunks",
        "LLM answer"
      ],
      "body": "The model does not magically know your PDF. You retrieve the closest chunks, paste them into the prompt, and ask the LLM to answer only from that. Cite the chunk. If retrieval is wrong, the answer is confidently wrong. Measure retrieval (did the right paragraph appear?) before you blame the LLM."
    },
    {
      "title": "Filters + vectors",
      "body": "Real apps need metadata: tenant, language, date, 'published'. A vector store that cannot filter will leak another customer's docs. Postgres + pgvector, Pinecone, Weaviate, Qdrant, and Chroma all support metadata filters. Always filter by tenant_id in a multi-user product."
    },
    {
      "title": "pgvector vs a specialist store",
      "body": "pgvector keeps vectors in Postgres next to the row. One backup, one transaction, one team skill. Good to a few million vectors if you index well. Pinecone, Qdrant, Weaviate, Milvus, Chroma scale the ANN index and ops. Start with pgvector if you already have Postgres. Move when recall or ingest speed forces it."
    },
    {
      "title": "Hybrid search",
      "body": "Keyword (BM25) is good at exact SKUs and names. Vectors are good at paraphrases. Hybrid search runs both and merges scores. 'Error code E-41' should hit BM25. 'why is my bill high' should hit vectors. Many products need both, not a religion."
    },
    {
      "title": "Ops you will forget",
      "body": "Re-embed when you change the model. Version the collection name (docs_v3_text-embedding-3). Delete vectors when you delete the source file. Cap top-k. Watch p95 query time and recall@k on a labelled set. An empty filter that returns another tenant's HR PDF is a security bug, not a quality bug."
    },
    {
      "title": "What not to use a vector DB for",
      "body": "Not a user table. Not a shopping cart. Not the only store of a legal contract (keep the file in object storage and the row in SQL; the vector is an index). Not a replacement for a unique email constraint. Similarity is not equality."
    }
  ],
  "examples": [
    {
      "title": "Embed and insert (pgvector idea)",
      "lang": "sql",
      "desc": "Definition. A column of type vector holds the embedding.\n\nHow it works. INSERT the chunk text plus the numbers. CREATE INDEX for ANN.\n\nOperational risk. Inserting vectors from two different models into one column.",
      "code": "-- store the chunk and its vector\nCREATE TABLE chunks (\n  id    SERIAL PRIMARY KEY,\n  body  TEXT,\n  tenant TEXT,\n  embedding vector(1536)  -- same size as the model\n);\n\nINSERT INTO chunks (body, tenant, embedding)\nVALUES ('refund policy…', 'acme', '[0.01, 0.22, …]');"
    },
    {
      "title": "Nearest neighbors in SQL",
      "lang": "sql",
      "flow": [
        "embed question",
        "ORDER BY distance",
        "LIMIT 5"
      ],
      "desc": "Definition. The query vector is compared to stored vectors.\n\nHow it works. <=> is cosine distance in pgvector. LIMIT 5 is top-k.\n\nOperational risk. Forgetting WHERE tenant = current org.",
      "code": "SELECT body\nFROM chunks\nWHERE tenant = 'acme'  -- never skip this\nORDER BY embedding <=> '[0.02, 0.19, …]'\nLIMIT 5;  -- top 5 similar chunks"
    },
    {
      "title": "RAG in the app",
      "lang": "js",
      "flow": [
        "question",
        "embed",
        "top-k",
        "prompt",
        "LLM"
      ],
      "desc": "Definition. Retrieve first, then generate.\n\nHow it works. embed(question), search, build prompt from chunks, call the model.\n\nOperational risk. Prompt without retrieved text — the model will guess.",
      "code": "const qVec = await embed(question);  // same model as insert\nconst hits = await search(qVec, { tenant, k: 5 });  // nearest chunks\nconst context = hits.map((h) => h.body).join(\"\\n---\\n\");\nconst answer = await llm([\n  { role: \"system\", content: \"Answer only from the context.\" },\n  { role: \"user\", content: context + \"\\n\\nQ: \" + question }\n]);"
    },
    {
      "title": "Chunk a markdown file",
      "lang": "js",
      "desc": "Definition. Split long text so each vector has one idea.\n\nHow it works. Walk headings or windows of ~500 tokens with overlap.\n\nOperational risk. One vector for a 40-page PDF.",
      "code": "function chunk(text, size = 500, overlap = 80) {\n  const out = [];\n  for (let i = 0; i < text.length; i += size - overlap) {\n    out.push(text.slice(i, i + size));  // one passage\n  }\n  return out;\n}"
    },
    {
      "title": "Metadata filter",
      "lang": "js",
      "desc": "Definition. Restrict the ANN search to one tenant and one source type.\n\nHow it works. filter: { tenant, kind: 'policy' } then vector search.\n\nOperational risk. Global search across tenants.",
      "code": "await index.query({\n  vector: qVec,\n  topK: 5,\n  filter: { tenant: \"acme\", kind: \"policy\" }  // hard wall\n});"
    },
    {
      "title": "Delete when the source dies",
      "lang": "js",
      "desc": "Definition. Vectors are an index of a file. Remove both.\n\nHow it works. delete where source_id = file. Then delete the object in S3.\n\nOperational risk. File gone, chunks still retrieved as if true.",
      "code": "await chunks.deleteMany({ sourceId: fileId });  // drop vectors\nawait s3.delete(fileId);  // drop the file"
    },
    {
      "title": "Version the collection",
      "lang": "js",
      "desc": "Definition. A new embedding model needs a new collection.\n\nHow it works. docs_v3_emb3small. Dual-write, switch queries, drop v2.\n\nOperational risk. Mixing 1536-d and 384-d in one index.",
      "code": "const COLLECTION = \"docs_v3_text-embedding-3-small\";  // name the model\nawait index.upsert({ collection: COLLECTION, id, values: vec, metadata });"
    },
    {
      "title": "Hybrid: keyword + vector",
      "lang": "js",
      "desc": "Definition. Merge BM25 hits and vector hits.\n\nHow it works. Run both, rank by a weighted score, unique by id.\n\nOperational risk. Only vectors for an exact error code the user pasted.",
      "code": "const [kw, vec] = await Promise.all([\n  bm25.search(question, 10),   // exact words\n  vector.search(qVec, 10)      // meaning\n]);\nconst merged = fuse(kw, vec);  // one ranked list"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is a vector database?",
      "a": "Definition. A store that keeps embeddings and returns the nearest ones for a query vector.\n\nHow it works. Insert vectors. Query with another vector. Get top-k.\n\nOperational risk. Using it as the only user database."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is an embedding?",
      "a": "Definition. A list of numbers that represents meaning.\n\nHow it works. A model maps text to ~384–1536 floats. Nearby vectors ≈ similar text.\n\nOperational risk. Querying with a different model than you used to insert."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Why not LIKE '%bike%'?",
      "a": "Definition. LIKE needs the same letters. Embeddings match meaning.\n\nHow it works. 'bicycle' can retrieve a 'bike' chunk.\n\nOperational risk. Vectors only, when the user pasted an exact SKU — add keyword search."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is top-k?",
      "a": "Definition. How many nearest chunks you take, often 3–10.\n\nHow it works. k too small misses context. k too large fills the prompt with junk.\n\nOperational risk. k=50 into a small context window."
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is RAG?",
      "a": "Definition. Retrieve relevant chunks, then ask an LLM to answer from them.\n\nHow it works. embed → search → prompt → generate.\n\nOperational risk. Skipping retrieval and hoping the model 'knows' your PDF.",
      "flow": [
        "Q",
        "embed",
        "top-k",
        "LLM"
      ]
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Why chunk documents?",
      "a": "Definition. One vector per whole book averages away the answer.\n\nHow it works. 300–800 tokens with overlap.\n\nOperational risk. Chunks that split a table in half."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Cosine vs L2?",
      "a": "Definition. Cosine uses angle. L2 uses straight-line distance.\n\nHow it works. Text embeddings often use cosine. Stay consistent with the index.\n\nOperational risk. Building with cosine and querying with L2."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "What is ANN?",
      "a": "Definition. Approximate nearest neighbor — fast, slightly imperfect.\n\nHow it works. HNSW and IVF are common indexes.\n\nOperational risk. Expecting exact nearest every time on a huge set."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Why metadata filters?",
      "a": "Definition. Restrict which vectors may win (tenant, date, type).\n\nHow it works. Filter first or during search, then rank by distance.\n\nOperational risk. Missing tenant filter — cross-customer leak."
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "pgvector vs Pinecone?",
      "a": "Definition. pgvector lives in Postgres. Pinecone is a hosted vector service.\n\nHow it works. Start pgvector if SQL is already home. Move when scale or ops demand it.\n\nOperational risk. Two sources of truth for the same chunk text."
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What do you store besides the vector?",
      "a": "Definition. The source text, source id, tenant, model version, and dates.\n\nHow it works. You show the chunk to the user and to the LLM.\n\nOperational risk. Storing only floats and losing the paragraph."
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "How do you change embedding models?",
      "a": "Definition. New collection, re-embed everything, switch queries, drop the old index.\n\nHow it works. Name collections with the model id.\n\nOperational risk. Upserting new dims into an old index."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is hybrid search?",
      "a": "Definition. Keyword plus vector, then merge.\n\nHow it works. BM25 for exact tokens, vectors for paraphrase.\n\nOperational risk. Vector-only for error codes and part numbers."
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Chroma / Weaviate / Qdrant — what are they?",
      "a": "Definition. Specialist vector stores (local or hosted) with ANN indexes and filters.\n\nHow it works. Same idea: upsert vectors, query top-k.\n\nOperational risk. Picking a brand before you have a chunking test set."
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "How do you measure retrieval?",
      "a": "Definition. Label questions with the chunk that should appear. Track recall@k and MRR.\n\nHow it works. If the right paragraph is missing, do not tune the LLM first.\n\nOperational risk. Only scoring 'the answer sounded nice'."
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What is a collection / index / namespace?",
      "a": "Definition. A named bucket of vectors, often one per model version or tenant group.\n\nHow it works. Query the same name you upserted into.\n\nOperational risk. Dev and prod sharing one index."
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "Can I put passwords in a vector DB?",
      "a": "Definition. No. Similarity is not access control, and embeddings can leak meaning.\n\nHow it works. Store secrets in a vault. Filter vectors by authz in the app.\n\nOperational risk. Embedding an internal HR dump with no filter."
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "How does delete work?",
      "a": "Definition. Remove the vector when you remove or replace the source file.\n\nHow it works. delete by source_id. Re-embed the new version.\n\nOperational risk. Stale chunks still cited as policy."
    },
    {
      "id": 19,
      "level": "advanced",
      "q": "What is a reranker?",
      "a": "Definition. A second model that scores the top-k more carefully.\n\nHow it works. Retrieve 20 cheaply, rerank to 5, then prompt.\n\nOperational risk. Reranking 200 chunks on every keystroke."
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "Does a vector DB replace Elasticsearch?",
      "a": "Definition. Not always. Keyword search still wins on exact strings and facets.\n\nHow it works. Many stacks run both or use a product that does hybrid.\n\nOperational risk. Dropping keyword search on day one."
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What dimension should I pick?",
      "a": "Definition. Whatever the embedding model outputs. You do not pick a random number.\n\nHow it works. text-embedding-3-small is 1536 unless you set a smaller dim the API supports.\n\nOperational risk. Truncating a vector by hand and keeping the same index."
    },
    {
      "id": 22,
      "level": "advanced",
      "q": "How do you multi-tenant safely?",
      "a": "Definition. tenant_id on every row and a mandatory filter (or a namespace per tenant).\n\nHow it works. Tests that user A cannot retrieve user B's chunks.\n\nOperational risk. A default empty filter."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "Where do you keep the original file?",
      "a": "Definition. Object storage (S3) plus a SQL row. The vector is an index.\n\nHow it works. Download the PDF from S3. Search via vectors.\n\nOperational risk. The vector store as the only copy of a contract."
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is similarity search used for besides RAG?",
      "a": "Definition. Duplicate detection, recommendations, image search, clustering.\n\nHow it works. Same nearest-neighbor idea, different payload.\n\nOperational risk. Using cosine on vectors that were never normalized when the metric assumes it."
    },
    {
      "id": 25,
      "level": "advanced",
      "q": "HNSW in one sentence?",
      "a": "Definition. A graph index for ANN: walk neighbors to get close fast.\n\nHow it works. Build is memory-heavy. Query is fast. Recall depends on ef/M settings.\n\nOperational risk. Default build on a laptop then surprise RAM in prod."
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "How do you update one paragraph?",
      "a": "Definition. Delete the old chunk ids for that section, embed the new text, upsert.\n\nHow it works. Stable ids help: fileId:chunk:12.\n\nOperational risk. Upsert with a new id and leaving the old vector."
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "Why same model on query and insert?",
      "a": "Definition. Distance is only meaningful in one embedding space.\n\nHow it works. One model name in config for both paths.\n\nOperational risk. A nightly job on model A and an API on model B."
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "What goes in the LLM prompt?",
      "a": "Definition. System rule + retrieved chunks + the question. Ask it to cite and to say when the context is missing.\n\nHow it works. Cap characters. Put the question last or clearly marked.\n\nOperational risk. Unbounded dump of 30 chunks."
    },
    {
      "id": 29,
      "level": "advanced",
      "q": "How do you keep it fresh?",
      "a": "Definition. Ingest pipeline on upload. Queue re-embed. Version collections.\n\nHow it works. File webhook → chunk → embed → upsert. Delete on remove.\n\nOperational risk. A folder that changed six months ago and an index that did not."
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "How do you explain this in a system-design interview?",
      "a": "Definition. Docs in S3, metadata in SQL, embeddings in pgvector or Pinecone, app does RAG.\n\nHow it works. Draw chunk → embed → store, and query → embed → top-k → LLM.\n\nOperational risk. Drawing only the LLM and no retrieval path."
    }
  ]
};
