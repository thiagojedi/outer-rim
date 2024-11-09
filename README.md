# Outer Ring Project

Outer Ring is a single user microblog server for the Activity Pub protocol
(a.k.a. FediVerse), running on the Deno ecosystem. Inspired by the likes of
[GoToSocial][gts01] and [Microblog.pub][mbp01].

## Objectives

- Aggressively lightweight
- Somewhat compliant with Mastodon API

## Stack:

- Frontend: Preact
- Backend: Fresh
- Federation: Fedify
- Auth: Auth.js
- Database: Drizzle-ORM (SQLite or Postgres)

# Mastodon API Progress

- [ ] Auth
- [ ] Profile
  - [ ] Follow
- [ ] Posts
  - [ ] Text
  - [ ] Poll
  - [ ] Media
- [ ] Timeline
  - [ ] Home
  - [ ] Local
  - [ ] Federated

---

[mbp01]: https://github.com/tsileo/microblog.pub
[gts01]: https://gotosocial.org/
