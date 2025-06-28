// Market Data Management System
class MarketManager {
    constructor() {
        this.apiKey = 'e2482ecbab9f3b1587192e08';
        this.apiBaseUrl = 'https://v6.exchangerate-api.com/v6';
        this.currencyPairs = this.initializeCurrencyPairs();
        this.previousRates = new Map(); // Store previous rates for change calculation
        this.autoRefresh = true;
        this.refreshInterval = null;
        this.rateUpdateInterval = null;
        this.init();
    }

    initializeCurrencyPairs() {
        return [
            { from: 'USD', to: 'JPY', fromFlag: '🇺🇸', toFlag: '🇯🇵', rate: 0, change: 0, volume: 12000, region: 'asia' },
            { from: 'USD', to: 'KRW', fromFlag: '🇺🇸', toFlag: '🇰🇷', rate: 0, change: 0, volume: 6780, region: 'asia' },
            { from: 'USD', to: 'THB', fromFlag: '🇺🇸', toFlag: '🇹🇭', rate: 0, change: 0, volume: 8540, region: 'asia' },
            { from: 'USD', to: 'VND', fromFlag: '🇺🇸', toFlag: '🇻🇳', rate: 0, change: 0, volume: 15420, region: 'asia' },
            { from: 'USD', to: 'IDR', fromFlag: '🇺🇸', toFlag: '🇮🇩', rate: 0, change: 0, volume: 9870, region: 'asia' },
            { from: 'USD', to: 'CNY', fromFlag: '🇺🇸', toFlag: '🇨🇳', rate: 0, change: 0, volume: 8970, region: 'asia' },
            { from: 'USD', to: 'EUR', fromFlag: '🇺🇸', toFlag: '🇪🇺', rate: 0, change: 0, volume: 21000, region: 'europe' },
            { from: 'USD', to: 'GBP', fromFlag: '🇺🇸', toFlag: '🇬🇧', rate: 0, change: 0, volume: 18000, region: 'europe' },
            { from: 'USD', to: 'AUD', fromFlag: '🇺🇸', toFlag: '🇦🇺', rate: 0, change: 0, volume: 16000, region: 'oceania' },
            { from: 'USD', to: 'SGD', fromFlag: '🇺🇸', toFlag: '🇸🇬', rate: 0, change: 0, volume: 14000, region: 'asia' },
            { from: 'USD', to: 'MYR', fromFlag: '🇺🇸', toFlag: '🇲🇾', rate: 0, change: 0, volume: 7320, region: 'asia' },
            { from: 'USD', to: 'PHP', fromFlag: '🇺🇸', toFlag: '🇵🇭', rate: 0, change: 0, volume: 12850, region: 'asia' },
            { from: 'USD', to: 'INR', fromFlag: '🇺🇸', toFlag: '🇮🇳', rate: 0, change: 0, volume: 11200, region: 'asia' },
            { from: 'USD', to: 'BDT', fromFlag: '🇺🇸', toFlag: '🇧🇩', rate: 0, change: 0, volume: 1650, region: 'asia' },
            { from: 'EUR', to: 'USD', fromFlag: '🇪🇺', toFlag: '��', rate: 0, change: 0, volume: 21000, region: 'europe' },
            { from: 'EUR', to: 'GBP', fromFlag: '🇪🇺', toFlag: '��', rate: 0, change: 0, volume: 9000, region: 'europe' },
            { from: 'EUR', to: 'JPY', fromFlag: '🇪🇺', toFlag: '��', rate: 0, change: 0, volume: 8000, region: 'asia' },
            { from: 'GBP', to: 'USD', fromFlag: '��', toFlag: '��', rate: 0, change: 0, volume: 18000, region: 'europe' },
            { from: 'GBP', to: 'EUR', fromFlag: '🇬🇧', toFlag: '🇪🇺', rate: 0, change: 0, volume: 12000, region: 'europe' },
            { from: 'AUD', to: 'USD', fromFlag: '🇦🇺', toFlag: '🇺🇸', rate: 0, change: 0, volume: 16000, region: 'oceania' }
        ];
    }

    async init() {
        this.transactions = this.generateInitialTransactions(120); // Start with 120 transactions
        this.renderTransactionQueue();
        this.startTransactionFeed();
        this.startAutoScroll();
        
        // Initialize live time and date display
        this.initLiveTimeDate();
        
        // Fetch initial exchange rates
        await this.fetchExchangeRates();
        this.renderRateTicker();
        
        // Set up periodic rate updates (every 5 minutes)
        this.startRateUpdates();
    }

    // Generate a large list of sample transactions
    generateInitialTransactions(count = 100) {
        const now = new Date();
        const countries = [
            { from: '🇺🇸', to: '🇻🇳', currency: 'USD' },
            { from: '🇬🇧', to: '🇵🇭', currency: 'GBP' },
            { from: '🇦🇺', to: '🇹🇭', currency: 'AUD' },
            { from: '🇨🇦', to: '🇻🇳', currency: 'CAD' },
            { from: '🇪🇺', to: '🇮🇩', currency: 'EUR' },
            { from: '🇯🇵', to: '🇰🇷', currency: 'JPY' },
            { from: '🇸🇬', to: '🇲🇾', currency: 'SGD' },
            { from: '🇺🇸', to: '🇵🇭', currency: 'USD' },
            { from: '🇪🇺', to: '🇻🇳', currency: 'EUR' },
            { from: '🇦🇺', to: '🇮🇩', currency: 'AUD' },
        ];
        const arr = [];
        for (let i = 0; i < count; i++) {
            const pick = countries[Math.floor(Math.random() * countries.length)];
            // More realistic amount: vary by currency, add randomness, and simulate daily trends
            let baseAmount = Math.floor(Math.random() * 2000) + 100;
            // Add a daily trend: e.g., higher amounts at certain times
            const hour = (now.getHours() + Math.floor(Math.random() * 3) - 1) % 24;
            if (hour >= 8 && hour <= 11) baseAmount += Math.floor(Math.random() * 1000); // morning peak
            if (hour >= 18 && hour <= 21) baseAmount += Math.floor(Math.random() * 1500); // evening peak
            // Add some rare big transfers
            if (Math.random() < 0.05) baseAmount += Math.floor(Math.random() * 5000);
            // Add some rare small transfers
            if (Math.random() < 0.05) baseAmount = Math.floor(Math.random() * 100) + 10;
            // Add a little noise
            baseAmount += Math.floor(Math.sin(i + now.getDate()) * 50);
            const amount = Math.max(10, baseAmount);
            const status = Math.random() > 0.3 ? 'Completed' : 'In Progress';
            const time = new Date(now - (count - i) * 8000 - Math.floor(Math.random() * 5000));
            arr.push({ ...pick, amount, status, time });
        }
        return arr.reverse(); // Most recent last
    }

    renderTransactionQueue() {
        const container = document.getElementById('transaction-queue');
        if (!container) return;
        // Use an inner wrapper for animation
        let inner = container.querySelector('.transaction-inner');
        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'transaction-inner';
            container.appendChild(inner);
        }
        inner.innerHTML = '';
        const transactions = this.transactions || [];
        transactions.forEach(tx => {
            const statusClass = tx.status === 'Completed' ? 'completed' : 'inprogress';
            const statusIcon = tx.status === 'Completed' ? 'fa-check-circle' : 'fa-spinner fa-spin';
            const timeStr = tx.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const txDiv = document.createElement('div');
            txDiv.className = 'flex flex-col sm:flex-row items-start sm:items-center justify-between transaction-row px-3 sm:px-5 py-2 sm:py-3 gap-2 sm:gap-0';
            txDiv.innerHTML = `
                <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span class="text-lg sm:text-2xl">${tx.from}</span>
                    <i class="fas fa-arrow-right text-blue-400 text-sm sm:text-lg"></i>
                    <span class="text-lg sm:text-2xl">${tx.to}</span>
                    <span class="ml-2 sm:ml-4 transaction-amount text-sm sm:text-base truncate">${tx.amount.toLocaleString()} <span class="transaction-currency">${tx.currency}</span></span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span class="transaction-meta text-xs sm:text-sm">${timeStr}</span>
                    <span class="transaction-status-badge ${statusClass} text-xs sm:text-sm"><i class="fas ${statusIcon}"></i> ${tx.status}</span>
                </div>
            `;
            inner.appendChild(txDiv);
        });
        this.renderMarketStats();
    }

    // Simulate new transactions coming in
    startTransactionFeed() {
        setInterval(() => {
            // Simulate a new transaction
            const countries = [
                { from: '🇺🇸', to: '🇻🇳', currency: 'USD' },
                { from: '🇬🇧', to: '🇵🇭', currency: 'GBP' },
                { from: '🇦🇺', to: '🇹🇭', currency: 'AUD' },
                { from: '🇨🇦', to: '🇻🇳', currency: 'CAD' },
                { from: '🇪🇺', to: '🇮🇩', currency: 'EUR' },
                { from: '🇯🇵', to: '🇰🇷', currency: 'JPY' },
                { from: '🇸🇬', to: '🇲🇾', currency: 'SGD' },
            ];
            const pick = countries[Math.floor(Math.random() * countries.length)];
            // More realistic amount for live feed
            let baseAmount = Math.floor(Math.random() * 2000) + 100;
            const now = new Date();
            const hour = now.getHours();
            if (hour >= 8 && hour <= 11) baseAmount += Math.floor(Math.random() * 1000);
            if (hour >= 18 && hour <= 21) baseAmount += Math.floor(Math.random() * 1500);
            if (Math.random() < 0.05) baseAmount += Math.floor(Math.random() * 5000);
            if (Math.random() < 0.05) baseAmount = Math.floor(Math.random() * 100) + 10;
            baseAmount += Math.floor(Math.sin(Date.now() / 100000) * 50);
            const amount = Math.max(10, baseAmount);
            const status = Math.random() > 0.3 ? 'Completed' : 'In Progress';
            this.transactions.push({ ...pick, amount, status, time: now });
            if (this.transactions.length > 200) this.transactions.shift();
            this.renderTransactionQueue();
        }, 1200);
    }

    // Smooth auto-scroll for the transaction queue (marquee effect, no scrollbar)
    startAutoScroll() {
        const container = document.getElementById('transaction-queue');
        if (!container) return;
        let inner = container.querySelector('.transaction-inner');
        if (!inner) return;
        container.style.height = '420px'; // Increased height for a bigger box
        container.style.overflow = 'hidden';
        let pos = 0;
        function step() {
            pos -= 0.7; // Keep the same speed
            inner.style.transform = `translateY(${pos}px)`;
            if (Math.abs(pos) >= inner.scrollHeight - container.clientHeight) {
                pos = 0;
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    async toggleAutoRefresh() {
        this.autoRefresh = !this.autoRefresh;
        const icon = document.getElementById('refresh-icon');
        const button = document.getElementById('refresh-btn');
        
        if (this.autoRefresh) {
            icon.classList.add('fa-spin');
            icon.style.color = '#10b981'; // green
            button.title = 'Auto-refresh enabled - Click to disable';
        } else {
            icon.classList.remove('fa-spin');
            icon.style.color = '#6b7280'; // gray
            button.title = 'Auto-refresh disabled - Click to enable';
        }
        
        // Manual refresh when toggling (fetch new rates)
        if (this.autoRefresh) {
            try {
                await this.fetchExchangeRates();
                this.renderRateTicker();
            } catch (error) {
                console.error('Error during manual refresh:', error);
            }
        }
    }

    // Simulate real-time rate and volume updates for realism
    updateRates() {
        // Simulate real-time rate updates
        this.currencyPairs.forEach(pair => {
            // Random small fluctuation (-0.5% to +0.5%)
            const fluctuation = (Math.random() - 0.5) * 0.01;
            pair.rate *= (1 + fluctuation);
            pair.change += fluctuation * 100;
            // Clamp change to reasonable bounds
            pair.change = Math.max(-5, Math.min(5, pair.change));
            // Update volume with more realistic daily pattern
            const now = new Date();
            let volumeChange = Math.floor((Math.random() - 0.45) * 100);
            // Simulate daily volume peaks
            const hour = now.getHours();
            if (hour >= 8 && hour <= 11) volumeChange += Math.floor(Math.random() * 200); // morning peak
            if (hour >= 18 && hour <= 21) volumeChange += Math.floor(Math.random() * 300); // evening peak
            // Rare big volume spikes
            if (Math.random() < 0.03) volumeChange += Math.floor(Math.random() * 1000);
            // Rare volume drops
            if (Math.random() < 0.02) volumeChange -= Math.floor(Math.random() * 500);
            // Add a little noise
            volumeChange += Math.floor(Math.sin(now.getDate() + now.getHours() + pair.rate) * 10);
            pair.volume = Math.max(0, pair.volume + volumeChange);
        });
        this.renderCurrencyPairs();
        this.renderTopPairs();
        this.updateMarketStats();
        this.updateLastUpdateTime();
        this.renderRateTicker(); // Update ticker on rate change
    }

    updateLastUpdateTime() {
        const lastUpdateEl = document.getElementById('last-update');
        if (lastUpdateEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            lastUpdateEl.textContent = `Last updated: ${timeString}`;
        }
    }

    // Initialize live time and date display
    initLiveTimeDate() {
        // Update immediately
        this.updateLiveTimeDate();
        
        // Update every second
        this.timeInterval = setInterval(() => {
            this.updateLiveTimeDate();
        }, 1000);
    }

    // Update live time and date elements
    updateLiveTimeDate() {
        const liveTimeEl = document.getElementById('live-time');
        const liveDateEl = document.getElementById('live-date');
        
        if (liveTimeEl || liveDateEl) {
            const now = new Date();
            
            // Update live time (HH:MM:SS format)
            if (liveTimeEl) {
                const timeString = now.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // 24-hour format
                });
                liveTimeEl.textContent = timeString;
            }
            
            // Update live date (Day Month Year format)
            if (liveDateEl) {
                const options = { 
                    weekday: 'short',
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                };
                const dateString = now.toLocaleDateString('en-US', options);
                liveDateEl.textContent = dateString;
            }
        }
    }

    renderCurrencyPairs() {
        const container = document.getElementById('currency-pairs-grid');
        const regionFilter = document.getElementById('region-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;
        
        let filteredPairs = this.currencyPairs;
        
        // Apply region filter
        if (regionFilter !== 'all') {
            filteredPairs = filteredPairs.filter(pair => pair.region === regionFilter);
        }
        
        // Apply sorting
        filteredPairs = this.sortPairs(filteredPairs, sortFilter);
        
        container.innerHTML = '';
        
        filteredPairs.forEach(pair => {
            const changeClass = pair.change >= 0 ? 'text-green-400' : 'text-red-400';
            const changeIcon = pair.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            const cardShadow = pair.change >= 0 ? 'shadow-green-400/20' : 'shadow-red-400/20';
            
            const pairElement = document.createElement('div');
            pairElement.className = `glass-card backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer ${cardShadow}`;
            pairElement.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2 text-lg font-bold">
                        <span class="text-2xl">${pair.fromFlag}</span>
                        <span>${pair.from}</span>
                        <i class="fas fa-arrow-right text-gray-400 mx-2"></i>
                        <span class="text-2xl">${pair.toFlag}</span>
                        <span>${pair.to}</span>
                    </div>
                    <div class="flex items-center gap-1 ${changeClass} font-semibold">
                        <i class="fas ${changeIcon}"></i>
                        <span>${pair.change >= 0 ? '+' : ''}${pair.change.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="flex items-end justify-between mb-4">
                    <div>
                        <div class="text-3xl font-extrabold text-white">${pair.rate.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                        <div class="text-xs text-gray-400 mt-1">24h Volume: <span class="text-blue-400 font-bold">$${pair.volume.toLocaleString()}</span></div>
                    </div>
                    <div class="text-xs text-gray-400 text-right">
                        <span class="block">Commission</span>
                        <span class="text-yellow-400 font-bold">0.2%</span>
                    </div>
                </div>
                <button class="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg mt-2 flex items-center justify-center gap-2">
                    <i class="fas fa-paper-plane"></i> Send Money
                </button>
            `;
            container.appendChild(pairElement);
        });
    }

    renderTopPairs() {
        const container = document.getElementById('top-pairs');
        const topPairs = [...this.currencyPairs]
            .sort((a, b) => b.change - a.change)
            .slice(0, 5);
            
        container.innerHTML = '';
        
        topPairs.forEach((pair, index) => {
            const changeClass = pair.change >= 0 ? 'text-green-400' : 'text-red-400';
            const rankClass = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-500';
            
            const pairElement = document.createElement('div');
            pairElement.className = 'flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-all cursor-pointer';
            
            pairElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span class="text-sm font-bold ${rankClass}">#${index + 1}</span>
                    </div>
                    <div class="flex items-center mr-4">
                        <span class="text-lg mr-1">${pair.fromFlag}</span>
                        <span class="text-lg">${pair.toFlag}</span>
                    </div>
                    <div>
                        <div class="font-semibold">${pair.from}/${pair.to}</div>
                        <div class="text-sm text-gray-400">Vol: $${this.formatNumber(pair.volume)}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold ${changeClass}">
                        ${pair.change >= 0 ? '+' : ''}${pair.change.toFixed(2)}%
                    </div>
                    <div class="text-sm text-gray-400">${this.formatRate(pair.rate, pair.to)}</div>
                </div>
            `;
            
            pairElement.addEventListener('click', () => this.showPairDetails(pair));
            container.appendChild(pairElement);
        });
    }

    // Render the currency rate ticker
    renderRateTicker() {
        const ticker = document.getElementById('rate-ticker');
        if (!ticker) return;
        const inner = ticker.querySelector('.ticker-inner');
        if (!inner) return;
        
        // Show only pairs with actual rates > 0
        const pairs = this.currencyPairs.filter(pair => pair.rate > 0).slice(0, 20);
        inner.innerHTML = '';
        
        if (pairs.length === 0) {
            // Show loading message if no rates loaded yet
            const loadingEl = document.createElement('span');
            loadingEl.className = 'flex items-center gap-2 px-3';
            loadingEl.innerHTML = `
                <i class="fas fa-spinner fa-spin text-blue-400"></i>
                <span>Loading live exchange rates...</span>
            `;
            inner.appendChild(loadingEl);
            return;
        }
        
        pairs.forEach(pair => {
            const changeClass = pair.change >= 0 ? 'ticker-rate-up' : 'ticker-rate-down';
            const changeIcon = pair.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            const formattedRate = this.formatExchangeRate(pair.rate, pair.to);
            const el = document.createElement('span');
            el.className = `flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm`;
            el.innerHTML = `
                <span class="text-sm sm:text-lg">${pair.fromFlag}</span>
                <span class="hidden xs:inline">${pair.from}</span>
                <i class="fas fa-arrow-right text-gray-400 mx-1 text-xs sm:text-sm"></i>
                <span class="text-sm sm:text-lg">${pair.toFlag}</span>
                <span class="hidden xs:inline">${pair.to}</span>
                <span class="ml-1 sm:ml-2 text-xs sm:text-sm font-bold">${formattedRate}</span>
                <span class="${changeClass} ml-1 sm:ml-2 flex items-center text-xs sm:text-sm">
                    <i class="fas ${changeIcon}"></i> 
                    <span class="hidden sm:inline ml-1">${pair.change >= 0 ? '+' : ''}${pair.change.toFixed(2)}%</span>
                </span>
            `;
            inner.appendChild(el);
        });
    }
    
    formatExchangeRate(rate, currency) {
        // Special formatting for different currencies
        if (rate === 0) return '-.--';
        
        if (['JPY', 'KRW', 'VND', 'IDR'].includes(currency)) {
            // Currencies with large values - no decimals
            return rate.toLocaleString('en-US', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            });
        } else if (['BDT', 'LKR', 'PHP'].includes(currency)) {
            // Medium value currencies - 1 decimal
            return rate.toLocaleString('en-US', { 
                minimumFractionDigits: 1, 
                maximumFractionDigits: 1 
            });
        } else {
            // Most currencies - 2-4 decimals depending on value
            if (rate < 1) {
                return rate.toFixed(4);
            } else if (rate < 10) {
                return rate.toFixed(3);
            } else {
                return rate.toFixed(2);
            }
        }
    }

    renderMarketStats() {
        // Calculate stats from transactions
        const txs = this.transactions || [];
        const totalVolume = txs.reduce((sum, tx) => sum + tx.amount, 0);
        const totalTx = txs.length;
        // Count top destination
        const countryCount = {};
        txs.forEach(tx => {
            countryCount[tx.to] = (countryCount[tx.to] || 0) + 1;
        });
        let topCountry = '-';
        let maxCount = 0;
        for (const [country, count] of Object.entries(countryCount)) {
            if (count > maxCount) {
                maxCount = count;
                topCountry = country;
            }
        }
        // Update DOM
        const volElem = document.getElementById('market-total-volume');
        const txElem = document.getElementById('market-total-tx');
        const topElem = document.getElementById('market-top-country');
        const barElem = document.getElementById('market-progress-bar');
        if (volElem) volElem.textContent = '$' + totalVolume.toLocaleString();
        if (txElem) txElem.textContent = totalTx;
        if (topElem) topElem.textContent = topCountry;
        if (barElem) barElem.style.width = Math.min(100, (totalTx / 200) * 100) + '%';
    }

    updateMarketStats() {
        const totalVolume = this.currencyPairs.reduce((sum, pair) => sum + pair.volume, 0);
        const avgChange = this.currencyPairs.reduce((sum, pair) => sum + pair.change, 0) / this.currencyPairs.length;
        
        document.getElementById('total-volume').textContent = `$${this.formatNumber(totalVolume)}`;
        document.getElementById('market-trend').textContent = `${avgChange >= 0 ? '↗' : '↘'} ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(1)}%`;
        
        // Update trend color
        const trendElement = document.getElementById('market-trend');
        trendElement.className = `text-lg font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`;
    }

    handleRegionFilter(event) {
        this.renderCurrencyPairs();
    }

    handleSortFilter(event) {
        this.renderCurrencyPairs();
    }

    sortPairs(pairs, sortBy) {
        switch (sortBy) {
            case 'rate':
                return pairs.sort((a, b) => b.rate - a.rate);
            case 'change':
                return pairs.sort((a, b) => b.change - a.change);
            case 'pair':
            default:
                return pairs.sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`));
        }
    }

    formatRate(rate, toCurrency) {
        if (rate > 1000) {
            return rate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else if (rate > 100) {
            return rate.toFixed(1);
        } else {
            return rate.toFixed(2);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }    getCommissionRate() {
        // Get commission rate from user's current level
        const userData = this.loadUserData();
        const levels = {
            1: 0.2, 2: 0.6, 3: 1, 4: 2, 5: 3
        };
        return levels[userData.currentLevel] || 0.2;
    }

    getRegionName(region) {
        const regions = {
            'asia': 'Asia Pacific',
            'europe': 'Europe',
            'americas': 'Americas'
        };
        return regions[region] || 'Global';
    }

    loadUserData() {
        const savedData = localStorage.getItem('epay_agent_data');
        return savedData ? JSON.parse(savedData) : { currentLevel: 1 };
    }

    showPairDetails(pair) {
        // Create a detailed view modal (simplified for demo)
        alert(`${pair.from}/${pair.to} Details:\n\nCurrent Rate: ${this.formatRate(pair.rate, pair.to)}\n24h Change: ${pair.change >= 0 ? '+' : ''}${pair.change.toFixed(2)}%\nVolume: $${this.formatNumber(pair.volume)}\nRegion: ${this.getRegionName(pair.region)}\nCommission: ${this.getCommissionRate()}%`);
    }

    // Exchange Rate API Integration
    async fetchExchangeRates() {
        try {
            this.updateConnectionStatus('loading');
            console.log('Fetching exchange rates...');
            
            // Get USD rates first
            const usdResponse = await fetch(`${this.apiBaseUrl}/${this.apiKey}/latest/USD`);
            if (!usdResponse.ok) {
                throw new Error(`USD API request failed: ${usdResponse.status}`);
            }
            const usdData = await usdResponse.json();
            
            // Get EUR rates for EUR pairs
            const eurResponse = await fetch(`${this.apiBaseUrl}/${this.apiKey}/latest/EUR`);
            if (!eurResponse.ok) {
                throw new Error(`EUR API request failed: ${eurResponse.status}`);
            }
            const eurData = await eurResponse.json();
            
            // Get GBP rates for GBP pairs
            const gbpResponse = await fetch(`${this.apiBaseUrl}/${this.apiKey}/latest/GBP`);
            if (!gbpResponse.ok) {
                throw new Error(`GBP API request failed: ${gbpResponse.status}`);
            }
            const gbpData = await gbpResponse.json();
            
            // Update currency pairs with real rates
            this.updateCurrencyRates(usdData.conversion_rates, eurData.conversion_rates, gbpData.conversion_rates);
            
            // Update last update time
            this.updateLastUpdateTime();
            
            this.updateConnectionStatus('connected');
            console.log('Exchange rates updated successfully');
            
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            this.updateConnectionStatus('error');
            // Use fallback rates if API fails
            this.useFallbackRates();
        }
    }
    
    updateCurrencyRates(usdRates, eurRates, gbpRates) {
        this.currencyPairs.forEach(pair => {
            const pairKey = `${pair.from}${pair.to}`;
            const previousRate = this.previousRates.get(pairKey) || 0;
            let newRate = 0;
            
            // Determine which rate data to use based on base currency
            if (pair.from === 'USD' && usdRates[pair.to]) {
                newRate = usdRates[pair.to];
            } else if (pair.from === 'EUR' && eurRates[pair.to]) {
                newRate = eurRates[pair.to];
            } else if (pair.from === 'GBP' && gbpRates[pair.to]) {
                newRate = gbpRates[pair.to];
            } else if (pair.from === 'AUD' && usdRates['AUD']) {
                // For AUD to USD, we need the inverse
                newRate = 1 / usdRates['AUD'];
            }
            
            if (newRate > 0) {
                // Calculate percentage change
                let change = 0;
                if (previousRate > 0) {
                    change = ((newRate - previousRate) / previousRate) * 100;
                } else {
                    // For first load, simulate a small random change
                    change = (Math.random() - 0.5) * 2; // -1% to +1%
                }
                
                pair.rate = newRate;
                pair.change = change;
                
                // Store current rate as previous for next update
                this.previousRates.set(pairKey, newRate);
            }
        });
    }
    
    useFallbackRates() {
        // Fallback rates in case API fails
        const fallbackRates = {
            'USDJPY': 157.25, 'USDKRW': 1352, 'USDTHB': 36.45, 'USDVND': 24000,
            'USDIDR': 15720, 'USDCNY': 7.25, 'USDEUR': 0.92, 'USDGBP': 0.79,
            'USDAUD': 1.51, 'USDSGD': 1.35, 'USDMYR': 4.72, 'USDPHP': 56.25,
            'USDINR': 83.15, 'USDBDT': 110.25, 'EURUSD': 1.09, 'EURGBP': 0.86,
            'EURJPY': 170.5, 'GBPUSD': 1.27, 'GBPEUR': 1.16, 'AUDUSD': 0.66
        };
        
        this.currencyPairs.forEach(pair => {
            const pairKey = `${pair.from}${pair.to}`;
            if (fallbackRates[pairKey]) {
                pair.rate = fallbackRates[pairKey];
                pair.change = (Math.random() - 0.5) * 2; // Random change between -1% and +1%
            }
        });
        
        console.log('Using fallback exchange rates');
    }
    
    startRateUpdates() {
        // Update rates every 5 minutes
        this.rateUpdateInterval = setInterval(async () => {
            await this.fetchExchangeRates();
            this.renderRateTicker();
        }, 5 * 60 * 1000);
    }
    
    stopRateUpdates() {
        if (this.rateUpdateInterval) {
            clearInterval(this.rateUpdateInterval);
            this.rateUpdateInterval = null;
        }
    }

    // Show connection status in the UI
    updateConnectionStatus(status) {
        const ticker = document.getElementById('rate-ticker');
        if (!ticker) return;
        
        // Add or update status indicator
        let statusDiv = ticker.parentElement.querySelector('.connection-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'connection-status text-xs text-center py-1';
            ticker.parentElement.insertBefore(statusDiv, ticker);
        }
        
        switch (status) {
            case 'loading':
                statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin text-blue-400"></i> <span class="text-blue-400">Fetching live rates...</span>';
                break;
            case 'connected':
                statusDiv.innerHTML = '<i class="fas fa-check-circle text-green-400"></i> <span class="text-green-400">Live rates connected</span>';
                // Hide after 3 seconds
                setTimeout(() => {
                    if (statusDiv) statusDiv.style.display = 'none';
                }, 3000);
                break;
            case 'error':
                // Hide the status div completely on error instead of showing error message
                statusDiv.style.display = 'none';
                break;
        }
    }
    
    // Enhanced cleanup method
    destroy() {
        this.stopRateUpdates();
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }
}

// Utility functions
function goBack() {
    window.location.href = 'dashboard.html';
}

function goToPage(page) {
    window.location.href = page;
}

function toggleAutoRefresh() {
    marketManager.toggleAutoRefresh();
}

// Initialize market manager
let marketManager;
document.addEventListener('DOMContentLoaded', () => {
    marketManager = new MarketManager();
});
