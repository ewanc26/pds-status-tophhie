# pds-status-tophhie

A public status page for the [tophhie.social](https://tophhie.social) AT Protocol
Personal Data Server (PDS).

It reports whether the server is reachable, what it advertises about itself, a
few usage statistics, and the list of accounts hosted on it. Everything is read
live in the browser from public endpoints, so there is no backend of its own and
no credentials involved.

## What it shows

| Section             | Source                                                          |
| ------------------- | --------------------------------------------------------------- |
| Service reachable   | `GET /xrpc/_health` on the PDS                                    |
| PDS version         | `GET /xrpc/_health`                                               |
| Server DID, invite requirement, contact, policy links | `com.atproto.server.describeServer` |
| Accounts on the PDS | `com.atproto.sync.listRepos`, with handles resolved via [plc.directory](https://plc.directory) |
| Posts this year     | `/pds/blueskyHeatmap` on the Tophhie Cloud API                    |
| Blob storage used   | `/pds/blobStorageUsageBytes` on the Tophhie Cloud API             |

Every remote field is treated as optional; the page degrades to "Unavailable"
rather than failing when an upstream response is missing or malformed.

## Configuration

Both endpoints are compile-time constants in `src/config.ts`. To point the page
at a different PDS, edit them there:

```ts
static readonly PDS_URL = "https://tophhie.social";
static readonly TOPHHIE_CLOUD_API_URL = "https://api.tophhie.cloud";
```

The statistics section is specific to the Tophhie Cloud API. A different PDS
will still render the health, description, and account sections, but the posts
and blob-usage figures will read "Unavailable" unless an equivalent API is
provided.

## Development

```sh
pnpm install
pnpm dev
```

## Building

```sh
pnpm build      # static output in dist/
pnpm preview    # serve the production build locally
pnpm check      # svelte-check
pnpm lint       # prettier + eslint
```

The site is built with `@sveltejs/adapter-static` into `dist/`, with
`fallback: index.html` so it can be served as a single-page app from any static
host.

## Support
If you find this project useful, consider supporting its development:
[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/ewancroft)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/ewanc26)
