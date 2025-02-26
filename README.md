# Outer Rim Project

Outer Rim is a single user microblog server for the Activity Pub protocol
(a.k.a. FediVerse), running on the Deno ecosystem. Inspired by the likes of
[Microblog.pub][mbp01], [GoToSocial][gts01], and [Hollo.social][hollo01].

## Objectives

- Aggressively lightweight
- Somewhat compliant with Mastodon API

## Mastodon API Progress

- [x] Auth
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

# Development

## Stack:

- Frontend: [Preact][preact01] + [Bulma CSS][bulma01]
- Backend: Deno + [Fresh][fresh01]
- Federation: [Fedify][hollo02]
- Auth: [OAuth2-Server][github02]
- Database: [Drizzle-ORM][drizzle01] + [LibSQL][libsql] (possibly Postgres)

## Preparing Dev Environment

The only dependency for the project is [Deno][deno01]. You may need Nodejs to
run drizzle-kit for now (see [bug report][github01]).

There's also a devcontainer to setup a complete dev environment

1. Install [Podman][podman01]
   - Docker may also work, but you'll need to change some args on
     `devcontainer.json`
2. Install [Devpod CLI][devpod01]
   - Devpod Desktop (GUI) will also work. See documentation for next steps
3. Install [Podman Provider][devpod02] for devpod:
   `devpod provider add babeloff/devpod-provider-podman`
4. Create a container:
   `devpod up --provider podman https://github.com/thiagojedi/outer-rim`

See [devpod's documentation][devpod03] to setup your preferred IDE.

## Environment Variables

Example of `.env` file:

```shell
DB_CONNECTION="file:./local.db"
```

# Etymology

The name 'Outer Rim' is inspired by the territories on Star Wars universe, where
small planets thrive without any large faction holding power over it.

Sure, it may be home for pirates and smugglers, but it is also where the Rebel
Alliance stood ground against the authoritarian regime of the Empire.

[bulma01]: https://bulma.io
[deno01]: https://deno.land
[devpod01]: https://devpod.sh/docs/getting-started/install
[devpod02]: https://github.com/babeloff/devpod-provider-podman
[devpod03]: https://devpod.sh/docs/what-is-devpod
[drizzle01]: https://orm.drizzle.team
[fresh01]: https://fresh.deno.dev
[github01]: https://github.com/drizzle-team/drizzle-orm/issues/3509
[github02]: https://github.com/oauthjs/node-oauth2-server
[gts01]: https://gotosocial.org
[hollo01]: https://docs.hollo.social
[hollo02]: https://fedify.dev
[libsql]: https://turso.tech/libsql
[mbp01]: https://github.com/tsileo/microblog.pub
[podman01]: https://podman.io/docs/installation
[preact01]: https://preactjs.com
