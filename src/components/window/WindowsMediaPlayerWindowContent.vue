<template>
  <div class="relative flex h-full w-full flex-col">
    <section class="flex flex-1 items-center justify-center bg-black">
      <img
        src="/win98icon/windows_slanted-1.png"
        alt="Windows Logo"
        class="max-h-40 max-w-40"
      />
    </section>

    <section
      class="flex w-full flex-col border-t px-2 py-1"
      style="min-height: 64px"
    >
      <!-- Scrubber -->
      <div class="mb-1 flex h-6 w-full items-center justify-center">
        <input
          type="range"
          min="0"
          :max="duration"
          step="0.01"
          v-model="currentTime"
          @input="onSeek"
          class="h-1 w-full accent-blue-600"
        />
      </div>

      <!-- Controls -->
      <div class="flex w-full items-center">
        <div class="flex flex-1 items-center gap-1.5">
          <div
            @click="!isPlaying && playAudio()"
            :class="[
              isPlaying
                ? 'cursor-default opacity-50'
                : 'cursor-pointer opacity-100',
              'transition-opacity',
            ]"
          >
            <i-tabler-player-play-filled class="h-4 w-4" />
          </div>
          <div
            @click="isPlaying && pauseAudio()"
            :class="[
              isPlaying
                ? 'cursor-pointer opacity-100'
                : 'cursor-default opacity-50',
              'transition-opacity',
            ]"
          >
            <i-tabler-player-pause-filled class="h-4 w-4" />
          </div>
          <div
            @click="isPlaying && stopAudio()"
            :class="[
              isPlaying
                ? 'cursor-pointer opacity-100'
                : 'cursor-default opacity-50',
              'transition-opacity',
            ]"
          >
            <i-tabler-player-stop-filled class="h-4 w-4" />
          </div>
        </div>

        <!-- Volume -->
        <div class="flex w-20 items-center">
          <i-tabler-volume class="mr-1 h-5 w-5" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            @input="onVolumeChange"
            class="h-1 accent-blue-600"
          />
        </div>
      </div>
    </section>

    <audio
      ref="audioPlayer"
      src="/nickleback.mp3"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);

function playAudio() {
  if (!audioPlayer.value) return;
  audioPlayer.value
    .play()
    .then(() => {
      isPlaying.value = true;
    })
    .catch(() => {});
}

function pauseAudio() {
  if (!audioPlayer.value) return;
  audioPlayer.value.pause();
  isPlaying.value = false;
}

function stopAudio() {
  if (!audioPlayer.value) return;
  audioPlayer.value.pause();
  audioPlayer.value.currentTime = 0;
  isPlaying.value = false;
}

function onTimeUpdate() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
}

function onLoadedMetadata() {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration;
    audioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(() => {});
  }
}

function onSeek(e: Event) {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = Number(
      (e.target as HTMLInputElement).value,
    );
  }
}

function onEnded() {
  isPlaying.value = false;
}

function onVolumeChange(e: Event) {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
  }
}

watch(volume, (val) => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = val;
  }
});

function formatTime(time: number) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value;
    audioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(() => {});
  }
});
</script>
