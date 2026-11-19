// Permanently disable the legacy role seed. It deleted every role and recreated
// them with empty permission arrays. Use reviewed, per-role admin changes instead.
console.error(
  "Role seed disabled: this legacy command could delete existing roles and permissions."
);
process.exitCode = 1;
