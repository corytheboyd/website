My personal website. Build with `gulp`, `postcss`, and `posthtml` using `TailwindCSS` for styling.

I decided to ditch Hugo after not being able to remember its esoteric conventions... for my own esoteric conventions comprised of `posthtml` plugins (`posthtml-include`, `posthtml-expressions`, and `posthtml-content`).

The website is hosted on Netlify, deployed on push to the GitHub repository. I manage DNS in Cloudflare to keep it simple and decoupled from the provider. That means I opt out of the Netlify CDN, but Cloudflare will pick up that slack for free.
