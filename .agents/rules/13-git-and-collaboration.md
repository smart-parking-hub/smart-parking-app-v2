# 13 — Git Branching, Collaboration & Branch Discipline

> Status: MANDATORY & ACTIVE  
> Skill reference: [`.agents/skills/git-branch-workflow/SKILL.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/.agents/skills/git-branch-workflow/SKILL.md)

---

## 1. Naming Convention
- Tên nhánh phải có ý nghĩa trực tiếp với task hoặc màn hình đang làm: `<type>/<screen-or-module-slug>`.
- Định dạng: Viết thường, `kebab-case`, tối đa 30–40 ký tự.
- Tiền tố hợp lệ:
  * `feat/<screen-slug>`: Triển khai màn hình hoặc tính năng mới.
  * `fix/<screen-slug>`: Vá lỗi trên màn hình hoặc sửa lỗi quy mô lớn.
  * `docs/<topic-slug>`: Cập nhật tài liệu, README, governance độc lập.
  * `chore/<topic-slug>`: Cấu hình linter, dependencies, tooling, CI/CD.
  * `refactor/<screen-slug>`: Tối ưu cấu trúc code mà không đổi giao diện.
- Cấm đặt tên chung chung, vô nghĩa (`test`, `new`, `temp`), hoặc quá dài.

---

## 2. Quy Tắc Tách Nhánh Docs & Tooling (Separation of Concerns)

> [!CRITICAL]
> **Tuyệt đối KHÔNG push các thay đổi tài liệu (Docs) hoặc cấu hình không liên quan vào feature branch đang làm.**
> - Khi sửa tài liệu (`docs/`, `README.md`, `AGENTS.md`, rules, skills) hoặc cấu hình dự án (`eslint`, build tools): BẮT BUỘC tạo nhánh riêng (`docs/<topic>` hoặc `chore/<topic>`) hoặc push vào `main`.
> - Feature branch (`feat/*`) chỉ được chứa thuần túy mã nguồn (`src/features/...`, router, tests liên quan) của đúng tính năng đó.

---

## 3. Quy Tắc Ngưỡng "Fix Quá Nhiều" (Major Fix Branching Threshold)

- **Chỉnh sửa nhỏ (Minor tweaks):** Khi sửa lỗi nhỏ, chỉnh padding/color, tinh chỉnh theo feedback nghiệm thu ngay trong task -> Quay lại đúng nhánh feature (`git checkout feat/<screen-slug>`) để commit tiếp.
- **Khi Fix quá nhiều (Major Overhaul):**
  * Nếu phát sinh **từ 3 lỗi logic nghiệp vụ trở lên**, hoặc phải **thay đổi > 30% cấu trúc file**, hoặc việc sửa lỗi có nguy cơ gây ảnh hưởng chéo -> **BẮT BUỘC TẠO HẲN MỘT NHÁNH MỚI TỪ MAIN** (ví dụ: `fix/<screen-slug>-overhaul`).
  * Tránh việc lặp đi lặp lại nhảy vào từng nhánh cũ để sửa chắp vá, làm rác lịch sử commit và gây khó khăn khi deploy/rollback.
  * Nhánh fix này sau khi kiểm thử đạt chuẩn Zero-Error/Zero-Warning sẽ được merge trực tiếp vào `main`.

---

## 4. Commit & Sync Protocol
- Tuân thủ Conventional Commits: `<type>(<scope>): <description>`.
- Luôn rebase hoặc pull code mới nhất từ `main` trước khi push để tránh xung đột chéo giữa các màn hình.
- Không bao giờ commit file nhạy cảm (`.env`), credentials, hoặc build artifacts (`dist`, `node_modules`).
