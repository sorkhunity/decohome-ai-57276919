import { Product, QuizQuestion } from '../types';

export const STYLE_LABELS: Record<string, string> = {
  minimal: 'مینیمال خلوت',
  boho: 'بوهو گرم و پرانرژی',
  hybrid: 'ترکیبی (مینیمال + بوهو)',
  modern: 'مدرن و راحت'
};

export const CATEGORY_LABELS: Record<string, string> = {
  living: 'نشیمن',
  rug_flooring: 'فرش و کفپوش',
  tv_room: 'نشیمن و تی‌وی‌روم',
  dining: 'غذاخوری',
  decor_plants: 'دکوراتیو و گیاهان',
  bedroom: 'اتاق خواب'
};

export const PRIORITY_LABELS: Record<string, string> = {
  comfort: 'راحتی و ارگونومی',
  looks: 'زیبایی بصری و استایل',
  storage: 'ذخیره‌سازی و نظم',
  eco: 'متریال طبیعی و پایدار'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'مبل مدرن آرمان (راحتی ۳ نفره)',
    category: 'living',
    price: 15000000,
    style: 'modern',
    image: '/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg',
    description: 'مبل راحتی ۳ نفره با پارچه ضد لک و پایه‌های چوب راش، انتخابی ایده‌آل برای استراحت آرمان و خانواده',
    dimensions: '۲۱۰ × ۹۰ × ۸۵ سانتی‌متر',
    inStock: true,
    rating: 4.8,
    tags: ['انتخاب آرمان', 'پرفروش', 'گارانتی ۳ ساله']
  },
  {
    id: 'prod-2',
    name: 'فرش دستبافت‌گونه بوهوی سارا',
    category: 'rug_flooring',
    price: 4000000,
    style: 'boho',
    image: '/__l5e/assets-v1/223c68d9-64db-4c3c-a572-34b853d2ec54/prototype-commerce.jpg',
    description: 'فرش طرح بوهو با بافت نرم و طرح‌های سنتی-مدرن، گرمابخش پذیرایی ۱۱۰ متری',
    dimensions: '۲ × ۳ متر',
    inStock: true,
    rating: 4.9,
    tags: ['انتخاب سارا', 'طرح بوهو', 'نخ طبیعی']
  },
  {
    id: 'prod-3',
    name: 'میز تلویزیون مینیمال چوب طبیعی',
    category: 'tv_room',
    price: 6000000,
    style: 'minimal',
    image: '/__l5e/assets-v1/73aaeffc-03f6-4dd8-b652-a097efe0b551/prototype-healthcare.jpg',
    description: 'میز تلویزیون مینیمال با خطوط تمیز، فضای ذخیره‌سازی مخفی و چوب روس درجه یک',
    dimensions: '۱۶۰ × ۴۰ × ۴۸ سانتی‌متر',
    inStock: true,
    rating: 4.7,
    tags: ['مینیمال', 'مقاوم', 'نصب رایگان']
  },
  {
    id: 'prod-4',
    name: 'میز ناهارخوری ۴ نفره اسکاندیناوی',
    category: 'dining',
    price: 9500000,
    style: 'minimal',
    image: '/__l5e/assets-v1/ee055612-0d60-456e-b148-d6c54a724bcf/prototype-food.jpg',
    description: 'ست میز و صندلی غذاخوری جمع‌وجور مناسب آشپزخانه آپارتمان ۱۱۰ متری',
    dimensions: '۱۲۱۰ × ۸۰ سانتی‌متر',
    inStock: true,
    rating: 4.6,
    tags: ['کم‌جا', 'محبوب']
  },
  {
    id: 'prod-5',
    name: 'گلدان بزرگ مونسترا با پایه چوبی',
    category: 'decor_plants',
    price: 1800000,
    style: 'hybrid',
    image: '/__l5e/assets-v1/459d47c5-f16d-4fab-a010-5ab0d6e5f8eb/prototype-education.jpg',
    description: 'گلدان طبیعی با ارتفاع ۱۲۰ سانتی‌متر، طراوت‌بخش فضای نشیمن و تصفیه کننده هوا',
    dimensions: 'ارتفاع ۱۲۰ سانتی‌متر',
    inStock: true,
    rating: 4.9,
    tags: ['طبیعی', 'تصفیه هوا']
  },
  {
    id: 'prod-6',
    name: 'تخت خواب دونفره بوهو با تاج حصیری',
    category: 'bedroom',
    price: 13500000,
    style: 'boho',
    image: '/__l5e/assets-v1/68ceadfc-b580-4f18-8679-0088dddd218c/prototype-travel.jpg',
    description: 'تخت خواب چوبی با تاج بافت حصیر خیزران طبیعی، آرامش‌بخش اتاق خواب اصلی',
    dimensions: '۱۶۰ × ۲۰۰ سانتی‌متر',
    inStock: true,
    rating: 4.9,
    tags: ['حصیر طبیعی', 'آرامش‌بخش']
  }
];

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'سبک غالب فضای نشیمن خانه شما کدام است؟',
    subtitle: 'آرمان به خطوط خلوت مینیمال علاقه دارد و سارا به گرمای بوهو.',
    options: [
      { id: 'opt-1', text: 'مینیمال خلوت و آرامش‌بخش', style: 'minimal', icon: 'Compass' },
      { id: 'opt-2', text: 'بوهو پر از گیاه و بافت‌های گرم', style: 'boho', icon: 'Sun' },
      { id: 'opt-3', text: 'ترکیب هوشمندانه هر دو (تلفیق تعادل)', style: 'hybrid', icon: 'Sparkles' }
    ]
  },
  {
    id: 2,
    title: 'بودجه تقریبی شما برای کل لوازم خانه چقدر است؟',
    subtitle: 'این مقدار برای بهینه‌سازی پیشنهادها استفاده می‌شود.',
    options: [
      { id: 'opt-4', text: 'تا ۳۰ میلیون تومان (اقتصادی و کاربردی)', style: 'minimal', icon: 'CreditCard' },
      { id: 'opt-5', text: 'بین ۳۰ تا ۶۰ میلیون تومان (متعادل)', style: 'hybrid', icon: 'CheckCircle' },
      { id: 'opt-6', text: 'بیش از ۶۰ میلیون تومان (ویژه و لوکس)', style: 'boho', icon: 'Award' }
    ]
  },
  {
    id: 3,
    title: 'بزرگ‌ترین اولویت شما در خرید مبلمان و دکور چیست؟',
    subtitle: 'انتخاب اولویت کمک می‌کند اختلاف سلیقه‌ها حل شود.',
    options: [
      { id: 'opt-7', text: 'راحتی کامل برای استراحت روزمره', style: 'minimal', icon: 'Heart' },
      { id: 'opt-8', text: 'زیبایی چشمگیر برای مهمانی‌ها و عکاسی', style: 'boho', icon: 'Camera' },
      { id: 'opt-9', text: 'فضای ذخیره‌سازی و نظم‌دهی عالی', style: 'hybrid', icon: 'ShieldCheck' }
    ]
  }
];
