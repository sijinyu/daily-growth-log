# Node.js 버전 요구사항

- **최소 Node 22+** 필수 (Vite 8 + rolldown의 `node:util.styleText` 배열 포맷)
- nvm 설치 경로: `$HOME/.nvm/nvm.sh`
- 사용법: `source "$HOME/.nvm/nvm.sh" && nvm use 22`
- `@rolldown/binding-darwin-arm64` devDependency로 명시 설치됨 (pnpm optional dep 호환 이슈)
- pnpm 사용 (corepack 경유)
