# 13 — Git Branching, Collaboration & Branch Reuse

> Status: MANDATORY & ACTIVE  
> Skill reference: [`.agents/skills/git-branch-workflow/SKILL.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/.agents/skills/git-branch-workflow/SKILL.md)

---

## 1. Naming Convention
- Tên nhánh phải có ý nghĩa trực tiếp với task hoặc màn hình đang làm: `<type>/<screen-or-module-slug>`.
- Định dạng: Viết thường, `kebab-case`, tối đa 30–40 ký tự.
- Tiền tố hợp lệ: `feat/`, `fix/`, `refactor/`, `chore/`.
- Cấm đặt tên chung chung, vô nghĩa (`test`, `new`, `temp`), hoặc quá dài.

## 2. Inviolable Rule: Single Feature Branch Lifecycle (Tái Sử Dụng Nhánh)
- Mỗi màn hình hoặc task chỉ sở hữu **đúng 1 nhánh duy nhất**.
- Khi màn hình đó cần chỉnh sửa, bổ sung tính năng, hoặc sửa lỗi theo phản hồi nghiệm thu: **Bắt buộc quay lại đúng nhánh đó** (`git checkout <branch>`) để bổ sung commit.
- **Tuyệt đối không tạo nhánh mới** (`-fix`, `-v2`, `-part2`) gây phân mảnh và rối loạn lịch sử.
- Chỉ xóa nhánh sau khi PR đã được merge hoàn tất vào nhánh `main`.

## 3. Commit & Sync Protocol
- Tuân thủ Conventional Commits: `<type>(<scope>): <description>`.
- Luôn rebase hoặc pull code mới nhất từ `main` trước khi push để tránh xung đột chéo giữa các màn hình.
- Không bao giờ commit file nhạy cảm (`.env`), credentials, hoặc build artifacts (`dist`, `node_modules`).
