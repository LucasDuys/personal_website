export interface PipelineStage {
  id: string;
  label: string;
  sublabel: string;
  detail: string;
}

export const RAG_PIPELINE: PipelineStage[] = [
  { id: 'ingest', label: 'Ingest', sublabel: 'connector sync', detail: 'Connector sync (Drive / Slack / Notion / GitHub), incremental, ACL-aware' },
  { id: 'chunk', label: 'Chunk', sublabel: 'semantic + overlap', detail: 'Dual strategy: semantic + overlap, 512-token chunks, 50-token overlap' },
  { id: 'embed', label: 'Embed', sublabel: 'pgvector / halfvec', detail: 'Batched embeddings stored in Postgres pgvector (HNSW), retries + backoff' },
  { id: 'retrieve', label: 'Retrieve', sublabel: 'vector + BM25', detail: 'Hybrid search: pgvector RPC + BM25, top-K 20 each, 40 candidates' },
  { id: 'fuse', label: 'Fuse', sublabel: 'reciprocal rank fusion', detail: 'Weighted RRF, k=60, w_vector 0.6 / w_bm25 0.4, output top 5 chunks' },
  { id: 'generate', label: 'Generate', sublabel: 'LLM + sources', detail: 'LLM answer generation with source citations, streamed, model-agnostic' },
];

export const AGENT_RUNTIME: PipelineStage[] = [
  { id: 'agent', label: 'Agent', sublabel: 'governed identity', detail: 'A governed AI agent acts under its own identity, never above the user' },
  { id: 'permissions', label: 'Permissions', sublabel: 'same as a person', detail: 'Inherits a role: same permissions and consent as a human, least privilege' },
  { id: 'connectors', label: 'Connectors', sublabel: 'mounted, ACL-aware', detail: 'Drive / Slack / Notion / GitHub / Gmail / Postgres, ACL pre-filter + post-check' },
  { id: 'gate', label: 'Gate', sublabel: 'autonomy spectrum', detail: 'Task, decision, autonomous: per-run guardrails, wall-clock + token budgets' },
  { id: 'act', label: 'Act', sublabel: 'read / write', detail: 'Connector read + governed write, every action written to the audit chain' },
];
