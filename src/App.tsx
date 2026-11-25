import React, { useState, useEffect } from 'react';
import { Home, Sparkles, HeartHandshake, ShoppingBag, CheckCircle, Menu, X, ArrowRight, RefreshCw, Calculator, Sliders, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';
import { ActiveScreen, Product, CartItem, QuizAnswers } from './types';
import { MOCK_PRODUCTS, MOCK_QUIZ_QUESTIONS } from './data/mockData';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [budgetLimit, setBudgetLimit] = useState<number>(50000000);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    stylePreference: 'hybrid',
    budget: 50000000,
    roomSize: 110,
    priority: 'comfort'
  });
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  // Sync hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') as ActiveScreen;
      if (['landing', 'quiz', 'reconciler', 'shopping', 'checkout'].includes(hash)) {
        setActiveScreen(hash);
      }
    };
    if (window.location.hash) {
      handleHashChange();
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.location.hash = `#/${screen}`;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-dvh bg-[#FAF8F5] text-[#2C2926] font-sans antialiased selection:bg-[#E8C5A0]/40 flex flex-col rtl">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
            <div className="w-12 h-12 rounded-2xl bg-[#5C4033] flex items-center justify-center text-white shadow-md">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#3D2C22] tracking-tight">خانه آرمان و سارا</h1>
              <p className="text-xs text-[#8C7A6B]">طراحی هارمونیک آپارتمان ۱۱۰ متری</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5F1EC] p-1.5 rounded-full border border-[#EBE6DF]">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeScreen === 'landing' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#5C4033] hover:bg-white/60'}`}
            >
              خانه اصلی
            </button>
            <button
              onClick={() => navigateTo('quiz')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeScreen === 'quiz' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#5C4033] hover:bg-white/60'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              تست سبک سارا و آرمان
            </button>
            <button
              onClick={() => navigateTo('reconciler')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeScreen === 'reconciler' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#5C4033] hover:bg-white/60'}`}
            >
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              مبدل سلیقه (مینیمال ⇄ بوهو)
            </button>
            <button
              onClick={() => navigateTo('shopping')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeScreen === 'shopping' ? 'bg-[#5C4033] text-white shadow-sm' : 'text-[#5C4033] hover:bg-white/60'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              لیست خرید ({cart.reduce((a, c) => a + c.quantity, 0)})
            </button>
          </nav>

          {/* Cart Quick Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('shopping')}
              className="relative p-2.5 rounded-2xl bg-[#F5F1EC] text-[#5C4033] hover:bg-[#EBE6DF] transition-all flex items-center gap-2"
              aria-label="سبد خرید و لیست خرید"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
              <span className="hidden lg:inline text-xs font-medium">
                {(totalCartPrice ?? 0).toLocaleString('fa-IR')} تومان
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-[#F5F1EC] text-[#5C4033]"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#EBE6DF] px-4 py-4 space-y-2 shadow-lg animate-in fade-in duration-200">
            <button
              onClick={() => navigateTo('landing')}
              className={`w-full text-start px-4 py-3 rounded-xl font-medium ${activeScreen === 'landing' ? 'bg-[#5C4033] text-white' : 'text-[#5C4033] hover:bg-[#F5F1EC]'}`}
            >
              خانه اصلی
            </button>
            <button
              onClick={() => navigateTo('quiz')}
              className={`w-full text-start px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${activeScreen === 'quiz' ? 'bg-[#5C4033] text-white' : 'text-[#5C4033] hover:bg-[#F5F1EC]'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              تست سبک سارا و آرمان
            </button>
            <button
              onClick={() => navigateTo('reconciler')}
              className={`w-full text-start px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${activeScreen === 'reconciler' ? 'bg-[#5C4033] text-white' : 'text-[#5C4033] hover:bg-[#F5F1EC]'}`}
            >
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              مبدل سلیقه (مینیمال ⇄ بوهو)
            </button>
            <button
              onClick={() => navigateTo('shopping')}
              className={`w-full text-start px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${activeScreen === 'shopping' ? 'bg-[#5C4033] text-white' : 'text-[#5C4033] hover:bg-[#F5F1EC]'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              لیست خرید ({cart.reduce((a, c) => a + c.quantity, 0)})
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeScreen === 'landing' && (
          <LandingScreen 
            navigateTo={navigateTo} 
            products={MOCK_PRODUCTS} 
            addToCart={addToCart} 
          />
        )}
        {activeScreen === 'quiz' && (
          <QuizScreen 
            navigateTo={navigateTo} 
            quizAnswers={quizAnswers} 
            setQuizAnswers={setQuizAnswers}
            aiRecommendation={aiRecommendation}
            setAiRecommendation={setAiRecommendation}
            isAiLoading={isAiLoading}
            setIsAiLoading={setIsAiLoading}
          />
        )}
        {activeScreen === 'reconciler' && (
          <ReconcilerScreen 
            products={MOCK_PRODUCTS}
            addToCart={addToCart}
          />
        )}
        {activeScreen === 'shopping' && (
          <ShoppingScreen 
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            budgetLimit={budgetLimit}
            setBudgetLimit={setBudgetLimit}
            navigateTo={navigateTo}
            onOpenCheckout={() => setCheckoutModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#3D2C22] text-[#EBE6DF] py-12 px-4 sm:px-6 lg:px-8 mt-16 border-t border-[#5C4033]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-white">خانه سارا و آرمان</h2>
            </div>
            <p className="text-sm text-[#C4B8AB] leading-relaxed">
              راهکار هوشمند دیزاین و آشتی دادن سلیقه مینیمال آرمان و بوهوی گرم سارا برای آپارتمان ۱۱۰ متری دلباز شما.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4 text-base">بخش‌های کلیدی</h3>
            <ul className="space-y-2 text-sm text-[#C4B8AB]">
              <li><button onClick={() => navigateTo('landing')} className="hover:text-white transition-colors">معرفی آپارتمان ۱۱۰ متری</button></li>
              <li><button onClick={() => navigateTo('quiz')} className="hover:text-white transition-colors">تست تعادل سلیقه (AI)</button></li>
              <li><button onClick={() => navigateTo('reconciler')} className="hover:text-white transition-colors">مبدل و ترکیب دکوراسیون</button></li>
              <li><button onClick={() => navigateTo('shopping')} className="hover:text-white transition-colors">محاسبه‌گر بودجه و سبد خرید</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4 text-base">تضمین کیفیت زندگی</h3>
            <p className="text-sm text-[#C4B8AB] leading-relaxed mb-4">
              تمامی محصولات با اندازه‌گیری دقیق برای پلان ۱۱۰ متری بهینه‌سازی شده و از چوب طبیعی و الیاف سازگار با محیط زیست تهیه شده‌اند.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 p-3 rounded-xl border border-amber-800/30">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>گارانتی ۳ ساله اصالت کالا و مشاوره چیدمان رایگان</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#5C4033]/50 text-center text-xs text-[#9E8E81]">
          تمامی حقوق محفوظ است. طراحی اختصاصی برای سارا و آرمان.
        </div>
      </footer>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <CheckoutModal 
          cart={cart}
          totalPrice={totalCartPrice}
          onClose={() => setCheckoutModalOpen(false)}
          onSuccess={() => {
            setCart([]);
            setOrderSuccess(true);
            setCheckoutModalOpen(false);
          }}
        />
      )}

      {/* Success Toast */}
      {orderSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D2C22] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-600/40 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">سفارش شما با موفقیت ثبت شد!</h4>
            <p className="text-xs text-[#C4B8AB]">کارشناسان ما جهت هماهنگی ارسال به آپارتمان ۱۱۰ متری تماس خواهند گرفت.</p>
          </div>
          <button onClick={() => setOrderSuccess(false)} className="mr-4 text-xs text-amber-300 hover:underline">بستن</button>
        </div>
      )}
    </div>
  );
}

/* 1. Landing Screen */
function LandingScreen({ navigateTo, products, addToCart }: { navigateTo: (s: ActiveScreen) => void, products: Product[], addToCart: (p: Product) => void }) {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2ECE4] to-[#FAF8F5] pt-12 pb-20 border-b border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E8C5A0]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5C4033] border border-[#E8C5A0]/50">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                آشتی میان مینیمالیسم آرمان و بوهوی گرم سارا
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3D2C22] tracking-tight leading-tight">
                خانه رویایی ۱۱۰ متری؛ <br />
                <span className="text-amber-700">ترکیبی بی‌نظیر از آرامش و گرما</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6C5B50] leading-relaxed max-w-2xl">
                وقتی سلیقه مدرن و مینیمال آرمان با روح گرم و پر از بافت بوهوی سارا گره می‌خورد، هوش مصنوعی ما کمک می‌کند تا هر گوشه از خانه ۱۱۰ متری شما بهترین بازتاب عشق و سلیقه مشترک‌تان باشد.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigateTo('quiz')}
                  className="px-7 py-4 bg-[#5C4033] text-white rounded-2xl font-bold shadow-lg hover:bg-[#3D2C22] transition-all flex items-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  شروع تست هماهنگی سلیقه
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => navigateTo('reconciler')}
                  className="px-7 py-4 bg-white text-[#5C4033] border border-[#D5C9BD] rounded-2xl font-bold hover:bg-[#F5F1EC] transition-all flex items-center gap-2 text-sm shadow-sm"
                >
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  مبدل سلیقه آرمان و سارا
                </button>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E5DFD7]">
                <div>
                  <div className="text-2xl font-black text-[#3D2C22]">۱۱۰ متر</div>
                  <div className="text-xs text-[#7A695C] mt-1">متراژ بهینه آپارتمان</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#3D2C22]">۵۰ میلیون</div>
                  <div className="text-xs text-[#7A695C] mt-1">بودجه پیشنهادی هوشمند</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#3D2C22]">۱۰۰٪</div>
                  <div className="text-xs text-[#7A695C] mt-1">رضایت مشترک زوج</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[4/3] group">
                <img
                  src="/__l5e/assets-v1/37676bb5-fabf-42e6-97a0-a98cdbd1de16/prototype-workplace.jpg"
                  alt="چیدمان داخلی خانه آرمان و سارا"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="bg-amber-600/90 text-white text-xs px-2.5 py-1 rounded-full font-semibold">پذیرایی اصلی</span>
                    <h3 className="font-bold text-lg mt-1">تلفیق چوب گرم و مبلمان مدرن</h3>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#EBE6DF] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</div>
                <div>
                  <div className="text-xs font-bold text-[#3D2C22]">تایید شده توسط سارا و آرمان</div>
                  <div className="text-[11px] text-[#7A695C]">بدون شلوغی، کاملاً دلباز</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products for 110m Home */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100/60 px-3 py-1 rounded-full">پیشنهادهای ویژه آپارتمان ۱۱۰ متری</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2C22] mt-2">گزیده‌ای از دکوراسیون هماهنگ</h2>
          </div>
          <button
            onClick={() => navigateTo('reconciler')}
            className="text-sm font-bold text-[#5C4033] hover:text-amber-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            مشاهده همه محصولات و مبدل
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-[#EBE6DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2ECE4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                  {product.tags.slice(0, 1).map((tag, idx) => (
                    <span key={idx} className="bg-white/90 backdrop-blur-sm text-[#3D2C22] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-[#8C7A6B] font-medium mb-1">{product.category}</div>
                  <h3 className="font-bold text-[#3D2C22] text-base leading-snug line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-[#6C5B50] mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#8C7A6B]">قیمت:</span>
                    <div className="font-extrabold text-[#3D2C22] text-sm">
                      {(product.price ?? 0).toLocaleString('fa-IR')} <span className="text-xs font-normal text-[#8C7A6B]">تومان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2.5 bg-[#5C4033] hover:bg-[#3D2C22] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    افزودن به لیست خرید
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3D2C22] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-700/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-amber-600/80 text-white text-xs px-3 py-1 rounded-full font-semibold">داستان سارا و آرمان</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">چگونه یک آپارتمان ۱۱۰ متری را بدون دلخوری بچینیم؟</h2>
            <p className="text-[#D5C9BD] text-sm sm:text-base leading-relaxed">
              آرمان عاشق خطوط صاف، خلوتی و رنگ‌های روشن مینیمال است؛ در حالی که سارا به المان‌های بوهو، گیاهان سرسبز و بافت‌های سنتی گرم عشق می‌ورزد. این اپلیکیشن با الگوریتم تطبیق سلیقه و تحلیل بودجه ۵۰ میلیونی، هر اختلاف سلیقه‌ای را به یک ایده جذاب تبدیل می‌کند!
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigateTo('quiz')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm transition-all shadow"
              >
                انجام تست سلیقه مشترک
              </button>
              <button
                onClick={() => navigateTo('reconciler')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm transition-all border border-white/20"
              >
                ورود به مبدل دکوراسیون
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* 2. Quiz Screen */
function QuizScreen({ 
  navigateTo, 
  quizAnswers, 
  setQuizAnswers, 
  aiRecommendation, 
  setAiRecommendation, 
  isAiLoading, 
  setIsAiLoading 
}: { 
  navigateTo: (s: ActiveScreen) => void, 
  quizAnswers: QuizAnswers, 
  setQuizAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>,
  aiRecommendation: string,
  setAiRecommendation: (s: string) => void,
  isAiLoading: boolean,
  setIsAiLoading: (b: boolean) => void
}) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleOptionSelect = (style: 'minimal' | 'boho' | 'hybrid') => {
    setQuizAnswers(prev => ({ ...prev, stylePreference: style }));
    if (currentStep < MOCK_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateAiAdvice(style);
    }
  };

  const generateAiAdvice = async (finalStyle: string) => {
    setIsAiLoading(true);
    setCompleted(true);
    try {
      const prompt = `شما مشاور دکوراسیون داخلی هستید. یک زوج (سارا با سلیقه بوهو و گرم، و آرمان با سلیقه مینیمال و خلوت) در یک آپارتمان ۱۱۰ متری زندگی می‌کنند. سبک منتخب نهایی آن‌ها بر اساس تست «${finalStyle}» شده است. با بودجه ۵۰ میلیون تومان، یک پیشنهاد خلاقانه، الهام‌بخش و صمیمی به زبان فارسی بنویسید که چگونه می‌توانند این سبک را در خانه ۱۱۰ متری خود پیاده کنند تا هر دو راضی باشند. متن حداکثر در 4 پاراگراف کوتاه و جذاب باشد.`;
      const result = await ai.generate(prompt);
      setAiRecommendation(result);
    } catch {
      setAiRecommendation('پیشنهاد هوش مصنوعی: برای آپارتمان ۱۱۰ متری شما، پیشنهاد می‌کنیم دیوارهای روشن مینیمال با پایه‌های چوبی طبیعی داشته باشید و با چند گلدان بزرگ مونسترا و فرش بافت‌دار بوهو، گرما و لطافت را به خانه بیاورید.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">تست تعادل سلیقه هوشمند</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3D2C22] mt-3">کشف نقطه اشتراک سارا و آرمان</h2>
        <p className="text-[#7A695C] text-sm mt-2">۳ سوال کوتاه برای رسیدن به سبک ایده‌آل آپارتمان ۱۱۰ متری</p>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE6DF] shadow-xl space-y-8">
          <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
            <span className="text-xs font-bold text-amber-700">سوال {currentStep + 1} از {MOCK_QUIZ_QUESTIONS.length}</span>
            <div className="flex gap-1.5">
              {MOCK_QUIZ_QUESTIONS.map((_, idx) => (
                <div key={idx} className={`w-8 h-2 rounded-full transition-colors ${idx <= currentStep ? 'bg-[#5C4033]' : 'bg-[#E5DFD7]'}`} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#3D2C22]">{MOCK_QUIZ_QUESTIONS[currentStep].title}</h3>
            <p className="text-sm text-[#7A695C] mt-1">{MOCK_QUIZ_QUESTIONS[currentStep].subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_QUIZ_QUESTIONS[currentStep].options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt.style)}
                className="text-right p-5 rounded-2xl border-2 border-[#EBE6DF] hover:border-[#5C4033] hover:bg-[#FAF8F5] transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-[#3D2C22] text-sm sm:text-base">{opt.text}</span>
                <div className="w-6 h-6 rounded-full border-2 border-[#D5C9BD] group-hover:border-[#5C4033] group-hover:bg-[#5C4033] flex items-center justify-center shrink-0 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-xs font-bold text-[#7A695C] hover:text-[#3D2C22]"
            >
              ← سوال قبلی
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBE6DF] shadow-2xl space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-[#3D2C22]">نتیجه تحلیل هوشمند برای سارا و آرمان</h3>
            <p className="text-sm text-[#7A695C]">سبک منتخب شما با موفقیت ترکیب شد و برای آپارتمان ۱۱۰ متری بهینه‌سازی گشت.</p>
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE6DF]">
            <h4 className="font-bold text-[#3D2C22] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              پیشنهاد اختصاصی مشاور هوش مصنوعی دکوراسیون:
            </h4>
            {isAiLoading ? (
              <div className="py-8 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[#5C4033] mx-auto" />
                <p className="text-xs text-[#7A695C]">در حال تحلیل و ترکیب سلیقه مینیمال و بوهو توسط هوش مصنوعی...</p>
              </div>
            ) : (
              <p className="text-sm text-[#5C4033] leading-relaxed whitespace-pre-line">
                {aiRecommendation}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button
              onClick={() => navigateTo('reconciler')}
              className="px-7 py-3.5 bg-[#5C4033] hover:bg-[#3D2C22] text-white font-bold rounded-2xl text-sm shadow transition-all"
            >
              مشاهده محصولات پیشنهادی در مبدل
            </button>
            <button
              onClick={() => {
                setCompleted(false);
                setCurrentStep(0);
              }}
              className="px-7 py-3.5 bg-white border border-[#D5C9BD] text-[#5C4033] font-bold rounded-2xl text-sm hover:bg-[#FAF8F5] transition-all"
            >
              انجام مجدد تست
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 3. Reconciler Screen (Taste Clash Resolver) */
function ReconcilerScreen({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'minimal' | 'boho' | 'modern'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter(p => {
    const matchesTab = activeTab === 'all' || p.style === activeTab;
    const matchesSearch = p.name.includes(searchTerm) || p.description.includes(searchTerm) || p.category.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">مبدل و حل اختلاف سلیقه</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2C22] mt-2">تعادل میان مینیمال (آرمان) و بوهو (سارا)</h2>
          <p className="text-sm text-[#7A695C] mt-1">محصولاتی که هم خلوتی آرمان را حفظ می‌کنند و هم گرمای بوهوی سارا را دارند.</p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="جستجوی مبل، فرش، میز..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-[#D5C9BD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#EBE6DF] pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-[#5C4033] text-white shadow-sm' : 'bg-white text-[#5C4033] border border-[#EBE6DF] hover:bg-[#FAF8F5]'}`}
        >
          همه محصولات ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('minimal')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'minimal' ? 'bg-[#5C4033] text-white shadow-sm' : 'bg-white text-[#5C4033] border border-[#EBE6DF] hover:bg-[#FAF8F5]'}`}
        >
          سلیقه آرمان (مینیمال)
        </button>
        <button
          onClick={() => setActiveTab('boho')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'boho' ? 'bg-[#5C4033] text-white shadow-sm' : 'bg-white text-[#5C4033] border border-[#EBE6DF] hover:bg-[#FAF8F5]'}`}
        >
          سلیقه سارا (بوهو و گرم)
        </button>
        <button
          onClick={() => setActiveTab('modern')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'modern' ? 'bg-[#5C4033] text-white shadow-sm' : 'bg-white text-[#5C4033] border border-[#EBE6DF] hover:bg-[#FAF8F5]'}`}
        >
          تلفیق مدرن و متعادل
        </button>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EBE6DF] space-y-3">
          <HelpCircle className="w-12 h-12 text-[#A8988A] mx-auto" />
          <h3 className="font-bold text-lg text-[#3D2C22]">محصولی یافت نشد</h3>
          <p className="text-xs text-[#7A695C]">لطفاً عبارت دیگری را جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-[#EBE6DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2ECE4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${product.style === 'minimal' ? 'bg-slate-800 text-white' : product.style === 'boho' ? 'bg-amber-700 text-white' : 'bg-emerald-700 text-white'}`}>
                    {product.style === 'minimal' ? 'مینیمال (آرمان)' : product.style === 'boho' ? 'بوهو (سارا)' : 'تلفیقی متعادل'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-[#8C7A6B] font-medium">{product.category} • ابعاد: {product.dimensions}</div>
                  <h3 className="font-bold text-[#3D2C22] text-lg leading-snug">{product.name}</h3>
                  <p className="text-xs text-[#6C5B50] leading-relaxed">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE4] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#8C7A6B]">قیمت:</span>
                    <div className="font-black text-[#3D2C22] text-base">
                      {(product.price ?? 0).toLocaleString('fa-IR')} <span className="text-xs font-normal text-[#8C7A6B]">تومان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-5 py-3 bg-[#5C4033] hover:bg-[#3D2C22] text-white text-xs font-bold rounded-2xl transition-all shadow"
                  >
                    افزودن به لیست خرید
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 4. Shopping Screen & Budget Calculator */
function ShoppingScreen({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  budgetLimit, 
  setBudgetLimit, 
  navigateTo,
  onOpenCheckout
}: { 
  cart: CartItem[], 
  updateQuantity: (id: string, delta: number) => void, 
  removeFromCart: (id: string) => void, 
  budgetLimit: number, 
  setBudgetLimit: (n: number) => void,
  navigateTo: (s: ActiveScreen) => void,
  onOpenCheckout: () => void
}) {
  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const remainingBudget = budgetLimit - totalAmount;
  const budgetPercentage = Math.min(Math.round((totalAmount / budgetLimit) * 100), 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">سبد خرید و مدیریت بودجه</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2C22] mt-2">لیست خرید آپارتمان ۱۱۰ متری</h2>
        <p className="text-sm text-[#7A695C] mt-1">مدیریت هزینه‌ها و کنترل بودجه ۵۰ میلیون تومانی سارا و آرمان</p>
      </div>

      {/* Budget Meter Widget */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE6DF] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-[#3D2C22]">وضعیت بودجه کل</h3>
            <p className="text-xs text-[#7A695C]">سقف بودجه انتخابی شما برای چیدمان کامل</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#5C4033]">تغییر سقف بودجه:</span>
            <select
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="px-4 py-2 rounded-xl border border-[#D5C9BD] text-xs font-bold bg-[#FAF8F5] text-[#3D2C22]"
            >
              <option value={40000000}>۴۰,۰۰۰,۰۰۰ تومان</option>
              <option value={50000000}>۵۰,۰۰۰,۰۰۰ تومان (پیشنهادی)</option>
              <option value={70000000}>۷۰,۰۰۰,۰۰۰ تومان</option>
              <option value={100000000}>۱۰۰,۰۰۰,۰۰۰ تومان</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#3D2C22]">هزینه کل اقلام: {(totalAmount ?? 0).toLocaleString('fa-IR')} تومان</span>
            <span className={remainingBudget < 0 ? 'text-rose-600 font-black' : 'text-emerald-700'}>
              {remainingBudget >= 0 ? `مانده بودجه: ${(remainingBudget ?? 0).toLocaleString('fa-IR')} تومان` : `کسری بودجه: ${Math.abs(remainingBudget).toLocaleString('fa-IR')} تومان`}
            </span>
          </div>
          <div className="w-full h-4 bg-[#F2ECE4] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${budgetPercentage > 90 ? 'bg-rose-500' : 'bg-[#5C4033]'}`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE6DF] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F2ECE4] text-[#5C4033] flex items-center justify-center mx-auto text-2xl">
            🛒
          </div>
          <h3 className="font-bold text-lg text-[#3D2C22]">سبد خرید شما خالی است</h3>
          <p className="text-xs text-[#7A695C] max-w-md mx-auto">هنوز محصولی برای آپارتمان ۱۱۰ متری انتخاب نکرده‌اید. از بخش مبدل یا صفحه اصلی محصولات را به لیست اضافه کنید.</p>
          <button
            onClick={() => navigateTo('reconciler')}
            className="px-6 py-3 bg-[#5C4033] hover:bg-[#3D2C22] text-white text-xs font-bold rounded-2xl shadow transition-all inline-block"
          >
            مشاهده و انتخاب محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EBE6DF] flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl bg-[#F2ECE4] shrink-0"
                />
                <div className="flex-1 text-center sm:text-right space-y-1">
                  <div className="text-xs text-[#8C7A6B]">{item.product.category}</div>
                  <h4 className="font-bold text-[#3D2C22] text-base">{item.product.name}</h4>
                  <div className="text-sm font-extrabold text-[#5C4033]">
                    {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D5C9BD] rounded-xl overflow-hidden bg-[#FAF8F5]">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="px-3 py-1.5 text-sm font-bold text-[#5C4033] hover:bg-[#EBE6DF]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-[#3D2C22]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="px-3 py-1.5 text-sm font-bold text-[#5C4033] hover:bg-[#EBE6DF]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    aria-label="حذف محصول"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EBE6DF] shadow-sm space-y-6 sticky top-28">
              <h3 className="font-bold text-lg text-[#3D2C22] border-b border-[#F2ECE4] pb-3">فاکتور نهایی</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#7A695C]">
                  <span>تعداد اقلام:</span>
                  <span className="font-bold text-[#3D2C22]">{cart.reduce((a, c) => a + c.quantity, 0)} عدد</span>
                </div>
                <div className="flex justify-between text-[#7A695C]">
                  <span>مجموع مبلغ اقلام:</span>
                  <span className="font-bold text-[#3D2C22]">{(totalAmount ?? 0).toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-[#7A695C]">
                  <span>هزینه حمل و نصب تخصصی:</span>
                  <span className="font-bold text-emerald-700">رایگان (هدیه آپارتمان)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2ECE4] flex justify-between items-center">
                <span className="font-extrabold text-[#3D2C22]">قابل پرداخت:</span>
                <span className="font-black text-lg text-[#5C4033]">{(totalAmount ?? 0).toLocaleString('fa-IR')} تومان</span>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full py-4 bg-[#5C4033] hover:bg-[#3D2C22] text-white font-bold rounded-2xl text-sm shadow-lg transition-all"
              >
                تایید نهایی و ثبت سفارش
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Checkout Modal Component */
function CheckoutModal({ cart, totalPrice, onClose, onSuccess }: { cart: CartItem[], totalPrice: number, onClose: () => void, onSuccess: () => void }) {
  const [fullName, setFullName] = useState<string>('سارا و آرمان');
  const [phone, setPhone] = useState<string>('09123456789');
  const [address, setAddress] = useState<string>('تهران، آپارتمان ۱۱۰ متری، بلوار سعادت‌آباد');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('لطفاً تمامی فیلدها را به دقت پر کنید.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EBE6DF] space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-[#F2ECE4] pb-4">
          <h3 className="font-bold text-xl text-[#3D2C22]">ثبت نهایی سفارش آپارتمان</h3>
          <button onClick={onClose} className="text-[#7A695C] hover:text-[#3D2C22]" aria-label="بستن">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1.5" htmlFor="fullName">نام زوج / تحویل‌گیرنده</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BD] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1.5" htmlFor="phone">شماره تماس همراه</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BD] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4033] mb-1.5" htmlFor="address">آدرس آپارتمان ۱۱۰ متری</label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D5C9BD] text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
              required
            />
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DF] text-xs text-[#7A695C] space-y-1">
            <div className="flex justify-between font-bold text-[#3D2C22]">
              <span>مبلغ کل سفارش:</span>
              <span>{(totalPrice ?? 0).toLocaleString('fa-IR')} تومان</span>
            </div>
            <div>ارسال و چیدمان رایگان توسط تیم تخصصی سارا و آرمان.</div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#FAF8F5] hover:bg-[#EBE6DF] text-[#5C4033] font-bold rounded-xl text-sm transition-all border border-[#D5C9BD]"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#5C4033] hover:bg-[#3D2C22] text-white font-bold rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'پرداخت و ثبت نهایی'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
