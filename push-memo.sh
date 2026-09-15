#!/bin/bash
set -e
export PATH="$HOME/.local/bin:$PATH"
cd ~/trust-pair2
git add -A
git commit --no-edit -F .git/COMMIT_MSG_TMP
rm -f .git/COMMIT_MSG_TMP
GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push github main
echo "--- result ---"
git log --oneline -2 | cat
