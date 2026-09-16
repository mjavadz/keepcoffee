import React, { useState, useEffect } from 'react';
import { Coffee, Star, Trash2, Check, Sparkles } from '../Icons';
import { toPersianDigits } from '../../utils/format';
import { products } from '../../data/products';
import './CoffeeJournal.css';

const TASTE_TAGS = [
  'شکلات تلخ',
  'کارامل',
  'فندق بوداده',
  'کاکائویی',
  'میوه‌ای و مرکباتی',
  'شهد گل',
  'بادی سنگین',
  'کرمای عالی',
  'تلخی ملایم',
  'پس‌مزه شیرین',
];

export default function CoffeeJournal({ user, storageKey, onEntryAdded, prefill }) {
  const beanProducts = products.filter((p) => p.category === 'beans');

  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [blendName, setBlendName] = useState(beanProducts[0]?.name || 'میکس ۱۰۰ روبوستا کلاسیک');
  const [brewMethod, setBrewMethod] = useState('پور-اور V60');
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['شکلات تلخ', 'کرمای عالی']);
  const [personalNotes, setPersonalNotes] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  // Handle prefill if passed from BrewAssistant
  useEffect(() => {
    if (prefill) {
      if (prefill.method) setBrewMethod(prefill.method);
      setShowForm(true);
    }
  }, [prefill]);

  // Load entries from localStorage
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(`${storageKey}_journal`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch (e) {}
  }, [storageKey]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      blend: blendName,
      method: brewMethod,
      rating,
      tags: selectedTags,
      note: personalNotes.trim(),
      date: new Date().toLocaleDateString('fa-IR'),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);

    if (storageKey) {
      localStorage.setItem(`${storageKey}_journal`, JSON.stringify(updated));
    }

    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 2500);

    // Reset and hide form
    setPersonalNotes('');
    setShowForm(false);

    if (onEntryAdded) {
      onEntryAdded(newEntry);
    }
  };

  const handleDelete = (id) => {
    const updated = entries.filter((item) => item.id !== id);
    setEntries(updated);
    if (storageKey) {
      localStorage.setItem(`${storageKey}_journal`, JSON.stringify(updated));
    }
  };

  return (
    <div className="coffee-journal-container">
      <div className="journal-header">
        <div className="journal-title-wrap">
          <div className="journal-badge">
            <Coffee size={16} />
            <span>دفترچه ارزیابی و خاطرات باریستا</span>
          </div>
          <h3>دفترچه یادداشت طعم‌یابی (Coffee Tasting Journal)</h3>
          <p>
            تجارب، درجات دم‌آوری و طعم‌یادهای کشف‌شده از هر فنجان قهوه را ثبت و آرشیو کنید.
          </p>
        </div>

        <button
          className="btn btn-primary journal-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'بستن فرم' : '+ ثبت فنجان جدید'}
        </button>
      </div>

      {successNotice && (
        <div className="journal-success-alert">
          <Check size={18} />
          <span>تجربه طعم جدید با موفقیت ثبت شد و ۲۰ امتیاز وفاداری به حساب شما تعلق گرفت! ✓</span>
        </div>
      )}

      {/* Add New Tasting Entry Form */}
      {showForm && (
        <form className="journal-entry-form" onSubmit={handleSubmit}>
          <h4>ثبت ارزیابی طعمی فنجان قهوه</h4>

          <div className="form-row-2">
            <div className="journal-field">
              <label>انتخاب دانه قهوه:</label>
              <select
                value={blendName}
                onChange={(e) => setBlendName(e.target.value)}
                className="journal-select"
              >
                {beanProducts.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
                <option value="قهوه تک‌خاستگاه / سفارشی">قهوه تک‌خاستگاه / سفارشی</option>
              </select>
            </div>

            <div className="journal-field">
              <label>ابزار و متد دم‌آوری:</label>
              <select
                value={brewMethod}
                onChange={(e) => setBrewMethod(e.target.value)}
                className="journal-select"
              >
                <option value="پور-اور V60">پور-اور V60</option>
                <option value="اسپرسوساز خانگی">اسپرسوساز خانگی</option>
                <option value="اسپرسوساز صنعتی">اسپرسوساز صنعتی</option>
                <option value="موکاپات روگازی">موکاپات روگازی</option>
                <option value="فرنچ پرس">فرنچ پرس</option>
                <option value="ایروپرس">ایروپرس</option>
                <option value="کلدبرو (دم‌سرد)">کلدبرو (دم‌سرد)</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="journal-field">
            <label>امتیاز کلی به این عصاره‌گیری:</label>
            <div className="rating-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-pick-btn ${star <= rating ? 'is-active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  <Star size={22} />
                </button>
              ))}
              <span className="rating-label-num">({toPersianDigits(rating)} از ۵)</span>
            </div>
          </div>

          {/* Taste Notes Chips */}
          <div className="journal-field">
            <label>طعم‌یادهای حس‌شده در دهان:</label>
            <div className="tags-selection-grid">
              {TASTE_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tag-chip-btn ${selectedTags.includes(t) ? 'is-active' : ''}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Barista Notes */}
          <div className="journal-field">
            <label>یادداشت شخصی و فیدبک طعم:</label>
            <textarea
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="مثلاً: اسیدیته بسیار زنده و دلنشین بود، کرما غلیظ شد، مناسب نوشیدن همراه با شکلات تلخ."
              rows={3}
              className="journal-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              <span>ذخیره در دفترچه (+۲۰ امتیاز)</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="journal-entries-list">
        {entries.length === 0 ? (
          <div className="journal-empty">
            <p>هنوز تجربه‌ای در دفترچه طعم‌یابی شما ثبت نشده است.</p>
            <span className="empty-sub">با ثبت هر فنجان، مهارت حسی باریستایی خود را تقویت کنید.</span>
          </div>
        ) : (
          <div className="entries-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="journal-card">
                <div className="jcard-top">
                  <div>
                    <span className="jcard-method">{entry.method}</span>
                    <h4 className="jcard-title">{entry.blend}</h4>
                  </div>
                  <button
                    className="jcard-delete"
                    onClick={() => handleDelete(entry.id)}
                    title="حذف این یادداشت"
                    aria-label="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="jcard-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= entry.rating ? 'star-gold' : 'star-gray'}
                    />
                  ))}
                  <span className="jcard-date">{entry.date}</span>
                </div>

                {entry.tags?.length > 0 && (
                  <div className="jcard-tags">
                    {entry.tags.map((tg) => (
                      <span key={tg} className="jcard-tag">☕ {tg}</span>
                    ))}
                  </div>
                )}

                {entry.note && (
                  <p className="jcard-note">«{entry.note}»</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
