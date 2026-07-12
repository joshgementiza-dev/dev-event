---
description: Create a UI component using TDD (test-driven development)
allowed-tools: Read, Write, Edit, Glob, Bash(npm test:*), Bash(npx vitest:*)
argument-hint: [Brief description]
---

## User Input

The user has provided information about the component to make: **$ARGUMENTS**

## Do This First:

From the component information above, determine a PascalCase component name (e.g., "a card showing user stats" → `UserStatsCard`).

### 1. Create Component

- `components/[ComponentName]/[ComponentName].tsx`
- `components/[ComponentName]/[ComponentName].module.css`
- `components/[ComponentName]/index.ts` → `export { default } from './[ComponentName]'`

Conventions: no semicolons, CSS Modules, theme colors from globals.css when needed.

### 2. Add to Preview Page

Update `app/(public)/preview/page.tsx` with a labeled section showing the component.

## Rules

- Keep tests minimal
- Only proceed when current step passes
