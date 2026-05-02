#!/usr/bin/env python3
"""
Jaccard clustering for beliefs-candidates.md entries.
Inspired by agentic-stack's dream-cycle Jaccard similarity approach.

Dual-layer approach:
1. Word-level Jaccard (CJK bigrams + latin words) for textual overlap
2. Concept-level tagging for thematic overlap (catches semantic duplicates)

Usage: python3 beliefs-cluster.py [--threshold 0.2] [--file path/to/beliefs-candidates.md]
"""

import re
import sys
import argparse
from collections import defaultdict
from pathlib import Path

STOP_WORDS = {
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
    'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than',
    'too', 'very', 'just', 'because', 'if', 'when', 'while', 'that',
    'this', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our',
    'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them',
    'their', 'what', 'which', 'who', 'whom', 'how', 'where', 'why',
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
    '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着',
    '没有', '看', '好', '自己', '这', '他', '她', '它', '吗', '吧',
    '把', '被', '让', '但', '而', '或', '如果', '因为', '所以',
    'gradient', '行为改变', 'pattern', 'luna', '第', '首次', '次',
}

# Concept keywords → thematic tag. Entries sharing concepts cluster semantically.
CONCEPT_KEYWORDS = {
    'pr': 'pr-workflow', 'merge': 'pr-workflow', 'review': 'pr-workflow',
    'test': 'testing', 'verify': 'testing', 'validate': 'testing',
    '验证': 'testing', '测试': 'testing',
    'dogfood': 'dogfood', '自己用': 'dogfood',
    'subagent': 'subagent', 'acp': 'subagent', 'spawn': 'subagent',
    'flowforge': 'tooling', 'workflow': 'tooling', 'workloop': 'tooling',
    'heartbeat': 'heartbeat', 'cron': 'scheduling',
    '讨好': 'pleasing', '打勾': 'pleasing',
    '跳过': 'skipping', '裸干': 'skipping',
    'blocked': 'passive-waiting',
    'workaround': 'root-cause',
    'maintainer': 'oss-etiquette', '添乱': 'oss-etiquette',
    'todo': 'todo-tracking', '待办': 'todo-tracking',
    'wiki': 'knowledge', '笔记': 'knowledge',
    '汇报': 'reporting', '通知': 'reporting', '告诉': 'reporting',
    '日记': 'writing', '故事': 'writing',
    '承诺': 'commitment', '说了': 'commitment',
}


def parse_entries(filepath: Path) -> list[dict]:
    """Parse beliefs-candidates.md into structured entries."""
    text = filepath.read_text(encoding='utf-8')
    entries = []
    lines = text.split('\n')
    current_entry = None

    for line in lines:
        m = re.match(r'^- (~~)?(\d{4}-\d{2}-\d{2}):\s*(.*)', line)
        if m:
            if current_entry:
                entries.append(current_entry)
            current_entry = {
                'date': m.group(2),
                'text': m.group(3).rstrip('~~'),
                'struck': bool(m.group(1)),
                'raw': line,
            }
        elif current_entry and line.startswith('  ') and not line.startswith('## '):
            current_entry['text'] += ' ' + line.strip()
            current_entry['raw'] += '\n' + line
        else:
            if current_entry:
                entries.append(current_entry)
                current_entry = None

    if current_entry:
        entries.append(current_entry)

    return entries


def extract_pattern_tag(text: str) -> str | None:
    m = re.search(r'\(pattern:\s*([^,)]+)', text)
    return m.group(1).strip() if m else None


def extract_concepts(text: str) -> set[str]:
    """Extract thematic concept tags from entry text."""
    concepts = set()
    text_lower = text.lower()
    for keyword, concept in CONCEPT_KEYWORDS.items():
        if keyword in text_lower or keyword in text:
            concepts.add(f'C:{concept}')
    return concepts


def tokenize(text: str) -> set[str]:
    """Tokenize: latin words + CJK bigrams + concept tags."""
    text_clean = re.sub(r'`[^`]*`', '', text)
    text_clean = re.sub(r'"[^"]*"', '', text_clean)
    text_clean = re.sub(r'\(pattern:[^)]*\)', '', text_clean)
    text_clean = re.sub(r'\(.*?第\d+次.*?\)', '', text_clean)
    text_clean = re.sub(r'~~', '', text_clean)
    text_clean = re.sub(r'\[.*?\]', '', text_clean)

    tokens = set()

    for word in re.findall(r'[a-zA-Z_-]{3,}', text_clean.lower()):
        if word not in STOP_WORDS:
            tokens.add(word)

    cjk_chars = re.findall(r'[\u4e00-\u9fff]', text_clean)
    for i in range(len(cjk_chars) - 1):
        bigram = cjk_chars[i] + cjk_chars[i + 1]
        if bigram not in STOP_WORDS:
            tokens.add(bigram)

    # Concept tags boost thematic similarity
    tokens.update(extract_concepts(text))

    return tokens


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def cluster_entries(entries: list[dict], threshold: float) -> list[tuple[list[int], float]]:
    """Single-linkage clustering with average similarity tracking."""
    n = len(entries)
    token_sets = [tokenize(e['text']) for e in entries]

    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py

    # Store all similarities for reporting
    sims = {}
    for i in range(n):
        for j in range(i + 1, n):
            sim = jaccard(token_sets[i], token_sets[j])
            if sim >= threshold:
                sims[(i, j)] = sim
                union(i, j)

    clusters = defaultdict(list)
    for i in range(n):
        clusters[find(i)].append(i)

    result = []
    for indices in clusters.values():
        if len(indices) >= 2:
            # Average pairwise similarity within cluster
            pair_sims = []
            for i_idx, ii in enumerate(indices):
                for jj in indices[i_idx + 1:]:
                    key = (min(ii, jj), max(ii, jj))
                    pair_sims.append(sims.get(key, 0.0))
            avg_sim = sum(pair_sims) / len(pair_sims) if pair_sims else 0.0
            result.append((indices, avg_sim))

    result.sort(key=lambda x: -x[1])
    return result


def concept_analysis(entries: list[dict]) -> dict[str, list[int]]:
    """Group entries by shared concept tags (thematic clusters)."""
    concept_groups = defaultdict(list)
    for i, e in enumerate(entries):
        concepts = extract_concepts(e['text'])
        for c in concepts:
            concept_groups[c].append(i)
    return {k: v for k, v in concept_groups.items() if len(v) >= 3}


def main():
    parser = argparse.ArgumentParser(description='Jaccard clustering for beliefs-candidates')
    parser.add_argument('--file', '-f', default=str(Path.home() / '.openclaw/workspace/beliefs-candidates.md'))
    parser.add_argument('--threshold', '-t', type=float, default=0.15,
                        help='Jaccard similarity threshold (default: 0.15)')
    parser.add_argument('--show-tokens', action='store_true')
    parser.add_argument('--include-struck', action='store_true')
    parser.add_argument('--concepts', action='store_true',
                        help='Show concept-level thematic analysis')
    args = parser.parse_args()

    filepath = Path(args.file)
    if not filepath.exists():
        print(f"Error: {filepath} not found", file=sys.stderr)
        sys.exit(1)

    entries = parse_entries(filepath)
    if not args.include_struck:
        active = [(i, e) for i, e in enumerate(entries) if not e.get('struck')]
        active_entries = [e for _, e in active]
    else:
        active_entries = entries

    print(f"📊 Beliefs Candidates Cluster Analysis")
    print(f"   Total entries: {len(entries)}")
    print(f"   Active (non-struck): {len(active_entries)}")
    print(f"   Threshold: {args.threshold}")
    print()

    # Pattern tag stats
    pattern_groups = defaultdict(list)
    untagged = 0
    for i, e in enumerate(active_entries):
        tag = extract_pattern_tag(e['text'])
        if tag:
            pattern_groups[tag].append(i)
        else:
            untagged += 1

    print(f"📌 Pattern tags: {len(pattern_groups)} unique, {untagged} entries untagged")
    multi = {k: v for k, v in pattern_groups.items() if len(v) >= 2}
    if multi:
        for tag, indices in sorted(multi.items(), key=lambda x: -len(x[1])):
            print(f"   [{len(indices)}x] {tag}")
    print()

    # Concept analysis
    if args.concepts:
        cgroups = concept_analysis(active_entries)
        if cgroups:
            print("🏷️  Concept Clusters (thematic grouping, 3+ entries)")
            print("=" * 60)
            for concept, indices in sorted(cgroups.items(), key=lambda x: -len(x[1])):
                print(f"\n  {concept} ({len(indices)} entries)")
                for idx in indices[:5]:
                    e = active_entries[idx]
                    tag = extract_pattern_tag(e['text'])
                    tag_str = f" [{tag}]" if tag else ""
                    display = e['text'][:90] + ('...' if len(e['text']) > 90 else '')
                    print(f"    [{e['date']}]{tag_str} {display}")
                if len(indices) > 5:
                    print(f"    ... and {len(indices) - 5} more")
            print()

    # Jaccard clusters
    clusters = cluster_entries(active_entries, args.threshold)

    if not clusters:
        print("✅ No word-overlap clusters found at this threshold.")
        if not args.concepts:
            print("   Try --concepts for thematic analysis, or lower --threshold")
        return

    novel = []
    tagged = []
    for indices, avg_sim in clusters:
        tags = set()
        for idx in indices:
            tag = extract_pattern_tag(active_entries[idx]['text'])
            if tag:
                tags.add(tag)
        if len(tags) <= 1 and all(extract_pattern_tag(active_entries[idx]['text']) for idx in indices):
            tagged.append((indices, avg_sim, tags))
        else:
            novel.append((indices, avg_sim, tags))

    print(f"🔍 Jaccard Clusters: {len(clusters)} total")
    print(f"   ⚡ {len(novel)} novel/cross-pattern (actionable)")
    print(f"   ✅ {len(tagged)} already share same tag")
    print()

    if novel:
        print("=" * 60)
        print("⚡ NOVEL CLUSTERS — potential duplicates or missing tags")
        print("=" * 60)
        for ci, (indices, avg_sim, tags) in enumerate(novel, 1):
            print(f"\n--- Cluster {ci} (n={len(indices)}, avg_sim={avg_sim:.2f}) ---")
            if tags:
                print(f"    Partial tags: {', '.join(tags)}")

            if args.show_tokens:
                token_sets = [tokenize(active_entries[idx]['text']) for idx in indices]
                shared = token_sets[0]
                for ts in token_sets[1:]:
                    shared = shared & ts
                if shared:
                    print(f"    Shared: {', '.join(sorted(shared)[:12])}")

            for idx in indices:
                e = active_entries[idx]
                display = e['text'][:120] + ('...' if len(e['text']) > 120 else '')
                print(f"  [{e['date']}] {display}")

    # Graduation candidates: entries with 3+ occurrences of same pattern
    print()
    print("=" * 60)
    print("🎓 GRADUATION CANDIDATES (pattern repeated 3+ times)")
    print("=" * 60)
    grad_found = False
    for tag, indices in sorted(pattern_groups.items(), key=lambda x: -len(x[1])):
        if len(indices) >= 3:
            grad_found = True
            # Check if already struck (graduated)
            all_struck = all(active_entries[idx].get('struck') for idx in indices)
            status = " ✅ graduated" if all_struck else " ⬆️ READY TO UPGRADE"
            print(f"\n  [{len(indices)}x] {tag}{status}")
            for idx in indices:
                e = active_entries[idx]
                display = e['text'][:100] + ('...' if len(e['text']) > 100 else '')
                print(f"    [{e['date']}] {display}")
    if not grad_found:
        print("\n  No patterns at 3+ count yet.")


if __name__ == '__main__':
    main()
