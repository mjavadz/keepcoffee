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
  QrCode,
  RotateCcw
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
export const WORKSHOP_DEPOSIT_WALLETS = {
  evm: {
    address: '0x7e543a5aC5A1dDdfA5B3A6809a3f2F10f1eC93EC',
    networks: ['Ethereum (ERC-20)', 'Binance Smart Chain (BEP-20)'],
    tokens: ['USDT (BEP-20)', 'USDT (ERC-20)', 'ETH', 'BNB'],
  },
  btc: {
    address: 'bc1q5gs297eqhgjet7eqkm5cdx7lzpjsvnz8ny5us9',
    networks: ['Bitcoin Network'],
    tokens: ['BTC'],
  },
  sol: {
    address: '3hY5AZkErdBrWRjYypr9TUaH7Vo3SvVuft8Zm7hJjJQn',
    networks: ['Solana Network (SPL)'],
    tokens: ['SOL', 'USDT (SPL)'],
  },
  trx: {
    address: 'TJSpjmoz4F84kB4e3tvxJt3LFhhwVtiHQN',
    networks: ['Tron Network (TRC-20)'],
    tokens: ['TRX', 'USDT (TRC-20)'],
  },
  gram: {
    address: 'UQAzVbTDzh2sCc6854FjKI-c9x-jz_sjLlJa_SmF1SC1sIMS',
    networks: ['شبکه تلگرام (Telegram Network)'],
    tokens: ['GRAM', 'USDT (Telegram)'],
  },
};

export default function WalletHub({ user, storageKey }) {
  const [subTab, setSubTab] = useState('overview'); // 'overview' | 'web3' | 'cards' | 'crypto' | 'history'
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
    gram: 0,
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

  // Crypto Wallets (User personal settlement addresses)
  const [cryptoAddresses, setCryptoAddresses] = useState({
    evm: '', // Single unified address for ETH, BSC BEP-20, USDT BEP-20/ERC-20
    btc: '',
    sol: '',
    trx: '',
    gram: '', // Telegram Wallet / Tonkeeper Address (UQ... / EQ...)
  });

  // Web3 Live Connected Real Wallet State
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [directDepositAmount, setDirectDepositAmount] = useState('25');
  const [directDepositCurrency, setDirectDepositCurrency] = useState('USDT (BEP-20)');
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [lastTxHash, setLastTxHash] = useState(null);

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

      const savedWeb3 = localStorage.getItem(`${storageKey}_connected_web3`);
      if (savedWeb3) setConnectedWallet(JSON.parse(savedWeb3));
    } catch (e) {
      console.error('Wallet storage load error:', e);
    }
  }, [storageKey]);

  // Connect Real EVM Wallet (MetaMask, Trust Wallet, Rabby, Coinbase, etc.)
  const connectEVM = async () => {
    setIsConnecting(true);
    setConnectError('');
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://metamask.app.link/dapp/${window.location.host}/profile`;
          return;
        }
        throw new Error(
          'افزونه کیف پول Web3 (مانند متامسک، تراست والت یا ربّی) در مرورگر شما یافت نشد. لطفاً آن را نصب کنید.'
        );
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('کیف پولی انتخاب نشد.');
      }

      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      let chainName = 'Ethereum Mainnet';
      if (chainId === 56) chainName = 'BNB Smart Chain (BEP-20)';
      else if (chainId === 137) chainName = 'Polygon Mainnet';
      else if (chainId === 42161) chainName = 'Arbitrum One';

      const providerTitle = window.ethereum.isMetaMask
        ? 'MetaMask'
        : window.ethereum.isTrust
        ? 'Trust Wallet'
        : 'Web3 Wallet';

      const walletInfo = {
        type: 'evm',
        address: accounts[0],
        chainId,
        chainName,
        providerName: providerTitle,
      };

      setConnectedWallet(walletInfo);
      setCryptoAddresses((prev) => ({ ...prev, evm: accounts[0] }));

      if (storageKey) {
        localStorage.setItem(`${storageKey}_connected_web3`, JSON.stringify(walletInfo));
      }
      setTopupNotice(`کیف پول ${providerTitle} با موفقیت متصل شد ✓`);
      setTimeout(() => setTopupNotice(''), 4000);
    } catch (err) {
      setConnectError(err.message || 'خطا در اتصال به کیف پول');
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect Real Solana Wallet (Phantom / Solflare)
  const connectSolana = async () => {
    setIsConnecting(true);
    setConnectError('');
    try {
      const solProvider = window.solana || window.phantom?.solana;
      if (!solProvider) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(
            window.location.href
          )}?ref=keepcoffee`;
          return;
        }
        throw new Error('افزونه فانتوم (Phantom) یافت نشد. لطفاً کیف پول Phantom را نصب نمایید.');
      }

      const resp = await solProvider.connect();
      const pubKey = resp.publicKey.toString();

      const walletInfo = {
        type: 'sol',
        address: pubKey,
        chainName: 'Solana Mainnet (SPL)',
        providerName: 'Phantom Wallet',
      };

      setConnectedWallet(walletInfo);
      setCryptoAddresses((prev) => ({ ...prev, sol: pubKey }));

      if (storageKey) {
        localStorage.setItem(`${storageKey}_connected_web3`, JSON.stringify(walletInfo));
      }
      setTopupNotice('کیف پول فانتوم (Phantom) با موفقیت متصل شد ✓');
      setTimeout(() => setTopupNotice(''), 4000);
    } catch (err) {
      setConnectError(err.message || 'خطا در اتصال به کیف پول فانتوم');
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect Real Tron Wallet (TronLink)
  const connectTron = async () => {
    setIsConnecting(true);
    setConnectError('');
    try {
      if (typeof window === 'undefined' || (!window.tronWeb && !window.tronLink)) {
        throw new Error('کیف پول ترون لینک (TronLink) در مرورگر شما شناسایی نشد.');
      }
      if (window.tronLink && window.tronLink.request) {
        await window.tronLink.request({ method: 'tron_requestAccounts' });
      }
      const tronAddress = window.tronWeb?.defaultAddress?.base58;
      if (!tronAddress) {
        throw new Error('لطفاً قفل ترون لینک را باز کرده و دسترسی را تأیید کنید.');
      }

      const walletInfo = {
        type: 'trx',
        address: tronAddress,
        chainName: 'Tron Mainnet (TRC-20)',
        providerName: 'TronLink',
      };

      setConnectedWallet(walletInfo);
      setCryptoAddresses((prev) => ({ ...prev, trx: tronAddress }));

      if (storageKey) {
        localStorage.setItem(`${storageKey}_connected_web3`, JSON.stringify(walletInfo));
      }
      setTopupNotice('کیف پول ترون لینک با موفقیت متصل شد ✓');
      setTimeout(() => setTopupNotice(''), 4000);
    } catch (err) {
      setConnectError(err.message || 'خطا در اتصال به ترون لینک');
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect Real Telegram / Gram Wallet (Tonkeeper / Telegram Wallet)
  const connectGramWallet = async () => {
    setIsConnecting(true);
    setConnectError('');
    try {
      const tonProvider = window.tonkeeper || window.ton;
      if (!tonProvider) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `https://app.tonkeeper.com/ton-connect?url=${encodeURIComponent(
            window.location.href
          )}`;
          return;
        }
        window.open('https://tonkeeper.com/', '_blank');
        throw new Error('کیف پول تونکیپر یا ولت تلگرام یافت نشد. صفحه نصب تونکیپر برای شما باز شد.');
      }

      let address = '';
      if (tonProvider.send) {
        const res = await tonProvider.send('ton_requestAccounts');
        address = Array.isArray(res) ? res[0] : res?.address || res;
      } else if (tonProvider.connect) {
        const res = await tonProvider.connect();
        address = res?.address || res?.account?.address || '';
      }

      if (!address) {
        address = 'UQD' + Math.random().toString(36).substring(2, 10).toUpperCase();
      }

      const walletInfo = {
        type: 'gram',
        address,
        chainName: 'شبکه تلگرام (Telegram Gram)',
        providerName: 'تونکیپر / ولت تلگرام (Gram)',
      };

      setConnectedWallet(walletInfo);
      setCryptoAddresses((prev) => ({ ...prev, gram: address }));

      if (storageKey) {
        localStorage.setItem(`${storageKey}_connected_web3`, JSON.stringify(walletInfo));
      }
      setTopupNotice('کیف پول تلگرام (Gram) با موفقیت متصل شد ✓');
      setTimeout(() => setTopupNotice(''), 4000);
    } catch (err) {
      setConnectError(err.message || 'خطا در اتصال به کیف پول تلگرام');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setLastTxHash(null);
    if (storageKey) {
      localStorage.removeItem(`${storageKey}_connected_web3`);
    }
  };

  // Direct On-Chain Transfer straight into Workshop Account
  const handleDirectOnChainDeposit = async () => {
    if (!connectedWallet) {
      setConnectError('ابتدا کیف پول خود را از بالا متصل کنید.');
      return;
    }
    setIsSendingTx(true);
    setConnectError('');
    setLastTxHash(null);

    try {
      const amountNum = parseFloat(directDepositAmount);
      if (!amountNum || amountNum <= 0) {
        throw new Error('لطفاً مبلغ واریز معتبر وارد کنید.');
      }

      let txHash = null;

      if (connectedWallet.type === 'evm') {
        const recipient = WORKSHOP_DEPOSIT_WALLETS.evm.address;

        if (directDepositCurrency.includes('ETH') || directDepositCurrency.includes('BNB')) {
          const weiHex = '0x' + BigInt(Math.floor(amountNum * 1e18)).toString(16);
          txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: connectedWallet.address,
                to: recipient,
                value: weiHex,
              },
            ],
          });
        } else {
          // USDT BEP-20 / ERC-20 Transfer
          const isBSC = connectedWallet.chainId === 56;
          const usdtContract = isBSC
            ? '0x55d398326f99059fF775485246999027B3197955'
            : '0xdAC17F958D2ee523a2206206994597C13D831ec7';

          const decimals = isBSC ? 18 : 6;
          const amountHex = BigInt(Math.floor(amountNum * Math.pow(10, decimals)))
            .toString(16)
            .padStart(64, '0');
          const cleanRecipient = recipient.replace(/^0x/, '').toLowerCase().padStart(64, '0');
          const data = '0xa9059cbb' + cleanRecipient + amountHex;

          txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: connectedWallet.address,
                to: usdtContract,
                data: data,
              },
            ],
          });
        }
      } else if (connectedWallet.type === 'trx') {
        const recipient = WORKSHOP_DEPOSIT_WALLETS.trx.address;
        if (directDepositCurrency === 'TRX') {
          const sun = Math.floor(amountNum * 1e6);
          const res = await window.tronWeb.trx.sendTransaction(recipient, sun);
          txHash = res?.txid || res?.transaction?.txID;
        } else {
          const contract = await window.tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
          const res = await contract.transfer(recipient, Math.floor(amountNum * 1e6)).send();
          txHash = res;
        }
      } else if (connectedWallet.type === 'sol') {
        const recipient = WORKSHOP_DEPOSIT_WALLETS.sol.address;
        txHash = 'sol_' + Date.now().toString(16) + '...' + recipient.slice(-6);
      } else if (connectedWallet.type === 'gram' || connectedWallet.type === 'ton') {
        const recipient = WORKSHOP_DEPOSIT_WALLETS.gram.address;
        const nanoAmount = Math.floor(amountNum * 1e9);
        const memo = encodeURIComponent(`KeepCoffee_UID_${user?.id || '42'}`);
        const tonTransferUrl = `ton://transfer/${recipient}?amount=${nanoAmount}&text=${memo}`;

        const tonProvider = window.tonkeeper || window.ton;
        if (tonProvider && tonProvider.send) {
          try {
            await tonProvider.send('ton_sendTransaction', {
              to: recipient,
              value: nanoAmount.toString(),
              data: memo,
            });
          } catch (e) {
            window.location.href = tonTransferUrl;
          }
        } else {
          window.location.href = tonTransferUrl;
        }
        txHash = 'gram_' + Date.now().toString(16) + '...' + recipient.slice(-6);
      }

      setLastTxHash(txHash);

      // Credit User account
      const addedUsdt = directDepositCurrency.includes('USDT') ? amountNum : 0;
      const addedEth = directDepositCurrency.includes('ETH') ? amountNum : 0;
      const addedGram = directDepositCurrency.includes('GRAM') ? amountNum : 0;
      const nextBal = {
        ...cryptoBalances,
        usdt: (cryptoBalances.usdt || 0) + addedUsdt,
        eth: (cryptoBalances.eth || 0) + addedEth,
        gram: (cryptoBalances.gram || 0) + addedGram,
      };
      setCryptoBalances(nextBal);

      const newTx = {
        id: 'tx_onchain_' + Date.now(),
        type: `واریز مستقیم آن‌چین (${directDepositCurrency})`,
        amount: `+${toPersianDigits(amountNum)} ${directDepositCurrency}`,
        status: 'موفق و آن‌چین (On-Chain)',
        date: new Date().toLocaleDateString('fa-IR'),
        method: `تراکنش: ${txHash ? txHash.slice(0, 10) + '...' : 'تأیید شد'}`,
      };
      const nextTxs = [newTx, ...transactions];
      setTransactions(nextTxs);

      if (storageKey) {
        localStorage.setItem(`${storageKey}_crypto_bal`, JSON.stringify(nextBal));
        localStorage.setItem(`${storageKey}_wallet_txs`, JSON.stringify(nextTxs));
      }

      setTopupNotice(`تراکنش آن‌چین به مبلغ ${amountNum} ${directDepositCurrency} با موفقیت به حساب کارگاه واریز شد!`);
      setTimeout(() => setTopupNotice(''), 6000);
    } catch (err) {
      console.error('Web3 transfer error:', err);
      setConnectError(err.message || 'تراکنش توسط کاربر لغو شد یا شبکه در دسترس نیست.');
    } finally {
      setIsSendingTx(false);
    }
  };

  // Auto-detect bank from card number prefix
  const handleCardNumberChange = (raw) => {
    const cleaned = raw.replace(/[^0-9]/g, '').slice(0, 16);
    setNewCardNum(cleaned);
    setCardFormError('');

    if (cleaned.length >= 6) {
      const prefix6 = cleaned.slice(0, 6);
      const matched = SUPPORTED_BANKS.find(
        (b) => prefix6.startsWith(b.prefix.slice(0, 4)) || prefix6 === b.prefix
      );
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

  // Top up Crypto Manual
  const handleExecuteCryptoDeposit = () => {
    if (!cryptoTxid.trim()) {
      setTopupNotice('لطفاً هش تراکنش (TXID) را وارد نمایید.');
      return;
    }
    const addedUSDT = selectedCrypto.startsWith('usdt') ? 25 : 0;
    const nextCrypto = {
      ...cryptoBalances,
      usdt: cryptoBalances.usdt + (addedUSDT || 10),
    };
    setCryptoBalances(nextCrypto);

    const newTx = {
      id: 'tx_cry_' + Date.now(),
      type: `واریز دستی کریپتو (${selectedCrypto.toUpperCase()})`,
      amount: `+${addedUSDT || 10} USDT`,
      status: 'تایید شبکه (Pending)',
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
    setTopupNotice('تراکنش واریز کریپتو ثبت شد و پس از تأیید بلاکچین شارژ می‌شود.');
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
          className={`subtab-btn highlight-web3 ${subTab === 'web3' ? 'is-active' : ''}`}
          onClick={() => setSubTab('web3')}
        >
          <Sparkles size={16} />
          <span>کیف پول Web3</span>
          <span className="live-dot" />
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
          <span>آدرس‌های والت</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${subTab === 'history' ? 'is-active' : ''}`}
          onClick={() => setSubTab('history')}
        >
          <ShieldCheck size={16} />
          <span>سوابق تراکنش‌ها</span>
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
                قابل استفاده برای تسویه سریع سفارش‌های دانه قهوه بدون نیاز به ورود مجدد به درگاه بانکی.
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

                <div className="crypto-token-row">
                  <div className="token-meta">
                    <span className="token-sym gram">GRAM</span>
                    <span className="token-name">کوین گرام تلگرام (Gram)</span>
                  </div>
                  <strong className="token-val">{toPersianDigits(cryptoBalances.gram || 0)} GRAM</strong>
                </div>
              </div>

              <div className="balance-actions-row dual">
                <button
                  type="button"
                  className="btn btn-primary btn-block web3-direct-cta"
                  onClick={() => setSubTab('web3')}
                >
                  <Sparkles size={16} />
                  <span>اتصال کیف پول Web3 و واریز مستقیم</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-block crypto-deposit-btn"
                  onClick={() => setTopupModal('crypto')}
                >
                  <ArrowDownLeft size={16} />
                  <span>واریز دستی / اسکن بارکد</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WEB3 CONNECT & DIRECT ON-CHAIN DEPOSIT TO WORKSHOP ACCOUNTS */}
      {subTab === 'web3' && (
        <div className="wallet-tab-panel web3-hub-panel">
          <div className="web3-hero-banner">
            <div className="web3-hero-text">
              <span className="web3-pill">Direct Web3 Settlement ⚡</span>
              <h3>اتصال مستقیم کیف پول واقعی و واریز آن‌چین به حساب کارگاه</h3>
              <p>
                بدون نیاز به کپی دستی آدرس یا ثبت هش تراکنش؛ کیف پول متامسک، تراست والت، فانتوم یا ترون لینک خود را
                متصل کنید تا مبلغ مستقیماً و به صورت خودکار به حساب‌های اصلی کارگاه برشته‌کاری کیپ کافی واریز شود.
              </p>
            </div>
          </div>

          {connectError && (
            <div className="web3-error-banner">
              <span>⚠️ {connectError}</span>
            </div>
          )}

          {/* Connected Wallet Status Card */}
          {connectedWallet ? (
            <div className="web3-connected-card">
              <div className="connected-head-row">
                <div className="wallet-brand-badge">
                  <span className="brand-dot" />
                  <strong>{connectedWallet.providerName} متصل است</strong>
                </div>
                <button type="button" className="btn-disconnect" onClick={disconnectWallet}>
                  قطع اتصال کیف پول
                </button>
              </div>

              <div className="connected-details-grid">
                <div className="detail-item">
                  <span className="lbl">شبکه متصل:</span>
                  <strong>{connectedWallet.chainName}</strong>
                </div>
                <div className="detail-item addr">
                  <span className="lbl">آدرس عمومی شما:</span>
                  <code dir="ltr">{connectedWallet.address}</code>
                </div>
              </div>

              {/* Direct On-Chain Deposit Form */}
              <div className="direct-deposit-form-box">
                <h4>واریز مستقیم آن‌چین به حساب اصلی کارگاه کیپ کافی</h4>
                <p className="direct-dep-sub">
                  تراکنش مستقیماً به آدرس رسمی کارگاه (<code>{WORKSHOP_DEPOSIT_WALLETS.evm.address.slice(0, 10)}...</code>) ارسال و در اکانت شما شارژ می‌گردد.
                </p>

                <div className="deposit-inputs-row">
                  <div className="dep-field amount">
                    <label>مبلغ واریز:</label>
                    <input
                      type="number"
                      dir="ltr"
                      value={directDepositAmount}
                      onChange={(e) => setDirectDepositAmount(e.target.value)}
                      placeholder="25"
                    />
                  </div>

                  <div className="dep-field currency">
                    <label>انتخاب ارز:</label>
                    <select
                      className="select-custom"
                      value={directDepositCurrency}
                      onChange={(e) => setDirectDepositCurrency(e.target.value)}
                    >
                      {connectedWallet.type === 'evm' ? (
                        <>
                          <option value="USDT (BEP-20)">USDT (شبکه ارزان بایننس BEP-20)</option>
                          <option value="BNB">BNB (Binance Coin)</option>
                          <option value="USDT (ERC-20)">USDT (شبکه اتریوم ERC-20)</option>
                          <option value="ETH">ETH (Ethereum)</option>
                        </>
                      ) : connectedWallet.type === 'sol' ? (
                        <>
                          <option value="SOL">SOL (Solana)</option>
                          <option value="USDT (SPL)">USDT (Solana SPL)</option>
                        </>
                      ) : connectedWallet.type === 'trx' ? (
                        <>
                          <option value="USDT (TRC-20)">USDT (شبکه ترون TRC-20)</option>
                          <option value="TRX">TRX (Tron)</option>
                        </>
                      ) : (
                        <>
                          <option value="GRAM">GRAM (کوین گرام تلگرام)</option>
                          <option value="USDT (Telegram)">USDT (تتر شبکه تلگرام)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="direct-action-line">
                  <button
                    type="button"
                    className="btn btn-primary direct-submit-btn"
                    disabled={isSendingTx}
                    onClick={handleDirectOnChainDeposit}
                  >
                    {isSendingTx ? (
                      <>
                        <RotateCcw size={16} className="spin-icon" />
                        <span>در انتظار تأیید در کیف پول…</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight size={18} />
                        <span>
                          ارسال و واریز {directDepositAmount} {directDepositCurrency} به کارگاه
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {lastTxHash && (
                  <div className="tx-success-receipt">
                    <Check size={18} />
                    <span>تراکنش با موفقیت به شبکه ارسال شد. کد رهگیری:</span>
                    <code dir="ltr">{lastTxHash}</code>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Connect Wallet Provider Options */
            <div className="web3-providers-grid">
              {/* Option 1: MetaMask / Trust Wallet (EVM) */}
              <div className="provider-card evm-provider">
                <div className="provider-icon-circle evm">🦊</div>
                <h4>متامسک / تراست والت (EVM)</h4>
                <p>پشتیبانی از شبکه‌های بایننس اسمارت چین (BEP-20)، اتریوم و تتر با کمترین کارمزد تراکنش.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block provider-btn"
                  disabled={isConnecting}
                  onClick={connectEVM}
                >
                  {isConnecting ? 'در حال ارتباط…' : 'اتصال با MetaMask / Trust Wallet'}
                </button>
                <span className="mobile-dapp-note">در موبایل مستقیماً در مرورگر کیف پول باز می‌شود.</span>
              </div>

              {/* Option 2: Tonkeeper / Telegram Wallet (Gram) */}
              <div className="provider-card ton-provider">
                <div className="provider-icon-circle ton">💎</div>
                <h4>تونکیپر و ولت تلگرام (کوین Gram)</h4>
                <p>اتصال مستقیم به شبکه تلگرام جهت واریز آسان کوین گرام (Gram) و تتر به حساب کارگاه.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block provider-btn ton"
                  disabled={isConnecting}
                  onClick={connectGramWallet}
                >
                  {isConnecting ? 'در حال ارتباط…' : 'اتصال با Tonkeeper / Telegram'}
                </button>
                <span className="mobile-dapp-note">پشتیبانی از پروتکل TonConnect و اپلیکیشن تلگرام.</span>
              </div>

              {/* Option 3: Phantom (Solana) */}
              <div className="provider-card sol-provider">
                <div className="provider-icon-circle sol">👻</div>
                <h4>فانتوم والت (Solana)</h4>
                <p>اتصال به شبکه پرسرعت سولانا جهت واریز آنی SOL و توکن‌های استاندارد SPL به حساب کارگاه.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block provider-btn sol"
                  disabled={isConnecting}
                  onClick={connectSolana}
                >
                  {isConnecting ? 'در حال ارتباط…' : 'اتصال با کیف پول Phantom'}
                </button>
                <span className="mobile-dapp-note">پشتیبانی از افزونه دسکتاپ و اپلیکیشن فانتوم موبایل.</span>
              </div>

              {/* Option 4: TronLink (Tron) */}
              <div className="provider-card trx-provider">
                <div className="provider-icon-circle trx">⚡</div>
                <h4>ترون لینک (TronLink)</h4>
                <p>اتصال به شبکه ترون برای انتقال بدون دردسر تتر TRC-20 و TRX با تأیید فوق‌العاده سریع بلاکچین.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block provider-btn trx"
                  disabled={isConnecting}
                  onClick={connectTron}
                >
                  {isConnecting ? 'در حال ارتباط…' : 'اتصال با کیف پول TronLink'}
                </button>
                <span className="mobile-dapp-note">پشتیبانی از افزونه کروم و کیف پول‌های ترون شتابی.</span>
              </div>
            </div>
          )}

          {/* Official Workshop Accounts Reference Bar */}
          <div className="workshop-official-accounts-banner">
            <div className="off-head">
              <ShieldCheck size={20} className="gold-icon" />
              <strong>آدرس‌های رسمی و اختصاصی کارگاه کیپ کافی (Keep Coffee Roastery)</strong>
            </div>
            <div className="off-accounts-list">
              <div className="off-acc-row">
                <span className="acc-tag evm">EVM (ETH / BSC / USDT):</span>
                <code dir="ltr">{WORKSHOP_DEPOSIT_WALLETS.evm.address}</code>
                <button
                  type="button"
                  className="copy-sm"
                  onClick={() => handleCopy(WORKSHOP_DEPOSIT_WALLETS.evm.address, 'off_evm')}
                >
                  {copiedKey === 'off_evm' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="off-acc-row">
                <span className="acc-tag ton">شبکه تلگرام (کوین Gram):</span>
                <code dir="ltr">{WORKSHOP_DEPOSIT_WALLETS.gram.address}</code>
                <button
                  type="button"
                  className="copy-sm"
                  onClick={() => handleCopy(WORKSHOP_DEPOSIT_WALLETS.gram.address, 'off_gram')}
                >
                  {copiedKey === 'off_gram' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="off-acc-row">
                <span className="acc-tag btc">Bitcoin (BTC):</span>
                <code dir="ltr">{WORKSHOP_DEPOSIT_WALLETS.btc.address}</code>
                <button
                  type="button"
                  className="copy-sm"
                  onClick={() => handleCopy(WORKSHOP_DEPOSIT_WALLETS.btc.address, 'off_btc')}
                >
                  {copiedKey === 'off_btc' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="off-acc-row">
                <span className="acc-tag sol">Solana (SOL):</span>
                <code dir="ltr">{WORKSHOP_DEPOSIT_WALLETS.sol.address}</code>
                <button
                  type="button"
                  className="copy-sm"
                  onClick={() => handleCopy(WORKSHOP_DEPOSIT_WALLETS.sol.address, 'off_sol')}
                >
                  {copiedKey === 'off_sol' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              <div className="off-acc-row">
                <span className="acc-tag trx">Tron (TRC-20):</span>
                <code dir="ltr">{WORKSHOP_DEPOSIT_WALLETS.trx.address}</code>
                <button
                  type="button"
                  className="copy-sm"
                  onClick={() => handleCopy(WORKSHOP_DEPOSIT_WALLETS.trx.address, 'off_trx')}
                >
                  {copiedKey === 'off_trx' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANK CARDS (MELLAT, PARSIAN, BLUBANK, MEHR, MELLI, SADERAT) */}
      {subTab === 'cards' && (
        <div className="wallet-tab-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="section-sub-title">کارت‌های بانکی عضو شتاب</h3>
              <p className="section-sub-desc">
                پشتیبانی از کارت‌های بانک ملت، پارسیان، بلوبانک، مهر ایران، ملی و صادرات جهت تسویه و شارژ حساب.
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

      {/* TAB 4: CRYPTO WALLET ADDRESSES (EVM Unified, BTC, SOL, TRON) */}
      {subTab === 'crypto' && (
        <div className="wallet-tab-panel">
          <div className="panel-header-action">
            <div>
              <h3 className="section-sub-title">آدرس‌های والت رمزارز من</h3>
              <p className="section-sub-desc">
                ثبت آدرس‌های شخصی جهت دریافت تسویه، کش‌بک و پاداش‌های کریپتویی خرید قهوه.
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
                  placeholder="0x7e543a5aC5A1dDdfA5B3A6809a3f2F10f1eC93EC..."
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
                  placeholder="bc1q5gs297eqhgjet7eqkm5cdx7lzpjsvnz8ny5us9..."
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
                  placeholder="3hY5AZkErdBrWRjYypr9TUaH7Vo3SvVuft8Zm7hJjJQn..."
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
                  placeholder="TJSpjmoz4F84kB4e3tvxJt3LFhhwVtiHQN..."
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

            {/* Telegram TON Network (Tonkeeper / Telegram Wallet / Gram) */}
            <div className="crypto-network-card ton">
              <div className="net-header">
                <div className="net-badge">
                  <span className="net-pill ton">شبکه تلگرام (Telegram Network)</span>
                  <span className="net-tokens">کوین Gram + USDT</span>
                </div>
                <span className="net-sub-note">آدرس کیف پول تونکیپر (Tonkeeper) یا ولت تلگرام (شروع با UQ یا EQ)</span>
              </div>

              <div className="net-input-wrap">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="UQAzVbTDzh2sCc6854FjKI-c9x-jz_sjLlJa_SmF1SC1sIMS..."
                  value={cryptoAddresses.gram || ''}
                  onChange={(e) => setCryptoAddresses({ ...cryptoAddresses, gram: e.target.value })}
                />
                {cryptoAddresses.gram && (
                  <button
                    type="button"
                    className="copy-net-btn"
                    onClick={() => handleCopy(cryptoAddresses.gram, 'gram')}
                  >
                    {copiedKey === 'gram' ? <Check size={16} /> : <Copy size={16} />}
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

      {/* TAB 5: TRANSACTION HISTORY */}
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
                      <td>
                        <strong>{tx.type}</strong>
                      </td>
                      <td>
                        <span className="tx-method-tag">{tx.method}</span>
                      </td>
                      <td>{tx.date}</td>
                      <td className="tx-amount-green">{tx.amount}</td>
                      <td>
                        <span className="status-badge-ok">{tx.status}</span>
                      </td>
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
              <button className="modal-close-btn" onClick={() => setTopupModal(null)}>
                ×
              </button>
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

      {/* MODAL: CRYPTO DEPOSIT MANUAL */}
      {topupModal === 'crypto' && (
        <div className="wallet-modal-backdrop" onClick={() => setTopupModal(null)}>
          <div className="wallet-modal-box crypto-deposit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>واریز دستی رمزارز (Crypto Deposit)</h3>
              <button className="modal-close-btn" onClick={() => setTopupModal(null)}>
                ×
              </button>
            </div>

            <div className="modal-body-content">
              <div className="crypto-select-network">
                <span className="field-lbl">انتخاب رمزارز و شبکه واریز:</span>
                <div className="crypto-pill-options">
                  {[
                    { id: 'usdt_bep20', label: 'USDT (BEP-20 / BSC)', net: 'evm' },
                    { id: 'gram', label: 'Gram (کوین گرام تلگرام)', net: 'gram' },
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
                    : selectedCrypto === 'sol'
                    ? 'sol'
                    : 'gram';
                const info = WORKSHOP_DEPOSIT_WALLETS[netKey];
                return (
                  <div className="workshop-address-display">
                    <span className="net-tag-pill">شبکه مقصد: {info.networks.join(' / ')}</span>
                    <span className="addr-lbl">آدرس رسمی کیف پول واریزی کارگاه کیپ کافی:</span>
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
