<template>
  <div class="flex flex-col gap-2 p-2">
    <section class="flex items-center gap-2">
      <img src="/win98icon/users-2.png" />
      <p>
        These are links to various external profiles of mine. I didn't build
        these myself, so don't expect them to be very good.
      </p>
    </section>

    <section>
      <ul class="flex flex-col gap-2">
        <li>
          <a
            href="https://ruby.social/@corytheboyd"
            target="_blank"
            class="flex items-center gap-1 rounded-tl-xl rounded-bl-xl bg-gradient-to-r from-red-300 from-10% via-red-200 via-50% to-red-300/0 to-100% p-2 text-right transition hover:underline"
          >
            <i-tabler-brand-mastodon class="h-5 w-5 text-red-800" />
            <span>https://ruby.social/@corytheboyd</span>
          </a>
        </li>

        <li>
          <a
            href="https://bsky.app/profile/corytheboyd.com"
            target="_blank"
            class="flex items-center gap-1 rounded-tl-xl rounded-bl-xl bg-gradient-to-r from-blue-300 from-10% via-blue-200 via-50% to-blue-300/0 to-100% p-2 text-right transition hover:underline"
          >
            <i-tabler-brand-bluesky class="h-5 w-5 text-blue-800" />
            <span>https://bsky.app/profile/corytheboyd.com</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
@reference "tailwindcss";
.link-item {
  @apply flex h-8 items-center justify-center gap-1 rounded-full shadow;
}

.link-item-icon {
}
</style>
<script setup lang="ts"></script>
