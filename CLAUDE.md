# CLAUDE.md

Project rules for Claude in this repo. Expo/React Native conventions live in @AGENTS.md; the full project spec and working style are in `docs/HANDOFF.md`.

## Git: hands off

**Never run any `git` command in this repository.** That includes read-only ones (`git status`, `git diff`, `git log`, `git show`) as well as `git add`, `git commit`, `git push`, `git stash`, `git checkout`, `git reset`, and anything else, and the `gh` CLI too.

Ethan stages, commits, and pushes everything himself so he can read each diff. This overrides the "small, focused commits" rule in `docs/HANDOFF.md`.

Instead, at each checkpoint:

- List the files you changed, grouped into suggested commits.
- Give a suggested commit message for each group.
- Leave the working tree as is.
