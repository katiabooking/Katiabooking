import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  { code: 'BHD', symbol: 'د.ب', name: 'Bahraini Dinar', flag: '🇧🇭' },
  { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial', flag: '🇴🇲' },
  { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', flag: '🇪🇬' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
];

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  exchangeRates: ExchangeRates;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatPrice: (price: number, fromCurrency?: string) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('katia-currency');
    if (saved) {
      return JSON.parse(saved);
    }
    return CURRENCIES[2]; // AED по умолчанию
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  // Загрузка курсов валют
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/AED'
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Fallback курсы если API не доступен (все курсы относительно AED)
        setExchangeRates({
          AED: 1,
          USD: 0.272,
          EUR: 0.251,
          GBP: 0.215,
          RUB: 25.2,
          TRY: 8.94,
          SAR: 1.02,
          QAR: 0.99,
          KWD: 0.084,
          BHD: 0.103,
          OMR: 0.105,
          EGP: 13.21,
          JPY: 40.7,
          CNY: 1.97,
          INR: 22.66,
          CAD: 0.37,
          AUD: 0.417,
          CHF: 0.24,
          PLN: 1.1,
          UAH: 10.95,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();

    // Обновлять курсы каждый час
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('katia-currency', JSON.stringify(newCurrency));
  };

  // Конвертация цены из AED (базовая валюта) в выбранную
  const convertPrice = (price: number, fromCurrency: string = 'AED'): number => {
    if (!exchangeRates[currency.code] || !exchangeRates[fromCurrency]) {
      return price;
    }

    // Сначала конвертируем в AED, затем в целевую валюту
    const priceInAED = price / exchangeRates[fromCurrency];
    const convertedPrice = priceInAED * exchangeRates[currency.code];

    return Math.round(convertedPrice * 100) / 100;
  };

  // Форматирование цены с символом валюты
  const formatPrice = (price: number, fromCurrency: string = 'AED'): string => {
    const converted = convertPrice(price, fromCurrency);
    
    // Форматирование в зависимости от валюты
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);

    // Некоторые валюты показываем символ после числа
    const symbolAfter = ['TRY', 'RUB', 'UAH', 'PLN'];
    if (symbolAfter.includes(currency.code)) {
      return `${formatted} ${currency.symbol}`;
    }

    // AED и арабские валюты показываем перед числом с пробелом
    const symbolBeforeWithSpace = ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'EGP'];
    if (symbolBeforeWithSpace.includes(currency.code)) {
      return `${currency.symbol} ${formatted}`;
    }

    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        exchangeRates,
        setCurrency,
        convertPrice,
        formatPrice,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}