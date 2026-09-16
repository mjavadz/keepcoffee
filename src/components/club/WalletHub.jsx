import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  CreditCard,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  ShieldCheck,
  QrCode
} from '../Icons';
import { toPersianDigits, formatToman } from '../../utils/format';
import './WalletHub.css';

// Supported Banks
export const SUPPORTED_BANKS = [
  { id: 'mellat', name: 'بانک ملت', prefix: '610433', color: '#8A1538', accent: '#FF1744', logoText: 'ملت' },
  { id: 'blubank', name: 'بلو بانک (سامان)', prefix: '621986', color: '#0057B7', accent: '#00D2FF', logoText: 'blu' },
  { id: 'parsian', name: 'بانک پارسیان', prefix: '622106', color: '#632735', accent: '#E0A96D', logoText: 'پارسیان' },
  { id: 'mehr', name: 'بانک مهر ایران', prefix: '606373', color: '#0B6B4A', accent: '#00E676', logoText: 'مهر ایران' },
  { id: 'melli', name: 'بانک ملی ایران', prefix: '603799', color: '#1A4B75', accent: '#64B5F6', logoText: 'بانک ملی' },
  { id: 'saderat', name: 'بانک صادرات', prefix: '603769', color: '#1C2E5E', accent: '#82B1FF', logoText: 'صادرات' },
];

// Official Workshop Deposit Addresses for Top-Up
const WORKSHOP_DEPOSIT_WALLETS = {
  evm: {
    address: '0x71C56dF97e14E1568A91E1A29D64a856a938F142',
    networks: ['Ethereum (ERC-20)', 'Binance Smart Chain (BEP-20)'],
    tokens: ['USDT (BEP-20)', 'USDT (ERC-20)', 'ETH'],
  },
  btc: {
    address: 'bc1qkeepcoffeeroasterytehran9982749218',
    networks: ['Bitcoin Network'],
    tokens: ['BTC'],
  },
  sol: {
    address: 'KeepCfRoast69N7wU81B2T3P4Q5R6S7T8U9V1W2X3Y4Z',
    networks: ['Solana Network (SPL)'],
    tokens: ['SOL', 'USDT (SPL)'],
  },
  trx: {
    address: 'TKeepCoffeeRoasteryTronNetwork109283746',
    networks: ['Tron Network (TRC-20)'],
    tokens: ['TRX', 'USDT (TRC-20)'],
  },
};

export default function WalletHub({ user, storageKey }) {
  const [subTab, setSubTab] = useState('overview'); // 'overview' | 'cards' | 'crypto' | 'history'
  const [copiedKey, setCopiedKey] = useState(null);

  // Top-Up Modal State
  const [topupModal, setTopupModal] = useState(null); // 'toman' | 'crypto' | null
  const [topupAmount, setTopupAmount] = useState('250000');
  const [topupCardId, setTopupCardId] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('usdt_bep20');
  const [cryptoTxid, setCryptoTxid] = useState('');
  const [topupNotice, setTopupNotice] = useState('');

  // Local storage state for user wallet assets
  const [tomanBalance, setTomanBalance] = useState(0);
  const [cryptoBalances, setCryptoBalances] = useState({
    usdt: 0,
    btc: 0,
    eth: 0,
    sol: 0,
    trx: 0,
  });

  // Bank Cards
  const [cards, setCards] = useState([
    {
      id: 'c1',
      bankId: 'blubank',
      bankName: 'بلو بانک (سامان)',
      cardNumber: '۶۲۱۹۸۶۱۰۴۴۲۳۸۹۰۱',
      holderName: user?.displayName || 'کاربر کیپ کافی',
      shaba: 'IR890560000000100012345678',
      isDefault: true,
      color: '#0057B7',
      accent: '#00D2FF',
    },
  ]);

  // Crypto Wallets (User personal withdrawal / settlement addresses)
  const [cryptoAddresses, setCryptoAddresses] = useState({
    evm: '', // Single unified address for ETH, BSC BEP-20, USDT BEP-20/ERC-20
    btc: '',
    sol: '',
    trx: '',
  });

  // Financial History
  const [transactions, setTransactions] = useState([]);

  // New card form
  const [newBankId, setNewBankId] = useState('mellat');
  const [newCardNum, setNewCardNum] = useState('');
  const [newHolder, setNewHolder] = useState(user?.displayName || '');
  const [newShaba, setNewShaba] = useState('');
  const [cardFormError, setCardFormError] = useState('');
  const [showAddCardForm, setShowAddCardForm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (!storageKey) return;
    try {
      const savedBalance = localStorage.getItem(`${storageKey}_toman_bal`);
      if (savedBalance) setTomanBalance(Number(savedBalance) || 0);

      const savedCryptoBal = localStorage.getItem(`${storageKey}_crypto_bal`);
      if (savedCryptoBal) setCryptoBalances(JSON.parse(savedCryptoBal));

      const savedCards = localStorage.getItem(`${storageKey}_bank_cards`);
      if (savedCards) setCards(JSON.parse(savedCards));

      const savedWallets = localStorage.getItem(`${storageKey}_crypto_wallets`);
      if (savedWallets) setCryptoAddresses(JSON.parse(savedWallets));

      const savedTxs = localStorage.getItem(`${storageKey}_wallet_txs`);
      if (savedTxs) setTransactions(JSON.parse(savedTxs));
    } catch (e) {
      console.error('Wallet storage load error:', e);
    }
  }, [storageKey]);

  // Auto-detect bank from card number prefix
  const handleCardNumberChange = (raw) => {
    const cleaned = raw.replace(/[^0-9]/g, '').slice(0, 16);
    setNewCardNum(cleaned);
    setCardFormError('');

    if (cleaned.length >= 6) {
      const prefix6 = cleaned.slice(0, 6);
      const matched = SUPPORTED_BANKS.find((b) => prefix6.startsWith(b.prefix.slice(0, 4)) || prefix6 === b.prefix);
      if (matched && matched.id !== newBankId) {
        setNewBankId(matched.id);
      }
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCardNum.length !== 16) {
      setCardFormError('شماره کارت باید دقیقاً ۱۶ رقم باشد.');
      return;
    }
    if (!newHolder.trim()) {
      setCardFormError('نام دارنده کارت الزامی است.');
      return;
    }

    const bank = SUPPORTED_BANKS.find((b) => b.id === newBankId) || SUPPORTED_BANKS[0];
    const newCard = {
      id: 'c_' + Date.now(),
      bankId: bank.id,
      bankName: bank.name,
      cardNumber: toPersianDigits(newCardNum),
      holderName: newHolder.trim(),
      shaba: newShaba.trim() ? (newShaba.startsWith('IR') ? newShaba : 'IR' + newShaba) : '',
      isDefault: cards.length === 0,
      color: bank.color,
      accent: bank.accent,
    };

    const updated = [newCard, ...cards];
    setCards(updated);
    if (storageKey) {
      localStorage.setItem(`${storageKey}_bank_cards`, JSON.stringify(updated));
    }

    setNewCardNum('');
    setNewShaba('');
    setShowAddCardForm(false);
  };

  const handleDeleteCard = (id) => {
    const filtered = cards.filter((c) => c.id !== id);
    setCards(filtered);
    if (storageKey) {
      localStorage.setItem(`${storageKey}_bank_cards`, JSON.stringify(filtered));
    }
  };

  const handleSaveWallets = (e) => {
    e.preventDefault();
    if (storageKey) {
      localStorage.setItem(`${storageKey}_crypto_wallets`, JSON.stringify(cryptoAddresses));
    }
    setTopupNotice('آدرس‌های والت با موفقیت در پروفایل ذخیره شدند ✓');
    setTimeout(() => setTopupNotice(''), 3000);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Top up Toman balance
  const handleExecuteTomanTopup = () => {
    const amount = Number(topupAmount);
    if (!amount || amount < 10000) {
      setTopupNotice('حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است.');
      return;
    }
    const nextBal = tomanBalance + amount;
    setTomanBalance(nextBal);

    const newTx = {
      id: 'tx_' + Date.now(),
      type: 'شارژ تومانی کیف پول',
      amount: `+${formatToman(amount)}`,
      status: 'موفق',
      date: new Date().toLocaleDateString('fa-IR'),
      method: topupCardId ? 'کارت بانکی ثبت‌شده' : 'درگاه پرداخت شتاب',
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

    if (storageKey) {
      localStorage.setItem(`${storageKey}_toman_bal`, String(nextBal));
      localStorage.setItem(`${storageKey}_wallet_txs`, JSON.stringify(nextTxs));
    }

    setTopupModal(null);
    setTopupNotice(`کیف پول تومانی شما با موفقیت مبلغ ${formatToman(amount)} شارژ شد.`);
    setTimeout(() => setTopupNotice(''), 4000);
  };

  // Top up Crypto
  const handleExecuteCryptoDeposit = () => {
    if (!cryptoTxid.trim()) {
      setTopupNotice('لطفاً هش تراکنش (TXID) را وارد نمایید.');
      return;
    }
    // Simulate credited crypto
    const addedUSDT = selectedCrypto.startsWith('usdt') ? 25 : 0;
    const nextCrypto = {
      ...cryptoBalances,
      usdt: cryptoBalances.usdt + (addedUSDT || 10),
    };
    setCryptoBalances(nextCrypto);

    const newTx = {
      id: 'tx_cry_' + Date.now(),
      type: `واریز کریپتو (${selectedCrypto.toUpperCase()})`,
      amount: `+${addedUSDT || 10} USDT`,
      status: 'تایید شبکه (Pending Verification)',
      date: new Date().toLocaleDateString('fa-IR'),
      method: `هش: ${cryptoTxid.slice(0, 10)}...`,
    };
    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

    if (storageKey) {
      localStorage.setItem(`${storageKey}_crypto_bal`, JSON.stringify(nextCrypto));
      localStorage.setItem(`${storageKey}_wallet_txs`, JSON.stringify(nextTxs));
    }

    setTopupModal(null);
    setCryptoTxid('');
    setTopupNotice('تراکنش واریز کریپتو ثبت شد و پس از تایید نود شبکه شارژ می‌شود.');
    setTimeout(() => setTopupNotice(''), 4000);
  };

  return (
    <div className="wallet-hub-container">
      {/* Notice Banner */}
      {topupNotice && (
        <div className="wallet-notice-banner">
          <Sparkles size={18} />
          <span>{topupNotice}</span>
        </div>
      )}

      {/* Sub-Tabs Nav */}
      <div className="wallet-subtabs-nav">
        <button
          type="button"
          className={`subtab-btn ${subTab === 'overview' ? 'is-active' : ''}`}
          onClick={() => setSubTab('overview')}
        >
          <Wallet size={16} />
          <span>موجودی دارایی‌ها</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${subTab === 'cards' ? 'is-active' : ''}`}
          onClick={() => setSubTab('cards')}
        >
          <CreditCard size={16} />
          <span>کارت‌های بانکی ({toPersianDigits(cards.length)})</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${subTab === 'crypto' ? 'is-active' : ''}`}
          onClick={() => setSubTab('crypto')}
        >
          <QrCode size={16} />
          <span>والت‌های کریپتو</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${subTab === 'history' ? 'is-active' : ''}`}
          onClick={() => setSubTab('history')}
        >
          <ShieldCheck size={16} />
          <span>تاریخچه تراکنش‌ها</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BALANCES */}
      {subTab === 'overview' && (
        <div className="wallet-tab-panel">
          <div className="balances-split-grid">
            {/* Toman Balance Card */}
            <div className="balance-card toman-card">
              <div className="balance-card-head">
                <span className="balance-badge toman">کیف پول تومانی (IRR)</span>
                <span className="balance-icon">﷼</span>
              </div>
              <div className="balance-number-wrap">
                <strong className="balance-amount">{formatToman(tomanBalance)}</strong>
                <span className="balance-unit">موجودی نقدی حساب</span>
              </div>
              <p className="balance-desc">
                قابل استفاده برای تسویه سریع سفارش‌های دانه قهوه و تجهیزات بدون نیاز به ورود مجدد به درگاه بانکی.
              </p>
              <div className="balance-actions-row">
                <button
                  type="button"
                  className="btn btn-primary btn-block wallet-topup-btn"
                  onClick={() => setTopupModal('toman')}
                >
                  <ArrowDownLeft size={16} />
                  <span>+ شارژ کیف پول تومانی</span>
                </button>
              </div>
            </div>

            {/* Crypto Portfolio Card */}
            <div className="balance-card crypto-card">
              <div className="balance-card-head">
                <span className="balance-badge crypto">پرتفوی دارایی کریپتو</span>
                <span className="balance-icon">₿</span>
              </div>
              <div className="crypto-tokens-summary">
                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym usdt">USDT</span>
                    <span className="token-name">تتر (BEP-20 / TRC-20)</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.usdt)} USDT</strong>
                </div>

                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym btc">BTC</span>
                    <span className="token-name">بیت‌کوین</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.btc)} BTC</strong>
                </div>

                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym eth">ETH</span>
                    <span className="token-name">اتریوم</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.eth)} ETH</strong>
                </div>

                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym sol">SOL</span>
                    <span className="token-name">سولانا</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.sol)} SOL</strong>
                </div>

                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym trx">TRX</span>
                    <span className="token-name">ترون</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.trx)} TRX</strong>
                </div>
              </div>

              <div className="balance-actions-row">
                <button
                  type="button"
                  className="btn btn-outline btn-block crypto-deposit-btn"
                  onClick={() => setTopupModal('crypto')}
                >
                  <ArrowDownLeft size={16} />
                  <span>+ واریز کریپتو (Deposit)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANK CARDS (MELLAT, PARSIAN, BLUBANK, MEHR, MELLI, SADERAT) */}
      {subTab === 'cards' && (
        <div className="wallet-tab-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="section-sub-title">کارت‌های بانکی عضو شتاب</h3>
              <p className="section-sub-desc">
                پشتیبانی از کارت‌های بانک ملت، پارسیان، بلوبانک، مهر ایران، ملی و صادرات جهت واریز و تسویه امن.
              </p>
            </div>
            {!showAddCardForm && (
              <button
                type="button"
                className="btn btn-primary add-card-trigger"
                onClick={() => setShowAddCardForm(true)}
              >
                <Plus size={16} />
                <span>افزودن کارت بانکی</span>
              </button>
            )}
          </div>

          {/* Add Card Form Modal / Collapsible */}
          {showAddCardForm && (
            <form className="add-bank-card-form" onSubmit={handleAddCard}>
              <div className="form-head-title">
                <h4>ثبت کارت بانکی جدید</h4>
                <button
                  type="button"
                  className="close-form-btn"
                  onClick={() => setShowAddCardForm(false)}
                >
                  ×
                </button>
              </div>

              {cardFormError && <div className="form-error-line">{cardFormError}</div>}

              <div className="form-fields-grid">
                <div className="auth-field">
                  <label htmlFor="bankSelect">بانک صادرکننده</label>
                  <select
                    id="bankSelect"
                    value={newBankId}
                    onChange={(e) => setNewBankId(e.target.value)}
                    className="select-custom"
                  >
                    {SUPPORTED_BANKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (پیش‌شماره {toPersianDigits(b.prefix)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="auth-field">
                  <label htmlFor="cardNumber">شماره ۱۶ رقمی کارت</label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={16}
                    value={newCardNum}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="۶۱۰۴۳۳۷۸..."
                    required
                  />
                  <span className="auth-hint">شماره کارت با ۶ رقم اول به صورت هوشمند شناسایی می‌شود.</span>
                </div>

                <div className="auth-field">
                  <label htmlFor="cardHolder">نام و نام خانوادگی صاحب کارت</label>
                  <input
                    id="cardHolder"
                    type="text"
                    value={newHolder}
                    onChange={(e) => setNewHolder(e.target.value)}
                    placeholder="مطابق با نام روی کارت بانکی"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="cardShaba">شماره شبا (اختیاری)</label>
                  <input
                    id="cardShaba"
                    type="text"
                    dir="ltr"
                    maxLength={26}
                    value={newShaba}
                    onChange={(e) => setNewShaba(e.target.value)}
                    placeholder="IR120140000000..."
                  />
                </div>
              </div>

              <div className="form-actions-bar">
                <button type="submit" className="btn btn-primary">
                  ثبت و تأیید کارت بانکی
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddCardForm(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {/* Cards Grid */}
          <div className="bank-cards-grid">
            {cards.map((c) => {
              const formattedDigits = c.cardNumber.replace(/(.{4})/g, '$1  ').trim();
              return (
                <div
                  key={c.id}
                  className="realistic-bank-card"
                  style={{
                    background: `linear-gradient(135deg, ${c.color} 0%, #101416 100%)`,
                    borderColor: c.accent,
                  }}
                >
                  <div className="card-top-row">
                    <div className="card-bank-badge">
                      <span className="bank-name-label">{c.bankName}</span>
                    </div>
                    <div className="card-chip-graphic" />
                  </div>

                  <div className="card-number-line" dir="ltr">
                    {formattedDigits}
                  </div>

                  <div className="card-bottom-row">
                    <div className="card-holder-block">
                      <span className="card-holder-label">صاحب کارت:</span>
                      <strong className="card-holder-name">{c.holderName}</strong>
                    </div>

                    <div className="card-tools-block">
                      {c.isDefault && <span className="default-pill">کارت اصلی</span>}
                      <button
                        type="button"
                        className="delete-card-btn"
                        onClick={() => handleDeleteCard(c.id)}
                        title="حذف کارت"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CRYPTO WALLET ADDRESSES (EVM Unified, BTC, SOL, TRON) */}
      {subTab === 'crypto' && (
        <div className="wallet-tab-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="section-sub-title">والت‌های رمزارز من (Crypto Hub)</h3>
              <p className="section-sub-desc">
                ثبت آدرس‌های شخصی برای دریافت تسویه، کش‌بک و پاداش‌های کریپتویی خرید قهوه.
              </p>
            </div>
          </div>

          <form className="crypto-addresses-form" onSubmit={handleSaveWallets}>
            {/* EVM Unified (ETH + BSC BEP-20 + USDT) */}
            <div className="crypto-network-card evm">
              <div className="net-header">
                <div className="net-badge">
                  <span className="net-pill evm">EVM Unified (0x...)</span>
                  <span className="net-tokens">Ethereum + Binance Smart Chain (BEP-20) + USDT</span>
                </div>
                <span className="net-sub-note">آدرس مشترک تمامی شبکه‌های بر پایه اتریوم و زنجیره بایننس</span>
              </div>

              <div className="net-input-wrap">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="0x71C56dF97e14E1568A91E1A29D64a856a938F142..."
                  value={cryptoAddresses.evm}
                  onChange={(e) => setCryptoAddresses({ ...cryptoAddresses, evm: e.target.value })}
                />
                {cryptoAddresses.evm && (
                  <button
                    type="button"
                    className="copy-net-btn"
                    onClick={() => handleCopy(cryptoAddresses.evm, 'evm')}
                  >
                    {copiedKey === 'evm' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Bitcoin (BTC) */}
            <div className="crypto-network-card btc">
              <div className="net-header">
                <div className="net-badge">
                  <span className="net-pill btc">Bitcoin Network</span>
                  <span className="net-tokens">BTC (SegWit / Native)</span>
                </div>
                <span className="net-sub-note">آدرس شبکه رسمی بیت‌کوین (شروع با bc1 یا 1)</span>
              </div>

              <div className="net-input-wrap">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="bc1qkeepcoffee9982749218..."
                  value={cryptoAddresses.btc}
                  onChange={(e) => setCryptoAddresses({ ...cryptoAddresses, btc: e.target.value })}
                />
                {cryptoAddresses.btc && (
                  <button
                    type="button"
                    className="copy-net-btn"
                    onClick={() => handleCopy(cryptoAddresses.btc, 'btc')}
                  >
                    {copiedKey === 'btc' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Solana (SOL) */}
            <div className="crypto-network-card sol">
              <div className="net-header">
                <div className="net-badge">
                  <span className="net-pill sol">Solana Network</span>
                  <span className="net-tokens">SOL + SPL Tokens</span>
                </div>
                <span className="net-sub-note">آدرس والت شبکه فوق‌سریع سولانا</span>
              </div>

              <div className="net-input-wrap">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="KeepCfRoast69N7wU81B2T3P4Q5R6S7..."
                  value={cryptoAddresses.sol}
                  onChange={(e) => setCryptoAddresses({ ...cryptoAddresses, sol: e.target.value })}
                />
                {cryptoAddresses.sol && (
                  <button
                    type="button"
                    className="copy-net-btn"
                    onClick={() => handleCopy(cryptoAddresses.sol, 'sol')}
                  >
                    {copiedKey === 'sol' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Tron (TRX / USDT TRC-20) */}
            <div className="crypto-network-card trx">
              <div className="net-header">
                <div className="net-badge">
                  <span className="net-pill trx">Tron Network</span>
                  <span className="net-tokens">TRX + USDT (TRC-20)</span>
                </div>
                <span className="net-sub-note">آدرس شبکه ترون (شروع با حرف T)</span>
              </div>

              <div className="net-input-wrap">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="TKeepCoffeeRoasteryTronNetwork1092..."
                  value={cryptoAddresses.trx}
                  onChange={(e) => setCryptoAddresses({ ...cryptoAddresses, trx: e.target.value })}
                />
                {cryptoAddresses.trx && (
                  <button
                    type="button"
                    className="copy-net-btn"
                    onClick={() => handleCopy(cryptoAddresses.trx, 'trx')}
                  >
                    {copiedKey === 'trx' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            <div className="crypto-save-actions">
              <button type="submit" className="btn btn-primary">
                ذخیره آدرس‌های والت در دیتابیس پروفایل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: TRANSACTION HISTORY */}
      {subTab === 'history' && (
        <div className="wallet-tab-panel">
          <h3 className="section-sub-title">ریز تراکنش‌های کیف پول الکترونیکی</h3>
          {transactions.length === 0 ? (
            <div className="empty-tx-card">
              <ShieldCheck size={32} className="gold-icon" />
              <p>هنوز تراکنشی برای کیف پول شما ثبت نشده است.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setTopupModal('toman')}
              >
                شارژ موجودی تومانی
              </button>
            </div>
          ) : (
            <div className="tx-table-wrap">
              <table className="wallet-tx-table">
                <thead>
                  <tr>
                    <th>عنوان تراکنش</th>
                    <th>روش / مرجع</th>
                    <th>تاریخ</th>
                    <th>مبلغ</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td><strong>{tx.type}</strong></td>
                      <td><span className="tx-method-tag">{tx.method}</span></td>
                      <td>{tx.date}</td>
                      <td className="tx-amount-green">{tx.amount}</td>
                      <td><span className="status-badge-ok">{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: TOMAN TOP-UP */}
      {topupModal === 'toman' && (
        <div className="wallet-modal-backdrop" onClick={() => setTopupModal(null)}>
          <div className="wallet-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>شارژ کیف پول تومانی (IRR)</h3>
              <button className="modal-close-btn" onClick={() => setTopupModal(null)}>×</button>
            </div>

            <div className="modal-body-content">
              <span className="field-lbl">انتخاب مبلغ شارژ:</span>
              <div className="preset-amounts-grid">
                {['100000', '250000', '500000', '1000000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`preset-btn ${topupAmount === amt ? 'is-selected' : ''}`}
                    onClick={() => setTopupAmount(amt)}
                  >
                    {formatToman(Number(amt))}
                  </button>
                ))}
              </div>

              <div className="auth-field" style={{ marginTop: '14px' }}>
                <label htmlFor="customAmt">مبلغ دلخواه (تومان):</label>
                <input
                  id="customAmt"
                  type="number"
                  dir="ltr"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="cardSelect">پرداخت با کارت بانکی:</label>
                <select
                  id="cardSelect"
                  className="select-custom"
                  value={topupCardId}
                  onChange={(e) => setTopupCardId(e.target.value)}
                >
                  <option value="">درگاه مستقیم بانکی شتاب (شاپرک)</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.bankName} - {c.cardNumber.slice(-4)} ({c.holderName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleExecuteTomanTopup}
                >
                  تأیید و شارژ {formatToman(Number(topupAmount) || 0)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CRYPTO DEPOSIT */}
      {topupModal === 'crypto' && (
        <div className="wallet-modal-backdrop" onClick={() => setTopupModal(null)}>
          <div className="wallet-modal-box crypto-deposit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>واریز رمزارز (Crypto Deposit)</h3>
              <button className="modal-close-btn" onClick={() => setTopupModal(null)}>×</button>
            </div>

            <div className="modal-body-content">
              <div className="crypto-select-network">
                <span className="field-lbl">انتخاب رمزارز و شبکه واریز:</span>
                <div className="crypto-pill-options">
                  {[
                    { id: 'usdt_bep20', label: 'USDT (BEP-20 / BSC)', net: 'evm' },
                    { id: 'usdt_trc20', label: 'USDT (TRC-20 / Tron)', net: 'trx' },
                    { id: 'btc', label: 'Bitcoin (BTC)', net: 'btc' },
                    { id: 'sol', label: 'Solana (SOL)', net: 'sol' },
                    { id: 'eth', label: 'Ethereum (ERC-20)', net: 'evm' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`crypto-opt-btn ${selectedCrypto === opt.id ? 'is-active' : ''}`}
                      onClick={() => setSelectedCrypto(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Roastery Official Deposit Wallet for this network */}
              {(() => {
                const netKey =
                  selectedCrypto.includes('bep20') || selectedCrypto === 'eth'
                    ? 'evm'
                    : selectedCrypto.includes('trc20')
                    ? 'trx'
                    : selectedCrypto === 'btc'
                    ? 'btc'
                    : 'sol';
                const info = WORKSHOP_DEPOSIT_WALLETS[netKey];
                return (
                  <div className="workshop-address-display">
                    <span className="net-tag-pill">شبکه مقصد: {info.networks.join(' / ')}</span>
                    <span className="addr-lbl">آدرس رسمی کیف پول واریزی کیپ کافی:</span>
                    <div className="addr-box" dir="ltr">
                      <code>{info.address}</code>
                      <button
                        type="button"
                        className="copy-btn-sm"
                        onClick={() => handleCopy(info.address, 'workshop_' + netKey)}
                      >
                        {copiedKey === 'workshop_' + netKey ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="auth-field" style={{ marginTop: '16px' }}>
                <label htmlFor="txidInput">کد رهگیری / هش تراکنش واریزی (TXID):</label>
                <input
                  id="txidInput"
                  type="text"
                  dir="ltr"
                  placeholder="هش تراکنش دریافتی از کیف پول یا صرافی..."
                  value={cryptoTxid}
                  onChange={(e) => setCryptoTxid(e.target.value)}
                />
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleExecuteCryptoDeposit}
                >
                  ثبت تراکنش واریزی جهت شارژ حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
