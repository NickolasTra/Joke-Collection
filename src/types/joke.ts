
export interface Joke {
  id?: number;
  type: 'general' | 'programming';
  setup: string;
  punchline: string;
  rating?: number;
  isFavorite?: boolean;
}
