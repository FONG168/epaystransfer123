// Transaction History Management System
class HistoryManager {
    constructor() {
        console.log('HistoryManager initializing...');
        this.userData = this.loadUserData();
        this.transactions = this.loadTransactionHistory();
        this.filteredTransactions = [...this.transactions];
        this.displayedCount = 0;
        this.pageSize = 10;
        console.log('Loaded transactions:', this.transactions.length);
        this.recordCompletedTransfersByLevel();
        this.init();
    }

    loadUserData() {
        const savedData = localStorage.getItem('epay_data');
        return savedData ? JSON.parse(savedData) : {
            balance: 0,
            totalEarned: 0,
            tasksCompleted: 0,
            currentLevel: 1,
            levelProgress: {
                1: { deposited: 0, tasksCompleted: 0, earned: 0 },
                2: { deposited: 0, tasksCompleted: 0, earned: 0 },
                3: { deposited: 0, tasksCompleted: 0, earned: 0 },
                4: { deposited: 0, tasksCompleted: 0, earned: 0 },
                5: { deposited: 0, tasksCompleted: 0, earned: 0 }
            }
        };
    }

    loadTransactionHistory() {
        // Load from the REAL epay_data structure that your system actually uses
        const epayData = localStorage.getItem('epay_data');
        let transactions = [];
        
        if (epayData) {
            const userData = JSON.parse(epayData);
            console.log('Real user data:', userData);
            
            // Convert completed tasks from your system into transaction format
            if (userData.completedTasks && Array.isArray(userData.completedTasks)) {
                transactions = userData.completedTasks.map(task => ({
                    id: task.id || 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    type: 'commission',
                    timestamp: new Date(task.completedAt).getTime() || Date.now(),
                    amount: task.amount || 0,
                    commission: task.commission || 0,
                    fromCurrency: task.fromCurrency || 'USD',
                    toCurrency: task.toCurrency || 'CNY',
                    customerName: task.customerName || 'Customer',
                    receiverName: task.receiverName || 'Receiver',
                    status: 'completed',
                    currencyPair: `${task.fromCurrency || 'USD'}/${task.toCurrency || 'CNY'}`
                }));
            }
            
            // Add deposit transactions if any deposits were made
            if (userData.deposits && Array.isArray(userData.deposits)) {
                const depositTransactions = userData.deposits.map(deposit => ({
                    id: 'DEP_' + (deposit.timestamp || Date.now()),
                    type: 'deposit',
                    timestamp: deposit.timestamp || Date.now(),
                    amount: deposit.amount || 0,
                    description: deposit.description || 'Account deposit',
                    status: 'completed'
                }));
                transactions = [...transactions, ...depositTransactions];
            }
            
            // Sort by timestamp (newest first)
            transactions.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        console.log('Loaded real transaction history:', transactions);
        return transactions;
    }

    init() {
        this.updateSummaryCards();
        this.renderTransactions();
        this.renderCharts();
        this.renderPerformanceMetrics();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('date-filter').addEventListener('change', this.handleDateFilter.bind(this));
        document.getElementById('type-filter').addEventListener('change', this.applyFilters.bind(this));
        document.getElementById('pair-filter').addEventListener('change', this.applyFilters.bind(this));
        document.getElementById('amount-filter').addEventListener('change', this.applyFilters.bind(this));
    }

    updateSummaryCards() {
        const commissionTransactions = this.transactions.filter(t => t.type === 'commission');
        const totalCommissions = commissionTransactions.reduce((sum, t) => sum + t.commission, 0);
        const avgCommission = commissionTransactions.length > 0 ? totalCommissions / commissionTransactions.length : 0;
        
        document.getElementById('total-commissions').textContent = `$${totalCommissions.toFixed(2)}`;
        document.getElementById('total-transactions').textContent = this.transactions.length;
        document.getElementById('avg-commission').textContent = `$${avgCommission.toFixed(2)}`;
        document.getElementById('success-rate').textContent = '100%'; // Assuming 100% success rate
    }

    handleDateFilter(event) {
        const value = event.target.value;
        const customRange = document.getElementById('custom-date-range');
        
        if (value === 'custom') {
            customRange.classList.remove('hidden');
        } else {
            customRange.classList.add('hidden');
        }
        
        this.applyFilters();
    }

    applyFilters() {
        const dateFilter = document.getElementById('date-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        const pairFilter = document.getElementById('pair-filter').value;
        const amountFilter = document.getElementById('amount-filter').value;
        
        let filtered = [...this.transactions];
        
        // Date filter
        const now = new Date();
        switch (dateFilter) {
            case 'today':
                filtered = filtered.filter(t => {
                    const transactionDate = new Date(t.timestamp);
                    return transactionDate.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                filtered = filtered.filter(t => new Date(t.timestamp) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date(now);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                filtered = filtered.filter(t => new Date(t.timestamp) >= monthAgo);
                break;
            case 'custom':
                const fromDate = document.getElementById('from-date').value;
                const toDate = document.getElementById('to-date').value;
                if (fromDate && toDate) {
                    filtered = filtered.filter(t => {
                        const transactionDate = new Date(t.timestamp);
                        return transactionDate >= new Date(fromDate) && transactionDate <= new Date(toDate);
                    });
                }
                break;
        }
        
        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }
        
        // Currency pair filter
        if (pairFilter !== 'all') {
            filtered = filtered.filter(t => t.currencyPair === pairFilter);
        }
        
        // Amount filter
        if (amountFilter !== 'all') {
            filtered = filtered.filter(t => {
                const amount = t.amount || 0;
                switch (amountFilter) {
                    case 'small': return amount >= 1 && amount <= 100;
                    case 'medium': return amount > 100 && amount <= 1000;
                    case 'large': return amount > 1000;
                    default: return true;
                }
            });
        }
        
        this.filteredTransactions = filtered;
        this.displayedCount = 0;
        this.renderTransactions();
        this.updateFilterCounts();
    }

    clearFilters() {
        document.getElementById('date-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('pair-filter').value = 'all';
        document.getElementById('amount-filter').value = 'all';
        document.getElementById('custom-date-range').classList.add('hidden');
        
        this.filteredTransactions = [...this.transactions];
        this.displayedCount = 0;
        this.renderTransactions();
        this.updateFilterCounts();
    }

    updateFilterCounts() {
        document.getElementById('showing-count').textContent = Math.min(this.displayedCount + this.pageSize, this.filteredTransactions.length);
        document.getElementById('total-count').textContent = this.filteredTransactions.length;
    }

    renderTransactions() {
        const container = document.getElementById('transaction-list');
        
        if (this.displayedCount === 0) {
            container.innerHTML = '';
        }
        
        // Show empty state if no transactions
        if (this.filteredTransactions.length === 0) {
            if (this.transactions.length === 0) {
                // No transactions at all
                container.innerHTML = `
                    <div class="glass-card backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 text-center">
                        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <i class="fas fa-history text-white text-lg sm:text-2xl"></i>
                        </div>
                        <h3 class="text-lg sm:text-xl font-semibold mb-2 text-white">No Transactions Yet</h3>
                        <p class="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Start completing tasks to see your transaction history here.</p>
                        <a href="tasks.html" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base touch-manipulation">
                            <i class="fas fa-tasks mr-2"></i>
                            Go to Tasks
                        </a>
                    </div>
                `;
            } else {
                // Transactions exist but filters returned no results
                container.innerHTML = `
                    <div class="glass-card backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 text-center">
                        <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <i class="fas fa-filter text-white text-lg sm:text-2xl"></i>
                        </div>
                        <h3 class="text-lg sm:text-xl font-semibold mb-2 text-white">No Matching Transactions</h3>
                        <p class="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Try adjusting your filters to see more results.</p>
                        <button onclick="historyManager.clearFilters()" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-sm sm:text-base touch-manipulation">
                            <i class="fas fa-times mr-2"></i>
                            Clear Filters
                        </button>
                    </div>
                `;
            }
            document.getElementById('load-more-container').style.display = 'none';
            return;
        }
        
        const startIndex = this.displayedCount;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredTransactions.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const transaction = this.filteredTransactions[i];
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        }
        
        this.displayedCount = endIndex;
        this.updateFilterCounts();
        
        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        const loadMoreContainer = document.getElementById('load-more-container');
        
        if (this.displayedCount >= this.filteredTransactions.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    createTransactionElement(transaction) {
        const element = document.createElement('div');
        element.className = 'transaction-item glass-card backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300';
        
        const date = new Date(transaction.timestamp);
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (transaction.type === 'commission') {
            element.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div class="flex items-center w-full sm:w-auto">
                        <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/25 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
                            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            <i class="fas fa-exchange-alt text-white text-lg sm:text-xl relative z-10"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-white text-sm sm:text-base truncate">${transaction.fromCurrency}→${transaction.toCurrency}</div>
                            <div class="text-xs sm:text-sm text-gray-300 truncate">Transfer for ${transaction.customerName}</div>
                            <div class="text-xs text-gray-400">${dateString} at ${timeString}</div>
                        </div>
                    </div>
                    <div class="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
                        <div class="text-base sm:text-lg font-bold text-green-400">+$${transaction.commission.toFixed(2)}</div>
                        <div class="text-xs sm:text-sm text-gray-300">Commission</div>
                        <div class="text-xs text-gray-400">Transfer: $${transaction.amount}</div>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <span class="text-xs text-gray-400 truncate font-mono">ID: ${transaction.id}</span>
                    <div class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm">
                        <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Completed</span>
                    </div>
                </div>
            `;
        } else if (transaction.type === 'deposit') {
            element.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div class="flex items-center w-full sm:w-auto">
                        <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
                            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            <i class="fas fa-plus text-white text-lg sm:text-xl relative z-10"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-white text-sm sm:text-base">Account Deposit</div>
                            <div class="text-xs sm:text-sm text-gray-300 truncate">${transaction.description || 'Account funding'}</div>
                            <div class="text-xs text-gray-400">${dateString} at ${timeString}</div>
                        </div>
                    </div>
                    <div class="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
                        <div class="text-base sm:text-lg font-bold text-blue-400">+$${transaction.amount.toFixed(2)}</div>
                        <div class="text-xs sm:text-sm text-gray-300">Deposit</div>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <span class="text-xs text-gray-400 truncate font-mono">ID: ${transaction.id}</span>
                    <div class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm">
                        <div class="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Completed</span>
                    </div>
                </div>
            `;
        } else if (transaction.type === 'withdrawal') {
            element.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div class="flex items-center w-full sm:w-auto">
                        <div class="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-400 via-red-500 to-pink-600 rounded-2xl shadow-lg shadow-red-500/25 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
                            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            <i class="fas fa-minus text-white text-lg sm:text-xl relative z-10"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-white text-sm sm:text-base">Withdrawal</div>
                            <div class="text-xs sm:text-sm text-gray-300 truncate">${transaction.description || 'Account withdrawal'}</div>
                            <div class="text-xs text-gray-400">${dateString} at ${timeString}</div>
                        </div>
                    </div>
                    <div class="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
                        <div class="text-base sm:text-lg font-bold text-red-400">-$${transaction.amount.toFixed(2)}</div>
                        <div class="text-xs sm:text-sm text-gray-300">Withdrawal</div>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <span class="text-xs text-gray-400 truncate font-mono">ID: ${transaction.id}</span>
                    <div class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm">
                        <div class="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Completed</span>
                    </div>
                </div>
            `;
        }
        
        return element;
    }

    renderCharts() {
        this.renderEarningsChart();
        this.renderTransactionBreakdown();
    }

    renderEarningsChart() {
        const container = document.getElementById('earnings-chart');
        container.innerHTML = '';
        
        // Generate last 7 days of earnings data
        const earningsData = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const dailyTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.timestamp);
                return transactionDate.toDateString() === date.toDateString() && t.type === 'commission';
            });
            
            const dailyEarnings = dailyTransactions.reduce((sum, t) => sum + t.commission, 0);
            earningsData.push({
                date: date.toLocaleDateString([], { weekday: 'short' }),
                amount: dailyEarnings
            });
        }
        
        const maxEarnings = Math.max(...earningsData.map(d => d.amount), 1);
        
        earningsData.forEach(data => {
            const barContainer = document.createElement('div');
            barContainer.className = 'flex flex-col items-center';
            
            const barHeight = (data.amount / maxEarnings) * 120; // Max height 120px
            
            barContainer.innerHTML = `
                <div class="text-xs text-gray-400 mb-1">$${data.amount.toFixed(0)}</div>
                <div class="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t" style="height: ${barHeight}px"></div>
                <div class="text-xs text-gray-400 mt-1">${data.date}</div>
            `;
            
            container.appendChild(barContainer);
        });
    }

    renderTransactionBreakdown() {
        const container = document.getElementById('transaction-breakdown');
        
        const commissionCount = this.transactions.filter(t => t.type === 'commission').length;
        const depositCount = this.transactions.filter(t => t.type === 'deposit').length;
        
        const total = commissionCount + depositCount;
        
        const commissionPercent = total > 0 ? (commissionCount / total) * 100 : 0;
        const depositPercent = total > 0 ? (depositCount / total) * 100 : 0;
        
        container.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
                        <span class="text-sm">Commissions</span>
                    </div>
                    <span class="text-sm font-semibold">${commissionCount} (${commissionPercent.toFixed(1)}%)</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: ${commissionPercent}%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                        <span class="text-sm">Deposits</span>
                    </div>
                    <span class="text-sm font-semibold">${depositCount} (${depositPercent.toFixed(1)}%)</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${depositPercent}%"></div>
                </div>
            </div>
        `;
    }

    renderPerformanceMetrics() {
        const commissionTransactions = this.transactions.filter(t => t.type === 'commission');
        
        // Best day earnings
        const dailyEarnings = {};
        commissionTransactions.forEach(t => {
            const date = new Date(t.timestamp).toDateString();
            dailyEarnings[date] = (dailyEarnings[date] || 0) + t.commission;
        });
        
        const bestDay = Object.entries(dailyEarnings).reduce((best, [date, amount]) => {
            return amount > best.amount ? { date, amount } : best;
        }, { date: '', amount: 0 });
        
        document.getElementById('best-day-earnings').textContent = `$${bestDay.amount.toFixed(2)}`;
        document.getElementById('best-day-date').textContent = bestDay.date ? new Date(bestDay.date).toLocaleDateString() : '-';
        
        // Average daily tasks (last 30 days)
        const last30Days = commissionTransactions.filter(t => {
            const transactionDate = new Date(t.timestamp);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return transactionDate >= thirtyDaysAgo;
        });
        
        const avgDailyTasks = last30Days.length / 30;
        document.getElementById('avg-daily-tasks').textContent = avgDailyTasks.toFixed(1);
        
        // Current streak (simplified calculation)
        const streak = this.calculateStreak();
        document.getElementById('streak-days').textContent = streak;
    }

    calculateStreak() {
        const commissionTransactions = this.transactions.filter(t => t.type === 'commission');
        const now = new Date();
        let streak = 0;
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const hasTransactions = commissionTransactions.some(t => {
                const transactionDate = new Date(t.timestamp);
                return transactionDate.toDateString() === date.toDateString();
            });
            
            if (hasTransactions) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    exportHistory() {
        const exportData = {
            summary: {
                totalTransactions: this.transactions.length,
                totalCommissions: this.transactions.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.commission, 0),
                exportDate: new Date().toISOString()
            },
            transactions: this.transactions
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `epay_transaction_history_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    /**
     * Add a new transaction to the real userData structure
     */
    static addTransaction(transaction) {
        const epayData = localStorage.getItem('epay_data');
        if (epayData) {
            const userData = JSON.parse(epayData);
            
            if (!userData.completedTasks) {
                userData.completedTasks = [];
            }
            
            // Convert transaction back to task format for storage
            const taskFormat = {
                id: transaction.id,
                amount: transaction.amount,
                commission: transaction.commission,
                fromCurrency: transaction.fromCurrency,
                toCurrency: transaction.toCurrency,
                customerName: transaction.customerName,
                receiverName: transaction.receiverName,
                completedAt: new Date(transaction.timestamp).toISOString()
            };
            
            userData.completedTasks.unshift(taskFormat);
            
            // Keep only last 100 tasks
            if (userData.completedTasks.length > 100) {
                userData.completedTasks.splice(100);
            }
            
            localStorage.setItem('epay_data', JSON.stringify(userData));
        }
    }

    /**
     * Add a deposit transaction to the real userData structure
     */
    static addDepositTransaction(amount, description = 'Account funding') {
        const epayData = localStorage.getItem('epay_data');
        if (epayData) {
            const userData = JSON.parse(epayData);
            
            if (!userData.deposits) {
                userData.deposits = [];
            }
            
            const deposit = {
                id: 'DEP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                amount: amount,
                description: description,
                timestamp: Date.now()
            };
            
            userData.deposits.unshift(deposit);
            userData.balance = (userData.balance || 0) + amount;
            
            localStorage.setItem('epay_data', JSON.stringify(userData));
        }
    }

    /**
     * Scan all commission transactions and record the number of completed transfers per level in localStorage.
     * This ensures the count is always correct based on history.
     */
    recordCompletedTransfersByLevel() {
        // Reset all levels
        Object.keys(this.userData.levelProgress).forEach(level => {
            this.userData.levelProgress[level].tasksCompleted = 0;
        });
        
        // Count commission transactions per level
        this.transactions.forEach(t => {
            if (t.type === 'commission') {
                // Use currentLevel if available, else default to 1
                const level = this.userData.currentLevel || 1;
                if (this.userData.levelProgress[level]) {
                    this.userData.levelProgress[level].tasksCompleted++;
                }
            }
        });
        
        // Save back to localStorage using the correct key
        localStorage.setItem('epay_data', JSON.stringify(this.userData));
    }
}

// Utility functions
function goBack() {
    window.location.href = 'dashboard.html';
}

function goToPage(page) {
    window.location.href = page;
}

function applyFilters() {
    historyManager.applyFilters();
}

function clearFilters() {
    historyManager.clearFilters();
}

function loadMoreTransactions() {
    historyManager.renderTransactions();
}

function exportHistory() {
    historyManager.exportHistory();
}

// Initialize history manager
let historyManager;
document.addEventListener('DOMContentLoaded', () => {
    historyManager = new HistoryManager();
});
