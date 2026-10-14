# EverList directory badge

The shared footer renders EverList's dark HTML badge on all 11 existing routes.
The markup and colors come from the approved Asphalt Calculator listing's
founder dashboard, inspected on 15 October 2026. The badge is local HTML and
CSS and requires no external image, stylesheet, script, or broader CSP rule.

The reciprocal link points to
`https://everlist.dev/tools/asphalt-calculator` and retains `noopener noreferrer`
for new-tab safety. It contains no `nofollow`, `sponsored`, or `ugc` qualifier.
The dashboard offers no additional badge-verification action. The existing
EverList listing's outbound links likewise contained no `nofollow` qualifier
when inspected; this does not establish search-engine indexing or rankings.

The website audit checks that every route server-renders exactly one accessible
and followable badge link. Browser verification covers desktop and mobile
footers and both existing calculator workflows.

Rollback: revert the badge commit or restore the prior production deployment
`dpl_9hh2NE9k8qAhLgAczyNNuwddruF1`, based on
`e974e30fa183babb89166f3e106fdb1ede0752e8`, and recheck the canonical domain.
