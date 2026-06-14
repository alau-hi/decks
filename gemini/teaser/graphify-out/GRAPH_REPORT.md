# Graph Report - teaser  (2026-06-14)

## Corpus Check
- 1 files · ~3,433,074 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 6 nodes · 5 edges · 2 communities (1 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce22390a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 2 edges
2. `dev` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (2 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.50
Nodes (3): description, name, version

## Knowledge Gaps
- **4 isolated node(s):** `name`, `version`, `description`, `dev`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.400) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._