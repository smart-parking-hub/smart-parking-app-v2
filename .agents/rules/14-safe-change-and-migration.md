# 14 — Safe Change and Parallel Migration
- Legacy frontend remains available as a behavioral reference until approved cutover.
- Do not edit/delete legacy code unless explicitly in task scope.
- Maintain a screen/feature parity matrix.
- New and old implementations must not unintentionally share mutable session state or conflicting routes.
- Cutover requires product/technical approval, acceptance evidence, monitoring and rollback plan.
- Mark parity gaps as blockers, approved differences or deferred scope.
