# 11 — Performance and Resilience
- Measure before optimizing.
- Lazy-load route-level modules when it improves initial load.
- Avoid unbounded lists; use server pagination or virtualization when supported and needed.
- Handle slow networks, retries and cancellation through the query/client layer.
- Avoid duplicate requests and excessive global state subscriptions.
- Track bundle size and important web vitals after baseline exists.
