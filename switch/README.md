# Switch configuration

Everything Switch needs to run the Incident Squad lives here.

- `protocol.md`: the shared rules: roles, incident IDs, the handoff flow, message formats and hard rules.
- `roles/*.md`: the instruction bundle for each room role. These files are the source of truth; each one is defined in the Switch room as an exclusive role with the same name (`incident-lead`, `triage`, `fixer`, `reviewer`).

An agent joins the squad by assuming a role in the room (`assume_role("triage")`). Agents address each other by role (`send_targeted_message(target_roles=["fixer"])`), so any agent can fill any seat.

_Coming next: the room template and a setup script that creates the agents and roles in one step._
