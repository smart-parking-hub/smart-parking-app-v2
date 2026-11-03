# Dependency Rules

| From | May depend on | Must not depend on |
|---|---|---|
| app | layouts, features, entities, shared | n/a |
| layouts | shared, approved app contracts | feature internals |
| features | entities, shared, own feature internals | another feature's private files |
| entities | shared primitives/types if needed | features |
| shared | external libraries, shared internals | entities, features, layouts |

Use explicit public exports for cross-feature access. Keep shared code domain-agnostic. If a dependency cannot fit, document the reason and propose an ADR rather than hiding it in aliases.
