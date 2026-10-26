// Source: the resume linked from the site (SITE.resume). Feeds search metadata, structured data and llms.txt.
// The phone number is deliberately left out: it would end up in public search data.

export const PROFILE = {
  // Spellings people may search for, including the GitHub handle.
  alternateNames: ["Siddharth Reddy", "N. Siddharth Reddy", "Siddharth Reddy N", "siddreddy07"],
  city: "Visakhapatnam",
  region: "Andhra Pradesh",
  country: "IN",
  summary:
    "Full Stack Developer working with React, Next.js, Node.js, and databases like MongoDB and PostgreSQL. I've built and shipped web applications during internships and through personal projects, with recent work focused on AI agents, RAG, browser automation, and developer tools.",
  focus: ["AI agents", "RAG", "Browser automation", "Developer tools", "Backend systems"],
  education: {
    school: "Andhra University College of Engineering",
    schoolUrl: "https://www.andhrauniversity.edu.in/",
    degree: "B.Tech in Computer Science and Engineering",
    start: "2021-12",
    end: "2025-04",
    grade: "CGPA 7.99 / 10.0",
  },
  // Internship dates as ISO months, keyed by company name in experience.json.
  roleDates: {
    TEN: { start: "2025-01", end: "2025-05" },
    "reaidy.io": { start: "2024-08", end: "2024-10" },
  } as Record<string, { start: string; end: string }>,
  // Resume projects without a page on the site.
  extraProjects: [
    {
      name: "SIFT — Multimodal AI Search",
      tags: ["LlamaIndex", "LlamaParse", "Cohere Embeddings", "Pinecone", "Node.js"],
      desc: "Multimodal RAG pipeline that ingests PDFs, images and web content and answers questions from retrieved context, with parsing, chunking, embeddings, vector indexing and metadata-aware retrieval with source traceability.",
    },
  ],
};
