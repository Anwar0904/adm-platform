---
name: grounded-coding-workflow
description: 'Use for repository coding tasks that require focused exploration, minimal edits, and executable validation. Guides bug fixes, feature work, refactors, and reviews with a local hypothesis, narrow checks, and concise progress reporting.'
argument-hint: 'Describe the coding task, target file or behavior, and any failing check.'
---

# Grounded Coding Workflow

## Outcome

Deliver a small, reviewable repository change whose behavior is supported by a focused executable check. Preserve unrelated user changes and keep the user informed of meaningful discoveries, edits, and validation results.

## Procedure

1. **Route to the owning code.** Start from the most concrete anchor available: a named file, symbol, failing behavior, command, test, or nearby implementation. Read only enough local context to identify the code that directly decides the behavior. If the anchor only forwards or registers data, follow one hop to the controlling implementation.
2. **Form a falsifiable hypothesis.** State internally what is likely wrong or missing, which local code path supports that conclusion, and the cheapest check that could disconfirm it. Stop exploring once one plausible hypothesis, discriminating check, and small reversible edit are available.
3. **Check local rules.** Before editing, load applicable repository instructions and inspect nearby conventions, tests, and call sites. Account for existing working-tree changes; never revert unrelated edits.
4. **Make the smallest edit.** Preserve public APIs and local style. Prefer existing helpers and abstractions. Add tests when the behavior or contract warrants them, but do not broaden unrelated cleanup. Use the workspace editing tools rather than shell write commands.
5. **Validate immediately.** After the first substantive edit, run the narrowest executable check that can falsify the hypothesis: a focused test, behavior check, typecheck, lint, or build for the touched slice. Do not resume broad exploration before this check.
6. **Iterate locally.** If validation fails and confirms the hypothesis, repair the same slice and rerun the same check. If it falsifies the hypothesis, take one nearby hop to the more direct controller and revise the hypothesis. If it is ambiguous, inspect one nearby test or call site, then choose between local repair and that one-hop move.
7. **Finish with evidence.** Run at least one post-edit executable validation whenever available. Review the resulting diff for scope and unintended changes. Report changed files, validation commands and outcomes, and any remaining test gaps or blockers.

## Decision Rules

- If the request is a question or brainstorming, explain the approach without editing.
- If a concrete change is requested, act after the local-routing budget is met; do not map the whole repository first.
- If no focused executable check exists, use the smallest available compile, lint, or build check; only use diff inspection when commands are unavailable.
- If a required decision is genuinely ambiguous, ask one concise question with the relevant choices. Otherwise choose the option most consistent with local code and state the assumption.
- Treat user edits and generated changes as authoritative unless they directly block the requested work.
- Do not commit, create branches, or perform destructive git operations unless explicitly requested.

## Progress Updates

Keep updates short and useful:

- Before exploration: name the anchor and what evidence is being gathered.
- Before editing: state the local hypothesis and intended small change.
- After validation: state the command and whether it supports or changes the hypothesis.
- At completion: summarize the result, touched files, checks run, and residual risk.

Avoid narrating every tool call or making claims not supported by a check.
