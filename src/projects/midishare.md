A peer-to-peer web application piano teachers and students use to share their keyboard inputs in near real time.

Midishare is a TypeScript monorepo of my own design, the key components being:
1. **Client**: `typescript`, `react`, `tailwindcss`, and `react-query`
1. **Server**: `typescript`, `node.js`, `express`, `sqlite`
1. **Keyboard**: Internal NPM package wrapping the keyboard component used by the Client SPA. `typescript`, `react`, `three.js`
1. **MIDI inspector**: Internal web application for inspecting live midi messages from controllers. `typscript`, `webmidi`, `react`, `tailwindcss`

Docker Compose powers the highly portable, high-production-parity development environment, which runs all of the above.

Midishare is deployed to `Digital Ocean`, on a Droplet running `Dokku`. Deployments to `Dokku` remotes (`client`, `server`) are configured to build from the same respective `Dockerfile` used in development (albeit with a different Dockerfile build target).

Static assets are served from an `nginx` process (separate from the `Dokku` `nginx` process) on the host, and then accelerated by `BunnyCDN`. Not quite `Jamstack`, but it's close and retains `nginx` access logs.

Monitoring is an open question, but I aim to use `Grafana Cloud` free tier as both a learning opportunity and an affordable/flexible/complete solution.
