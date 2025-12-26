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
  // ВАЖНО: Курсы показывают сколько AED за 1 единицу валюты
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    AED: 1,
    USD: 3.67,      // 1 USD = 3.67 AED
    EUR: 3.98,      // 1 EUR = 3.98 AED  
    GBP: 4.65,      // 1 GBP = 4.65 AED
    RUB: 0.0397,    // 1 RUB = 0.0397 AED
    TRY: 0.112,     // 1 TRY = 0.112 AED
    SAR: 0.98,      // 1 SAR = 0.98 AED
    QAR: 1.01,      // 1 QAR = 1.01 AED
    KWD: 11.90,     // 1 KWD = 11.90 AED
    BHD: 9.71,      // 1 BHD = 9.71 AED
    OMR: 9.52,      // 1 OMR = 9.52 AED
    EGP: 0.076,     // 1 EGP = 0.076 AED
    JPY: 0.0246,    // 1 JPY = 0.0246 AED
    CNY: 0.508,     // 1 CNY = 0.508 AED
    INR: 0.0442,    // 1 INR = 0.0442 AED
    CAD: 2.70,      // 1 CAD = 2.70 AED
    AUD: 2.40,      // 1 AUD = 2.40 AED
    CHF: 4.17,      // 1 CHF = 4.17 AED
    PLN: 0.91,      // 1 PLN = 0.91 AED
    UAH: 0.091,     // 1 UAH = 0.091 AED
  });
  const [loading, setLoading] = useState(true);

  // Загрузка курсов валют
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        
        // Попробуем несколько бесплатных API по очереди
        const apis = [
          // API 1: Frankfurter (бесплатный, от ЕЦБ) - запрашиваем с AED напрямую
          async () => {
            const response = await fetch('https://api.frankfurter.app/latest?from=AED');
            if (!response.ok) throw new Error('Frankfurter API failed');
            const data = await response.json();
            
            // Инвертируем курсы: API даёт "1 AED = X валюты", нам нужно "1 валюта = X AED"
            const rates: ExchangeRates = { AED: 1 };
            
            Object.keys(data.rates).forEach(code => {
              // Инвертируем: если 1 AED = 0.27 USD, то 1 USD = 1/0.27 = 3.7 AED
              rates[code] = 1 / data.rates[code];
            });
            
            return rates;
          },
          
          // API 2: Exchangerate.host (бесплатный, без ключа) - запрашиваем с AED
          async () => {
            const response = await fetch('https://api.exchangerate.host/latest?base=AED');
            if (!response.ok) throw new Error('Exchangerate.host API failed');
            const data = await response.json();
            
            // Инвертируем курсы
            const rates: ExchangeRates = { AED: 1 };
            
            Object.keys(data.rates).forEach(code => {
              rates[code] = 1 / data.rates[code];
            });
            
            return rates;
          },
          
          // API 3: Floatrates (бесплатный) - запрашиваем с AED
          async () => {
            const response = await fetch('https://www.floatrates.com/daily/aed.json');
            if (!response.ok) throw new Error('Floatrates API failed');
            const data = await response.json();
            
            // Floatrates даёт прямые курсы от AED
            const rates: ExchangeRates = { AED: 1 };
            
            Object.keys(data).forEach(key => {
              const code = key.toUpperCase();
              // data[key].rate показывает "1 AED = X валюты", инвертируем
              rates[code] = 1 / data[key].rate;
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
            continue; // Пр��буем следующий API
          }
        }

        // Если все API failed, используем fallback без паники
        throw lastError || new Error('All APIs unavailable');

      } catch (error) {
        console.log('ℹ️ Using offline exchange rates (last updated: 26.12.2024)');
        // Fallback курсы если все API не доступны
        // ВАЖНО: Курсы показывают сколько AED за 1 единицу валюты
        setExchangeRates({
          AED: 1,
          USD: 3.67,      // 1 USD = 3.67 AED
          EUR: 3.98,      // 1 EUR = 3.98 AED  
          GBP: 4.65,      // 1 GBP = 4.65 AED
          RUB: 0.0397,    // 1 RUB = 0.0397 AED
          TRY: 0.112,     // 1 TRY = 0.112 AED
          SAR: 0.98,      // 1 SAR = 0.98 AED
          QAR: 1.01,      // 1 QAR = 1.01 AED
          KWD: 11.90,     // 1 KWD = 11.90 AED
          BHD: 9.71,      // 1 BHD = 9.71 AED
          OMR: 9.52,      // 1 OMR = 9.52 AED
          EGP: 0.076,     // 1 EGP = 0.076 AED
          JPY: 0.0246,    // 1 JPY = 0.0246 AED
          CNY: 0.508,     // 1 CNY = 0.508 AED
          INR: 0.0442,    // 1 INR = 0.0442 AED
          CAD: 2.70,      // 1 CAD = 2.70 AED
          AUD: 2.40,      // 1 AUD = 2.40 AED
          CHF: 4.17,      // 1 CHF = 4.17 AED
          PLN: 0.91,      // 1 PLN = 0.91 AED
          UAH: 0.091,     // 1 UAH = 0.091 AED
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

  // Конвертация цены из любой валюты в выбранную
  // exchangeRates хранят: сколько AED за 1 единицу валюты
  // Например: EUR: 3.98 означает 1 EUR = 3.98 AED
  const convertPrice = (price: number, fromCurrency: string = 'AED'): number => {
    // Защита от undefined или пустых курсов
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return price;
    }

    if (!exchangeRates[currency.code] || !exchangeRates[fromCurrency]) {
      return price;
    }

    // Шаг 1: Конвертируем в AED (умножаем на курс исходной валюты)
    const priceInAED = price * exchangeRates[fromCurrency];
    
    // Шаг 2: Конвертируем из AED в целевую валюту (делим на курс целевой валюты)
    const convertedPrice = priceInAED / exchangeRates[currency.code];

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