<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Spotify playback in a single mounted player and use its official iframe API for controls; in-page anchor navigation must not recreate playback, and unsupported volume controls must not be simulated.

- Generate souvenir PNGs with the same full-resolution canvas renderer used for preview; keep all visitor inputs only in React state and read semantic palette tokens at render time.
- Keep interactive timeline and card tools in focused browser-safe components; the content route owns editorial sections and historical source links.
- Apply site theme through the document dark class without remounting tools; keep souvenir palette tokens fixed and independent so theme switching cannot change card exports or interrupt music.
