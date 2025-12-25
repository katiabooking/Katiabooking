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

  // Инициализируем с fallback курсами сразу, чтобы избежать ошибок
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
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
  const [loading, setLoading] = useState(true);

  // Загрузка курсов валют
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        
        // Попробуем несколько бесплатных API по очереди
        const apis = [
          // API 1: Frankfurter (бесплатный, от ЕЦБ) - запрашиваем с EUR и пересчитываем
          async () => {
            const response = await fetch('https://api.frankfurter.app/latest?from=EUR');
            if (!response.ok) throw new Error('Frankfurter API failed');
            const data = await response.json();
            
            // Пересчитываем все курсы относительно AED
            const eurToAed = 1 / (data.rates.AED || 0.251); // EUR -> AED
            const rates: ExchangeRates = { AED: 1 };
            
            // Конвертируем каждую валюту: EUR -> Currency -> AED
            Object.keys(data.rates).forEach(code => {
              rates[code] = data.rates[code] * eurToAed;
            });
            rates.EUR = eurToAed; // Добавляем EUR
            
            return rates;
          },
          
          // API 2: Exchangerate.host (бесплатный, без ключа)
          async () => {
            const response = await fetch('https://api.exchangerate.host/latest?base=USD');
            if (!response.ok) throw new Error('Exchangerate.host API failed');
            const data = await response.json();
            
            // Пересчитываем все курсы относительно AED
            const usdToAed = 1 / (data.rates.AED || 0.272); // USD -> AED
            const rates: ExchangeRates = { AED: 1 };
            
            Object.keys(data.rates).forEach(code => {
              rates[code] = data.rates[code] * usdToAed;
            });
            rates.USD = usdToAed;
            
            return rates;
          },
          
          // API 3: Floatrates (бесплатный, без ключа, JSON формат)
          async () => {
            const response = await fetch('https://www.floatrates.com/daily/usd.json');
            if (!response.ok) throw new Error('Floatrates API failed');
            const data = await response.json();
            
            // Пересчитываем все курсы относительно AED
            const usdToAed = data.aed ? 1 / data.aed.rate : 3.67; // USD -> AED
            const rates: ExchangeRates = { AED: 1, USD: usdToAed };
            
            Object.keys(data).forEach(key => {
              const code = key.toUpperCase();
              if (code !== 'AED') {
                rates[code] = data[key].rate * usdToAed;
              }
            });
            
            return rates;
          },
        ];

        // Пробуем API по очереди
        let lastError: Error | null = null;
        for (let i = 0; i < apis.length; i++) {
          try {
            const rates = await apis[i]();
            setExchangeRates(rates);
            console.log('✅ Exchange rates loaded successfully from API', i + 1);
            return; // Успешно загрузили, выходим
          } catch (error) {
            lastError = error as Error;
            // Не показываем warning если это не последний API
            if (i < apis.length - 1) {
              console.log(`ℹ️ API ${i + 1} unavailable, trying alternative...`);
            }
            continue; // Пробуем следующий API
          }
        }

        // Если все API failed, используем fallback без паники
        throw lastError || new Error('All APIs unavailable');

      } catch (error) {
        console.log('ℹ️ Using offline exchange rates (last updated: 25.12.2024)');
        // Fallback курсы если все API не доступны (обновлено 25.12.2024)
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
    // Защита от undefined или пустых курсов
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return price;
    }

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