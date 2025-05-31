<template>
  <div class="w-full">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex justify-center space-x-8">
        <button
          @click="activeTab = 'discovery'"
        >
          Discover Jokes
        </button>
        <button
          @click="activeTab = 'collection'"
        >
          My Collection
        </button>
      </nav>
    </div>

    <div class="mt-6">
      <JokeDiscovery v-if="activeTab === 'discovery'" />
      <JokeCollection v-if="activeTab === 'collection'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JokeDiscovery from './JokeDiscovery.vue';
import JokeCollection from './JokeCollection.vue';

const activeTab = ref<'discovery' | 'collection'>('discovery');
</script>