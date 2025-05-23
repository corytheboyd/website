<template>
  <form class="flex flex-col gap-3 p-3" @submit.prevent>
    <section class="flex space-x-4">
      <img src="/win98icon/application_hourglass-0.png" />
      <p class="mb-1 text-xs">
        Type the name of a program, folder, document, or Internet resource, and
        Windows will open it for you.
      </p>
    </section>

    <section class="flex items-center justify-center space-x-3">
      <label>Open:</label>
      <input
        id="run-input"
        class="input w-full border border-gray-400 bg-white px-1 py-0.5 text-black"
        type="text"
        autocomplete="off"
      />
    </section>

    <section class="mt-2 flex flex-row justify-end gap-2">
      <button type="submit" class="button min-w-16">OK</button>
      <button type="button" class="button min-w-16">Cancel</button>
    </section>
  </form>
</template>
