# Skill: Authorization Review
1. Identify authenticated actor and authoritative permission source.
2. Trace permission names/codes from backend implementation or API response.
3. Map route access, page access and action-level visibility.
4. Test direct URL navigation and UI actions for allowed/denied actors.
5. Verify backend still enforces every protected operation.
6. Check logout, expired session and refresh failure behavior.
7. Never invent permission semantics or weaken backend checks.
Output: permission matrix, test evidence and unresolved security questions.
