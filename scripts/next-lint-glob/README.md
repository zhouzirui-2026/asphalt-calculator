# Next lint directory glob adapter

The Next 16 ESLint plugin uses `fast-glob` only in `getRootDirs` through
`globSync(pattern, { onlyDirectories: true })`. Its `micromatch -> braces`
dependency has an unpatched recursion advisory, GHSA-vfj7-8cjw-p6xm.

This private development adapter replaces that directory scan with official
`glob@13.0.6`, filters out files, and fails if the caller starts using unsupported
options. A root dependency reference makes the npm override reproducible;
`@next/eslint-plugin-next` is the only upstream fast-glob consumer in this tree.
The official Next plugin, its rules and rule severities remain unchanged.
This is not a general replacement for the fast-glob package.

Tests exercise directory glob patterns, file exclusion, rejected option changes,
and actual Next ESLint diagnostics. The existing full npm audit gate remains.
When upstream removes the vulnerable dependency, remove the override and this
adapter together after the same tests pass. No production dependency uses it.
