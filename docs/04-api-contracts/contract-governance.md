# API Contract Governance

For each endpoint record:
- service and owning backend module;
- method/path;
- authentication and required permissions;
- query/path parameters;
- request and response schemas;
- pagination/filter/sort semantics;
- error envelope and field validation shape;
- side effects and idempotency considerations;
- source (OpenAPI/controller/DTO/test);
- last verified commit/date.

Never derive contracts from frontend mock data alone. If OpenAPI conflicts with implementation, record CONFLICT and ask backend owner to resolve.
