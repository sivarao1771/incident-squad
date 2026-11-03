# Incident Squad protocol

Shared rules every squad agent follows. Each role file in `switch/roles/` repeats the parts that role needs, so a role is self-contained when assumed in Switch.

## Roles

| Role | Exclusive | Job |
| --- | --- | --- |
| `incident-lead` | yes | Opens incidents, keeps the timeline, posts the final summary |
| `triage` | yes | Reproduces the bug, finds the root cause, writes a failing test |
| `fixer` | yes | Fixes the bug on a branch, opens the PR, merges after human approval |
| `reviewer` | yes | Reviews the PR, reruns tests, approves or sends it back |

Roles are addressed by name (`send_targeted_message` with `target_roles`), so handoffs reach whoever holds the role without hard-coding agent names.

## Incident IDs

Every incident gets an ID: `INC-<number>`, assigned by `incident-lead` (starting at `INC-1`). Every message about an incident starts with its ID in brackets, e.g. `[INC-3]`. This keeps several incidents readable in one room.

## Handoff flow

```
human reports bug
  └─> incident-lead  : opens INC-n, hands to triage
        └─> triage   : TRIAGE REPORT, hands to fixer
              └─> fixer    : FIX READY (PR link), hands to reviewer
                    └─> reviewer : REVIEW APPROVED -> asks humans to approve
                                   CHANGES REQUESTED -> back to fixer (max 2 rounds)
                          └─> human : "approve INC-n"
                                └─> fixer : merges, posts MERGED
                                      └─> incident-lead : INCIDENT SUMMARY
```

## Message formats

Keep messages short; people read them in Discord. Use these headers so the flow is easy to follow in the demo video.

- `[INC-n] TRIAGE REPORT`: symptom, how to reproduce, root cause (file:line), failing test added (branch + test name), suggested fix.
- `[INC-n] FIX READY`: PR link, one-line summary of the change, test result.
- `[INC-n] REVIEW APPROVED` or `[INC-n] CHANGES REQUESTED`: verdict, what was checked, specific requested changes.
- `[INC-n] MERGED`: PR link, merge commit.
- `[INC-n] INCIDENT SUMMARY`: what broke, impact, root cause, fix, time from report to merge, follow-ups.

## Hard rules

1. **Only a human can approve a merge.** A merge needs a message from a human participant (not an agent) saying `approve INC-n`. Agent approvals never count.
2. **Never push to `main`.** All changes go through a branch named `fix/INC-n-<short-slug>` and a PR.
3. **No force-push, no history rewrites, no deleting branches you did not create.**
4. **Stay in scope.** Fix the reported bug only. Note anything else as a follow-up.
5. **Tests must pass** (`npm test` and `npm run typecheck`) before handing off.
6. **When stuck, say so** in the room and address `incident-lead` rather than guessing.
7. **No stray @-mentions** in message bodies. Use `send_targeted_message` to address a role or person.
