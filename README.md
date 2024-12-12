# Outer Rim Project

Outer Rim is a single user microblog server for the Activity Pub protocol
(a.k.a. FediVerse), running on the Deno ecosystem. Inspired by the likes of
[Microblog.pub][mbp01], [GoToSocial][gts01], and [Hollo.social][hol01].

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

# Etymology

The name 'Outer Rim' is inspired by the territories on Star Wars universe, where
small planets thrive without any large faction holding power over it.

Sure, it may be home for pirates and smugglers, but it is also where the Rebel
Alliance stood ground against the authoritarian regime of the Empire.

[mbp01]: https://github.com/tsileo/microblog.pub
[gts01]: https://gotosocial.org/
[hol01]: https://docs.hollo.social/
