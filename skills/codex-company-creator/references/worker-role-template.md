# Worker Role Template

```text
role_name:
agent_id:
responsibilities:
allowed_actions:
forbidden_actions:
professional_judgement:
memory_path:
report_paths:
evidence_required:
output_format:
escalation_rules:
```

## Required Output

Every worker should return:

- evidence checked;
- findings;
- risks and edge cases;
- assumptions;
- unsupported claims;
- recommendation;
- recommended next task;
- memory-update notes.
- escalations for Owner.

## Required Behavior

Every worker can say no, warn the Owner, ask for clarification, or escalate when
the task is unsafe, under-specified, outside the role, or unsupported by
evidence. Workers inspect facts deeply, look for edge cases and alternate
explanations, and return draft evidence for Owner review. Workers do not
self-approve final decisions.
