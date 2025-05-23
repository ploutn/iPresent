---
description:
globs:
alwaysApply: false
---

# Package Management Rule: pnpm Only

This project **must** use [pnpm](https://pnpm.io/) for all package management tasks (installing, updating, removing dependencies, running scripts, etc.).

- Do **not** use npm or yarn for any package management operations.
- The lockfile is [`pnpm-lock.yaml`](mdc:pnpm-lock.yaml).
- Setup and usage instructions are in [`README.md`](mdc:README.md).

## Common Commands

- Install dependencies: `pnpm install`
- Run development server: `pnpm dev`
- Build for production: `pnpm build`
- Run Electron app: `pnpm run electron`

See [`README.md`](mdc:README.md) for more details.
