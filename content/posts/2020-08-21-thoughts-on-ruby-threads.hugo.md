---
draft: true
title: Optimizing an IO intensive data syncing with Ruby threads
date: 2020-08-21
publishDate: 2020-08-21
slug: thoughts-on-ruby-threads
---

{{<dropcap 1>}}
Having worked with Ruby on Rails for most of my career as a software engineer, I have a special
place for Ruby in my heart.
{{</dropcap>}}

Ruby (and Rails) is neither the fastest, nor the most resource
efficient language/framework available, but it was _never trying to be_ in the first place, so
please kindly set aside your "Rust/C++/Java/Brainfuck would be better for this" signs for the
remainder of this blog post :)

Do not let this stop you from using [Threads](https://ruby-doc.org/core-2.7.1/Thread.html) to
optimize slow parts of your operation! Ruby uses a
[global interpreter lock](https://en.wikipedia.org/wiki/Global_interpreter_lock) to ensure that no
more than one thread executes at a time, but don't fall into the common trap of misinterpreting
that.

# The GIL doesn't neuter multi-threaded code

I wish someone explained this to me when I first started my career with Ruby, as there was a lot
of confused hype at the time around [JRuby](https://www.jruby.org/) and "Ruby needs real threads".

I didn't really get the need for this because I had not yet encountered a Need For Speed in the
simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) apps I worked on. So
I ignored the topic entirely, for most of my career, as it was just "something for people
smarter than me".

Let's just demystify Threads.

While only a single thread _executes_ at any given moment, Ruby (through the operating system) can
multi-task just like a human.

Here is an example. You're waiting for Webpack to compile your massive legacy web application
because you modified a single CSS property. You know it won't compile faster if you watch it, so
you open Slack and see that you were sent a question from your peer. Response sent, I wonder if
that build finished... It's done, yay!

# Someone told me "multi-threading is hard"

They were right! There is a whole new category of failure vectors that come with using threads in
your code. I won't go into mush detail on these myself, and there are other resources available on
this topic.

Henceforth, I will assume you have some familiarity with the basic thread APIs exposed by Ruby. If
you see something you don't know, I implore you to educate yourself through the standard
library documentation ([`Thread` for example](https://ruby-doc.org/core-2.7.1/Thread.html)) as much
as possible before alternative resources like [StackOverflow](https://stackoverflow.com/).

# When simple doesn't work anymore

Recently tasked with building a fairly complex data sync system for a certain calendar provider, I
immediately hit what I knew would be a massive performance wall when writing the simple
implementation into the spec.

Trust me, I don't like to make systems more complex than they need to be. When working with a team of software
engineers, you should _always_ err on the side of making code easy for other engineers to safely
change in the future.

That is of course not an absolute, sometimes you _do_ need that abstraction, performance improvement, etc.
Making that call when it's needed is the unspoken art of being an engineering lead.

This was one of those cases.

# The problem at hand

So what does this data sync look like you ask? We're only going to focus on the most complex
component, which I will call the delta consumer, and assuming it's only running against a single
person's calendar.

One cycle of the event delta consumer looks like this:

1. Fetch a page of changed calendar events
1. Fetch optional user override for events
1. Fetch additional properties for events
1. Reduce results of user override and additional properties into action (to sync, or not to sync)
1. Fetch the next page of changed events, repeat until no more pages

Steps 2 and 3 are needed to determine if, for the purposes of our application, the event should be
fed into the rest of our data sync pipeline, or rejected. We don't want to sync _every_ event that
changed on the calendar.

Specifically, we only want to sync an event if:

1. It was sent to the invitees, i.e. it is not in a draft-like state
1. The User did not set a special property to prevent the event from being synced

If either of those conditions fail, the event should not be synced.

# Benchmarking

I set forth contriving a set of utilities to simulate the APIs at play. To keep it simple, I
simulated network activity with
[`sleep`](https://ruby-doc.org/core-2.7.1/Kernel.html#method-i-sleep) calls, roughly approximating
observed response times.

These utilities standing in for actual behavior are:

1. `EventDeltaStream`: Get changed Events, abstracting pagination behind an
[`Enumerable`](https://ruby-doc.org/core-2.7.1/Enumerable.html) interface.
1. `EventDataClient`: Get additional properties about events in bulk, specifically the "is sent"
and "user override" values mentioned earlier (In reality, this is two different API calls that both
support batch requests of up to 20 events)

## Serial implementation

I used the above utilities to create two different implementations that fetch all changed events,
make the necessary requests to fetch additional properties, and consider events "syncable" based on
those properties.

The first approach is the serial approach. One page of events if fetched, a batch "is sent" request
runs, and then a batch "user override" request. If qualified by response data, the event is pushed
into the `sync_queue`. This process repeats until there are no more changed events to consider.

{{< gist corytheboyd e7198f5c8c942db819b0f561bc47694d >}}

When run against 10 pages, each containing 100 events, the entire script executes in **56 seconds**.
This isn't terrible, but remember we're running this for many users. 1 minute intervals with more
than a handful of users just won't be sustainable.

# Threaded implementation

Most of the time spent above is just wasted on waiting for network calls to finish. While it's a
bit more complicated to rewrite our logic to leverage threads, the gains are worth it.

Let's check out the implementation!

{{< gist corytheboyd ca178cbe421a8bbfab40916067c802ea >}}

The threaded implementation, run against the same setup of 10 pages with 100 events each, finishes
in a whopping **2.5 seconds**.

That is a 22x improvement over the serial implementation, very nice! 

# Summary

While it's certainly more complex, and there is more that can go wrong with it, rewriting this
event sync logic with threads yielded the results needed to ensure an acceptable sync latency.

If implementing something like this for a production environment, here is a list of things you
should consider being ready to handle to get started:
1. Non-successful responses from any of the APIs
1. Individual requests in a batch request failing (depends on the provider, refer to their
documentation)
1. Unhandled exception crashes a child thread (see
[`Thread::report_on_exception`](https://ruby-doc.org/core-2.7.1/Thread.html#method-c-abort_on_exception)) 

Also of note, I don't consider myself an expert in multi-threaded design, because I don't exactly
have to reach for it very often in my day-to-day. Just like everything else about the discipline of
writing software, my knowledge is ever growing and will never be exhaustive.  

Another 
