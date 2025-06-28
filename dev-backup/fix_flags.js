// Clean currency pairs with proper flag emojis
const cleanCurrencyPairs = [
    // USD to major currencies
    { from: 'USD', to: 'EUR', fromFlag: '🇺🇸', toFlag: '🇪🇺', minAmount: 50, maxAmount: 5000, rate: 0.92 },
    { from: 'USD', to: 'GBP', fromFlag: '🇺🇸', toFlag: '🇬🇧', minAmount: 50, maxAmount: 5000, rate: 0.79 },
    { from: 'USD', to: 'JPY', fromFlag: '🇺🇸', toFlag: '🇯🇵', minAmount: 100, maxAmount: 10000, rate: 157 },
    { from: 'USD', to: 'CNY', fromFlag: '🇺🇸', toFlag: '🇨🇳', minAmount: 50, maxAmount: 5000, rate: 7.2 },
    { from: 'USD', to: 'KRW', fromFlag: '🇺🇸', toFlag: '🇰🇷', minAmount: 100, maxAmount: 10000, rate: 1350 },
    
    // USD to Asian currencies
    { from: 'USD', to: 'VND', fromFlag: '🇺🇸', toFlag: '🇻🇳', minAmount: 50, maxAmount: 5000, rate: 24000 },
    { from: 'USD', to: 'THB', fromFlag: '🇺🇸', toFlag: '🇹🇭', minAmount: 50, maxAmount: 5000, rate: 36 },
    { from: 'USD', to: 'IDR', fromFlag: '🇺🇸', toFlag: '🇮🇩', minAmount: 50, maxAmount: 5000, rate: 15500 },
    { from: 'USD', to: 'MYR', fromFlag: '🇺🇸', toFlag: '🇲🇾', minAmount: 50, maxAmount: 5000, rate: 4.7 },
    { from: 'USD', to: 'PHP', fromFlag: '🇺🇸', toFlag: '🇵🇭', minAmount: 50, maxAmount: 5000, rate: 56 },
    { from: 'USD', to: 'SGD', fromFlag: '🇺🇸', toFlag: '🇸🇬', minAmount: 50, maxAmount: 5000, rate: 1.35 },
    { from: 'USD', to: 'INR', fromFlag: '🇺🇸', toFlag: '🇮🇳', minAmount: 50, maxAmount: 5000, rate: 83 },
    { from: 'USD', to: 'HKD', fromFlag: '🇺🇸', toFlag: '🇭🇰', minAmount: 50, maxAmount: 5000, rate: 7.8 },
    { from: 'USD', to: 'TWD', fromFlag: '🇺🇸', toFlag: '🇹🇼', minAmount: 50, maxAmount: 5000, rate: 31.5 },
    
    // USD to other major currencies
    { from: 'USD', to: 'AUD', fromFlag: '🇺🇸', toFlag: '🇦🇺', minAmount: 50, maxAmount: 5000, rate: 1.51 },
    { from: 'USD', to: 'CAD', fromFlag: '🇺🇸', toFlag: '🇨🇦', minAmount: 50, maxAmount: 5000, rate: 1.35 },
    { from: 'USD', to: 'CHF', fromFlag: '🇺🇸', toFlag: '🇨🇭', minAmount: 50, maxAmount: 5000, rate: 0.89 },
    { from: 'USD', to: 'NZD', fromFlag: '🇺🇸', toFlag: '🇳🇿', minAmount: 50, maxAmount: 5000, rate: 1.62 },
    { from: 'USD', to: 'NOK', fromFlag: '🇺🇸', toFlag: '🇳🇴', minAmount: 50, maxAmount: 5000, rate: 10.8 },
    { from: 'USD', to: 'SEK', fromFlag: '🇺🇸', toFlag: '🇸🇪', minAmount: 50, maxAmount: 5000, rate: 10.4 },
    
    // USD to emerging markets
    { from: 'USD', to: 'BRL', fromFlag: '🇺🇸', toFlag: '🇧🇷', minAmount: 50, maxAmount: 5000, rate: 5.2 },
    { from: 'USD', to: 'MXN', fromFlag: '🇺🇸', toFlag: '🇲🇽', minAmount: 50, maxAmount: 5000, rate: 17.8 },
    { from: 'USD', to: 'ZAR', fromFlag: '🇺🇸', toFlag: '🇿🇦', minAmount: 50, maxAmount: 5000, rate: 18.5 },
    { from: 'USD', to: 'TRY', fromFlag: '🇺🇸', toFlag: '🇹🇷', minAmount: 50, maxAmount: 5000, rate: 30.2 },
];

console.log('Clean currency pairs created successfully!');
