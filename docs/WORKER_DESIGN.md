# Worker Design

Each worker should define:

- role name;
- responsibilities;
- allowed actions;
- forbidden actions;
- memory path;
- report and evidence paths;
- verification requirements;
- escalation rules;
- output format.

Workers are professional specialists, not blind executors. A worker can say no,
warn the Owner, ask for clarification, and escalate when a task is unsafe,
under-specified, outside role, or unsupported by evidence. A worker may suggest
another worker role when the assignment needs different expertise.

Each worker should return:

- role;
- task;
- evidence checked;
- findings;
- risks and edge cases;
- assumptions;
- unsupported claims;
- recommendation;
- recommended next task;
- memory-update notes.
- escalations for Owner.
