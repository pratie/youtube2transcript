# YouTube2Transcript

A focused, free single-video transcript tool and acquisition surface for
[BulkTranscripts](https://bulktranscripts.co).

## Architecture

The statically rendered Next.js frontend runs on Vercel. Its interactive tool calls
`https://bulktranscripts.co/api/free-transcript` directly from the visitor's browser.
There is deliberately no Vercel API proxy and no shared paid license key: the Railway
backend must see the visitor's actual network identity so its device/IP fair-use limits
remain effective.

The backend endpoint accepts only direct YouTube video URLs. Playlist and channel URLs
receive a structured handoff to the BulkTranscripts web app. It shares the existing
extraction engine and transcript cache, but has its own hourly rate bucket and telemetry
surface.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The production backend explicitly permits localhost for
this route, so no local backend is required for a normal smoke test.

Optional build-time variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_TRANSCRIPT_ENDPOINT` | Override the transcript endpoint for local testing |
| `NEXT_PUBLIC_EVENTS_ENDPOINT` | Override the privacy-safe event endpoint |
| `NEXT_PUBLIC_CHROME_EXTENSION_URL` | Show the live Chrome CTA once the Web Store listing is approved |

## Deployment

1. Import `github.com/pratie/youtube2transcript` into Vercel.
2. Keep the detected framework as Next.js and deploy from `main`.
3. Add both `youtube2transcript.xyz` and `www.youtube2transcript.xyz` to the Vercel project.
4. In Hostinger DNS, add the exact apex and `www` records Vercel displays.
5. Set the apex domain as primary and redirect `www` to it.
6. Add `youtube2transcript.xyz` as a Domain Property in Google Search Console, verify its
   TXT record in Hostinger, and submit `https://youtube2transcript.xyz/sitemap.xml`.

Vercel will provision TLS after DNS verification and automatically deploy future pushes.

## Verification

```bash
npm run lint
npm run build
```

After deployment, verify `/`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`,
`/manifest.webmanifest`, and one real transcript request.
