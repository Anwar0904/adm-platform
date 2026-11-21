# Deletion manifest

**No files, packages, database records, or production indexes were deleted by the security cleanup.**

| Proposed deletion | Evidence | Approval | Executed |
| --- | --- | --- | --- |
| None | No item met the required reference/ownership/behavior proof threshold. | Not applicable | No |

The runtime `ensurePublicIdIndex()` drop/create operation was removed from the media upload handler. This removes unsafe request-time DDL; it does not drop an existing database index. Review the existing index state from a nonproduction copy and prepare a separate migration if needed.
