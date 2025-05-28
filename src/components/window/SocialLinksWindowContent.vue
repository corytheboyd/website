<template>
  <div class="flex flex-col gap-2 p-2">
    <section class="flex items-center gap-2">
      <img src="/win98icon/users-2.png" />
      <p>
        These are links to various external profiles of mine. I didn't build
        these websites myself, so don't expect them to be very good.
      </p>
    </section>

    <section>
      <ul class="flex flex-col gap-2">
        <li>
          <a
            href="https://github.com/corytheboyd"
            target="_blank"
            class="social-link from-gray-300 via-gray-200 to-gray-300/0"
          >
            <i-tabler-brand-github class="social-link-icon text-gray-800" />
            <span>https://github.com/corytheboyd</span>
          </a>
        </li>

        <li>
          <a
            href="https://ruby.social/@corytheboyd"
            target="_blank"
            class="social-link from-red-300 via-red-200 to-red-300/0"
          >
            <i-tabler-brand-mastodon class="social-link-icon text-red-800" />
            <span>https://ruby.social/@corytheboyd</span>
          </a>
        </li>

        <li>
          <a
            href="https://bsky.app/profile/corytheboyd.com"
            target="_blank"
            class="social-link from-blue-300 via-blue-200 to-blue-300/0"
          >
            <i-tabler-brand-bluesky class="social-link-icon text-blue-800" />
            <span>https://bsky.app/profile/corytheboyd.com</span>
          </a>
        </li>

        <li>
          <a
            href="https://soundcloud.com/corytheboyd"
            target="_blank"
            class="social-link from-orange-300 via-orange-200 to-orange-300/0"
          >
            <i-tabler-brand-soundcloud
              class="social-link-icon text-orange-800"
            />
            <span>https://soundcloud.com/corytheboyd</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style>
@reference "tailwindcss";

.social-link {
  @apply flex items-center gap-1 rounded-tl-xl rounded-bl-xl bg-gradient-to-r p-2 text-right transition hover:underline;
}

.social-link-icon {
  @apply h-5 w-5;
}
</style>
<script setup lang="ts"></script>
