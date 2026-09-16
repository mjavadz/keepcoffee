import React, { useState, useEffect, useMemo } from 'react';
import { Coffee, Clock, Play, Pause, RotateCcw, Check, Sparkles } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import './BrewAssistant.css';

const BREW_METHODS = [
  {
    id: 'v60',
    name: 'پور-اور V60',
    sub: 'Pour Over',
    ratio: 15, // 1g coffee to 15g water
    grind: 'متوسط رو به ریز (Medium-Fine)',
    temp: '۹۲ الی ۹۴ درجه سانتی‌گراد',
    totalSeconds: 165,
    steps: [
      { start: 0, end: 45, title: 'بلومینگ (پیش‌خیسانی)', desc: '۵۰ میلی‌لیتر آب بریزید تا گازهای طبیعی خارج شوند.' },
      { start: 45, end: 100, title: 'ریزش اول مارپیچی', desc: 'ریزش دورانی آرام از مرکز به سمت لایه‌های بیرونی تا ۱۸۰ میلی‌لیتر.' },
      { start: 100, end: 165, title: 'ریزش نهایی و عبور قطره‌ای', desc: 'ریزش باقیمانده آب تا وزن هدف و صبر برای پایان قطره‌ها.' },
    ],
  },
  {
    id: 'aeropress',
    name: 'ایروپرس (معکوس)',
    sub: 'Aeropress Inverted',
    ratio: 13,
    grind: 'متوسط (Medium)',
    temp: '۸۸ الی ۹۰ درجه سانتی‌گراد',
    totalSeconds: 100,
    steps: [
      { start: 0, end: 30, title: 'افزودن آب و هم‌زدن', desc: 'آب را اضافه کرده و ۱۰ ثانیه با قاشق چرخشی هم بزنید.' },
      { start: 30, end: 70, title: 'استیپ (هم‌نشینی)', desc: 'فیلتر را ببندید و اجازه دهید قهوه عصاره‌گیری شود.' },
      { start: 70, end: 100, title: 'پرس یکنواخت', desc: 'پیستون را ۳۰ ثانیه به آرامی تا شنیدن صدای خروج هوا فشرده کنید.' },
    ],
  },
  {
    id: 'moka',
    name: 'موکاپات روگازی',
    sub: 'Moka Pot Express',
    ratio: 10,
    grind: 'ریز موکاپاتی (Fine-Medium)',
    temp: 'شعله ملایم و کنترل‌شده',
    totalSeconds: 210,
    steps: [
      { start: 0, end: 120, title: 'جوشش اولیه مخزن', desc: 'آب جوش در مخزن زیرین و قرار دادن روی شعله بسیار کم.' },
      { start: 120, end: 180, title: 'خروج فوم غلیظ عسلی', desc: 'خروج آرام اسپرسوی غلیظ بدون قل‌قل شدید از ناودانی.' },
      { start: 180, end: 210, title: 'قطع سریع حرارت', desc: 'به محض تغییر رنگ کرما به زرد روشن، زیر شعله را خاموش کنید.' },
    ],
  },
  {
    id: 'french',
    name: 'فرنچ پرس کلاسیک',
    sub: 'French Press',
    ratio: 14,
    grind: 'درشت شنی (Coarse)',
    temp: '۹۳ درجه سانتی‌گراد',
    totalSeconds: 240,
    steps: [
      { start: 0, end: 60, title: 'خیساندن و شکستن لایه', desc: 'نیمی از آب را بریزید، ۳۰ ثانیه صبر کنید و هم بزنید.' },
      { start: 60, end: 210, title: 'دم‌کشیدن کامل', desc: 'باقیمانده آب را ریخته و اهرم را بالا نگه دارید.' },
      { start: 210, end: 240, title: 'پرس و سرو آرام', desc: 'پیستون را به نرمی پایین برده و فوراً در فنجان بریزید.' },
    ],
  },
];

export default function BrewAssistant({ onLogToJournal }) {
  const [selectedMethodId, setSelectedMethodId] = useState('v60');
  const [coffeeGrams, setCoffeeGrams] = useState(18); // default 18g
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const method = useMemo(() => {
    return BREW_METHODS.find((m) => m.id === selectedMethodId) || BREW_METHODS[0];
  }, [selectedMethodId]);

  const waterMl = useMemo(() => {
    return Math.round(coffeeGrams * method.ratio);
  }, [coffeeGrams, method.ratio]);

  // Timer ticker
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev + 1 >= method.totalSeconds) {
            setIsRunning(false);
            setCompleted(true);
            return method.totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, method.totalSeconds]);

  // Reset timer on method change
  const handleSelectMethod = (id) => {
    setSelectedMethodId(id);
    setIsRunning(false);
    setTimerSeconds(0);
    setCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerSeconds(0);
    setCompleted(false);
  };

  // Find active step
  const activeStep = useMemo(() => {
    return (
      method.steps.find(
        (s) => timerSeconds >= s.start && timerSeconds < s.end
      ) || method.steps[method.steps.length - 1]
    );
  }, [method.steps, timerSeconds]);

  const progressPercent = Math.min(100, Math.round((timerSeconds / method.totalSeconds) * 100));

  const formatMinSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="brew-assistant-card">
      <div className="brew-header">
        <div className="brew-badge">
          <Clock size={16} />
          <span>دستیار هوشمند دم‌آوری باریستا</span>
        </div>
        <h3>تایمر زنده و راهنمای گام‌به‌گام عصاره‌گیری</h3>
        <p>متد دلخواهت را انتخاب کن تا نسبت استاندارد آب به قهوه و تایمر زمان‌بندی دقیق را دریافت کنی.</p>
      </div>

      {/* Methods Carousel/Pills */}
      <div className="brew-methods-pills">
        {BREW_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`method-pill ${selectedMethodId === m.id ? 'is-active' : ''}`}
            onClick={() => handleSelectMethod(m.id)}
          >
            <span className="method-pill-name">{m.name}</span>
            <span className="method-pill-sub">{m.sub}</span>
          </button>
        ))}
      </div>

      <div className="brew-workspace-grid">
        {/* Left: Recipe & Ratio calculator */}
        <div className="brew-recipe-panel">
          <div className="recipe-calc-box">
            <div className="calc-row-header">
              <label>مقدار دانه قهوه:</label>
              <strong>{toPersianDigits(coffeeGrams)} گرم</strong>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={coffeeGrams}
              onChange={(e) => setCoffeeGrams(Number(e.target.value))}
              className="coffee-slider"
            />
            <div className="slider-hints">
              <span>۱۰ گرم (۱ فنجان سبک)</span>
              <span>۱۸ گرم (دوبل استاندارد)</span>
              <span>۴۰ گرم (چند نفره)</span>
            </div>
          </div>

          <div className="recipe-specs-grid">
            <div className="spec-tile">
              <span className="spec-lbl">حجم کل آب:</span>
              <strong className="spec-val gold">{toPersianDigits(waterMl)} میلی‌لیتر</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-lbl">نسبت دم‌آوری (Ratio):</span>
              <strong className="spec-val">۱ به {toPersianDigits(method.ratio)}</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-lbl">درجه آسیاب پیشنهادی:</span>
              <strong className="spec-val small">{method.grind}</strong>
            </div>
            <div className="spec-tile">
              <span className="spec-lbl">دمای آب:</span>
              <strong className="spec-val small">{method.temp}</strong>
            </div>
          </div>
        </div>

        {/* Right: Live Digital Stopwatch */}
        <div className="brew-stopwatch-panel">
          <div className="stopwatch-display">
            <span className="stopwatch-digits">{formatMinSec(timerSeconds)}</span>
            <span className="stopwatch-target">از {formatMinSec(method.totalSeconds)}</span>
          </div>

          {/* Progress Bar */}
          <div className="brew-progress-bar">
            <div className="brew-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Current Step Instruction */}
          <div className={`active-step-callout ${completed ? 'is-completed' : ''}`}>
            {completed ? (
              <div className="completed-wrap">
                <Check size={22} className="check-icon" />
                <div>
                  <strong>عصاره‌گیری با موفقیت به پایان رسید!</strong>
                  <p>فنجان قهوه شما آماده نوشیدن است. نوش جان!</p>
                </div>
              </div>
            ) : (
              <div>
                <span className="step-tag">مرحله فعلی</span>
                <h4>{activeStep.title}</h4>
                <p>{activeStep.desc}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="stopwatch-controls">
            {!isRunning ? (
              <button
                className="btn btn-primary btn-lg start-btn"
                onClick={() => setIsRunning(true)}
                disabled={completed}
              >
                <Play size={18} />
                <span>{timerSeconds > 0 ? 'ادامه تایمر' : 'شروع عصاره‌گیری'}</span>
              </button>
            ) : (
              <button className="btn btn-primary btn-lg pause-btn" onClick={() => setIsRunning(false)}>
                <Pause size={18} />
                <span>توقف موقت</span>
              </button>
            )}

            <button className="btn btn-outline reset-btn" onClick={handleReset} title="تنظیم مجدد">
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Log to Journal Quick Button */}
          {completed && onLogToJournal && (
            <button
              className="btn btn-outline btn-block log-journal-btn"
              onClick={() => onLogToJournal({ method: method.name, grams: coffeeGrams, water: waterMl })}
            >
              <Sparkles size={16} />
              <span>ثبت در دفترچه ارزیابی طعم</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
