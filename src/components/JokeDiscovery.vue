<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">🎭 Joke Discovery</h1>
      <p class="text-gray-600">Discover hilarious jokes and add them to your collection!</p>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <!-- Joke Type Toggle -->
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          @click="setJokeType('random')"
          :class="{
            'bg-white shadow-sm text-gray-900': jokeType === 'random',
            'text-gray-600 hover:text-gray-900': jokeType !== 'random'
          }"
          class="px-4 py-2 rounded-md font-medium transition-all duration-200"
        >
          🎲 Random
        </button>
        <button
          @click="setJokeType('programming')"
          :class="{
            'bg-white shadow-sm text-gray-900': jokeType === 'programming',
            'text-gray-600 hover:text-gray-900': jokeType !== 'programming'
          }"
          class="px-4 py-2 rounded-md font-medium transition-all duration-200"
        >
          💻 Programming
        </button>
      </div>

      <!-- Get New Joke Button -->
      <button
        @click="fetchNewJoke"
        :disabled="isLoading"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
        <span v-else>🎯 Get New Joke</span>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="fetchNewJoke"
          class="mt-2 text-red-700 hover:text-red-900 font-medium"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Joke Display -->
    <div v-if="currentJoke" class="flex justify-center">
      <JokeCard
        :joke="currentJoke"
        @add-to-collection="addToCollection"
        @rate="openRatingModal"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Initial State -->
    <div v-if="!currentJoke && !isLoading && !error" class="text-center py-12">
      <div class="text-6xl mb-4">🎪</div>
      <p class="text-gray-500 text-lg">Click "Get New Joke" to start discovering!</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 z-50">
      <div class="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
        {{ successMessage }}
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Rate this joke</h3>
        <div class="flex justify-center space-x-2 mb-4">
          <button
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            class="text-3xl hover:scale-110 transition-transform"
            :class="star <= tempRating ? 'text-yellow-400' : 'text-gray-300'"
          >
            ⭐
          </button>
        </div>
        <div class="flex space-x-3">
          <button
            @click="cancelRating"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmRating"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Rate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import JokeCard from '@/components/JokeCard.vue';
import type { Joke } from '@/types/joke';
import { getRandomJoke, getRandomProgrammingJoke } from '@/data/mockJokes';

const currentJoke = ref<Joke | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const jokeType = ref<'random' | 'programming'>('random');
const successMessage = ref('');
const showRatingModal = ref(false);
const tempRating = ref(0);
const jokeToRate = ref<Joke | null>(null);

const setJokeType = (type: 'random' | 'programming') => {
  jokeType.value = type;
  if (currentJoke.value) {
    fetchNewJoke();
  }
};

const fetchNewJoke = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (jokeType.value === 'programming') {
      currentJoke.value = getRandomProgrammingJoke();
    } else {
      currentJoke.value = getRandomJoke();
    }
  } catch (err) {
    error.value = 'Failed to fetch joke. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const addToCollection = (joke: Joke) => {
  // TODO: Implement actual collection storage
  showSuccess('Joke added to your collection! 🎉');
};

const toggleFavorite = (joke: Joke) => {
  if (currentJoke.value) {
    currentJoke.value.isFavorite = !currentJoke.value.isFavorite;
    const message = currentJoke.value.isFavorite 
      ? 'Added to favorites! ❤️' 
      : 'Removed from favorites';
    showSuccess(message);
  }
};

const openRatingModal = (joke: Joke) => {
  jokeToRate.value = joke;
  tempRating.value = joke.rating || 0;
  showRatingModal.value = true;
};

const setRating = (rating: number) => {
  tempRating.value = rating;
};

const confirmRating = () => {
  if (jokeToRate.value && currentJoke.value) {
    currentJoke.value.rating = tempRating.value;
    showSuccess(`Rated ${tempRating.value} stars! ⭐`);
  }
  cancelRating();
};

const cancelRating = () => {
  showRatingModal.value = false;
  jokeToRate.value = null;
  tempRating.value = 0;
};

const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

onMounted(() => {
  fetchNewJoke();
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>