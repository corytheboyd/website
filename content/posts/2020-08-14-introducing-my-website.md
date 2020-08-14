---
draft: false
title: Inside my personal website
summary: Static text does not require JavaScript. Period.
date: 2020-08-14
publishDate: 2020-08-14
slug: inside-my-personal-website
---

{{<dropcap 1>}}
Hello and welcome to my website! Given all of this extra time I have had at home recently, I figured it was finally time to stand up a website to publish some blog posts I have been meaning to write. As any self respecting software engineer would do in this case, my plan was to build it all myself.
{{</dropcap>}}

Having not considered the ecosystem of static content generation sites for quite some time, I hit the books to figure what my options are.

## Wait, it's all JavaScript?!

The very first first thing I noticed was that almost every solution required JavaScript, either at build time or on the client. JavaScript has no business being involved in static text based context, HTML and CSS already do an amazing job.

At the end of the day, there was only a single viable solution that passed the test of being relevant and not using JavaScript, [Hugo](https://gohugo.io/).

## Styling

Hugo at its core is really nothing more than a very feature rich HTML template renderer, which is exactly the right tool for the job of generating markup, but what about styling?

I chose to just use [SASS](https://sass-lang.com). Using nothing but SASS is amazing for a project this small. I wrote all of the styling myself, which for text based content, really isn't that bad.

Hugo offers a library of themes, but I personally find the usage of themes to be a bit tacky. I wanted something that is uniquely mine, and more importantly, doesn't add a bunch of shit I will never use.

## Hosting & deployment

Hosting static content in 20202 is so easy it should be _illegal_. I use [GitHub Pages](https://pages.github.com/) as the host, which really is as simple as turning it on in the repository settings.

Similarly, deployment is disgustingly easy with [GitHub Actions](https://github.com/features/actions). My configuration file is triggered by every push to master, which then:

1. Downloads the `hugo` binary
1. Builds the site from source with `hugo`
1. Pushes the build to the `gh-pages` branch

And that's it, every push of my website source code immediately triggers a build and deployment, all for free.

Here is my configuration for reference:

{{< gist corytheboyd 72219b9e70776db5c5a76662b8efc80f >}}

## That's it, we have a website

It really is this simple to build your own custom corner of the internet and serve it for free. I left out some details, specifically my configuration in Cloudflare, but if there is demand I can dive deeper into it.

## Less JavaScript

I hope you'll join me in adding less unnecessary JavaScript to the internet. It will make you a stronger web developer, and your websites are nearly guaranteed to be faster. There are still of course valid use cases for JavaScript, and perhaps I will explore this topic more in the future as well.
