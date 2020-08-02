+++
title = "About this blog"
date = "2020-08-01"
publishDate = "2020-08-01"
summary = "The obligatory meta post about how I made this blog"
draft = true
slug = "about-this-blog"
+++

# About this blog

It wouldn't be a software engineer's personal website without a description of the underlying technology now would it? :)

## Getting started

I had a few humble requirements when putting this together:

* It has to be free
* I don't want to deal with hosting, just use GitHub pages
* No JavaScript allowed. No webpack, React, etc.
* Avoid duplicating HTML with a templated build process

## GitHub Pages

[GitHub Pages](https://pages.github.com/) is a fantastic product that perfectly fits our needs here. Why go through the hassle of hosting static content myself when GitHub will do it better, with SSL, for free?

Sure, you can do all of this on your own, but in the interest of creating as little liability as possible, I will always opt for the do-no-work solution if it satisfies requirements.

## No JavaScript

You don't need JavaScript to render static text and assets on the internet. End of discussion.

## Templated builds

I thought at first it would be fun and refreshing to create this website entirely from hand. Yes, you can still do this in 2020, without megabytes of JavaScript!

So I set foot hobbling together my artisanal HTML, carefully apply Just Enough CSS rules to make it feel high quality. It was fun for about two days, but I pretty quickly hit that obvious breaking point I knew I would in the back of my mind. Namely, the two things I knew would just lead to me giving up later were:

1. Writing CSS without a preprocessor really is just awful and error prone
1. I was duplicating common markup everywhere

### CSS without a preprocessor

My gripe is that vanilla CSS forces your definitions into a single global namespace with no sane alternatives.

I thought I could just beat the system here by getting good, but even with the few basic elements I had rolled, it was already getting quite difficult to work with. Sometimes you just have to relearn why it's okay to add complexity when needed, personally I like revisiting topics like this, as sometimes you learn new fundamentals that you didn't before! I didn't in this case, but it can happen!

### Duplicated markup

Every page copied over the same base structure, the same header/body/footer etc. I at least had each page reaching out to import the same global stylesheet, but even that got a bit rough to manage at different depths in the directory structure.

I started to toy with the idea of using [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components), `<template>` and `<slot>`, [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) and (gasp!) JavaScript to avoid this duplication.

I sobered up about thirty minutes later and asked my partner to slap me across the face. I was trying to avoid migrating to an actual static site generation tool, but it really was just the simplest path forward, and turns out still satisfied my goals with this website (specifically, no JavaScript)

## Enter Hugo

TODO