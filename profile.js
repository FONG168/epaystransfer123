// Enhanced Profile Management System
class EnhancedProfileManager {    constructor() {
        this.userData = this.loadUserData();
        // Always ensure these are valid objects
        this.personalInfo = this.userData.personalInfo || {
            fullName: 'Member User',
            email: 'member@email.com',
            phone: '+1 (000) 000-0000',
            jobTitle: 'Financial Member',
            address: 'Not specified',
            dateOfBirth: 'Not specified',
            profilePhoto: null, // Add profile photo property
            verification: {
                passport: { verified: false, date: null },
                nationalId: { verified: false, date: null },
                drivingLicense: { verified: false, date: null }
            }
        };
        this.paymentMethods = this.userData.paymentMethods || {
            bankAccounts: [],
            cryptoWallets: []
        };
        // Always ensure loggedDevices is an array
        this.securitySettings = this.userData.securitySettings || {
            twoFactorEnabled: false,
            loginNotifications: true,
            passwordLastChanged: new Date().toISOString(),
            securityQuestions: [],
            loggedDevices: [
                {
                    id: 1,
                    name: 'Current Device',
                    location: 'Unknown',
                    lastActive: new Date().toISOString(),
                    isCurrent: true
                }
            ]
        };
        if (!Array.isArray(this.securitySettings.loggedDevices)) {
            this.securitySettings.loggedDevices = [
                {
                    id: 1,
                    name: 'Current Device',
                    location: 'Unknown',
                    lastActive: new Date().toISOString(),
                    isCurrent: true
                }
            ];
        }
        this.init();
    }

    loadUserData() {
        const savedData = localStorage.getItem('epay_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            // Ensure complete structure exists
            const completeData = {
                // Member data
                balance: data.balance || 0,
                totalEarned: data.totalEarned || 0,
                tasksCompleted: data.tasksCompleted || 0,
                currentLevel: data.currentLevel || 1,
                levelProgress: data.levelProgress || {
                    1: { deposited: 0, tasksCompleted: 0, earned: 0 },
                    2: { deposited: 0, tasksCompleted: 0, earned: 0 },
                    3: { deposited: 0, tasksCompleted: 0, earned: 0 },
                    4: { deposited: 0, tasksCompleted: 0, earned: 0 },
                    5: { deposited: 0, tasksCompleted: 0, earned: 0 }
                },
                joinDate: data.joinDate || new Date().toISOString(),
                agentName: data.agentName || 'Member User',
                transactions: data.transactions || [],
                
                // Personal info (consolidated)
                personalInfo: data.personalInfo || {
                    fullName: 'Member User',
                    email: 'member@email.com',
                    phone: '+1 (000) 000-0000',
                    jobTitle: 'Financial Member',
                    address: 'Not specified',
                    dateOfBirth: 'Not specified',
                    profilePhoto: null, // Add profile photo property
                    verification: {
                        passport: { verified: false, date: null },
                        nationalId: { verified: false, date: null },
                        drivingLicense: { verified: false, date: null }
                    }
                },
                
                // Payment methods (consolidated)
                paymentMethods: data.paymentMethods || {
                    bankAccounts: [],
                    cryptoWallets: []
                },
                
                // Security settings (consolidated)
                securitySettings: {
                    twoFactorEnabled: data.securitySettings?.twoFactorEnabled ?? false,
                    loginNotifications: data.securitySettings?.loginNotifications ?? true,
                    passwordLastChanged: data.securitySettings?.passwordLastChanged ?? new Date().toISOString(),
                    securityQuestions: data.securitySettings?.securityQuestions ?? [],
                    loggedDevices: Array.isArray(data.securitySettings && data.securitySettings.loggedDevices) ? data.securitySettings.loggedDevices : [
                        {
                            id: 1,
                            name: 'Current Device',
                            location: 'Unknown',
                            lastActive: new Date().toISOString(),
                            isCurrent: true
                        }
                    ]
                }
            };
            
            return completeData;
        }
        
        // Default complete data structure
        return {
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
            },
            joinDate: new Date().toISOString(),
            agentName: 'Member User',
            transactions: [],
            personalInfo: {
                fullName: 'Member User',
                email: 'member@email.com',
                phone: '+1 (000) 000-0000',
                jobTitle: 'Financial Member',
                address: 'Not specified',
                dateOfBirth: 'Not specified',
                profilePhoto: null, // Add profile photo property
                verification: {
                    passport: { verified: false, date: null },
                    nationalId: { verified: false, date: null },
                    drivingLicense: { verified: false, date: null }
                }
            },
            paymentMethods: {
                bankAccounts: [],
                cryptoWallets: []
            },
            securitySettings: {
                twoFactorEnabled: false,
                loginNotifications: true,
                passwordLastChanged: new Date().toISOString(),
                securityQuestions: [],
                loggedDevices: [
                    {
                        id: 1,
                        name: 'Current Device',
                        location: 'Unknown',
                        lastActive: new Date().toISOString(),
                        isCurrent: true
                    }
                ]
            }
        };
    }

    // Remove the old separate load methods
    saveUserData() {
        localStorage.setItem('epay_data', JSON.stringify(this.userData));
    }

    loadSecuritySettings() {
        const savedSettings = localStorage.getItem('epay_security_settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            twoFactorEnabled: false,
            lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            loggedDevices: [
                {
                    id: 1,
                    name: 'Windows PC - Chrome',
                    location: 'New York, NY',
                    lastActive: new Date().toISOString(),
                    isCurrent: true
                },
                {
                    id: 2,
                    name: 'iPhone 14 - Safari',
                    location: 'New York, NY',
                    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    isCurrent: false
                },
                {
                    id: 3,
                    name: 'iPad Pro - Safari',
                    location: 'Los Angeles, CA',
                    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    isCurrent: false
                }
            ]
        };
    }    // Remove the old separate save method - everything is now in saveUserData()
    
    init() {
        this.setupTabNavigation();
        this.loadProfileData();
        this.loadTransactionData();
        this.loadPaymentMethodsData();
        this.loadPersonalInfoData();
        this.loadSecurityData();
        this.loadSupportData();
        this.loadVerificationData();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        // Check if elements exist before trying to use forEach
        if (!tabButtons || tabButtons.length === 0) {
            console.warn('No tab buttons found');
            return;
        }
        
        if (!tabContents || tabContents.length === 0) {
            console.warn('No tab contents found');
            return;
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    // Handle different border styles for mobile vs desktop
                    if (window.innerWidth < 1024) {
                        // Mobile: bottom border
                        btn.classList.remove('border-blue-500', 'text-blue-400', 'bg-gray-900/40');
                        btn.classList.add('border-transparent', 'text-gray-400');
                    } else {
                        // Desktop: left border
                        btn.classList.remove('border-blue-500', 'text-blue-400', 'bg-gray-900/40');
                        btn.classList.add('border-transparent', 'text-gray-400');
                    }
                });
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                // Add active class to clicked tab and corresponding content
                button.classList.add('active');
                if (window.innerWidth < 1024) {
                    // Mobile styling - use border-b-3 class
                    button.classList.remove('border-transparent', 'text-gray-400');
                    button.classList.add('border-blue-500', 'text-blue-400', 'bg-gray-900/40');
                } else {
                    // Desktop styling - use border-l-4 class  
                    button.classList.remove('border-transparent', 'text-gray-400');
                    button.classList.add('border-blue-500', 'text-blue-400', 'bg-gray-900/40');
                }
                
                const targetElement = document.getElementById(`${targetTab}-tab`);
                if (targetElement) {
                    targetElement.classList.add('active');
                    targetElement.classList.remove('hidden');
                }
            });
        });
        
        // Handle responsive tab styling on window resize
        window.addEventListener('resize', () => {
            this.handleResponsiveTabStyling();
        });
    }
    
    handleResponsiveTabStyling() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            // Reapply styles based on current screen size
            const targetTab = activeTab.getAttribute('data-tab');
            
            // Remove all border classes first
            activeTab.classList.remove('border-blue-500', 'border-transparent');
            
            if (window.innerWidth < 1024) {
                // Mobile: bottom border
                activeTab.classList.add('border-blue-500');
            } else {
                // Desktop: left border  
                activeTab.classList.add('border-blue-500');
            }
        }
    }    loadProfileData() {
        // Update profile header with error checking
        const memberNameEl = document.getElementById('member-name');
        if (memberNameEl) {
            memberNameEl.textContent = this.personalInfo.fullName;
        }
        
        // Load profile photo
        this.loadProfilePhoto();
        
        // Update verification status based on photo and ID verification
        this.updateVerificationStatus();
        
        const joinDateEl = document.getElementById('join-date');
        if (joinDateEl) {
            joinDateEl.textContent = new Date(this.userData.joinDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        // Update statistics with error checking
        const totalBalanceEl = document.getElementById('total-balance');
        if (totalBalanceEl) {
            totalBalanceEl.textContent = `$${this.userData.balance.toFixed(2)}`;
        }
        
        const totalEarnedEl = document.getElementById('total-earned');
        if (totalEarnedEl) {
            totalEarnedEl.textContent = `$${this.userData.totalEarned.toFixed(2)}`;
        }
        
        const totalTasksEl = document.getElementById('total-tasks');
        if (totalTasksEl) {
            totalTasksEl.textContent = this.userData.tasksCompleted;
        }
        
        // Calculate success rate (assuming 100% for now)
        const successRate = this.userData.tasksCompleted > 0 ? 100 : 100;
        const successRateEl = document.getElementById('success-rate');
        if (successRateEl) {
            successRateEl.textContent = `${successRate}%`;
        }
        
        // Check if user has uploaded both profile photo and ID verification uploads
        this.updateVerificationStatus();
    }

    // Enhanced: Load and filter transactions by period
    loadTransactionData(period = 'today') {
        const transactions = this.userData.transactions || [];
        const now = new Date();
        let filtered = [];
        if (period === 'today') {
            filtered = transactions.filter(t => {
                if (!t.timestamp) return true; // fallback for old data
                const tDate = new Date(t.timestamp);
                return tDate.toDateString() === now.toDateString();
            });
        } else if (period === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 6);
            filtered = transactions.filter(t => {
                if (!t.timestamp) return true;
                const tDate = new Date(t.timestamp);
                return tDate >= weekAgo && tDate <= now;
            });
        } else if (period === 'month') {
            const monthAgo = new Date(now);
            monthAgo.setDate(now.getDate() - 29);
            filtered = transactions.filter(t => {
                if (!t.timestamp) return true;
                const tDate = new Date(t.timestamp);
                return tDate >= monthAgo && tDate <= now;
            });
        } else {
            filtered = transactions;
        }
        // Only update recent transactions UI, not daily/weekly/monthly summary boxes
        const transactionsContainer = document.getElementById('recent-transactions');
        if (!transactionsContainer) return;
        transactionsContainer.innerHTML = '';
        if (filtered.length === 0) {
            transactionsContainer.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fas fa-inbox text-3xl mb-3 opacity-50"></i>
                    <p>No transactions yet</p>
                    <p class="text-sm">Your transaction history will appear here</p>
                </div>
            `;
            return;
        }
        filtered.slice(-10).reverse().forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item flex items-center justify-between p-3 bg-gray-800/30 rounded-lg';
            const iconClass = transaction.type === 'commission' ? 'fa-arrow-up' : 
                             transaction.type === 'deposit' ? 'fa-plus' : 'fa-arrow-down';
            const colorClass = transaction.type === 'commission' ? 'green' : 
                              transaction.type === 'deposit' ? 'blue' : 'red';
            const sign = transaction.positive ? '+' : '-';
            transactionElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-${colorClass}-600 rounded-full flex items-center justify-center mr-3">
                        <i class="fas ${iconClass} text-white text-sm"></i>
                    </div>
                    <div>
                        <div class="font-semibold">${transaction.description}</div>
                        <div class="text-sm text-gray-400">${transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : ''}</div>
                    </div>
                </div>
                <div class="text-${colorClass}-400 font-semibold">${sign}$${transaction.amount.toFixed(2)}</div>
            `;
            transactionsContainer.appendChild(transactionElement);
        });
    }

    loadPaymentMethodsData() {
        this.loadBankAccounts();
        this.loadCryptoWallets();
    }    loadBankAccounts() {
        const container = document.getElementById('bank-accounts');
        container.innerHTML = '';

        if (this.paymentMethods.bankAccounts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fas fa-university text-3xl mb-3 opacity-50"></i>
                    <p>No bank accounts added</p>
                    <p class="text-sm">Add a bank account to get started</p>
                </div>
            `;
            return;
        }

        this.paymentMethods.bankAccounts.forEach(account => {
            const accountElement = document.createElement('div');
            accountElement.className = 'payment-method-card p-4 bg-gray-800/30 rounded-lg border border-gray-700';
            
            accountElement.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="font-semibold">${account.accountHolder}</div>
                        <div class="text-sm text-gray-400">Account Holder</div>
                    </div>
                    ${account.isPrimary ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">Primary</span>' : ''}
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Bank:</span>
                        <span>${account.bankName}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Account:</span>
                        <span>${account.accountNumber}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Phone:</span>
                        <span>${account.phone}</span>
                    </div>
                </div>
                <div class="flex space-x-2 mt-4">
                    <button class="btn-secondary text-xs px-3 py-1" onclick="profileManager.editBankAccount(${account.id})">Edit</button>
                    <button class="text-red-400 hover:text-red-300 text-xs px-3 py-1" onclick="profileManager.removeBankAccount(${account.id})">Remove</button>
                </div>
            `;
            
            container.appendChild(accountElement);
        });
    }    loadCryptoWallets() {
        const container = document.getElementById('crypto-wallets');
        container.innerHTML = '';

        if (this.paymentMethods.cryptoWallets.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fab fa-bitcoin text-3xl mb-3 opacity-50"></i>
                    <p>No crypto wallets added</p>
                    <p class="text-sm">Add a wallet to get started</p>
                </div>
            `;
            return;
        }

        this.paymentMethods.cryptoWallets.forEach(wallet => {
            const walletElement = document.createElement('div');
            walletElement.className = 'payment-method-card p-4 bg-gray-800/30 rounded-lg border border-gray-700';
            
            walletElement.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                            <i class="fab fa-bitcoin text-white text-sm"></i>
                        </div>
                        <div>
                            <div class="font-semibold">${wallet.type} Wallet</div>
                            <div class="text-sm text-gray-400">Tether (${wallet.network})</div>
                        </div>
                    </div>
                    ${wallet.isActive ? '<span class="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">Active</span>' : ''}
                </div>
                <div class="bg-gray-900/50 rounded p-3 mb-3">
                    <div class="text-xs text-gray-400 mb-1">Address:</div>
                    <div class="text-sm font-mono break-all">${wallet.address}</div>
                </div>
                <div class="flex space-x-2">
                    <button class="btn-secondary text-xs px-3 py-1" onclick="profileManager.copyWalletAddress('${wallet.address}')">
                        <i class="fas fa-copy mr-1"></i>Copy
                    </button>
                    <button class="text-red-400 hover:text-red-300 text-xs px-3 py-1" onclick="profileManager.removeWallet(${wallet.id})">Remove</button>
                </div>
            `;
            
            container.appendChild(walletElement);
        });
    }

    loadPersonalInfoData() {
        const container = document.getElementById('personal-info');
        container.innerHTML = `
            <div class="flex justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Full Name</span>
                <span class="font-semibold">${this.personalInfo.fullName}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Email</span>
                <span class="font-semibold">${this.personalInfo.email}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Phone Number</span>
                <span class="font-semibold">${this.personalInfo.phone}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Job Title</span>
                <span class="font-semibold">${this.personalInfo.jobTitle}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-700">
                <span class="text-gray-400">Address</span>
                <span class="font-semibold text-right">${this.personalInfo.address}</span>
            </div>
            <div class="flex justify-between py-3">
                <span class="text-gray-400">Date of Birth</span>
                <span class="font-semibold">${this.personalInfo.dateOfBirth}</span>
            </div>
        `;
    }    loadVerificationData() {
        const container = document.getElementById('id-verification');
        container.innerHTML = '';

        const verificationTypes = [
            { 
                key: 'passport', 
                name: 'Passport', 
                icon: 'fa-passport',
                verified: this.personalInfo.verification.passport.verified,
                date: this.personalInfo.verification.passport.date
            },
            { 
                key: 'nationalId', 
                name: 'National ID', 
                icon: 'fa-id-card',
                verified: this.personalInfo.verification.nationalId.verified,
                date: this.personalInfo.verification.nationalId.date
            },
            { 
                key: 'drivingLicense', 
                name: 'Driving License', 
                icon: 'fa-car',
                verified: this.personalInfo.verification.drivingLicense.verified,
                date: this.personalInfo.verification.drivingLicense.date
            }
        ];

        // Update verification status badge
        const verifiedCount = verificationTypes.filter(item => item.verified).length;
        const statusBadge = document.getElementById('verification-status-badge');
        if (statusBadge) {
            if (verifiedCount === verificationTypes.length) {
                statusBadge.className = 'px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm';
                statusBadge.innerHTML = '<i class="fas fa-check mr-1"></i>Fully Verified';
            } else if (verifiedCount > 0) {
                statusBadge.className = 'px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm';
                statusBadge.innerHTML = `<i class="fas fa-clock mr-1"></i>Partially Verified (${verifiedCount}/${verificationTypes.length})`;
            } else {
                statusBadge.className = 'px-3 py-1 bg-gray-600/20 text-gray-400 rounded-full text-sm';
                statusBadge.innerHTML = '<i class="fas fa-clock mr-1"></i>Not Verified';
            }
        }

        verificationTypes.forEach(item => {
            const verificationElement = document.createElement('div');
            if (item.verified) {
                verificationElement.className = 'p-4 bg-green-600/10 border border-green-500/30 rounded-lg';
                verificationElement.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center">
                            <i class="fas ${item.icon} text-green-400 mr-2"></i>
                            <span class="font-semibold">${item.name}</span>
                        </div>
                        <span class="text-green-400 text-sm"><i class="fas fa-check-circle"></i></span>
                    </div>
                    <div class="text-sm text-gray-400">Verified on ${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                `;
            } else {
                verificationElement.className = 'p-4 bg-gray-800/30 border border-gray-700 rounded-lg';
                verificationElement.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center">
                            <i class="fas ${item.icon} text-gray-400 mr-2"></i>
                            <span class="font-semibold text-gray-400">${item.name}</span>
                        </div>
                        <button class="btn-secondary text-xs px-3 py-1" onclick="upload${item.name.replace(' ', '')}()">Upload</button>
                    </div>
                    <div class="text-sm text-gray-400">Not uploaded</div>
                `;
            }
            container.appendChild(verificationElement);
        });

        // Update main verification status after loading verification data
        this.updateVerificationStatus();
    }

    loadSecurityData() {
        // Update 2FA toggle
        const twoFAToggle = document.getElementById('2fa-toggle');
        if (twoFAToggle) {
            twoFAToggle.checked = this.securitySettings.twoFactorEnabled;
        }

        // Load logged devices
        const devicesContainer = document.getElementById('logged-devices');
        devicesContainer.innerHTML = '';

        // Defensive: always use an array
        const devices = Array.isArray(this.securitySettings.loggedDevices) ? this.securitySettings.loggedDevices : [];
        devices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = 'flex items-center justify-between p-4 bg-gray-800/30 rounded-lg';
            
            const icon = device.name.includes('PC') ? 'fa-desktop' : 
                        device.name.includes('iPhone') ? 'fa-mobile-alt' : 'fa-tablet-alt';
            
            const lastActiveText = device.isCurrent ? 'Current device' : 
                                  this.getTimeAgo(device.lastActive);
            
            deviceElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-${device.isCurrent ? 'blue' : 'gray'}-600 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas ${icon} text-white"></i>
                    </div>
                    <div>
                        <div class="font-semibold">${device.name}</div>
                        <div class="text-sm text-gray-400">${lastActiveText} • ${device.location}</div>
                    </div>
                </div>
                ${device.isCurrent ? 
                    '<span class="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">Active</span>' :
                    `<button class="text-red-400 hover:text-red-300 text-sm" onclick="profileManager.logoutDevice(${device.id})">Logout</button>`
                }
            `;
            
            devicesContainer.appendChild(deviceElement);
        });
    }

    loadSupportData() {
        // Support data is mostly static, but we can add dynamic elements later
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        return `${diffInDays} days ago`;
    }

    // Transaction period change
    changeTransactionPeriod(period) {
        // Remove active class from all period buttons
        document.querySelectorAll('.btn-secondary').forEach(btn => {
            btn.classList.remove('active-period');
        });
        
        // Add active class to clicked button
        event.target.classList.add('active-period');
        
        // Update transaction data based on period
        // This would typically fetch different data from the server
        this.loadTransactionData(period);
    }

    // Payment Methods Functions
    addBankAccount() {
        this.showModal('Add Bank Account', this.getBankAccountForm());
    }

    editBankAccount(id) {
        const account = this.paymentMethods.bankAccounts.find(acc => acc.id === id);
        this.showModal('Edit Bank Account', this.getBankAccountForm(account));
    }

    removeBankAccount(id) {
        if (confirm('Are you sure you want to remove this bank account?')) {
            this.paymentMethods.bankAccounts = this.paymentMethods.bankAccounts.filter(acc => acc.id !== id);
            this.saveUserData();
            this.loadBankAccounts();
        }
    }

    addCryptoWallet() {
        this.showModal('Add Crypto Wallet', this.getCryptoWalletForm());
    }

    removeWallet(id) {
        if (confirm('Are you sure you want to remove this wallet?')) {
            this.paymentMethods.cryptoWallets = this.paymentMethods.cryptoWallets.filter(wallet => wallet.id !== id);
            this.saveUserData();
            this.loadCryptoWallets();
        }
    }

    copyWalletAddress(address) {
        navigator.clipboard.writeText(address).then(() => {
            this.showNotification('Wallet address copied to clipboard!', 'success');
        });
    }

    // Personal Info Functions
    editPersonalInfo() {
        this.showModal('Edit Personal Information', this.getPersonalInfoForm());
    }

    uploadPassport() {
        this.showModal('Upload Passport', this.getFileUploadForm('passport'));
    }

    uploadNationalID() {
        this.showModal('Upload National ID', this.getFileUploadForm('nationalId'));
    }

    uploadDrivingLicense() {
        this.showModal('Upload Driving License', this.getFileUploadForm('drivingLicense'));
    }

    // Get file upload form for ID verification
    getFileUploadForm(verificationType) {
        return `
            <form onsubmit="profileManager.handleIdVerificationUpload(event, '${verificationType}')">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">
                            Upload ${this.getVerificationDisplayName(verificationType)}
                        </label>
                        <div class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                            <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                            <p class="text-gray-400 mb-2">Click to upload or drag and drop</p>
                            <p class="text-xs text-gray-500">JPG, PNG or PDF (max 5MB)</p>
                            <input type="file" name="idDocument" accept="image/*,.pdf" class="hidden" required 
                                   onchange="this.parentNode.querySelector('p').textContent = this.files[0]?.name || 'Click to upload or drag and drop'">
                            <button type="button" class="mt-3 btn-secondary" 
                                    onclick="this.parentNode.querySelector('input[type=file]').click()">
                                Choose File
                            </button>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="btn-primary flex-1">
                            <i class="fas fa-upload mr-2"></i>Upload Document
                        </button>
                        <button type="button" onclick="profileManager.closeModal()" class="btn-secondary flex-1">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        `;
    }

    // Get display name for verification type
    getVerificationDisplayName(verificationType) {
        const names = {
            'passport': 'Passport',
            'nationalId': 'National ID',
            'drivingLicense': 'Driving License'
        };
        return names[verificationType] || verificationType;
    }

    // Handle ID verification upload
    handleIdVerificationUpload(event, verificationType) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const file = formData.get('idDocument');
        
        if (!file) {
            this.showNotification('Please select a file to upload', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            this.showNotification('Please select a valid image or PDF file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size must be less than 5MB', 'error');
            return;
        }

        // Mark verification as verified
        this.personalInfo.verification[verificationType].verified = true;
        this.personalInfo.verification[verificationType].date = new Date().toISOString();
        this.userData.personalInfo.verification[verificationType].verified = true;
        this.userData.personalInfo.verification[verificationType].date = new Date().toISOString();

        // Save data
        this.saveUserData();

        // Update displays
        this.loadVerificationData();
        this.updateVerificationStatus();

        // Close modal and show success
        this.closeModal();
        this.showNotification(`${this.getVerificationDisplayName(verificationType)} uploaded successfully!`, 'success');
    }

    // Security Functions
    changePassword() {
        this.showModal('Change Password', this.getPasswordChangeForm());
    }

    logoutDevice(deviceId) {
        if (confirm('Are you sure you want to logout this device?')) {
            this.securitySettings.loggedDevices = this.securitySettings.loggedDevices.filter(device => device.id !== deviceId);
            this.saveUserData();
            this.loadSecurityData();
            this.showNotification('Device logged out successfully', 'success');
        }
    }

    logoutAllDevices() {
        // Show custom confirmation modal
        this.showLogoutConfirmationModal();
    }

    showLogoutConfirmationModal() {
        const confirmationContent = `
            <div class="text-center">
                <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-sign-out-alt text-white text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold mb-4 text-red-400">Logout from All Devices</h3>
                <div class="text-gray-300 mb-6 space-y-2">
                    <p class="font-semibold">⚠️ This action will:</p>
                    <ul class="text-left text-sm space-y-1 bg-gray-800/50 p-4 rounded-lg">
                        <li>• End your current session immediately</li>
                        <li>• Log out from ALL devices and browsers</li>
                        <li>• Clear session data and cached information</li>
                        <li>• Redirect you to the main page</li>
                        <li class="text-green-400">✓ Your user data and progress will be preserved</li>
                    </ul>
                    <p class="text-yellow-400 text-sm mt-4">You will need to log in again to access your account.</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="if(window.profileManager) window.profileManager.cancelLogout(); else this.closest('.modal-container') && this.closest('.modal-container').remove();" class="btn-secondary flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </button>
                    <button onclick="if(window.profileManager) window.profileManager.confirmLogout(); else alert('Profile manager not available');" class="btn-primary flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout All Devices
                    </button>
                </div>
            </div>
        `;
        
        // Try to use the existing modal system first
        try {
            this.showModal('Confirm Logout', confirmationContent);
        } catch (error) {
            console.warn('Modal system not available, creating standalone modal:', error);
            // Fallback: create a standalone modal if the main modal system isn't available
            this.createStandaloneLogoutModal(confirmationContent);
        }
    }

    createStandaloneLogoutModal(content) {
        // Remove any existing logout modal
        const existingModal = document.getElementById('logout-confirmation-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create the modal HTML
        const modalHTML = `
            <div id="logout-confirmation-modal" class="fixed inset-0 bg-black/90 backdrop-blur-lg z-[60] flex items-center justify-center p-4">
                <div class="glass-card bg-gradient-to-br from-gray-900/95 to-red-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full border border-red-500/30 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-bold text-red-400">Confirm Logout</h2>
                        <button onclick="this.closest('#logout-confirmation-modal').remove()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    ${content}
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Focus the modal for accessibility
        const modal = document.getElementById('logout-confirmation-modal');
        if (modal) {
            modal.focus();
        }
    }

    cancelLogout() {
        // Try to close the main modal system first
        try {
            this.closeModal();
        } catch (error) {
            console.warn('Main modal system not available');
        }
        
        // Also remove the standalone modal if it exists
        const standaloneModal = document.getElementById('logout-confirmation-modal');
        if (standaloneModal) {
            standaloneModal.remove();
        }
    }

    confirmLogout() {
        // Close any open modals first
        this.cancelLogout();
        
        // Clear all devices from the logged devices list
        this.securitySettings.loggedDevices = [];
        this.saveUserData();
        
        // Show notification briefly before redirect
        this.showNotification('All devices logged out successfully. Redirecting...', 'success');
        
        // Clear any session data and redirect after a short delay
        setTimeout(() => {
            // Clear only session-related data, preserve user data
            localStorage.removeItem('current_session');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('login_timestamp');
            localStorage.removeItem('session_id');
            
            // Clear session storage (temporary data)
            sessionStorage.clear();
            
            // Clear browser cache if possible
            if ('caches' in window) {
                caches.keys().then(function(names) {
                    for (let name of names) {
                        caches.delete(name);
                    }
                });
            }
            
            // Redirect to main page or login page
            window.location.href = 'index.html';
        }, 2000);
    }    // Support Functions
    showFAQ(category) {
        const faqContent = this.getFAQContent(category);
        this.showModal(`FAQ - ${this.formatFAQTitle(category)}`, faqContent);
    }

    // Data Management Functions
    resetAllData() {
        // Show confirmation modal instead of prompt
        this.showResetConfirmationModal();
    }

    showResetConfirmationModal() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            console.error('Modal container not found!');
            alert('Modal container not found. Please check the HTML.');
            return;
        }
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
                <div class="bg-gray-900 rounded-2xl max-w-md w-full mx-4 border border-red-500/30">
                    <div class="p-6 border-b border-gray-700">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-red-400">Reset All Data</h3>
                                <p class="text-sm text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>
                        <div class="text-sm text-gray-300 mb-4">
                            <p class="mb-3">This will permanently delete ALL your account data including:</p>
                            <ul class="list-disc list-inside ml-4 space-y-1 text-gray-400">
                                <li>Account balance and earnings</li>
                                <li>Transaction history</li>
                                <li>Task completion records</li>
                                <li>Personal information</li>
                                <li>Payment methods</li>
                                <li>Security settings</li>
                            </ul>
                        </div>
                        <div class="bg-red-600/10 border border-red-500/30 rounded-lg p-3 mb-4">
                            <p class="text-red-400 text-sm font-semibold">⚠️ This action is IRREVERSIBLE!</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex space-x-3">
                            <button onclick="window.profileManager.closeModal()" class="flex-1 btn-secondary px-4 py-3 text-center font-semibold">
                                Cancel
                            </button>
                            <button onclick="window.profileManager.confirmReset()" class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    confirmReset() {
        // Close the confirmation modal
        this.closeModal();
        
        // Show loading modal
        this.showResetLoadingModal();
        
        // Start 3-second countdown
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            countdown--;
            const countdownElement = document.getElementById('reset-countdown');
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.performDataReset();
            }
        }, 1000);
    }

    showResetLoadingModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
                <div class="bg-gray-900 rounded-2xl max-w-md w-full mx-4 border border-yellow-500/30">
                    <div class="p-8 text-center">
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 class="text-xl font-bold text-yellow-400 mb-2">Resetting Data</h3>
                            <p class="text-gray-400">Please wait while we reset your account...</p>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-gray-800/50 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-400">Verification in progress</span>
                                    <span class="text-2xl font-bold text-yellow-400" id="reset-countdown">3</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-yellow-400 h-2 rounded-full animate-pulse" style="width: 100%"></div>
                                </div>
                            </div>
                            
                            <div class="text-xs text-gray-500">
                                <p>⚠️ Do not close or refresh the page</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }    performDataReset() {
        try {
            // Clear all localStorage data for EPay system (only keys that are actually used)
            localStorage.removeItem('epay_data');
            localStorage.removeItem('epay_member_data');
            localStorage.removeItem('epay_security_settings');
            localStorage.removeItem('epay_tasks');
            localStorage.removeItem('epay_history');
            localStorage.removeItem('epay_profile');
            localStorage.removeItem('epay_balance');
            localStorage.removeItem('epay_member_stats');
            
            // Clear all localStorage items that start with 'epay'
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('epay')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // Reset all class properties to completely empty values
            this.userData = {
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
                },
                joinDate: new Date().toISOString(),
                agentName: 'Agent User',
                transactions: [] // Empty transactions array for reset
            };
            
            this.personalInfo = {
                fullName: 'Agent User',
                email: 'agent@email.com',
                phone: '+1 (000) 000-0000',
                jobTitle: 'Financial Agent',
                address: 'Not specified',
                dateOfBirth: 'Not specified',
                verification: {
                    passport: { verified: false, date: null },
                    nationalId: { verified: false, date: null },
                    drivingLicense: { verified: false, date: null }
                }
            };
            
            this.paymentMethods = {
                bankAccounts: [],
                cryptoWallets: []
            };
            
            this.securitySettings = {
                twoFactorEnabled: false,
                lastPasswordChange: new Date().toISOString(),
                loggedDevices: [
                    {
                        id: 1,
                        name: 'Current Device',
                        location: 'Unknown',
                        lastActive: new Date().toISOString(),
                        isCurrent: true
                    }
                ]
            };

            // Save the reset data to localStorage
            this.saveUserData();

            // Show success modal
            this.showResetSuccessModal();
        } catch (error) {
            console.error('Reset failed:', error);
            this.showResetErrorModal();
        }
    }

    showResetSuccessModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
                <div class="bg-gray-900 rounded-2xl max-w-md w-full mx-4 border border-green-500/30">
                    <div class="p-8 text-center">
                        <div class="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-green-400 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-green-400 mb-2">Reset Complete!</h3>
                        <p class="text-gray-400 mb-6">All your account data has been successfully reset.</p>
                        
                        <div class="space-y-3">
                            <button onclick="profileManager.reloadPage()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                                Continue
                            </button>
                            <button onclick="profileManager.redirectToLogin()" class="w-full btn-secondary px-4 py-3 font-semibold">
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showResetErrorModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center">
                <div class="bg-gray-900 rounded-2xl max-w-md w-full mx-4 border border-red-500/30">
                    <div class="p-8 text-center">
                        <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-times text-red-400 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-red-400 mb-2">Reset Failed</h3>
                        <p class="text-gray-400 mb-6">An error occurred while resetting your data. Please try again.</p>
                        
                        <div class="space-y-3">
                            <button onclick="profileManager.closeModal()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }    reloadPage() {
        // Force reload fresh data from localStorage (which is now reset)
        this.userData = this.loadUserData();
        this.securitySettings = this.loadSecuritySettings();
        
        // Reload all sections with fresh data
        this.loadProfileData();
        this.loadTransactionData();
        this.loadPaymentMethodsData();
        this.loadPersonalInfoData();
        this.loadVerificationData();
        this.loadSecurityData();
        this.loadSupportData();
        
        this.closeModal();
        this.showNotification('Account data has been reset successfully!', 'success');
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    // Form Generation Functions
    getBankAccountForm(account = null) {
        const isEdit = account !== null;
        return `
            <form onsubmit="profileManager.saveBankAccount(event, ${isEdit ? account.id : 'null'})">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Account Holder Name</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${account ? account.accountHolder : ''}" name="accountHolder" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Bank Name</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${account ? account.bankName : ''}" name="bankName" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Account Number</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${account ? account.accountNumber : ''}" name="accountNumber" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Phone Number</label>
                        <input type="tel" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${account ? account.phone : ''}" name="phone" required>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="isPrimary" name="isPrimary" ${account && account.isPrimary ? 'checked' : ''}>
                        <label for="isPrimary" class="ml-2 text-sm">Set as primary account</label>
                    </div>
                </div>
                <div class="flex space-x-3 mt-6">
                    <button type="submit" class="btn-primary flex-1">${isEdit ? 'Update' : 'Add'} Account</button>
                    <button type="button" onclick="profileManager.closeModal()" class="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        `;
    }

    getCryptoWalletForm() {
        return `
            <form onsubmit="profileManager.saveCryptoWallet(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Wallet Type</label>
                        <select name="type" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" required>
                            <option value="USDT">USDT (Tether)</option>
                            <option value="BTC">Bitcoin</option>
                            <option value="ETH">Ethereum</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Network</label>
                        <select name="network" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" required>
                            <option value="TRC20">TRC20</option>
                            <option value="ERC20">ERC20</option>
                            <option value="BEP20">BEP20</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Wallet Address</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               name="address" placeholder="Enter wallet address" required>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" id="isActive" name="isActive" checked>
                        <label for="isActive" class="ml-2 text-sm">Set as active wallet</label>
                    </div>
                </div>
                <div class="flex space-x-3 mt-6">
                    <button type="submit" class="btn-primary flex-1">Add Wallet</button>
                    <button type="button" onclick="profileManager.closeModal()" class="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        `;
    }

    getPersonalInfoForm() {
        return `
            <form onsubmit="profileManager.savePersonalInfo(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Full Name</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${this.personalInfo.fullName}" name="fullName" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${this.personalInfo.email}" name="email" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Phone Number</label>
                        <input type="tel" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${this.personalInfo.phone}" name="phone" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Job Title</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${this.personalInfo.jobTitle}" name="jobTitle" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Address</label>
                        <textarea class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                                  name="address" rows="3" required>${this.personalInfo.address}</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Date of Birth</label>
                        <input type="text" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               value="${this.personalInfo.dateOfBirth}" name="dateOfBirth" required>
                    </div>
                </div>
                <div class="flex space-x-3 mt-6">
                    <button type="submit" class="btn-primary flex-1">Update Information</button>
                    <button type="button" onclick="profileManager.closeModal()" class="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        `;
    }

    getPasswordChangeForm() {
        return `
            <form onsubmit="profileManager.savePassword(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Current Password</label>
                        <input type="password" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               name="currentPassword" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">New Password</label>
                        <input type="password" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               name="newPassword" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Confirm New Password</label>
                        <input type="password" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg" 
                               name="confirmPassword" required>
                    </div>
                </div>
                <div class="flex space-x-3 mt-6">
                    <button type="submit" class="btn-primary flex-1">Change Password</button>
                    <button type="button" onclick="profileManager.closeModal()" class="btn-secondary flex-1">Cancel</button>
                </div>
            </form>
        `;
    }

    getFAQContent(category) {
        const faqs = {
            'getting-started': [
                {
                    question: 'How do I start earning as a Member?',
                    answer: 'To start earning, you need to deposit the minimum amount for your desired Member level and begin completing tasks. First, complete your profile verification, then make your initial deposit, and you can start processing money transfer tasks immediately.'
                },
                {
                    question: 'What are the different Member levels?',
                    answer: 'There are 5 levels: Level 1 ($300), Level 2 ($1,500), Level 3 ($3,000), Level 4 ($5,000), and Level 5 ($10,000). Higher levels offer more daily tasks, better commission rates, and priority support.'
                },
                {
                    question: 'Is ePay a legitimate company?',
                    answer: 'Yes, ePay Financial Services LLC is a fully licensed and regulated company registered in Delaware, USA (Registration No. 7892451). We are authorized by the Financial Crimes Enforcement Network (FinCEN) and carry professional liability insurance up to $5M USD.'
                },
                {
                    question: 'How much can I earn as a Member?',
                    answer: 'Earnings depend on your Member level and activity. Bronze Members can earn $50-100/day, while Diamond Members can earn $500-1000/day. Your commission rate ranges from 0.2% to 1.0% per transaction.'
                },
                {
                    question: 'What documents do I need to get started?',
                    answer: 'You need a valid government-issued ID (passport or driving license), proof of address (utility bill or bank statement), and a bank account for withdrawals.'
                },
                {
                    question: 'Is my money safe with ePay?',
                    answer: 'Absolutely. We use bank-grade 256-bit SSL encryption, segregated client accounts, and are fully insured. Your deposits are protected under the Financial Services Compensation Scheme (FSCS).'
                },
                {
                    question: 'Can I upgrade my Member level later?',
                    answer: 'Yes, you can upgrade to higher levels at any time by making additional deposits. Upgrades are instant and you immediately gain access to more tasks and higher commission rates.'
                },
                {
                    question: 'What happens if I want to stop being a Member?',
                    answer: 'You can stop at any time. Simply complete your current tasks, withdraw your earnings and deposit balance. There are no penalties or long-term commitments.'
                },
                {
                    question: 'Do I need any special skills or experience?',
                    answer: 'No special skills required! Our platform is designed for anyone to use. We provide comprehensive training materials and 24/7 support to help you succeed.'
                },
                {
                    question: 'How long does it take to see my first earnings?',
                    answer: 'You can start earning immediately after making your deposit. Most new Members complete their first task within 30 minutes and see earnings in their account right away.'
                },
                {
                    question: 'Can I work from anywhere in the world?',
                    answer: 'Yes, our platform is available globally. You can work from anywhere with an internet connection. We support multiple currencies and payment methods worldwide.'
                }
            ],
            'tasks': [
                {
                    question: 'How do tasks work?',
                    answer: 'Tasks involve processing money transfers for customers. You earn a commission based on your Member level.'
                },
                {
                    question: 'How often can I complete tasks?',
                    answer: 'The number of daily tasks depends on your Member level, ranging from 20 to 60 tasks per day.'
                }
            ],
            'payments': [
                {
                    question: 'How do I withdraw my earnings?',
                    answer: 'You can withdraw to your linked bank account or crypto wallet. Minimum withdrawal is $50.'
                },
                {
                    question: 'How long do withdrawals take?',
                    answer: 'Only 30-1 hour'
                }
            ],
            'security': [
                {
                    question: 'How do I secure my account?',
                    answer: 'Use a strong password, and regularly review your logged devices.'
                },
                {
                    question: 'What if I suspect unauthorized access?',
                    answer: 'Immediately change your password, logout all devices, and contact support.'
                }
            ]
        };

        const categoryFAQs = faqs[category] || [];
        return `
            <div class="space-y-4">
                ${categoryFAQs.map(faq => `
                    <div class="bg-gray-800/30 rounded-lg p-4">
                        <div class="font-semibold mb-2">${faq.question}</div>
                        <div class="text-gray-300 text-sm">${faq.answer}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatFAQTitle(category) {
        const titles = {
            'getting-started': 'Getting Started',
            'tasks': 'Task Management',
            'payments': 'Payments & Withdrawals',
            'security': 'Account Security'
        };
        return titles[category] || category;
    }

    // Form Submission Handlers
    saveBankAccount(event, accountId = null) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const accountData = {
            id: accountId || Date.now(),
            accountHolder: formData.get('accountHolder'),
            bankName: formData.get('bankName'),
            accountNumber: formData.get('accountNumber'),
            phone: formData.get('phone'),
            isPrimary: formData.get('isPrimary') === 'on'
        };

        if (accountId) {
            const index = this.paymentMethods.bankAccounts.findIndex(acc => acc.id === accountId);
            this.paymentMethods.bankAccounts[index] = accountData;
        } else {
            this.paymentMethods.bankAccounts.push(accountData);
        }

        this.saveUserData();
        this.loadBankAccounts();
        this.closeModal();
        this.showNotification('Bank account saved successfully!', 'success');
    }

    saveCryptoWallet(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const walletData = {
            id: Date.now(),
            type: formData.get('type'),
            network: formData.get('network'),
            address: formData.get('address'),
            isActive: formData.get('isActive') === 'on'
        };

        this.paymentMethods.cryptoWallets.push(walletData);
        this.saveUserData();
        this.loadCryptoWallets();
        this.closeModal();
        this.showNotification('Crypto wallet added successfully!', 'success');
    }

    savePersonalInfo(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        this.personalInfo.fullName = formData.get('fullName');
        this.personalInfo.email = formData.get('email');
        this.personalInfo.phone = formData.get('phone');
        this.personalInfo.jobTitle = formData.get('jobTitle');
        this.personalInfo.address = formData.get('address');
        this.personalInfo.dateOfBirth = formData.get('dateOfBirth');

        this.saveUserData();
        this.loadPersonalInfoData();
        this.loadProfileData();
        this.closeModal();
        this.showNotification('Personal information updated successfully!', 'success');
    }

    savePassword(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        this.securitySettings.lastPasswordChange = new Date().toISOString();
        this.saveUserData();
        this.closeModal();
        this.showNotification('Password changed successfully!', 'success');
    }

    // Transaction simulation for testing
    testTransaction() {
        this.addTransaction({
            type: 'deposit',
            amount: 100,
            description: 'Test Deposit',
            positive: true
        });
    }

    // Photo Upload Methods
    loadProfilePhoto() {
        const profilePhoto = document.getElementById('profile-photo');
        const defaultAvatar = document.getElementById('default-avatar');
        
        if (this.personalInfo.profilePhoto) {
            if (profilePhoto) {
                profilePhoto.src = this.personalInfo.profilePhoto;
                profilePhoto.classList.remove('hidden');
            }
            if (defaultAvatar) {
                defaultAvatar.classList.add('hidden');
            }
        } else {
            if (profilePhoto) {
                profilePhoto.classList.add('hidden');
            }
            if (defaultAvatar) {
                defaultAvatar.classList.remove('hidden');
            }
        }
    }

    uploadPhoto() {
        const photoUpload = document.getElementById('photo-upload');
        if (photoUpload) {
            photoUpload.click();
        }
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Image size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            
            // Update the profile photo in data and UI
            this.personalInfo.profilePhoto = imageDataUrl;
            this.userData.personalInfo.profilePhoto = imageDataUrl;
            this.saveUserData();
            
            // Update the display
            this.loadProfilePhoto();
            
            // Update verification status since photo has changed
            this.updateVerificationStatus();
            
            this.showNotification('Profile photo updated successfully!', 'success');
        };
        
        reader.onerror = () => {
            this.showNotification('Error reading the image file', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    removeProfilePhoto() {
        this.personalInfo.profilePhoto = null;
        this.userData.personalInfo.profilePhoto = null;
        this.saveUserData();
        this.loadProfilePhoto();
        
        // Update verification status since photo was removed
        this.updateVerificationStatus();
        
        this.showNotification('Profile photo removed successfully!', 'success');
    }

    // Utility: Add a transaction with timestamp
    addTransaction({type, amount, description, positive}) {
        if (!this.userData.transactions) this.userData.transactions = [];
        this.userData.transactions.push({
            type,
            amount,
            description,
            positive,
            timestamp: new Date().toISOString()
        });
        // Update balance if deposit/withdrawal/commission
        if (type === 'deposit') {
            this.userData.balance += amount;
        } else if (type === 'withdrawal') {
            this.userData.balance -= amount;
        } else if (type === 'commission') {
            this.userData.totalEarned += amount;
            this.userData.balance += amount;
        }
        this.saveUserData();
        this.loadProfileData();
        this.loadTransactionData();
    }

    // Check if user has uploaded both profile photo and ID verification
    updateVerificationStatus() {
        const verificationStatusEl = document.getElementById('verification-status');
        
        if (!verificationStatusEl) return;
        
        // Check if profile photo is uploaded
        const hasProfilePhoto = this.personalInfo.profilePhoto !== null && this.personalInfo.profilePhoto !== undefined;
        
        // Check if at least one ID verification is uploaded
        const hasIdVerification = this.personalInfo.verification.passport.verified || 
                                 this.personalInfo.verification.nationalId.verified || 
                                 this.personalInfo.verification.drivingLicense.verified;
        
        // Update verification status based on both conditions
        if (hasProfilePhoto && hasIdVerification) {
            verificationStatusEl.textContent = 'Verified Member';
            verificationStatusEl.parentElement.className = 'text-green-400 font-semibold';
            verificationStatusEl.parentElement.innerHTML = '<i class="fas fa-check-circle mr-1"></i><span id="verification-status">Verified Member</span>';
        } else {
            verificationStatusEl.textContent = 'Unverified Member';
            verificationStatusEl.parentElement.className = 'text-red-400 font-semibold';
            verificationStatusEl.parentElement.innerHTML = '<i class="fas fa-times-circle mr-1"></i><span id="verification-status">Unverified Member</span>';
        }
    }

    // Modal and Notification Functions
    showModal(title, content) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
                <div class="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] border border-gray-700 flex flex-col">
                    <div class="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
                        <h3 class="text-lg font-bold">${title}</h3>
                        <button onclick="profileManager.closeModal()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto flex-1">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }

    closeModal() {
        document.getElementById('modal-container').innerHTML = '';
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600',
            warning: 'bg-yellow-600'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Utility Functions
function goBack() {
    window.history.back();
}

function goToPage(page) {
    window.location.href = page;
}

function logout() {
    // Show custom logout confirmation modal
    showHeaderLogoutConfirmation();
}

function showHeaderLogoutConfirmation() {
    const confirmationContent = `
        <div class="text-center">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-sign-out-alt text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-4 text-red-400">Logout Confirmation</h3>
            <div class="text-gray-300 mb-6 space-y-2">
                <p class="font-semibold">⚠️ Are you sure you want to logout?</p>
                <div class="text-left text-sm space-y-1 bg-gray-800/50 p-4 rounded-lg">
                    <p>This will:</p>
                    <li>• End your current session</li>
                    <li>• Clear session data and cache</li>
                    <li>• Redirect you to the main page</li>
                    <li class="text-green-400">✓ Your user data and progress will be preserved</li>
                </div>
                <p class="text-yellow-400 text-sm mt-4">You will need to log in again to access your account.</p>
            </div>
            <div class="flex space-x-3">
                <button onclick="cancelHeaderLogout()" class="btn-secondary flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
                <button onclick="confirmHeaderLogout()" class="btn-primary flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors text-white">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
            </div>
        </div>
    `;
    
    // Create standalone modal for header logout
    createHeaderLogoutModal(confirmationContent);
}

function createHeaderLogoutModal(content) {
    // Remove any existing logout modal
    const existingModal = document.getElementById('header-logout-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create the modal HTML
    const modalHTML = `
        <div id="header-logout-modal" class="fixed inset-0 bg-black/90 backdrop-blur-lg z-[60] flex items-center justify-center p-4">
            <div class="glass-card bg-gradient-to-br from-gray-900/95 to-red-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full border border-red-500/30 p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold text-red-400">Logout</h2>
                    <button onclick="cancelHeaderLogout()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${content}
            </div>
        </div>
    `;

    // Add the modal to the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus the modal for accessibility
    const modal = document.getElementById('header-logout-modal');
    if (modal) {
        modal.focus();
    }
}

function cancelHeaderLogout() {
    const modal = document.getElementById('header-logout-modal');
    if (modal) {
        modal.remove();
    }
}

function confirmHeaderLogout() {
    // Close the modal first
    cancelHeaderLogout();
    
    // Clear only session-related data, preserve user data
    localStorage.removeItem('current_session');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('login_timestamp');
    localStorage.removeItem('session_id');
    
    // Clear session storage (temporary data)
    sessionStorage.clear();
    
    // Clear browser cache if possible
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
    
    // Show a brief notification before redirect
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-4 right-4 bg-green-600 text-white p-4 rounded-lg z-50 text-center';
    notification.innerHTML = 'Logged out successfully. Redirecting...';
    document.body.appendChild(notification);
    
}

// ID Verification upload functions
function uploadPassport() {
    if (window.profileManager) {
        window.profileManager.uploadPassport();
    }
}

function uploadNationalID() {
    if (window.profileManager) {
        window.profileManager.uploadNationalID();
    }
}

function uploadDrivingLicense() {
    if (window.profileManager) {
        window.profileManager.uploadDrivingLicense();
    }
}

// Photo upload functions
function uploadPhoto() {
    if (window.profileManager) {
        window.profileManager.uploadPhoto();
    }
}

function handlePhotoUpload(event) {
    if (window.profileManager) {
        window.profileManager.handlePhotoUpload(event);
    }
}

function removeProfilePhoto() {
    if (window.profileManager) {
        window.profileManager.removeProfilePhoto();
    }
}

// Navigation functions
function goBack() {
    window.history.back();
}

function goToPage(page) {
    window.location.href = page;
}

function logout() {
    window.location.href = 'index.html';
}

// Header logout functions
function showHeaderLogout() {
    if (window.profileManager) {
        window.profileManager.showLogoutConfirmationModal();
    }
}

function cancelHeaderLogout() {
    if (window.profileManager) {
        window.profileManager.closeModal();
    }
}

function confirmHeaderLogout() {
    // Close the modal first
    cancelHeaderLogout();
    
    // Clear only session-related data, preserve user data
    localStorage.removeItem('current_session');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('login_timestamp');
    localStorage.removeItem('session_id');
    
    // Clear session storage (temporary data)
    sessionStorage.clear();
    
    // Clear browser cache if possible
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
    
    // Show a brief notification before redirect
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-4 right-4 bg-green-600 text-white p-4 rounded-lg z-50 text-center';
    notification.innerHTML = 'Logged out successfully. Redirecting...';
    document.body.appendChild(notification);
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Initialize ProfileManager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.profileManager = new EnhancedProfileManager();
        console.log('ProfileManager initialized successfully');
    } catch (error) {
        console.error('Error initializing ProfileManager:', error);
        // Show a user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-20 left-4 right-4 bg-red-600 text-white p-4 rounded-lg z-50';
        errorDiv.innerHTML = `
            <h3 class="font-bold">Error Loading Profile</h3>
            <p>There was an error loading the profile manager. Please refresh the page.</p>
            <button onclick="location.reload()" class="mt-2 bg-red-800 px-3 py-1 rounded">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});
