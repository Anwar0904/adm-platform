# Cleanup candidates

Candidates are evidence requests, not deletion instructions. Each requires ownership confirmation, reference search, and a successful clean build before removal.

| Candidate | Evidence needed | Recommendation |
| --- | --- | --- |
| Dependencies in `package.json` | Use/import scan including scripts, CSS/PostCSS plugins, dynamic imports, and framework conventions; compare production bundle and lockfile. | No dependency removed. Review with `npm ls` and current audit under Node 22. |
| Legacy auth validators/services | Search API/client imports and migration compatibility; test old sessions and existing DB records. | Retain until compatibility tests establish dead code. |
| Media `publicId` field/index | Inspect production collection indexes and all old records/providers using a backup. | Do not drop or recreate automatically. Prepare separately reviewed migration. |
| Existing `src/components/portfolio-experience/**` | Confirm current public page usage and approved design scope. | Retain; these components are in the active portfolio experience. |
| Existing portfolio sections and docs | Validate routes/import references and content ownership. | Retain; no orphan evidence. |
| `src/app/api/seed/roles/route.ts` | Confirm operational use, local workflow, and environment guards. | Keep production disabled; do not delete or execute without owner signoff. |
| Build output, uploads, environment files, and generated assets | Establish ownership, retention, backup, and whether file is tracked. | Never bulk-delete from this review. Do not expose or copy secrets. |

No candidate met the proof threshold for deletion in this pass.
