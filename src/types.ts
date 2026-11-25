export type TabType = 'landing' | 'quiz' | 'reconciler' | 'shopping' | 'checkout';
export type ActiveScreen = TabType;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in Toman
  style: 'minimal' | 'boho' | 'hybrid' | 'modern';
  image: string;
  inStock: boolean;
  description: string;
  dimensions?: string;
  rating: number;
  tags: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  style: 'minimal' | 'boho' | 'hybrid';
  icon?: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export interface QuizAnswers {
  stylePreference: 'minimal' | 'boho' | 'hybrid';
  budget: number;
  roomSize: number;
  priority: 'comfort' | 'looks' | 'storage' | 'eco';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SavedRoomNote {
  id: string;
  author: string; // 'سارا' | 'آرمان'
  text: string;
  created_at: string;
}
