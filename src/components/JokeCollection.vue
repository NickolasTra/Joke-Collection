<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">📚 My Joke Collection</h1>
      <div class="flex justify-center space-x-8 mt-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ collection.totalJokes }}</div>
          <div class="text-sm text-gray-600">Total Jokes</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-500">{{ collection.averageRating.toFixed(1) }}</div>
          <div class="text-sm text-gray-600">Avg Rating</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-500">{{ favoriteCount }}</div>
          <div class="text-sm text-gray-600">Favorites</div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Bar -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search jokes..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Type Filter -->
        <div class="lg:w-48">
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="programming">Programming</option>
          </select>
        </div>

        <!-- Rating Filter -->
        <div class="lg:w-48">
          <select
            v-model="selectedRating"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div class="lg:w-48">
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dateAdded">Date Added</option>
            <option value="rating">Rating</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        <!-- Show Favorites Toggle -->
        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="showFavoritesOnly"
              type="checkbox"
              class="sr-only"
            >
            <div class="relative">
              <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div 
                :class="showFavoritesOnly ? 'translate-x-6 bg-red-500' : 'translate-x-0 bg-white'"
                class="absolute left-1 top-1 w-6 h-6 rounded-full transition transform"
              ></div>
            </div>
            <span class="ml-3 text-sm font-medium text-gray-700">❤️ Favorites</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <div class="text-center text-gray-600">
      Showing {{ filteredJokes.length }} of {{ collection.totalJokes }} jokes
    </div>

    <!-- Jokes Grid -->
    <div v-if="filteredJokes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <JokeCard
        v-for="joke in filteredJokes"
        :key="joke.id"
        :joke="joke"
        @remove-from-collection="removeFromCollection"
        @rate="openRatingModal"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🎭</div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No jokes found</h3>
      <p class="text-gray-500">
        <span v-if="searchQuery || selectedType !== 'all' || selectedRating !== 'all' || showFavoritesOnly">
          Try adjusting your filters or search query.
        </span>
        <span v-else>
          Start by discovering some jokes to add to your collection!
        </span>
      </p>
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
            Update Rating
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import JokeCard from '@/components/JokeCard.vue';
import type { Joke, JokeCollection } from '@/types/joke';
import { mockJokes } from '@/data/mockJokes';

const collection = ref<JokeCollection>({
  jokes: [],
  totalJokes: 0,
  averageRating: 0
});

const searchQuery = ref('');
const selectedType = ref<string>('all');
const selectedRating = ref<string>('all');
const sortBy = ref<string>('dateAdded');
const showFavoritesOnly = ref(false);

const showRatingModal = ref(false);
const tempRating = ref(0);
const jokeToRate = ref<Joke | null>(null);

const favoriteCount = computed(() => {
  return collection.value.jokes.filter(joke => joke.isFavorite).length;
});

const filteredJokes = computed(() => {
  let filtered = collection.value.jokes;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(joke => 
      joke.setup.toLowerCase().includes(query) || 
      joke.punchline.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(joke => joke.type === selectedType.value);
  }

  // Apply rating filter
  if (selectedRating.value !== 'all') {
    const minRating = parseInt(selectedRating.value);
    filtered = filtered.filter(joke => (joke.rating || 0) >= minRating);
  }

  // Apply favorites filter
  if (showFavoritesOnly.value) {
    filtered = filtered.filter(joke => joke.isFavorite);
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'alphabetical':
      filtered.sort((a, b) => a.setup.localeCompare(b.setup));
      break;
    case 'dateAdded':
    default:
      filtered.sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime());
      break;
  }

  return filtered;
});

const updateCollectionStats = () => {
  collection.value.totalJokes = collection.value.jokes.length;
  
  if (collection.value.jokes.length > 0) {
    const totalRating = collection.value.jokes.reduce((sum, joke) => sum + (joke.rating || 0), 0);
    collection.value.averageRating = totalRating / collection.value.jokes.length;
  } else {
    collection.value.averageRating = 0;
  }
};

const removeFromCollection = (joke: Joke) => {
  const index = collection.value.jokes.findIndex(j => j.id === joke.id);
  if (index > -1) {
    collection.value.jokes.splice(index, 1);
    updateCollectionStats();
  }
};

const toggleFavorite = (joke: Joke) => {
  const foundJoke = collection.value.jokes.find(j => j.id === joke.id);
  if (foundJoke) {
    foundJoke.isFavorite = !foundJoke.isFavorite;
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
  if (jokeToRate.value) {
    const foundJoke = collection.value.jokes.find(j => j.id === jokeToRate.value?.id);
    if (foundJoke) {
      foundJoke.rating = tempRating.value;
      updateCollectionStats();
    }
  }
  cancelRating();
};

const cancelRating = () => {
  showRatingModal.value = false;
  jokeToRate.value = null;
  tempRating.value = 0;
};

onMounted(() => {
  // Initialize with some mock data for demonstration
  collection.value.jokes = [...mockJokes];
  updateCollectionStats();
});

</script>