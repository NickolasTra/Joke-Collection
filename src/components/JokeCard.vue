<template>
  <div 
    class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Joke Type Badge -->
    <div class="flex justify-between items-start mb-4">
      <span 
        :class="getBadgeClass(joke.type)"
        class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
      >
        {{ joke.type }}
      </span>
      <button
        @click.stop="toggleFavorite"
        class="text-2xl transition-colors duration-200 hover:scale-110 transform"
        :class="joke.isFavorite ? 'text-red-500' : 'text-gray-300'"
      >
        ❤️
      </button>
    </div>

    <!-- Joke Setup -->
    <h2 class="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
      {{ joke.setup }}
    </h2>

    <!-- Punchline Area -->
    <div class="min-h-[60px] mb-4">
      <p v-if="!isHovered && !isPunchlineRevealed" class="text-gray-500 italic text-center py-4">
        Hover to reveal the punchline! 🎭
      </p>
      <p 
        v-else 
        class="text-gray-700 font-medium leading-relaxed animate-fade-in"
      >
        {{ joke.punchline }}
      </p>
    </div>

    <!-- Rating Display -->
    <div v-if="joke.rating" class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <span class="text-sm text-gray-600">Rating:</span>
        <div class="flex">
          <span 
            v-for="star in 5" 
            :key="star"
            class="text-lg"
            :class="star <= joke.rating! ? 'text-yellow-400' : 'text-gray-300'"
          >
            ⭐
          </span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button
          @click.stop="$emit('rate', joke)"
          class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          Rate
        </button>
        <button
          @click.stop="$emit('addToCollection', joke)"
          class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>

    <!-- Reveal Button for Mobile -->
    <button
      v-if="!isHovered && !isPunchlineRevealed"
      @click.stop="revealPunchline"
      class="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 md:hidden"
    >
      Reveal Punchline
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Joke } from '../types/joke';

interface Props {
  joke: Joke;
}

interface Emits {
  (e: 'addToCollection', joke: Joke): void;
  (e: 'rate', joke: Joke): void;
  (e: 'toggleFavorite', joke: Joke): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isHovered = ref(false);
const isPunchlineRevealed = ref(false);

const getBadgeClass = (type: string): string => {
  const classes = {
    general: 'bg-blue-100 text-blue-800',
    programming: 'bg-green-100 text-green-800',
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const revealPunchline = () => {
  isPunchlineRevealed.value = true;
};

const toggleFavorite = () => {
  emit('toggleFavorite', props.joke);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>