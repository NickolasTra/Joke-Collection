import type { Joke } from '@/types/joke';

export const mockJokes: Joke[] = [
  {
    id: 1,
    type: 'general',
    setup: 'Why don\'t scientists trust atoms?',
    punchline: 'Because they make up everything!',
    rating: 4,
    isFavorite: true
  },
  {
    id: 2,
    type: 'programming',
    setup: 'Why do programmers prefer dark mode?',
    punchline: 'Because light attracts bugs!',
    rating: 5,
    isFavorite: false
  },
  {
    id: 3,
    type: 'general',
    setup: 'What do you call a fake noodle?',
    punchline: 'An impasta!',
    rating: 3,
    isFavorite: true
  },
  {
    id: 4,
    type: 'programming',
    setup: 'How many programmers does it take to change a lightbulb?',
    punchline: 'None, that\'s a hardware problem!',
    rating: 4,
    isFavorite: false
  },
  {
    id: 5,
    type: 'general',
    setup: 'Why did the scarecrow win an award?',
    punchline: 'Because he was outstanding in his field!',
    rating: 2,
    isFavorite: false
  },
  {
    id: 6,
    type: 'programming',
    setup: 'Why do Java developers wear glasses?',
    punchline: 'Because they don\'t C#!',
    rating: 5,
    isFavorite: true
  },
  {
    id: 7,
    type: 'general',
    setup: 'What do you call a bear with no teeth?',
    punchline: 'A gummy bear!',
    rating: 4,
    isFavorite: false
  },
  {
    id: 8,
    type: 'programming',
    setup: 'There are 10 types of people in this world...',
    punchline: 'Those who understand binary and those who don\'t!',
    rating: 3,
    isFavorite: true
  }
];

export const getRandomJoke = (): Joke => {
  const randomIndex = Math.floor(Math.random() * mockJokes.length);
  return { ...mockJokes[randomIndex] };
};

export const getProgrammingJokes = (): Joke[] => {
  return mockJokes.filter(joke => joke.type === 'programming');
};

export const getRandomProgrammingJoke = (): Joke => {
  const programmingJokes = getProgrammingJokes();
  const randomIndex = Math.floor(Math.random() * programmingJokes.length);
  return { ...programmingJokes[randomIndex] };
};