// Simplified Dashboard JavaScript - Working Version
class AgentDashboard {
    constructor() {
        this.currentPage = 'home';
        this.userData = this.loadUserData();
        this.levels = this.initializeLevels();
        this.scrollThrottle = null; // Initialize scroll throttle timer
        this.init();
    }    // Initialize user data with persistence
    loadUserData() {
        const savedData = localStorage.getItem('epay_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Fix level 0 issue and ensure proper structure
            if (data.currentLevel === 0 || !data.currentLevel) {
                data.currentLevel = 1;
            }
            
            // Ensure levelProgress exists and has complete structure
            if (!data.levelProgress) {
                data.levelProgress = {};
            }
            
            // Ensure all levels have complete progress objects
            for (let level = 1; level <= 5; level++) {
                if (!data.levelProgress[level]) {
                    data.levelProgress[level] = { deposited: 0, tasksCompleted: 0, earned: 0 };
                } else {
                    // Ensure all fields exist in each level
                    data.levelProgress[level].deposited = data.levelProgress[level].deposited || 0;
                    data.levelProgress[level].tasksCompleted = data.levelProgress[level].tasksCompleted || 0;
                    data.levelProgress[level].earned = data.levelProgress[level].earned || 0;
                }
            }
            
            // Ensure top-level fields exist
            data.balance = data.balance || 0;
            data.totalEarned = data.totalEarned || 0;
            data.tasksCompleted = data.tasksCompleted || 0;
            data.lastWithdrawal = data.lastWithdrawal || null;
            data.canWithdraw = data.canWithdraw !== undefined ? data.canWithdraw : true;
            
            return data;
        }
        
        // Default user data - CONSISTENT with other pages
        return {
            balance: 0,
            totalEarned: 0,
            tasksCompleted: 0,
            currentLevel: 1,  // Changed from 0 to 1
            levelProgress: {
                1: { deposited: 0, tasksCompleted: 0, earned: 0 },
                2: { deposited: 0, tasksCompleted: 0, earned: 0 },
                3: { deposited: 0, tasksCompleted: 0, earned: 0 },
                4: { deposited: 0, tasksCompleted: 0, earned: 0 },
                5: { deposited: 0, tasksCompleted: 0, earned: 0 }
            },
            lastWithdrawal: null,
            canWithdraw: true
        };
    }

    // Save user data to localStorage
    saveUserData() {
        localStorage.setItem('epay_data', JSON.stringify(this.userData));
    }

    // Reset user data to defaults (for debugging)
    resetUserData() {
        localStorage.removeItem('epay_agent_data');
        this.userData = this.loadUserData();
        this.updateDisplay();
        console.log('User data reset to defaults');
        alert('User data has been reset to defaults. Refresh the page to see changes.');
        return this.userData;
    }

    // Initialize levels configuration
    initializeLevels() {
        return {
            1: {
                name: 'Level 1 Member',
                minDeposit: 200,
                dailyTasks: 65,
                commissionRate: 0.6,
                description: 'Basic level for new members',
                color: 'from-amber-600 to-orange-600',
                icon: 'fas fa-medal',
                earning: '$7-12/day'
            },
            2: {
                name: 'Level 2 Member',
                minDeposit: 1800,
                dailyTasks: 85,
                commissionRate: 1,
                description: 'Intermediate level with better rewards',
                color: 'from-gray-400 to-gray-600',
                icon: 'fas fa-award',
                earning: '$50-60/day'
            },
            3: {
                name: 'Level 3 Member',
                minDeposit: 3500,
                dailyTasks: 100,
                commissionRate: 3,
                description: 'Advanced level for experienced members',
                color: 'from-yellow-400 to-yellow-600',
                icon: 'fas fa-trophy',
                earning: '$300-400/day'
            },
            4: {
                name: 'Level 4 Member',
                minDeposit: 4500,
                dailyTasks: 140,
                commissionRate: 5,
                description: 'Premium level with high commissions',
                color: 'from-purple-400 to-purple-600',
                icon: 'fas fa-crown',
                earning: '$400-500/day'
            },
            5: {
                name: 'Level 5 Member',
                minDeposit: 8000,
                dailyTasks: 160,
                commissionRate: 8,
                description: 'Elite level for top performers',
                color: 'from-blue-400 to-cyan-400',
                icon: 'fas fa-gem',
                earning: '$500-600/day'
            }
        };
    }    // Initialize the dashboard
    init() {
        this.updateDisplay();
        this.setupEventListeners();
        this.loadPage('home');
        
        // Add global reference for debugging
        window.dashboard = this;
        
        // Ensure level cards are properly updated on init
        setTimeout(() => {
            this.updateLevelCards();
        }, 500);
    }// Format number in accounting style with commas
    formatAccounting(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Format number without currency symbol but with commas
    formatNumber(amount) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }    // Update dashboard display
    updateDisplay() {
        document.getElementById('total-balance').textContent = this.formatAccounting(this.userData.balance);        document.getElementById('total-earned').textContent = this.formatAccounting(this.userData.totalEarned);
        document.getElementById('tasks-completed').textContent = this.userData.tasksCompleted.toLocaleString();
        
        const currentLevel = this.userData.currentLevel || 1;
        if (currentLevel >= 1 && currentLevel <= 5) {
            document.getElementById('current-level').textContent = `Level ${currentLevel}`;
            document.getElementById('commission-rate').textContent = `${this.levels[currentLevel].commissionRate}%`;
        } else {
            document.getElementById('current-level').textContent = 'Level 1 Member';
            document.getElementById('commission-rate').textContent = '0.2%';
        }
        
        // Update level cards to reflect current status
        this.updateLevelCards();
    }

    // Update level cards display to show unlocked/locked status
    updateLevelCards() {
        // Get all level cards
        const levelCards = document.querySelectorAll('.level-card, [data-level]');
        
        levelCards.forEach(card => {
            const level = parseInt(card.dataset.level || card.getAttribute('data-level'));
            if (!level || !this.levels[level]) return;
            
            const config = this.levels[level];
            const levelProgress = this.userData.levelProgress[level];
            const hasRequiredDeposit = levelProgress.deposited >= config.minDeposit;
            const isActive = level === this.userData.currentLevel;
            
            // Update lock icon
            const lockIcon = card.querySelector('.fa-lock, .fa-unlock, .fa-check-circle');
            if (lockIcon) {
                if (hasRequiredDeposit) {
                    if (isActive) {
                        lockIcon.className = 'fas fa-check-circle text-green-400';
                    } else {
                        lockIcon.className = 'fas fa-unlock text-green-400';
                    }
                } else {
                    lockIcon.className = 'fas fa-lock text-red-400';
                }
            }
              // Update button text and functionality with enhanced styling
            const button = card.querySelector('button, .btn');
            if (button) {
                if (hasRequiredDeposit) {
                    if (isActive) {
                        button.innerHTML = '<i class="fas fa-play mr-2"></i>Start Tasks';
                        button.className = 'w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg';
                        button.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
                        button.onclick = () => window.location.href = 'tasks.html';
                    } else {
                        button.innerHTML = '<i class="fas fa-rocket mr-2"></i>Activate Level';
                        button.className = 'w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg';
                        button.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                        button.onclick = () => this.activateLevel(level);
                    }
                } else {
                    button.innerHTML = '<i class="fas fa-credit-card mr-2"></i>Click to Deposit';
                    button.className = 'w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300';
                    button.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.3)';
                    button.onclick = () => this.initiateDeposit(level);
                }
            }
            
            // Update deposit status text
            const statusText = card.querySelector('.deposit-status, .text-red-400, .text-green-400');
            if (statusText) {
                if (hasRequiredDeposit) {
                    statusText.textContent = isActive ? 'ACTIVE LEVEL' : 'READY TO ACTIVATE';
                    statusText.className = 'text-green-400 font-bold text-sm';
                } else {
                    statusText.textContent = `REQUIRES ${this.formatAccounting(config.minDeposit)} DEPOSIT`;
                    statusText.className = 'text-red-400 font-bold text-sm';
                }
            }            // Update card border/appearance with enhanced styling
            if (hasRequiredDeposit) {
                // Remove locked styling
                card.classList.remove('opacity-75', 'locked', 'balance-locked', 'locked-level');
                
                if (isActive) {
                    // Active level - bright, glowing, premium look
                    card.classList.remove('unlocked-inactive');
                    card.classList.add('unlocked-active');
                    card.classList.add('ring-4', 'ring-green-400', 'ring-opacity-40');
                    
                    // Add or update status badge
                    this.updateStatusBadge(card, 'ACTIVE', 'active');
                } else {
                    // Unlocked but not active - still premium but less intense
                    card.classList.remove('unlocked-active');
                    card.classList.add('unlocked-inactive');
                    card.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-30');
                    
                    // Add or update status badge
                    this.updateStatusBadge(card, 'UNLOCKED', 'unlocked');
                }
            } else {
                // Locked level - muted, clear distinction
                card.classList.remove('unlocked-active', 'unlocked-inactive', 'ring-2', 'ring-4', 'ring-green-400', 'ring-blue-400', 'ring-opacity-40', 'ring-opacity-30');
                card.classList.add('locked-level');
                
                // Add or update status badge
                this.updateStatusBadge(card, 'LOCKED', 'locked');
            }
        });
    }    // Show professional deposit modal
    showProfessionalDepositModal(level, config, levelProgress, isLocked) {
        const hasRequiredDeposit = levelProgress.deposited >= config.minDeposit;
        const shortfall = Math.max(0, config.minDeposit - levelProgress.deposited);
        const isActive = level === this.userData.currentLevel;
        
        // Override isLocked based on actual deposit status
        const actuallyLocked = !hasRequiredDeposit;
        
        document.getElementById('modal-level-title').textContent = `Level ${level} - ${config.name}`;
        
        document.getElementById('modal-level-content').innerHTML = `
            <div class="text-center space-y-6">
                <div class="w-24 h-24 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <i class="${config.icon} text-4xl text-white"></i>
                </div>
                  <div class="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                    <div class="text-center">
                        <div class="text-sm text-gray-400 mb-2">Required Deposit</div>
                        <div class="text-4xl font-bold text-green-400 mb-3">${this.formatAccounting(config.minDeposit)}</div>
                        <div class="text-sm text-gray-300 mb-2">Daily Tasks: ${config.dailyTasks.toLocaleString()}</div>
                        <div class="text-sm text-gray-300">Commission Rate: ${config.commissionRate}%</div>
                        ${levelProgress.deposited > 0 ? 
                            `<div class="text-sm text-blue-400 mb-1 mt-3">Already deposited: ${this.formatAccounting(levelProgress.deposited)}</div>
                             ${shortfall > 0 ? `<div class="text-sm text-red-400">Still needed: ${this.formatAccounting(shortfall)}</div>` : 
                               `<div class="text-sm text-green-400"><i class="fas fa-check-circle mr-1"></i>Deposit Complete!</div>`}` : ''
                        }
                    </div>
                </div>
                
                ${actuallyLocked ? 
                    `<button onclick="window.dashboard.initiateDeposit(${level})" 
                            class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-xl shadow-lg transform hover:scale-105">
                        <i class="fas fa-credit-card mr-3"></i>
                        Deposit Now
                    </button>` :
                    isActive ?
                    `<button onclick="window.dashboard.goToTasks()" 
                            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-xl shadow-lg transform hover:scale-105">
                        <i class="fas fa-play mr-3"></i>
                        Start Tasks
                    </button>` :
                    `<button onclick="window.dashboard.activateLevel(${level})" 
                            class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-xl shadow-lg transform hover:scale-105">
                        <i class="fas fa-rocket mr-3"></i>
                        Activate Level
                    </button>`
                }
                
                <button onclick="window.dashboard.closeLevelModal()" 
                        class="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                    Close
                </button>
            </div>
        `;
        
        document.getElementById('level-modal').classList.remove('hidden');
    }

    // Close level modal
    closeLevelModal() {
        document.getElementById('level-modal').classList.add('hidden');
    }    // Initiate deposit process - opens live chat
    initiateDeposit(level) {
        const config = this.levels[level];
        const levelProgress = this.userData.levelProgress[level];
        // Use the full minDeposit amount rather than the remaining amount needed
        // This allows users to make deposits even if they've already met the requirement
        const amountNeeded = config.minDeposit;
        
        console.log('Level:', level, 'Config:', config, 'Level Progress:', levelProgress, 'Amount Needed:', amountNeeded);
        
        this.closeLevelModal();
          // Open live chat for deposit assistance
        this.openLiveChatForDeposit(level, amountNeeded, config);
    }

    // Go to tasks page
    goToTasks() {
        this.closeLevelModal();
        window.location.href = 'tasks.html';
    }

    // Activate level (if already deposited)
    activateLevel(level) {
        this.userData.currentLevel = level;
        this.saveUserData();
        this.updateDisplay();
        this.closeLevelModal();
        alert(`Level ${level} activated successfully!`);
    }

    // Load different pages
    loadPage(page) {
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${page}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        this.currentPage = page;
        
        // Handle page navigation
        switch(page) {
            case 'home':
                // Already on dashboard, no redirect needed
                break;
            case 'transactions':
                window.location.href = 'tasks.html';
                break;
            case 'market':
                window.location.href = 'market.html';
                break;
            case 'history':
                window.location.href = 'history.html';
                break;
            case 'profile':
                window.location.href = 'profile.html';
                break;
            default:
                console.log('Unknown page:', page);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.loadPage(page);
            });
        });

        // Quick action buttons
        const startTasksBtn = document.getElementById('start-tasks-btn');
        if (startTasksBtn) {
            startTasksBtn.addEventListener('click', () => {
                window.location.href = 'tasks.html';
            });
        }        const depositBtn = document.getElementById('deposit-btn');        if (depositBtn) {
            depositBtn.addEventListener('click', () => {
                this.openLiveChatForDeposit(1, 300, this.levels[1]); // Open chat for Level 1 deposit
            });
        }

        const withdrawBtn = document.getElementById('withdraw-btn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                window.location.href = 'history.html';
            });
        }

        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }

        // Close modal buttons
        const closeLevelModal = document.getElementById('close-level-modal');
        if (closeLevelModal) {
            closeLevelModal.addEventListener('click', () => {
                this.closeLevelModal();
            });
        }

        // Live chat events
        this.setupLiveChatEvents();
    }

    // Live Chat functionality
    setupLiveChatEvents() {
        // Close live chat modal - Primary handler
        const closeLiveChatBtn = document.getElementById('close-live-chat');
        if (closeLiveChatBtn) {
            // Remove any existing event listeners first
            closeLiveChatBtn.removeEventListener('click', this.handleCloseLiveChat);
            
            // Add the event listener
            this.handleCloseLiveChat = () => {
                console.log('Close chat button clicked');
                this.closeLiveChat();
            };
            
            closeLiveChatBtn.addEventListener('click', this.handleCloseLiveChat);
            
            // Backup event handlers for better reliability
            closeLiveChatBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.closeLiveChat();
            });
            
            // Add keyboard support
            closeLiveChatBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeLiveChat();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('live-chat-modal');
                if (modal && !modal.classList.contains('hidden')) {
                    this.closeLiveChat();
                }
            }
        });

        // Chat form submission
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendChatMessage();
            });
        }
        
        // Enhanced mobile input handling
        if (chatInput) {
            // Prevent zoom on iOS when focusing input
            chatInput.addEventListener('focus', () => {
                if (window.innerWidth < 768) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                }
            });
            
            chatInput.addEventListener('blur', () => {
                if (window.innerWidth < 768) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                    }
                }
            });
            
            // Handle Enter key on mobile
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }

        // Auto-open chat when clicking deposit buttons
        const depositBtns = document.querySelectorAll('[onclick*="initiateDeposit"]');
        depositBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const level = parseInt(btn.closest('.level-card').dataset.level);
                this.openLiveChatForDeposit(level);
            });
        });
    }    // Open live chat modal
    openLiveChat() {
        const modal = document.getElementById('live-chat-modal');
        const chatMessages = document.getElementById('chat-messages');
        
        if (modal) {
            // Clear previous messages
            if (chatMessages) {
                chatMessages.innerHTML = '';
            }
            
            // Handle mobile viewport and body scroll
            if (window.innerWidth < 768) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
            
            modal.classList.remove('hidden');
            // Add animation classes
            setTimeout(() => {
                const modalContent = modal.querySelector('.animate-fade-in-lg, .bg-white, .bg-gradient-to-br');
                if (modalContent) {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }
            }, 50);
            
            // Add greeting and show language selection
            setTimeout(() => {
                this.addChatMessage('agent', 'Hello! Welcome to ePay Customer Support. 👋');
            }, 500);
            
            setTimeout(() => {
                this.addChatMessage('agent', 'Please select your preferred language to continue:');
            }, 1200);
            
            setTimeout(() => {
                this.showNewLanguageOptions();
            }, 2000);
        }
    }

    // Close live chat modal
    closeLiveChat() {
        const modal = document.getElementById('live-chat-modal');
        const modalContent = modal.querySelector('.bg-gradient-to-br');
        
        // Restore body scroll on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }    // Open live chat for deposit assistance
    openLiveChatForDeposit(level, amountNeeded, config) {
        console.log('openLiveChatForDeposit called with:', { level, amountNeeded, config });
        
        const modal = document.getElementById('live-chat-modal');
        const chatMessages = document.getElementById('chat-messages');
          // Store level data for later use
        this.currentChatLevel = level;
        this.currentChatAmount = amountNeeded;
        this.currentChatConfig = config;
        
        // Also set tempDepositData for the deposit flow
        this.tempDepositData = {
            level: level,
            amountNeeded: amountNeeded,
            config: config
        };
        
        console.log('tempDepositData set in openLiveChatForDeposit:', this.tempDepositData);
        
        // Clear previous messages
        chatMessages.innerHTML = '';
        
        // Handle mobile viewport and body scroll
        if (window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
        
        // Show the modal with animation
        modal.classList.remove('hidden');
        setTimeout(() => {
            const modalContent = modal.querySelector('.bg-gradient-to-br');
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 100);
        
        // Add greeting and show language selection
        setTimeout(() => {
            this.addChatMessage('agent', 'Hello! Welcome to ePay Customer Support. 👋');
        }, 500);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Please select your preferred language to continue:');
        }, 1200);
        
        setTimeout(() => {
            this.showNewLanguageOptions();
        }, 2000);
    }    // Optimized scroll to bottom function with throttling
    scrollToBottom(chatMessages, immediate = false) {
        if (this.scrollThrottle) {
            clearTimeout(this.scrollThrottle);
        }
        
        const scrollFunction = () => {
            requestAnimationFrame(() => {
                if (chatMessages && chatMessages.scrollHeight > chatMessages.clientHeight) {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            });
        };
        
        if (immediate) {
            scrollFunction();
        } else {
            this.scrollThrottle = setTimeout(scrollFunction, 50);
        }
    }

    // Add a chat message to the chat window with smooth animations
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        
        // Create typing indicator for agent messages
        if (sender === 'agent') {
            this.showTypingIndicator();
        }
        
        // Delay before showing the actual message
        setTimeout(() => {
            if (sender === 'agent') {
                this.hideTypingIndicator();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `mb-4 sm:mb-5 md:mb-6 ${sender === 'user' ? 'text-right' : 'text-left'} opacity-0 transform translate-y-2 chat-message-container`;
            
            const messageContent = document.createElement('div');
            const isComplexMessage = message.includes('<div class="space-y-3">');
            
            messageContent.className = `inline-block ${
                sender === 'user' 
                    ? 'max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl' 
                    : isComplexMessage ? 'max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl' : 'max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'
            } px-4 sm:px-5 md:px-6 lg:px-7 py-3 sm:py-4 md:py-5 rounded-2xl sm:rounded-3xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed shadow-lg ${
                sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-lg border border-blue-500/20' 
                    : 'bg-gradient-to-r from-white to-gray-50 text-gray-800 rounded-bl-lg border border-gray-200/50'
            } transform transition-all duration-300 font-normal`;
            
            // Check if message contains HTML tags to determine if it should be rendered as HTML
            if (typeof message === 'string' && message.includes('<')) {
                messageContent.innerHTML = message;
            } else if (typeof message === 'string') {
                messageContent.textContent = message;
            } else {
                messageContent.innerHTML = message;
            }
            
            messageDiv.appendChild(messageContent);
            chatMessages.appendChild(messageDiv);
            
            // Apply animation based on sender
            requestAnimationFrame(() => {
                messageDiv.classList.remove('opacity-0', 'translate-y-2');
                messageDiv.classList.add('opacity-100', 'translate-y-0');
                if (sender === 'agent') {
                    messageDiv.classList.add('chat-message-agent');
                } else {
                    messageDiv.classList.add('chat-message-user');
                }
            });
            
            // Optimized scroll to bottom with better performance
            this.scrollToBottom(chatMessages);
            
        }, sender === 'agent' ? 1200 : 0); // Delay for agent messages to show typing
    }

    // Show typing indicator
    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const existingIndicator = document.getElementById('typing-indicator');
        
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'mb-4 sm:mb-5 md:mb-6 text-left opacity-0 transform translate-y-2 transition-all duration-300';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        // Animate in
        requestAnimationFrame(() => {
            typingDiv.classList.remove('opacity-0', 'translate-y-2');
            typingDiv.classList.add('opacity-100', 'translate-y-0');
        });
        
        // Optimized auto scroll to show typing indicator
        this.scrollToBottom(chatMessages, true);
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }
    }// Show deposit options in chat
    showDepositOptions(level, amountNeeded, config) {
        // Get translated text based on selected language
        const translations = this.getTranslations(this.selectedLanguage || 'English');
        
        const optionsHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">${translations.chooseMethod}</p>
                <div class="space-y-2">
                    <button onclick="window.dashboard.selectDepositMethod('bank', ${level}, ${amountNeeded})" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-university text-blue-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">${translations.bankTransfer}</div>
                                <div class="text-xs text-gray-600">${translations.bankDesc}</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectDepositMethod('crypto', ${level}, ${amountNeeded})" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-coins text-green-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">${translations.cryptocurrency}</div>
                                <div class="text-xs text-gray-600">${translations.cryptoDesc}</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectDepositMethod('card', ${level}, ${amountNeeded})" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-credit-card text-purple-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">${translations.creditCard}</div>
                                <div class="text-xs text-gray-600">${translations.cardDesc}</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', optionsHtml);
    }    // Handle deposit method selection
    selectDepositMethod(method, level, amountNeeded) {
        const translations = this.getTranslations(this.selectedLanguage || 'English');
        
        // Add user message with translated method name
        let methodName = '';
        switch(method) {
            case 'bank':
                methodName = translations.bankTransfer;
                break;
            case 'crypto':
                methodName = translations.cryptocurrency;
                break;
            case 'card':
                methodName = translations.creditCard;
                break;
        }
        
        this.addChatMessage('user', `${methodName}`);
        
        setTimeout(() => {
            switch(method) {
                case 'bank':
                    this.showBankDepositDetails(level, amountNeeded);
                    break;
                case 'crypto':
                    this.showCryptoDepositDetails(level, amountNeeded);
                    break;
                case 'card':
                    this.showCardDepositDetails(level, amountNeeded);
                    break;
            }
        }, 1000);
    }    // Show bank deposit details
    showBankDepositDetails(level, amountNeeded) {
        this.addChatMessage('agent', 'Great choice! Here are our bank details for your deposit:');
        
        setTimeout(() => {
            // Default to USD banking details
            const bankingInfo = this.getBankingDetails('USD') || {
                bankName: 'First National Bank',
                accountName: 'ePay Global Ltd',
                accountNumber: '1234567890',
                bankCode: '123456789',
                additionalInfo: 'Routing Number'
            };
            
            const bankDetails = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div class="text-center">
                        <div class="font-bold text-lg text-blue-800">Bank Transfer Details</div>
                        <div class="text-sm text-blue-600">Amount: $${amountNeeded.toFixed(2)}</div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div><strong>Bank Name:</strong> ${bankingInfo.bankName}</div>
                        <div><strong>Account Name:</strong> ${bankingInfo.accountName}</div>
                        <div><strong>Account Number:</strong> ${bankingInfo.accountNumber}</div>
                        <div><strong>${bankingInfo.additionalInfo}:</strong> ${bankingInfo.bankCode}</div>
                        <div><strong>Reference:</strong> LEVEL${level}-${Date.now()}</div>
                    </div>
                    <div class="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div class="text-xs text-yellow-800">
                            <i class="fas fa-exclamation-triangle mr-1"></i>
                            Please include the reference number in your transfer
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', bankDetails);
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Once you complete the transfer, please send me a screenshot of the transaction receipt and I\'ll activate your account immediately! 📱');
        }, 1500);
    }

    // Show crypto deposit details
    showCryptoDepositDetails(level, amountNeeded) {
        this.addChatMessage('agent', 'Perfect! Crypto deposits are processed instantly. Here\'s your deposit address:');
        
        setTimeout(() => {
            const cryptoDetails = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div class="text-center">
                        <div class="font-bold text-lg text-green-800">USDT (TRC-20) Deposit</div>
                        <div class="text-sm text-green-600">Amount: $${amountNeeded.toFixed(2)} USDT</div>
                    </div>
                    <div class="bg-white border border-gray-300 rounded p-3">
                        <div class="text-xs text-gray-600 mb-1">Deposit Address:</div>
                        <div class="font-mono text-sm break-all bg-gray-100 p-2 rounded">
                            TXYZabc123def456ghi789jkl012mno345pqr678
                        </div>
                        <button onclick="navigator.clipboard.writeText('TXYZabc123def456ghi789jkl012mno345pqr678')" 
                                class="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                            <i class="fas fa-copy mr-1"></i> Copy Address
                        </button>
                    </div>
                    <div class="bg-red-50 border border-red-200 rounded p-2">
                        <div class="text-xs text-red-800">
                            <i class="fas fa-exclamation-triangle mr-1"></i>
                            Only send USDT via TRC-20 network
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', cryptoDetails);
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Send the exact amount and your account will be upgraded automatically! If you need any help, just ask. 🚀');
        }, 1500);
    }

    // Show card deposit details
    showCardDepositDetails(level, amountNeeded) {
        this.addChatMessage('agent', 'Card deposits are quick and secure! Let me set up the deposit link for you.');
        
        setTimeout(() => {
            const cardDetails = `
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <div class="text-center">
                        <div class="font-bold text-lg text-purple-800">Secure Card Deposit</div>
                        <div class="text-sm text-purple-600">Amount: $${amountNeeded.toFixed(2)}</div>
                    </div>
                    <button onclick="window.dashboard.processCardPayment(${level}, ${amountNeeded})" 
                            class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition">
                        <i class="fas fa-credit-card mr-2"></i>
                        Deposit $${amountNeeded.toFixed(2)} Now
                    </button>
                    <div class="text-xs text-gray-600 text-center">
                        <i class="fas fa-shield-alt mr-1"></i>
                        Secured by 256-bit SSL encryption
                    </div>
                </div>
            `;
            this.addChatMessage('agent', cardDetails);
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Click the deposit button above to proceed with your secure card deposit. Your account will be upgraded instantly! 💳');
        }, 1500);
    }

    // Process card payment (placeholder)
    processCardPayment(level, amountNeeded) {
        this.addChatMessage('user', 'Processing card deposit...');
        
        setTimeout(() => {
            this.addChatMessage('agent', `✅ Deposit successful! Your account has been upgraded to Level ${level}. Welcome to your new agent level!`);
            
            // Update user data
            this.userData.levelProgress[level].deposited = this.levels[level].minDeposit;
            this.userData.currentLevel = level;
            this.userData.balance += amountNeeded; // Add to balance for demo
            this.saveUserData();
            this.updateDisplay();
            
            setTimeout(() => {
                this.addChatMessage('agent', 'You can now start completing tasks and earning commissions! Is there anything else I can help you with?');
            }, 1000);
        }, 2000);
    }

    // Close live chat
    closeLiveChat() {
        console.log('Closing live chat modal');
        const modal = document.getElementById('live-chat-modal');
        
        if (!modal) {
            console.error('Modal not found');
            return;
        }
        
        const modalContent = modal.querySelector('.bg-gradient-to-br');
        
        // Restore body scroll on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
            console.log('Modal hidden');
        }, 300);
    }

    // Setup live chat event listeners  
    setupLiveChatEvents() {
        console.log('Setting up live chat events');
        
        // Close chat button - multiple event handlers for reliability
        const closeChatBtn = document.getElementById('close-live-chat');
        if (closeChatBtn) {
            console.log('Close button found, adding event listeners');
            
            // Primary click handler
            closeChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                this.closeLiveChat();
            });
            
            // Touch handler for mobile
            closeChatBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button touched');
                this.closeLiveChat();
            });
            
            // Keyboard handler
            closeChatBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('Close button keyboard activated');
                    this.closeLiveChat();
                }
            });
        } else {
            console.error('Close chat button not found');
        }

        // Chat form submission
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        
        if (chatForm && chatInput) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage('user', message);
                    chatInput.value = '';
                    
                    // Auto-reply (placeholder)
                    setTimeout(() => {
                        this.addChatMessage('agent', 'Thank you for your message. Our team will assist you shortly!');
                    }, 1000);
                }
            });
        }
    }

    // Open live chat for deposit assistance
    openLiveChatForDeposit(level, amountNeeded, config) {
        console.log('openLiveChatForDeposit called with:', { level, amountNeeded, config });
        
        const modal = document.getElementById('live-chat-modal');
        const chatMessages = document.getElementById('chat-messages');
        
        // Clear previous messages
        chatMessages.innerHTML = '';
        
        // Show the modal with animation
        modal.classList.remove('hidden');
        setTimeout(() => {
            const modalContent = modal.querySelector('.bg-white');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 100);
          // Add initial chat messages
        setTimeout(() => {
            this.addChatMessage('agent', 'Hello! Welcome to ePay support. How can I assist you today? 👋');
            this.addChatMessage('agent', `I see you want to unlock ${config.name} (Level ${level}). You need to deposit ${this.formatAccounting(amountNeeded)} to activate this level.`);
            this.addChatMessage('agent', 'I can help you complete this deposit quickly and securely. First, please select your preferred language:');
        }, 500);
        
        setTimeout(() => {
            this.showLanguageOptions(level, amountNeeded, config);
        }, 1000);
    }    // Show language selection options
    showLanguageOptions(level, amountNeeded, config) {
        // Store the parameters temporarily for the language selection
        this.tempDepositData = { level, amountNeeded, config };
        
        const languageOptions = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">🌍 Choose your preferred language:</p>
                <div class="grid grid-cols-3 gap-2">
                    <button onclick="window.dashboard.selectLanguage('English', '🇺🇸')" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇺🇸</div>
                        <div class="text-xs font-medium text-gray-800">English</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Chinese', '🇨🇳')" 
                            class="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇨🇳</div>
                        <div class="text-xs font-medium text-gray-800">中文</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Indonesian', '🇮🇩')" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇮🇩</div>
                        <div class="text-xs font-medium text-gray-800">Indonesian</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Malay', '🇲🇾')" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇲🇾</div>
                        <div class="text-xs font-medium text-gray-800">Bahasa Melayu</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Japanese', '🇯🇵')" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇯🇵</div>
                        <div class="text-xs font-medium text-gray-800">日本語</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Korean', '🇰🇷')" 
                            class="w-full bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇰🇷</div>
                        <div class="text-xs font-medium text-gray-800">한국어</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Hindi', '🇮🇳')" 
                            class="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇮🇳</div>
                        <div class="text-xs font-medium text-gray-800">हिंदी</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Arabic', '🇸🇦')" 
                            class="w-full bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇸🇦</div>
                        <div class="text-xs font-medium text-gray-800">العربية</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Vietnamese', '🇻🇳')" 
                            class="w-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇻🇳</div>
                        <div class="text-xs font-medium text-gray-800">Tiếng Việt</div>
                    </button>
                    <button onclick="window.dashboard.selectLanguage('Thai', '🇹🇭')" 
                            class="w-full bg-lime-50 hover:bg-lime-100 border border-lime-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇹🇭</div>
                        <div class="text-xs font-medium text-gray-800">ภาษาไทย</div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', languageOptions);
    }    // Handle language selection
    selectLanguage(language, flag) {
        // Store selected language
        this.selectedLanguage = language;
        
        // Add user message
        this.addChatMessage('user', `${flag} ${language}`);
        
        setTimeout(() => {
            this.addChatMessage('agent', `Great! I'll assist you in ${language}. Now I need your email address to proceed with the deposit:`);
        }, 800);
        
        setTimeout(() => {
            this.showEmailInput();
        }, 1500);
    }

    // Show email input
    showEmailInput() {
        const emailInputHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">📧 Please enter your email address:</p>
                <div class="space-y-2">
                    <input type="email" id="user-email-input" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                           placeholder="Enter your email address" />
                    <button onclick="window.dashboard.submitEmail()" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-envelope mr-2"></i>
                        Submit Email
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', emailInputHtml);
    }    // Handle email submission
    submitEmail() {
        const emailInput = document.getElementById('user-email-input');
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Store email
        this.userEmail = email;
        
        // Add user message
        this.addChatMessage('user', email);
        
        // Check if we're in activation flow
        if (this.isActivationFlow && this.currentChatLevel) {
            // Clear activation flag
            this.isActivationFlow = false;
            
            // Route to unlock level chat flow with level-specific messaging
            setTimeout(() => {
                const config = this.currentChatConfig;
                this.addChatMessage('agent', `Perfect! Now I'll help you unlock ${config.name} with your ${this.formatAccounting(config.minDeposit)} deposit.`);
            }, 800);
            
            setTimeout(() => {
                this.addChatMessage('agent', 'Please select your preferred deposit method:');
            }, 1500);
            
            setTimeout(() => {
                this.showDepositMethods();
            }, 2200);
        } else {
            // Regular deposit flow
            setTimeout(() => {
                this.addChatMessage('agent', 'Thank you! Now please select your preferred deposit method:');
            }, 800);
            
            setTimeout(() => {
                this.showDepositMethods();
            }, 1500);
        }
    }

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show deposit methods (Bank Transfer and USDT only)
    showDepositMethods() {
        const depositMethodsHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">💳 Choose your deposit method:</p>
                <div class="space-y-2">
                    <button onclick="window.dashboard.selectDepositMethod('bank')" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-university text-blue-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">Bank Transfer</div>
                                <div class="text-xs text-gray-600">Secure bank-to-bank transfer</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectDepositMethod('usdt')" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-coins text-green-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">USDT (Cryptocurrency)</div>
                                <div class="text-xs text-gray-600">USDT via TRC-20 network</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', depositMethodsHtml);
    }    // Handle deposit method selection
    selectDepositMethod(method) {
        if (method === 'bank') {
            this.addChatMessage('user', 'Bank Transfer');
            
            setTimeout(() => {
                this.addChatMessage('agent', 'Excellent! Bank transfer selected. Now please choose the currency you want to deposit in:');
            }, 800);
            
            setTimeout(() => {
                this.showCurrencyOptions();
            }, 1500);
              } else if (method === 'usdt') {
            this.addChatMessage('user', '💰 USDT (Cryptocurrency)');
            
            setTimeout(() => {
                this.addChatMessage('agent', 'Great! USDT deposits are processed instantly. Let me calculate the exact amount for you...');
            }, 800);
            
            setTimeout(() => {
                // For USDT, we use 1:1 USD conversion
                const { level, amountNeeded } = this.tempDepositData;
                this.showUSDTDepositConfirmation(level, amountNeeded);
            }, 1500);
        }
    }

    // Show currency options
    showCurrencyOptions() {
        const currencyOptionsHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">🌏 Select your deposit currency:</p>
                
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-2">🌏 Asia Pacific</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="window.dashboard.selectCurrency('HKD', 'Hong Kong Dollar', 7.8)" 
                                    class="currency-btn bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇭🇰</span>
                                    <span class="font-medium text-gray-800 text-sm">HKD</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('SGD', 'Singapore Dollar', 1.35)" 
                                    class="currency-btn bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇸🇬</span>
                                    <span class="font-medium text-gray-800 text-sm">SGD</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('JPY', 'Japanese Yen', 150)" 
                                    class="currency-btn bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇯🇵</span>
                                    <span class="font-medium text-gray-800 text-sm">JPY</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('KRW', 'Korean Won', 1320)" 
                                    class="currency-btn bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇰🇷</span>
                                    <span class="font-medium text-gray-800 text-sm">KRW</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('TWD', 'Taiwan Dollar', 31.5)" 
                                    class="currency-btn bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇹🇼</span>
                                    <span class="font-medium text-gray-800 text-sm">TWD</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('THB', 'Thai Baht', 36)" 
                                    class="currency-btn bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇹🇭</span>
                                    <span class="font-medium text-gray-800 text-sm">THB</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('MYR', 'Malaysian Ringgit', 4.7)" 
                                    class="currency-btn bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇲🇾</span>
                                    <span class="font-medium text-gray-800 text-sm">MYR</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('IDR', 'Indonesian Rupiah', 15700)" 
                                    class="currency-btn bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇮🇩</span>
                                    <span class="font-medium text-gray-800 text-sm">IDR</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('VND', 'Vietnamese Dong', 24000)" 
                                    class="currency-btn bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇻🇳</span>
                                    <span class="font-medium text-gray-800 text-sm">VND</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-2">🌍 Middle East & Africa</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="window.dashboard.selectCurrency('AED', 'UAE Dirham', 3.67)" 
                                    class="currency-btn bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇦🇪</span>
                                    <span class="font-medium text-gray-800 text-sm">AED</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('SAR', 'Saudi Riyal', 3.75)" 
                                    class="currency-btn bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇸🇦</span>
                                    <span class="font-medium text-gray-800 text-sm">SAR</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-700 mb-2">🌍 Europe</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="window.dashboard.selectCurrency('EUR', 'Euro', 0.92)" 
                                    class="currency-btn bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇪🇺</span>
                                    <span class="font-medium text-gray-800 text-sm">EUR</span>
                                </div>
                            </button>
                            <button onclick="window.dashboard.selectCurrency('GBP', 'British Pound', 0.79)" 
                                    class="currency-btn bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-left transition-colors">
                                <div class="flex items-center">
                                    <span class="text-sm mr-2">🇬🇧</span>
                                    <span class="font-medium text-gray-800 text-sm">GBP</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', currencyOptionsHtml);
    }    // Handle currency selection and calculate amount
    selectCurrency(currencyCode, currencyName, exchangeRate) {
        const { level, amountNeeded } = this.tempDepositData;
        console.log('selectCurrency called:', { level, amountNeeded, currencyCode, exchangeRate });
        const convertedAmount = this.formatNumber(amountNeeded * exchangeRate);
        console.log('convertedAmount calculated:', convertedAmount);
        
        // Store currency information
        this.selectedCurrency = { currencyCode, currencyName, exchangeRate, convertedAmount };
        
        // Add user message        this.addChatMessage('user', `${currencyCode} - ${currencyName}`);
        
        setTimeout(() => {
            this.showDepositConfirmation(level, amountNeeded, currencyCode, convertedAmount, currencyName);
        }, 800);
    }

    // Show professional deposit confirmation with summary
    showDepositConfirmation(level, amountNeeded, currencyCode, convertedAmount, currencyName) {
        this.addChatMessage('agent', 'Perfect! Let me confirm your deposit details:');
        
        setTimeout(() => {
            const { config } = this.tempDepositData;            const confirmationHtml = `
                <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                    <!-- Header Section -->
                    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
                        <div class="flex items-center justify-center mb-3">
                            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-clipboard-check text-xl"></i>
                            </div>
                        </div>
                        <h3 class="text-lg font-bold text-center mb-1">Confirm Deposit Details</h3>
                        <p class="text-center text-indigo-100 text-sm">Review & Confirm Your Deposit</p>
                    </div>

                    <!-- Amount Section -->
                    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-indigo-800 mb-1">${convertedAmount} ${currencyCode}</div>
                            <div class="text-sm text-gray-600">≈ ${this.formatAccounting(amountNeeded)}</div>
                            <div class="text-xs text-purple-600 font-medium mt-1">${currencyName}</div>
                        </div>
                    </div>

                    <!-- Transaction Summary Section -->
                    <div class="px-6 py-5 space-y-4">
                        <!-- Level & Service Info -->
                        <div class="bg-gradient-to-r ${config.color} rounded-lg p-4 text-white">
                            <div class="flex items-center justify-center mb-2">
                                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                    <i class="${config.icon} text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-bold text-sm">${config.name}</div>
                                    <div class="text-xs opacity-90">Level ${level} Upgrade</div>
                                </div>
                            </div>
                            <div class="text-center text-xs opacity-90">
                                ${config.dailyTasks} tasks/day • ${config.commissionRate}% commission
                            </div>
                        </div>

                        <!-- Deposit Details -->
                        <div class="space-y-3">
                            <div class="bg-gray-50 rounded-lg p-3">
                                <div class="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                    <i class="fas fa-credit-card text-indigo-600 mr-2"></i>
                                    Deposit Information
                                </div>
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between py-1 border-b border-gray-200">
                                        <span class="text-gray-600 text-xs font-medium">Deposit Method</span>
                                        <span class="text-gray-900 font-semibold text-xs">Bank Transfer</span>
                                    </div>
                                    <div class="flex items-center justify-between py-1 border-b border-gray-200">
                                        <span class="text-gray-600 text-xs font-medium">Currency</span>
                                        <span class="text-indigo-600 font-semibold text-xs">${currencyCode}</span>
                                    </div>
                                    <div class="flex items-center justify-between py-1 border-b border-gray-200">
                                        <span class="text-gray-600 text-xs font-medium">Amount</span>
                                        <span class="text-green-600 font-bold text-xs">${convertedAmount} ${currencyCode}</span>
                                    </div>
                                    <div class="flex items-center justify-between py-1">
                                        <span class="text-gray-600 text-xs font-medium">USD Equivalent</span>
                                        <span class="text-gray-900 font-semibold text-xs">${this.formatAccounting(amountNeeded)}</span>
                                    </div>
                                </div>                            </div>
                        </div>
                    </div>

                    <!-- Confirmation Notice -->
                    <div class="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-yellow-600 mr-3 mt-1"></i>
                            <div>
                                <div class="font-bold text-yellow-800 text-sm mb-1">Important Notice</div>
                                <div class="text-xs text-yellow-700">
                                    By confirming, you agree to proceed with the ${convertedAmount} ${currencyCode} deposit to upgrade your account to ${config.name}.
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="px-6 py-5 bg-gray-50 border-t border-gray-100 space-y-3">
                        <button onclick="window.dashboard.confirmDeposit()" 
                                class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-[1.02]">
                            <i class="fas fa-check-circle mr-2"></i>
                            Confirm & Proceed to Deposit
                        </button>
                        <button onclick="window.dashboard.cancelConfirmation()" 
                                class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors duration-200 border border-gray-300 flex items-center justify-center">
                            <i class="fas fa-arrow-left mr-2"></i>
                            Back to Edit Details
                        </button>
                    </div>
                </div>
            `;
            
            this.addChatMessage('agent', confirmationHtml);
        }, 800);
    }

    // Handle deposit confirmation
    confirmDeposit() {
        this.addChatMessage('user', '✅ Confirmed - Proceed with deposit');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Perfect! Your deposit details have been confirmed. Here are your bank transfer details:');
        }, 800);
        
        setTimeout(() => {
            const { level, amountNeeded } = this.tempDepositData;
            const { currencyCode, convertedAmount, currencyName } = this.selectedCurrency;
            this.showBankDepositDetailsWithCurrency(level, amountNeeded, currencyCode, convertedAmount, currencyName);
        }, 1500);
    }

    // Handle deposit cancellation
    cancelConfirmation() {
        this.addChatMessage('user', '❌ Cancel - Return to main menu');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'No problem! Is there anything else I can help you with?');
        }, 800);
        
        setTimeout(() => {
            this.showSupportOptions();
        }, 1500);
    }

    // Show bank deposit details with selected currency
    showBankDepositDetailsWithCurrency(level, usdAmount, currencyCode, convertedAmount, currencyName) {
        this.addChatMessage('agent', '🏦 Here are your secure bank transfer details:');
        
        setTimeout(() => {
            const referenceNumber = `LEVEL${level}-${Date.now()}`;
            const bankingInfo = this.getBankingDetails(currencyCode);
            
            const bankDetails = `
                <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                    <!-- Header Section -->
                    <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                        <div class="flex items-center justify-center mb-2">
                            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-university text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-lg font-bold text-center mb-1">Banking Information</h3>
                        <p class="text-center text-blue-100 text-sm">Secure Bank Transfer</p>
                    </div>

                    <!-- Amount Section -->
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-700 mb-1">${convertedAmount} ${currencyCode}</div>
                            <div class="text-sm text-gray-600">≈ ${this.formatAccounting(usdAmount)}</div>
                            <div class="text-xs text-blue-600 font-medium mt-1">${currencyName}</div>
                        </div>
                    </div>

                    <!-- Bank Details Section -->
                    <div class="px-6 py-5 space-y-4">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600 text-sm font-medium">Bank Name</span>
                                <span class="text-gray-900 font-semibold text-sm">${bankingInfo.bankName}</span>
                            </div>
                            <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600 text-sm font-medium">Account Name</span>
                                <span class="text-gray-900 font-semibold text-sm">${bankingInfo.accountName}</span>
                            </div>
                            <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600 text-sm font-medium">Account Number</span>
                                <div class="text-right">
                                    <div class="font-mono font-bold text-gray-900 text-sm">${bankingInfo.accountNumber}</div>
                                    <button onclick="navigator.clipboard.writeText('${bankingInfo.accountNumber}')" 
                                            class="text-xs text-blue-600 hover:text-blue-800 mt-1">
                                        <i class="fas fa-copy mr-1"></i>Copy
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-center justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600 text-sm font-medium">Reference</span>
                                <div class="text-right">
                                    <div class="font-mono font-bold text-red-600 text-sm">${referenceNumber}</div>
                                    <button onclick="navigator.clipboard.writeText('${referenceNumber}')" 
                                            class="text-xs text-red-600 hover:text-red-800 mt-1">
                                        <i class="fas fa-copy mr-1"></i>Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Instructions Section -->
                    <div class="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-yellow-600 mr-3 mt-1 text-lg"></i>
                            <div>
                                <div class="font-bold text-yellow-800 text-sm mb-2">Transfer Instructions</div>
                                <ul class="text-xs text-yellow-700 space-y-1">
                                    <li>• Include reference number in transfer description</li>
                                    <li>• Send exact amount: <strong>${convertedAmount} ${currencyCode}</strong></li>
                                    <li>• Take screenshot of completed transaction</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', bankDetails);
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', '📸 Once you complete the bank transfer, please upload your deposit receipt below to expedite processing:');
        }, 2000);
        
        setTimeout(() => {
            this.showUploadReceiptInterface();
        }, 2500);
    }

    // Show upload receipt interface
    showUploadReceiptInterface() {
        const uploadSectionHtml = `
            <div id="receipt-upload-section" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto mt-4">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-upload text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Upload Deposit Receipt</h3>
                    <p class="text-center text-blue-100 text-sm">Required to complete your deposit</p>
                </div>

                <!-- Upload Area -->
                <div class="p-6">
                    <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                        <div id="upload-content">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600 font-medium mb-2">Drag & drop your receipt here</p>
                            <p class="text-sm text-gray-500 mb-4">or click to browse files</p>
                            <button type="button" id="choose-file-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Choose File
                            </button>
                            <input type="file" id="receipt-file-input" accept="image/*,.pdf" class="hidden">
                        </div>
                        
                        <!-- Preview Area (hidden initially) -->
                        <div id="file-preview" class="hidden">
                            <div class="flex items-center justify-center mb-4">
                                <div id="preview-icon" class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-file-image text-2xl text-green-600"></i>
                                </div>
                            </div>
                            <p id="file-name" class="font-medium text-gray-800 mb-2"></p>
                            <p id="file-size" class="text-sm text-gray-600 mb-4"></p>
                            <div class="flex space-x-3 justify-center">
                                <button id="change-file-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Change File
                                </button>
                                <button id="remove-file-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-6">
                        <button id="submit-receipt-btn" disabled class="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 cursor-not-allowed">
                            <i class="fas fa-lock mr-2"></i>
                            Upload Receipt to Submit
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', uploadSectionHtml);
        
        // Setup event listeners after the HTML is added to DOM
        setTimeout(() => {
            this.setupUploadEventListeners();
        }, 500);
    }

    // Setup upload event listeners
    setupUploadEventListeners() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('receipt-file-input');
        const submitBtn = document.getElementById('submit-receipt-btn');
        const uploadContent = document.getElementById('upload-content');
        const filePreview = document.getElementById('file-preview');
        const changeFileBtn = document.getElementById('change-file-btn');
        const removeFileBtn = document.getElementById('remove-file-btn');
        const chooseFileBtn = document.getElementById('choose-file-btn');
        
        if (!uploadArea || !fileInput || !submitBtn || !chooseFileBtn) {
            setTimeout(() => this.setupUploadEventListeners(), 200);
            return;
        }

        let uploadedFile = null;
        const self = this;

        // Choose file button click
        chooseFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            fileInput.click();
        });

        // Upload area click
        uploadArea.addEventListener('click', (e) => {
            if (uploadContent && uploadContent.style.display !== 'none' && !e.target.closest('#choose-file-btn')) {
                fileInput.click();
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Change/Remove file buttons
        changeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        removeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile();
        });

        // Submit button
        submitBtn.addEventListener('click', () => {
            if (uploadedFile) {
                self.submitReceiptAndProcess(uploadedFile);
            }
        });

        function handleFile(file) {
            // Validate file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please upload JPG, PNG, or PDF files only.');
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size too large. Please upload files smaller than 10MB.');
                return;
            }

            uploadedFile = file;
            showFilePreview(file);
            enableSubmitButton();
        }

        function showFilePreview(file) {
            const fileName = document.getElementById('file-name');
            const fileSize = document.getElementById('file-size');
            const previewIcon = document.getElementById('preview-icon');

            if (!fileName || !fileSize || !previewIcon) return;

            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);

            if (file.type.startsWith('image/')) {
                previewIcon.innerHTML = '<i class="fas fa-file-image text-2xl text-green-600"></i>';
            } else if (file.type === 'application/pdf') {
                previewIcon.innerHTML = '<i class="fas fa-file-pdf text-2xl text-red-600"></i>';
            }

            uploadContent.style.display = 'none';
            filePreview.classList.remove('hidden');
            uploadArea.classList.remove('border-dashed', 'border-gray-300');
            uploadArea.classList.add('border-solid', 'border-green-300', 'bg-green-50');
        }

        function removeFile() {
            uploadedFile = null;
            filePreview.classList.add('hidden');
            uploadContent.style.display = 'block';
            uploadArea.classList.remove('border-solid', 'border-green-300', 'bg-green-50');
            uploadArea.classList.add('border-dashed', 'border-gray-300');
            fileInput.value = '';
            disableSubmitButton();
        }

        function enableSubmitButton() {
            submitBtn.disabled = false;
            submitBtn.className = 'w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg';
            submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Submit Receipt & Complete Deposit';
        }

        function disableSubmitButton() {
            submitBtn.disabled = true;
            submitBtn.className = 'w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 cursor-not-allowed';
            submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>Upload Receipt to Submit';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    // Submit receipt and process with verification loading
    submitReceiptAndProcess(file) {
        // Show user message
        this.addChatMessage('user', `✅ Receipt uploaded: ${file.name}`);
        
        // Show processing message
        setTimeout(() => {
            this.addChatMessage('agent', '🔄 Perfect! I\'ve received your deposit receipt. Let me verify this with our deposit system...');

        }, 1000);

        // Show verification loading
        setTimeout(() => {
            this.showVerificationLoading();
        }, 2000);

        // After 4 seconds of verification, show success
        setTimeout(() => {
            this.hideVerificationLoading();
            this.processSuccessfulDeposit();
        }, 6000); // 2 seconds delay + 4 seconds verification = 6 seconds total
    }

    // Show verification loading animation
    showVerificationLoading() {
        const loadingHtml = `
            <div id="verification-loading" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-shield-check text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Verifying Deposit</h3>
                    <p class="text-center text-blue-100 text-sm">Please wait while we process your deposit</p>
                </div>
                
                <div class="px-6 py-8 text-center">
                    <div class="relative mb-6">
                        <div class="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                        </div>
                        <div class="text-lg font-semibold text-gray-800 mb-2">Verification in Progress</div>
                        <div class="text-sm text-gray-600">Checking deposit details with bank...</div>
                    </div>
                    
                    <div class="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Receipt uploaded successfully</span>
                        </div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            <span>Verifying deposit details...</span>
                        </div>
                        <div class="flex items-center text-gray-400">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Processing account upgrade...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', loadingHtml);
    }

    // Hide verification loading
    hideVerificationLoading() {
        const loadingElement = document.getElementById('verification-loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            loadingElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                loadingElement.remove();
            }, 300);
        }
    }

    // Process successful deposit and auto-unlock level
    processSuccessfulDeposit() {
        const { level, amountNeeded } = this.tempDepositData;
        
        // Show success message
        this.addChatMessage('agent', '🎉 **DEPOSIT VERIFIED!** Your deposit has been successfully processed and credited to your account.');
        
        setTimeout(() => {
            this.addChatMessage('agent', `💰 **${this.formatAccounting(amountNeeded)} has been added to your account balance!**`);
        }, 1500);

        setTimeout(() => {
            this.addChatMessage('agent', `🚀 **Congratulations!** Your account has been automatically upgraded to **Level ${level}**. You can now start completing tasks and earning commissions!`);
        }, 3000);        setTimeout(() => {
            // Update user data - add money to balance and unlock level
            this.userData.balance += amountNeeded;
            this.userData.levelProgress[level].deposited = this.levels[level].minDeposit;
            this.userData.currentLevel = level;
            this.saveUserData();
            this.updateDisplay();
            
            // Force a complete page refresh of level cards
            setTimeout(() => {
                this.updateLevelCards();
                // Also trigger any level card click handlers to refresh
                this.refreshAllLevelCards();
            }, 100);
            
            // Show success notification
            this.showDepositSuccessNotification(level, amountNeeded);
            
            // Clear temp data
            this.tempDepositData = null;
            this.selectedCurrency = null;
            
            this.addChatMessage('agent', '✨ Your dashboard has been updated! You can now close this chat and start earning. Welcome to your new level!');
        }, 4500);
    }

    // Show success notification
    showDepositSuccessNotification(level, amount) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-3 text-xl"></i>
                <div>
                    <div class="font-bold">Deposit Successful!</div>
                    <div class="text-sm opacity-90">Level ${level} unlocked • ${this.formatAccounting(amount)} credited</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Force refresh all level cards by re-triggering their display logic
    refreshAllLevelCards() {
        // Simulate clicking on dashboard or triggering level card refresh
        const event = new Event('levelCardsUpdate');
        document.dispatchEvent(event);
        
        // Also manually update any level card states
        setTimeout(() => {
            console.log('Refreshing level cards after deposit...');
            this.updateLevelCards();
            
            // Update any additional UI elements that might show level status
            const currentLevelElements = document.querySelectorAll('[data-current-level]');
            currentLevelElements.forEach(el => {
                el.textContent = `Level ${this.userData.currentLevel}`;
            });
            
            // Update level card click handlers with fresh data
            this.updateLevelCardClickHandlers();
        }, 200);
    }

    // Update level card click handlers with current user data
    updateLevelCardClickHandlers() {
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach(card => {
            const level = parseInt(card.dataset.level);
            if (!level || !this.levels[level]) return;
            
            // Remove old event listeners by cloning the node
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Add new click handler with fresh user data
            newCard.addEventListener('click', () => {
                const config = this.levels[level];
                const levelProgress = this.userData.levelProgress[level];
                const hasRequiredDeposit = levelProgress.deposited >= config.minDeposit;
                const isLocked = !hasRequiredDeposit;
                
                this.showProfessionalDepositModal(level, config, levelProgress, isLocked);
            });
        });
    }

    // Update status badge on level card
    updateStatusBadge(card, text, type) {
        // Remove existing badge if any
        const existingBadge = card.querySelector('.level-status-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Create new badge
        const badge = document.createElement('div');
        badge.className = `level-status-badge ${type}`;
        badge.textContent = text;
        
        // Make sure card has relative positioning
        if (!card.style.position) {
            card.style.position = 'relative';
        }
        
        // Add badge to card
        card.appendChild(badge);
    }

    // Show USDT deposit confirmation with amount
    showUSDTDepositConfirmation(level, usdAmount) {
        const usdtAmount = usdAmount; // 1:1 conversion for USDT
        const config = this.levels[level];
        
        const confirmationHtml = `
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-200 overflow-hidden max-w-md mx-auto">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-coins text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">USDT Deposit Confirmation</h3>
                    <p class="text-center text-green-100 text-sm">TRC-20 Network Only</p>
                </div>

                <!-- Amount Section -->
                <div class="px-6 py-5">
                    <div class="text-center mb-4">
                        <div class="text-sm text-gray-600 mb-1">You are unlocking:</div>
                        <div class="text-xl font-bold text-gray-800 mb-2">${config.name} (Level ${level})</div>
                        <div class="text-3xl font-bold text-green-600 mb-1">${usdtAmount.toFixed(2)} USDT</div>
                        <div class="text-sm text-gray-500">≈ ${this.formatAccounting(usdAmount)}</div>
                    </div>

                    <!-- Deposit Details -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Network:</span>
                            <span class="font-medium text-gray-800">TRC-20 (TRON)</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Currency:</span>
                            <span class="font-medium text-gray-800">USDT</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Processing:</span>
                            <span class="font-medium text-green-600">Instant</span>
                        </div>
                    </div>

                    <!-- Warning Box -->
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-600 mr-2 mt-0.5"></i>
                            <div class="text-sm text-red-700">
                                <div class="font-medium mb-1">Important:</div>
                                <ul class="text-xs space-y-1">
                                    <li>• Only send USDT via TRC-20 network</li>
                                    <li>• Do not use other networks (ERC-20, BEP-20, etc.)</li>
                                    <li>• Wrong network = permanent loss of funds</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <button onclick="window.dashboard.confirmUSDTDeposit(${level}, ${usdtAmount})" 
                                class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                            <i class="fas fa-check-circle mr-2"></i>
                            Confirm USDT Deposit
                        </button>
                        <button onclick="window.dashboard.showDepositMethods()" 
                                class="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>
                            Back to Deposit Methods
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', confirmationHtml);
    }

    // Handle USDT deposit confirmation
    confirmUSDTDeposit(level, usdtAmount) {
        this.addChatMessage('user', '✅ Confirmed - Proceed with USDT deposit');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Perfect! I\'ll now provide you with the USDT deposit details. Please follow the instructions carefully:');
        }, 800);
        
        setTimeout(() => {
            this.showUSDTDepositDetails(level, usdtAmount);
        }, 1500);
    }

    // Show USDT deposit details with upload interface
    showUSDTDepositDetails(level, usdtAmount) {
        const referenceNumber = `USDT${level}-${Date.now()}`;
        
        const usdtDetailsHtml = `
            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-wallet text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">USDT Deposit Details</h3>
                    <p class="text-center text-green-100 text-sm">TRC-20 Network Only</p>
                </div>

                <!-- Amount Section -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-700 mb-1">${usdtAmount.toFixed(2)} USDT</div>
                        <div class="text-sm text-gray-600">≈ ${this.formatAccounting(usdtAmount)}</div>
                        <div class="text-xs text-green-600 font-medium mt-1">TRC-20 Network Only</div>
                    </div>
                </div>

                <!-- Deposit Address Section -->
                <div class="px-6 py-5 space-y-4">
                    <div class="space-y-3">
                        <div class="text-center">
                            <div class="text-sm text-gray-600 mb-2">Deposit Address (TRC-20)</div>
                            <div class="bg-gray-100 border border-gray-300 rounded-lg p-3">
                                <div class="font-mono text-sm break-all text-gray-800 mb-2" id="usdt-address">
                                    TKzXCNZnkHmCwV8EYzEyPUhzJdZQjfJ5gP
                                </div>
                                <button onclick="navigator.clipboard.writeText('TKzXCNZnkHmCwV8EYzEyPUhzJdZQjfJ5gP')" 
                                        class="w-full text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
                                    <i class="fas fa-copy mr-1"></i>Copy Address
                                </button>
                            </div>
                        </div>

                        <div class="text-center">
                            <div class="text-sm text-gray-600 mb-2">Reference Number</div>
                            <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                                <div class="font-mono font-bold text-yellow-800 text-sm mb-2">${referenceNumber}</div>
                                <button onclick="navigator.clipboard.writeText('${referenceNumber}')" 
                                        class="w-full text-xs bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700 transition-colors">
                                    <i class="fas fa-copy mr-1"></i>Copy Reference
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Instructions -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-start">
                            <i class="fas fa-info-circle text-blue-600 mr-3 mt-1"></i>
                            <div class="text-sm">
                                <div class="font-bold text-blue-800 mb-2">Transfer Instructions</div>
                                <ul class="text-blue-700 space-y-1 text-xs">
                                    <li>• Send exactly <strong>${usdtAmount.toFixed(2)} USDT</strong></li>
                                    <li>• Use only <strong>TRC-20 network</strong></li>
                                    <li>• Include reference in transaction memo (if possible)</li>
                                    <li>• Take screenshot after successful transfer</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Critical Warning -->
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-start">
                            <i class="fas fa-exclamation-triangle text-red-600 mr-3 mt-1"></i>
                            <div class="text-sm">
                                <div class="font-bold text-red-800 mb-2">⚠️ Critical Warning</div>
                                <ul class="text-red-700 space-y-1 text-xs">
                                    <li>• <strong>ONLY TRC-20 network accepted</strong></li>
                                    <li>• ERC-20, BEP-20, or other networks will result in <strong>permanent loss</strong></li>
                                    <li>• Double-check network before sending</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', usdtDetailsHtml);
        
        setTimeout(() => {
            this.addChatMessage('agent', '📸 Once you complete the USDT transfer, please upload your transaction screenshot below to expedite processing:');
        }, 2000);
        
        setTimeout(() => {
            this.showUSDTUploadInterface();
        }, 2500);
    }

    // Show USDT upload interface
    showUSDTUploadInterface() {
        const uploadSectionHtml = `
            <div id="usdt-upload-section" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto mt-4">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-upload text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Upload Transaction Proof</h3>
                    <p class="text-center text-green-100 text-sm">Required to complete your USDT deposit</p>
                </div>

                <!-- Upload Area -->
                <div class="p-6">
                    <div id="usdt-upload-area" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer bg-gray-50 hover:bg-green-50">
                        <div id="usdt-upload-content">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600 font-medium mb-2">Drag & drop your transaction screenshot</p>
                            <p class="text-sm text-gray-500 mb-4">or click to browse files</p>
                            <button type="button" id="usdt-choose-file-btn" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Choose File
                            </button>
                            <input type="file" id="usdt-file-input" accept="image/*,.pdf" class="hidden">
                        </div>
                        
                        <!-- Preview Area (hidden initially) -->
                        <div id="usdt-file-preview" class="hidden">
                            <div class="flex items-center justify-center mb-4">
                                <div id="usdt-preview-icon" class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-file-image text-2xl text-green-600"></i>
                                </div>
                            </div>
                            <p id="usdt-file-name" class="font-medium text-gray-800 mb-2"></p>
                            <p id="usdt-file-size" class="text-sm text-gray-600 mb-4"></p>
                            <div class="flex space-x-3 justify-center">
                                <button id="usdt-change-file-btn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Change File
                                </button>
                                <button id="usdt-remove-file-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-6">
                        <button id="usdt-submit-btn" disabled class="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 cursor-not-allowed">
                            <i class="fas fa-lock mr-2"></i>
                            Upload Transaction Proof to Submit
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', uploadSectionHtml);
        
        // Setup event listeners after the HTML is added to DOM
        setTimeout(() => {
            this.setupUSDTUploadEventListeners();
        }, 500);
    }

    // Setup USDT upload event listeners
    setupUSDTUploadEventListeners() {
        const uploadArea = document.getElementById('usdt-upload-area');
        const fileInput = document.getElementById('usdt-file-input');
        const submitBtn = document.getElementById('usdt-submit-btn');
        const uploadContent = document.getElementById('usdt-upload-content');
        const filePreview = document.getElementById('usdt-file-preview');
        const changeFileBtn = document.getElementById('usdt-change-file-btn');
        const removeFileBtn = document.getElementById('usdt-remove-file-btn');
        const chooseFileBtn = document.getElementById('usdt-choose-file-btn');
        
        if (!uploadArea || !fileInput || !submitBtn || !chooseFileBtn) {
            setTimeout(() => this.setupUSDTUploadEventListeners(), 200);
            return;
        }

        let uploadedFile = null;
        const self = this;

        // Choose file button click
        chooseFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            fileInput.click();
        });

        // Upload area click
        uploadArea.addEventListener('click', (e) => {
            if (uploadContent && uploadContent.style.display !== 'none' && !e.target.closest('#usdt-choose-file-btn')) {
                fileInput.click();
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Change/Remove file buttons
        changeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        removeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile();
        });

        // Submit button
        submitBtn.addEventListener('click', () => {
            if (uploadedFile) {
                self.submitUSDTTransactionAndProcess(uploadedFile);
            }
        });

        function handleFile(file) {
            // Validate file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please upload JPG, PNG, or PDF files only.');
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size too large. Please upload files smaller than 10MB.');
                return;
            }

            uploadedFile = file;
            showFilePreview(file);
            enableSubmitButton();
        }

        function showFilePreview(file) {
            const fileName = document.getElementById('usdt-file-name');
            const fileSize = document.getElementById('usdt-file-size');
            const previewIcon = document.getElementById('usdt-preview-icon');

            if (!fileName || !fileSize || !previewIcon) return;

            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);

            if (file.type.startsWith('image/')) {
                previewIcon.innerHTML = '<i class="fas fa-file-image text-2xl text-green-600"></i>';
            } else if (file.type === 'application/pdf') {
                previewIcon.innerHTML = '<i class="fas fa-file-pdf text-2xl text-green-600"></i>';
            }

            uploadContent.style.display = 'none';
            filePreview.classList.remove('hidden');
            uploadArea.classList.remove('border-dashed', 'border-gray-300');
            uploadArea.classList.add('border-solid', 'border-green-300', 'bg-green-50');
        }

        function removeFile() {
            uploadedFile = null;
            filePreview.classList.add('hidden');
            uploadContent.style.display = 'block';
            uploadArea.classList.remove('border-solid', 'border-green-300', 'bg-green-50');
            uploadArea.classList.add('border-dashed', 'border-gray-300');
            fileInput.value = '';
            disableSubmitButton();
        }

        function enableSubmitButton() {
            submitBtn.disabled = false;
            submitBtn.className = 'w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg';
            submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Submit Transaction Proof & Complete Deposit';
        }

        function disableSubmitButton() {
            submitBtn.disabled = true;
            submitBtn.className = 'w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 cursor-not-allowed';
            submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>Upload Transaction Proof to Submit';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    // Submit USDT transaction and process with verification loading
    submitUSDTTransactionAndProcess(file) {
        // Show user message
        this.addChatMessage('user', `✅ Transaction proof uploaded: ${file.name}`);
        
        // Show processing message
        setTimeout(() => {
            this.addChatMessage('agent', '🔍 Perfect! I\'ve received your USDT transaction proof. Let me verify this with the blockchain...');
        }, 1000);

        // Show verification loading
        setTimeout(() => {
            this.showUSDTVerificationLoading();
        }, 2000);

        // After 4 seconds of verification, show success
        setTimeout(() => {
            this.hideUSDTVerificationLoading();
            this.processUSDTDepositSuccess();
        }, 6000); // 2 seconds delay + 4 seconds verification = 6 seconds total
    }

    // Show USDT verification loading animation
    showUSDTVerificationLoading() {
        const loadingHtml = `
            <div id="usdt-verification-loading" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-search text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Verifying USDT Transaction</h3>
                    <p class="text-center text-green-100 text-sm">Checking blockchain confirmation</p>
                </div>
                
                <div class="px-6 py-8 text-center">
                    <div class="relative mb-6">
                        <div class="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-spinner fa-spin text-3xl text-green-600"></i>
                        </div>
                        <div class="text-lg font-semibold text-gray-800 mb-2">Blockchain Verification</div>
                        <div class="text-sm text-gray-600">Confirming USDT transaction on TRC-20...</div>
                    </div>
                    
                    <div class="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Transaction proof received</span>
                        </div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            <span>Verifying on blockchain...</span>
                        </div>
                        <div class="flex items-center text-gray-400">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Processing account credit...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', loadingHtml);
    }

    // Hide USDT verification loading
    hideUSDTVerificationLoading() {
        const loadingElement = document.getElementById('usdt-verification-loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            loadingElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                loadingElement.remove();
            }, 300);
        }
    }

    // Process successful USDT deposit and auto-unlock level
    processUSDTDepositSuccess() {
        const { level, amountNeeded } = this.tempDepositData;
        
        // Show success message
        this.addChatMessage('agent', '🎉 **USDT TRANSACTION CONFIRMED!** Your deposit has been successfully verified on the blockchain and credited to your account.');
        
        setTimeout(() => {
            this.addChatMessage('agent', `💰 **${this.formatAccounting(amountNeeded)} has been instantly credited to your account balance!**`);
        }, 1500);

        setTimeout(() => {
            this.addChatMessage('agent', `🚀 **Congratulations!** Your account has been automatically upgraded to **Level ${level}**. You can now start completing tasks and earning commissions immediately!`);
        }, 3000);
        
        setTimeout(() => {
            // Update user data - add money to balance and unlock level
            this.userData.balance += amountNeeded;
            this.userData.levelProgress[level].deposited = this.levels[level].minDeposit;
            this.userData.currentLevel = level;
            this.saveUserData();
            this.updateDisplay();
            
            // Force a complete page refresh of level cards
            setTimeout(() => {
                this.updateLevelCards();
                // Also trigger any level card click handlers to refresh
                this.refreshAllLevelCards();
            }, 100);
            
            // Show success notification
            this.showDepositSuccessNotification(level, amountNeeded);
            
            // Clear temp data
            this.tempDepositData = null;
            this.selectedCurrency = null;            
            this.addChatMessage('agent', '✨ Your dashboard has been updated! You can now close this chat and start earning. Welcome to your new level!');
        }, 4500);
    }    // Show new language selection options (different from deposit flow)
    showNewLanguageOptions() {
        const languageOptions = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">🌍 Please choose your language / 请选择您的语言:</p>
                <div class="grid grid-cols-3 gap-2">
                    <button onclick="window.dashboard.selectChatLanguage('English', '🇺🇸', 'English')" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇺🇸</div>
                        <div class="text-xs font-medium text-gray-800">English</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Chinese', '🇨🇳', '中文')" 
                            class="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇨🇳</div>
                        <div class="text-xs font-medium text-gray-800">中文</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Indonesian', '🇮🇩', 'Bahasa')" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇮🇩</div>
                        <div class="text-xs font-medium text-gray-800">Bahasa</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Malay', '🇲🇾', 'Melayu')" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇲🇾</div>
                        <div class="text-xs font-medium text-gray-800">Melayu</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Korean', '🇰🇷', '한국어')" 
                            class="w-full bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇰🇷</div>
                        <div class="text-xs font-medium text-gray-800">한국어</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Japanese', '🇯🇵', '日本語')" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇯🇵</div>
                        <div class="text-xs font-medium text-gray-800">日本語</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Thai', '🇹🇭', 'ไทย')" 
                            class="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇹🇭</div>
                        <div class="text-xs font-medium text-gray-800">ไทย</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Hindi', '🇮🇳', 'हिंदी')" 
                            class="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇮🇳</div>
                        <div class="text-xs font-medium text-gray-800">हिंदी</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Arabic', '🇸🇦', 'العربية')" 
                            class="w-full bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇸🇦</div>
                        <div class="text-xs font-medium text-gray-800">العربية</div>
                    </button>
                    <button onclick="window.dashboard.selectChatLanguage('Vietnamese', '🇻🇳', 'Tiếng Việt')" 
                            class="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-2 text-center transition-colors">
                        <div class="text-lg mb-1">🇻🇳</div>
                        <div class="text-xs font-medium text-gray-800">Tiếng Việt</div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', languageOptions);
    }

    // Handle language selection for chat support
    selectChatLanguage(language, flag, nativeName) {
        // Store selected language
        this.selectedChatLanguage = language;
        
        // Add user message
        this.addChatMessage('user', `${flag} ${nativeName}`);
        
        setTimeout(() => {
            this.addChatMessage('agent', `Perfect! I'll assist you in ${nativeName}. How can I help you today?`);
        }, 800);
        
        setTimeout(() => {
            this.showSupportOptions();
        }, 1500);
    }

    // Show main support options
    showSupportOptions() {
        const supportOptionsHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">Please select the type of assistance you need:</p>
                <div class="space-y-2">
                    <button onclick="window.dashboard.selectSupportOption('activate')" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-user-check text-blue-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">1. How to Activate Account</div>
                                <div class="text-xs text-gray-600">Learn how to activate your agent account</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectSupportOption('settlement')" 
                            class="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-bolt text-red-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">2. Settlement Urgent Transfer</div>
                                <div class="text-xs text-gray-600">Urgent transfer and settlement assistance</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.handleSettlementQuestion('what-urgent')" 
                            class="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-question-circle text-orange-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">3. What is an urgent transfer?</div>
                                <div class="text-xs text-gray-600">Learn about urgent transfer requirements</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.handleSettlementQuestion('why-recharge')" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-credit-card text-yellow-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">4. Why do I need to add more recharge?</div>
                                <div class="text-xs text-gray-600">Understanding recharge requirements</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.handleSettlementQuestion('no-recharge')" 
                            class="w-full bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-ban text-pink-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">5. Can I continue tasks without recharging?</div>
                                <div class="text-xs text-gray-600">Task continuation without settlement</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.handleSettlementQuestion('blocked-tasks')" 
                            class="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-lock text-indigo-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">6. Why can't I continue tasks before depositing?</div>
                                <div class="text-xs text-gray-600">Understanding task restrictions</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.handleSettlementQuestion('incomplete-withdrawal')" 
                            class="w-full bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-wallet text-teal-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">7. Can I withdraw if I don't complete tasks?</div>
                                <div class="text-xs text-gray-600">Withdrawal requirements explained</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectSupportOption('tasks')" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-tasks text-green-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">8. Task Assistance</div>
                                <div class="text-xs text-gray-600">Help with completing tasks</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectSupportOption('withdrawal')" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-money-bill-wave text-purple-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">9. Withdrawal Support</div>
                                <div class="text-xs text-gray-600">Help with withdrawing your earnings</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectSupportOption('other')" 
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center">
                            <i class="fas fa-question-circle text-gray-600 mr-3"></i>
                            <div>
                                <div class="font-medium text-gray-800">10. Other Questions</div>
                                <div class="text-xs text-gray-600">General inquiries and support</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', supportOptionsHtml);
    }

    // Handle support option selection
    selectSupportOption(option) {
        let optionText = '';
        
        switch(option) {
            case 'activate':
                optionText = '1. How to Activate Account';
                break;
            case 'settlement':
                optionText = '2. Settlement Urgent Transfer';
                break;
            case 'tasks':
                optionText = '3. Task Assistance';
                break;
            case 'withdrawal':
                optionText = '4. Withdrawal Support';
                break;
            case 'other':
                optionText = '5. Other Questions';
                break;
        }
        
        // Add user message
        this.addChatMessage('user', optionText);
        
        setTimeout(() => {
            this.handleSupportRequest(option);
        }, 1000);
    }

    // Handle different support requests
    handleSupportRequest(option) {
        switch(option) {
            case 'activate':
                this.handleAccountActivation();
                break;
            case 'settlement':
                this.handleSettlementTransfer();
                break;
            case 'tasks':
                this.handleTaskAssistance();
                break;
            case 'withdrawal':
                this.handleWithdrawalSupport();
                break;
            case 'other':
                this.handleOtherQuestions();
                break;
        }
    }    // Handle account activation assistance
    handleAccountActivation() {
        this.addChatMessage('agent', 'I\'ll help you activate your agent account! 🚀');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Account activation means unlocking your agent level and starting to complete transfer tasks to earn commissions.');
        }, 1000);
        
        setTimeout(() => {
            const activationExplanation = `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-rocket text-white text-xl"></i>
                        </div>
                        <div class="font-bold text-blue-800 text-lg mb-2">🎯 What is Account Activation?</div>
                    </div>
                    
                    <div class="space-y-3 text-sm text-gray-700">
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                            <span><strong>Unlock Member Level:</strong> Choose and activate your preferred member tier (Level 1 to Level 5)</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                            <span><strong>Start Transfer Tasks:</strong> Complete promotional tasks to earn guaranteed commissions</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                            <span><strong>Higher Level = Higher Earnings:</strong> More tasks and better commission rates</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i>
                            <span><strong>Instant Withdrawals:</strong> Cash out your earnings anytime</span>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 border border-green-200 rounded p-3">
                        <div class="text-center">
                            <div class="text-green-800 font-medium mb-1">😊 Benefits after activation:</div>
                            <div class="text-xs text-green-700 space-y-1">
                                <div>• Access to transfer tasks with guaranteed commissions</div>
                                <div>• Higher level = Higher commission rates</div>
                                <div>• Instant withdrawals available</div>
                                <div>• 24/7 customer support</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', activationExplanation);
        }, 1800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Ready to start earning? Click below to activate your account now:');
        }, 2500);
        
        setTimeout(() => {
            this.showActivateAccountButton();
        }, 3000);
    }

    // Show activate account button
    showActivateAccountButton() {
        const activateButtonHtml = `
            <div class="text-center space-y-3">
                <button onclick="window.dashboard.activateAccountNow()" 
                        class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <i class="fas fa-rocket mr-3"></i>
                    Activate Account Now
                </button>
                <button onclick="window.dashboard.returnToMainMenu()" 
                        class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to main menu
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', activateButtonHtml);
    }

    // Handle activate account now button click
    activateAccountNow() {
        this.addChatMessage('user', '🚀 Activate Account Now');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Excellent! Now please select which agent level you want to activate:');
        }, 800);
        
        setTimeout(() => {
            this.showLevelSelection();
        }, 1500);
    }

    // Show level selection for activation
    showLevelSelection() {
        const levelSelectionHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium text-center">Choose your agent level:</p>
                <div class="space-y-2">
                    <button onclick="window.dashboard.selectLevelForActivation(1)" 
                            class="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-medal text-white text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-800">Level 1 Member</div>
                                    <div class="text-xs text-gray-600">65 daily tasks • 0.6% commission</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-amber-700">$200</div>
                                <div class="text-xs text-gray-500">deposit</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectLevelForActivation(2)" 
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-award text-white text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-800">Level 2 Member</div>
                                    <div class="text-xs text-gray-600">85 daily tasks • 1% commission</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-gray-700">$1,800</div>
                                <div class="text-xs text-gray-500">deposit</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectLevelForActivation(3)" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-trophy text-white text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-800">Level 3 Member</div>
                                    <div class="text-xs text-gray-600">100 daily tasks • 3% commission</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-yellow-700">$3,500</div>
                                <div class="text-xs text-gray-500">deposit</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectLevelForActivation(4)" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-crown text-white text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-800">Level 4 Member</div>
                                    <div class="text-xs text-gray-600">140 daily tasks • 5% commission</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-purple-700">$4,500</div>
                                <div class="text-xs text-gray-500">deposit</div>
                            </div>
                        </div>
                    </button>
                    <button onclick="window.dashboard.selectLevelForActivation(5)" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                    <i class="fas fa-gem text-white text-sm"></i>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-800">Level 5 Member</div>
                                    <div class="text-xs text-gray-600">160 daily tasks • 8% commission</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-blue-700">$8,000</div>
                                <div class="text-xs text-gray-500">deposit</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', levelSelectionHtml);
    }

    // Handle level selection for activation
    selectLevelForActivation(level) {
        const config = this.levels[level];
        const levelProgress = this.userData.levelProgress[level];
        const amountNeeded = config.minDeposit - (levelProgress.deposited || 0);
        
        // Add user message
        this.addChatMessage('user', `Level ${level} - ${config.name} ($${config.minDeposit})`);
        
        setTimeout(() => {
            this.addChatMessage('agent', `Perfect choice! You've selected ${config.name} with ${this.formatAccounting(config.minDeposit)} deposit requirement.`);
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', `This level allows you to complete ${config.dailyTasks} tasks daily with ${config.commissionRate}% commission rate. Ready to proceed with the deposit?`);
        }, 1500);
        
        setTimeout(() => {
            this.showDepositConfirmationForActivation(level, amountNeeded, config);
        }, 2200);
    }

    // Show deposit confirmation specifically for activation
    showDepositConfirmationForActivation(level, amountNeeded, config) {
        const confirmationHtml = `
            <div class="space-y-3">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div class="font-bold text-green-800 mb-2">Ready to Activate?</div>
                    <div class="text-sm text-green-700">
                        <div>Level: ${config.name}</div>
                        <div>Required Deposit: ${this.formatAccounting(amountNeeded)}</div>
                        <div>Daily Tasks: ${config.dailyTasks}</div>
                        <div>Commission Rate: ${config.commissionRate}%</div>
                    </div>
                </div>
                
                <button onclick="window.dashboard.confirmDepositForActivation(${level})" 
                        class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-check-circle mr-2"></i>
                    Yes, Proceed with Deposit
                </button>
                <button onclick="window.dashboard.showLevelSelection()" 
                        class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Choose Different Level
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', confirmationHtml);
    }

    // Confirm deposit and connect to unlock level system
    confirmDepositForActivation(level) {
        const config = this.levels[level];
        const levelProgress = this.userData.levelProgress[level];
        const amountNeeded = config.minDeposit - (levelProgress.deposited || 0);
        
        // Add user confirmation message
        this.addChatMessage('user', '✅ Yes, Proceed with Deposit');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Excellent! I\'m now connecting you to our secure deposit system. You\'ll receive detailed deposit instructions for your selected level.');
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Please provide your email address to proceed:');
        }, 1500);          setTimeout(() => {
            // Store the level data for the unlock process (both formats for compatibility)
            this.currentChatLevel = level;
            this.currentChatAmount = amountNeeded;
            this.currentChatConfig = config;
            
            // Also set tempDepositData for the deposit flow
            this.tempDepositData = {
                level: level,
                amountNeeded: amountNeeded,
                config: config
            };
            
            // Set flag to indicate we're in activation mode
            this.isActivationFlow = true;
            
            // Connect to the existing unlock level system by showing email input
            this.showEmailInput();
        }, 2200);
    }

    // Show activation options
    showActivationOptions() {
        const activationOptionsHtml = `
            <div class="space-y-2">
                <button onclick="window.dashboard.startDepositProcess()" 
                        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-credit-card mr-2"></i>
                    Yes, help me deposit now
                </button>
                <button onclick="window.dashboard.showLevelInformation()" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-info-circle mr-2"></i>
                    Show me level information first
                </button>
                <button onclick="window.dashboard.returnToMainMenu()" 
                        class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to main menu
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', activationOptionsHtml);
    }    // Handle settlement transfer assistance
    handleSettlementTransfer() {
        this.addChatMessage('agent', '⚡ I understand you need urgent settlement transfer assistance for a high-value transaction.');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'I can help you with settlement transfers or answer common questions. What would you like to know?');
        }, 1000);
        
        setTimeout(() => {
            const settlementOptions = `
                <div class="space-y-3">
                    <div class="font-medium text-gray-800 mb-3">📋 Common Settlement Questions:</div>
                    
                    <button onclick="window.dashboard.handleSettlementQuestion('what-urgent')" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left transition-colors">
                        <div class="font-medium text-gray-800">❓ What is an urgent transfer?</div>
                    </button>
                    
                    <button onclick="window.dashboard.handleSettlementQuestion('why-recharge')" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-left transition-colors">
                        <div class="font-medium text-gray-800">💰 Why do I need to add more recharge?</div>
                    </button>
                    
                    <button onclick="window.dashboard.handleSettlementQuestion('no-recharge')" 
                            class="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-3 text-left transition-colors">
                        <div class="font-medium text-gray-800">🚫 Can I continue tasks without recharging for settlement?</div>
                    </button>
                    
                    <button onclick="window.dashboard.handleSettlementQuestion('blocked-tasks')" 
                            class="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-left transition-colors">
                        <div class="font-medium text-gray-800">🔒 Why can't I continue tasks before depositing?</div>
                    </button>
                    
                    <button onclick="window.dashboard.handleSettlementQuestion('incomplete-withdrawal')" 
                            class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-left transition-colors">
                        <div class="font-medium text-gray-800">❌ Can I withdraw if I don't complete all tasks?</div>
                    </button>
                    
                    <div class="border-t border-gray-200 mt-4 pt-3">
                        <button onclick="window.dashboard.showSettlementProofUpload()" 
                                class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-left transition-colors">
                            <div class="font-medium text-gray-800">📤 Submit settlement transfer proof</div>
                        </button>
                        
                        <button onclick="window.dashboard.returnToMainMenu()" 
                                class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-left transition-colors mt-2">
                            <div class="font-medium text-gray-800">🔙 Back to main menu</div>
                        </button>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', settlementOptions);
        }, 1500);
    }

    // Handle settlement question responses
    handleSettlementQuestion(questionType) {
        console.log('Settlement question called with:', questionType); // Debug log
        let userQuestion = '';
        let agentResponse = '';
        
        switch(questionType) {
            case 'what-urgent':
                userQuestion = 'What is an urgent transfer?';
                agentResponse = `🔥 An urgent transfer is a high-value transaction that requires immediate settlement. These transfers are flagged by our system when the transaction amount exceeds your current balance capacity. They require additional security verification and settlement funds to complete successfully.`;
                break;
                
            case 'why-recharge':
                userQuestion = 'Why do I need to add more recharge?';
                agentResponse = `💰 You need to add more recharge because urgent transfers require settlement funds to match the transaction value. This is a security measure to ensure all transfers can be completed successfully. The recharge acts as a temporary settlement guarantee and will be returned to you along with your commission once the transfer is completed.`;
                break;
                
            case 'no-recharge':
                userQuestion = 'Can I continue tasks without recharging for settlement?';
                agentResponse = `🚫 Unfortunately, you cannot continue with new tasks until the current urgent transfer is settled. This is because our system needs to complete the ongoing high-value transaction first. Once you settle the urgent transfer, you can immediately continue with regular tasks and earn commissions.`;
                break;
                
            case 'blocked-tasks':
                userQuestion = 'Why can\'t I continue tasks before depositing?';
                agentResponse = `🔒 Tasks are temporarily blocked because there's an urgent transfer pending settlement. Our system prioritizes the completion of high-value transactions for security reasons. Once you deposit the settlement amount, the urgent transfer will be processed, and all tasks will be unlocked immediately.`;
                break;
                
            case 'incomplete-withdrawal':
                userQuestion = 'Can I withdraw if I don\'t complete all tasks?';
                agentResponse = `❌ You cannot process withdrawals while there's an incomplete urgent transfer. This is for security and regulatory compliance. However, once you complete the urgent transfer settlement, you'll be able to withdraw your full balance plus earned commissions immediately - usually within 30 minutes to 1 hour.`;
                break;
        }
        
        // Add user question
        this.addChatMessage('user', userQuestion);
        
        // Add agent response after delay
        setTimeout(() => {
            this.addChatMessage('agent', agentResponse);
        }, 1000);
        
        // Show follow-up options
        setTimeout(() => {
            const followUpOptions = `
                <div class="space-y-2">
                    <button onclick="window.dashboard.handleSettlementTransfer()" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Ask another question</div>
                    </button>
                    <button onclick="window.dashboard.showSettlementProofUpload()" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Submit settlement proof</div>
                    </button>
                    <button onclick="window.dashboard.returnToMainMenu()" 
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Back to main menu</div>
                    </button>
                </div>
            `;
            this.addChatMessage('agent', followUpOptions);
        }, 2000);
    }

    // Show settlement proof upload interface
    showSettlementProofUpload() {
        const settlementUploadHtml = `
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                <div class="text-center">
                    <div class="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-file-upload text-white text-xl"></i>
                    </div>
                    <div class="font-bold text-orange-800 text-lg mb-2">Settlement Transfer Proof Required</div>
                    <div class="text-sm text-gray-600 mb-4">Please upload proof photo of your urgent transfer transaction</div>
                </div>
                
                <div id="settlement-upload-area" class="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                    <div class="space-y-3">
                        <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                            <i class="fas fa-camera text-orange-600 text-2xl"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">Upload Transaction Proof</div>
                            <div class="text-sm text-gray-600">Click to select or drag & drop your image</div>
                            <div class="text-xs text-gray-500 mt-1">Supported: JPG, PNG, PDF (Max 10MB)</div>
                        </div>
                    </div>
                </div>
                
                <input type="file" id="settlement-file-input" accept="image/*,.pdf" class="hidden">
                
                <div id="settlement-file-preview" class="hidden bg-white border border-gray-200 rounded-lg p-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <i class="fas fa-check text-green-600"></i>
                            </div>
                            <div>
                                <div id="settlement-file-name" class="font-medium text-gray-800 text-sm"></div>
                                <div id="settlement-file-size" class="text-xs text-gray-500"></div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button id="settlement-change-file" class="text-blue-600 hover:text-blue-700 text-sm">Change</button>
                            <button id="settlement-remove-file" class="text-red-600 hover:text-red-700 text-sm">Remove</button>
                        </div>
                    </div>
                </div>
                
                <button id="settlement-submit-proof" 
                        class="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
                        disabled>
                    <i class="fas fa-upload mr-2"></i>
                    Submit Transfer Proof
                </button>
            </div>
        `;        this.addChatMessage('agent', settlementUploadHtml);
        
        // Setup event listeners after the HTML is added with retry mechanism
        setTimeout(() => {
            this.setupSettlementUploadEventListeners();
        }, 500);
    }    // Setup settlement upload event listeners
    setupSettlementUploadEventListeners(retryCount = 0) {
        const self = this; // Store reference to this
        const uploadArea = document.getElementById('settlement-upload-area');
        const fileInput = document.getElementById('settlement-file-input');
        const filePreview = document.getElementById('settlement-file-preview');
        const fileName = document.getElementById('settlement-file-name');
        const fileSize = document.getElementById('settlement-file-size');
        const changeFileBtn = document.getElementById('settlement-change-file');
        const removeFileBtn = document.getElementById('settlement-remove-file');
        const submitBtn = document.getElementById('settlement-submit-proof');        if (!uploadArea || !fileInput || !submitBtn) {
            // Retry up to 5 times with increasing delay
            if (retryCount < 5) {
                setTimeout(() => {
                    this.setupSettlementUploadEventListeners(retryCount + 1);
                }, 300 * (retryCount + 1));
            } else {
                console.error('Failed to find settlement upload elements after 5 retries');
            }
            return;
        }

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-orange-400');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-orange-400');
        });        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-orange-400');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        // Upload area click
        uploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        });        // Change file button
        changeFileBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        // Remove file button
        removeFileBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            removeFile();
        });

        // Submit button
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const file = fileInput.files[0];
            if (file) {
                self.submitSettlementProof(file);
            }        });

        function handleFile(file) {
            // Validate file
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image (JPG, PNG) or PDF file.');
                return;
            }

            if (file.size > maxSize) {
                alert('File size must be less than 10MB.');
                return;
            }

            showFilePreview(file);
            enableSubmitButton();
        }        function showFilePreview(file) {
            if (fileName && fileSize) {
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                uploadArea.classList.add('hidden');
                filePreview.classList.remove('hidden');
            }
        }

        function removeFile() {
            fileInput.value = '';
            uploadArea.classList.remove('hidden');
            filePreview.classList.add('hidden');
            disableSubmitButton();        }

        function enableSubmitButton() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
            }
        }

        function disableSubmitButton() {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    // Submit settlement proof and process calculation
    submitSettlementProof(file) {
        // Show user message
        this.addChatMessage('user', `✅ Settlement proof uploaded: ${file.name}`);
        
        // Show processing message
        setTimeout(() => {
            this.addChatMessage('agent', '🔍 Analyzing your settlement transfer proof...');
        }, 1000);

        // Show verification loading
        setTimeout(() => {
            this.showSettlementVerificationLoading();
        }, 2000);

        // After verification, show calculation form
        setTimeout(() => {
            this.hideSettlementVerificationLoading();
            this.showSettlementCalculationForm();
        }, 5000);
    }

    // Show settlement verification loading
    showSettlementVerificationLoading() {
        const loadingHtml = `
            <div id="settlement-verification-loading" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-search text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Verifying Settlement Transfer</h3>
                    <p class="text-center text-orange-100 text-sm">Analyzing transaction details</p>
                </div>
                
                <div class="px-6 py-8 text-center">
                    <div class="relative mb-6">
                        <div class="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-spinner fa-spin text-3xl text-orange-600"></i>
                        </div>
                        <div class="text-lg font-semibold text-gray-800 mb-2">Transaction Analysis</div>
                        <div class="text-sm text-gray-600">Calculating recharge requirements...</div>
                    </div>
                    
                    <div class="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Settlement proof received</span>
                        </div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            <span>Analyzing transfer amount...</span>
                        </div>
                        <div class="flex items-center text-gray-400">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Calculating bonus rewards...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', loadingHtml);
    }

    // Hide settlement verification loading
    hideSettlementVerificationLoading() {
        const loadingElement = document.getElementById('settlement-verification-loading');
        if (loadingElement) {
            loadingElement.style.transition = 'opacity 0.3s ease-out';
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
            }, 300);
        }
    }

    // Show settlement calculation form
    showSettlementCalculationForm() {
        // Generate random urgent transfer amount (higher than balance)
        const currentBalance = this.userData.balance;
        const urgentTransferAmount = Math.floor(Math.random() * 50000) + currentBalance + 5000; // Always higher than current balance
        const rechargeAmount = urgentTransferAmount - currentBalance;
        const bonusRewards = Math.floor(rechargeAmount * 0.10); // 10% bonus
        const totalCredit = rechargeAmount + bonusRewards;

        // Store for later processing
        this.settlementData = {
            urgentTransferAmount,
            currentBalance,
            rechargeAmount,
            bonusRewards,
            totalCredit
        };

        this.addChatMessage('agent', '✅ **SETTLEMENT TRANSFER ANALYSIS COMPLETE!**');
        
        setTimeout(() => {
            const calculationHtml = `
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-calculator text-white text-xl"></i>
                        </div>
                        <div class="font-bold text-blue-800 text-lg mb-2">💰 Settlement Calculation</div>
                    </div>
                    
                    <div class="bg-white rounded-lg p-4 space-y-3">
                        <div class="text-center text-sm text-gray-600 mb-3">Transaction Analysis Results:</div>
                        
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span class="text-gray-700">Urgent Transfer Amount:</span>
                                <span class="font-semibold text-red-600">${this.formatAccounting(urgentTransferAmount)}</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span class="text-gray-700">Current Account Balance:</span>
                                <span class="font-semibold text-gray-800">${this.formatAccounting(currentBalance)}</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span class="text-orange-700 font-medium">Required Recharge Amount:</span>
                                <span class="font-bold text-orange-600">${this.formatAccounting(rechargeAmount)}</span>
                            </div>
                            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span class="text-green-700 font-medium">Bonus Rewards (10%):</span>
                                <span class="font-bold text-green-600">+${this.formatAccounting(bonusRewards)}</span>
                            </div>
                            <div class="flex justify-between items-center bg-green-50 rounded p-2">
                                <span class="text-green-800 font-bold">Total Credit to Account:</span>
                                <span class="font-bold text-green-700 text-lg">${this.formatAccounting(totalCredit)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div class="text-center">
                            <div class="text-yellow-800 font-medium mb-1">🎁 Special Settlement Bonus:</div>
                            <div class="text-xs text-yellow-700">
                                You'll receive an additional 10% bonus (${this.formatAccounting(bonusRewards)}) on top of your recharge amount!
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', calculationHtml);
        }, 1000);

        setTimeout(() => {
            this.addChatMessage('agent', `To complete your settlement transfer, you need to recharge ${this.formatAccounting(rechargeAmount)} into your account. This will unlock the settlement and you'll receive a ${this.formatAccounting(bonusRewards)} bonus!`);
        }, 2000);

        setTimeout(() => {
            this.showSettlementDepositConfirmation();
        }, 3000);
    }

    // Show settlement deposit confirmation
    showSettlementDepositConfirmation() {
        const { rechargeAmount, bonusRewards, totalCredit } = this.settlementData;
        
        const confirmationHtml = `
            <div class="space-y-3">
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div class="font-bold text-orange-800 mb-2">Ready to Proceed with Settlement?</div>
                    <div class="text-sm text-orange-700 space-y-1">
                        <div>Recharge Amount: ${this.formatAccounting(rechargeAmount)}</div>
                        <div>Bonus Rewards: +${this.formatAccounting(bonusRewards)}</div>
                        <div class="font-bold">Total Credit: ${this.formatAccounting(totalCredit)}</div>
                    </div>
                </div>
                
                <button onclick="window.dashboard.confirmSettlementDeposit()" 
                        class="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-check-circle mr-2"></i>
                    Yes, Proceed with Recharge Deposit
                </button>
                <button onclick="window.dashboard.returnToMainMenu()" 
                        class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to main menu
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', confirmationHtml);
    }    // Confirm settlement deposit and connect to deposit system
    confirmSettlementDeposit() {
        const { rechargeAmount, bonusRewards, totalCredit } = this.settlementData;
        
        // Add user confirmation message
        this.addChatMessage('user', '✅ Yes, Proceed with Recharge Deposit');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Perfect! I\'m connecting you to our secure recharge system now...');
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'System ready! Proceeding to deposit interface...');
        }, 1500);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'You will now be directed to complete your deposit of $' + this.formatNumber(rechargeAmount) + ' to unlock settlement transfer.');
        }, 2200);
        
        setTimeout(() => {
            // Set flag to indicate we're in settlement mode
            this.isSettlementFlow = true;
            
            // Start the settlement deposit flow with currency selection
            this.showSettlementCurrencySelection();
        }, 2900);
    }

    // Show currency selection for settlement deposit
    showSettlementCurrencySelection() {
        this.addChatMessage('agent', 'Perfect! Let me confirm your deposit details:');
        
        setTimeout(() => {
            const currencySelectionHtml = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div class="text-center mb-3">
                        <div class="text-blue-800 font-bold">🌍 Select your deposit currency:</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <!-- Asia Pacific -->
                        <div class="text-xs font-semibold text-gray-600 col-span-2 mb-1">Asia Pacific</div>
                        <button onclick="window.dashboard.selectSettlementCurrency('HKD')" class="bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded p-2 text-sm font-medium transition-colors">
                            🇭🇰 HKD
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('SGD')" class="bg-pink-100 hover:bg-pink-200 border border-pink-300 rounded p-2 text-sm font-medium transition-colors">
                            🇸🇬 SGD
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('JPY')" class="bg-red-100 hover:bg-red-200 border border-red-300 rounded p-2 text-sm font-medium transition-colors">
                            🇯🇵 JPY
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('KRW')" class="bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded p-2 text-sm font-medium transition-colors">
                            🇰🇷 KRW
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('TWD')" class="bg-green-100 hover:bg-green-200 border border-green-300 rounded p-2 text-sm font-medium transition-colors">
                            🇹🇼 TWD
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('THB')" class="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded p-2 text-sm font-medium transition-colors">
                            🇹🇭 THB
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('MYR')" class="bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded p-2 text-sm font-medium transition-colors">
                            🇲🇾 MYR
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('IDR')" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded p-2 text-sm font-medium transition-colors">
                            🇮🇩 IDR
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('VND')" class="bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 rounded p-2 text-sm font-medium transition-colors">
                            🇻🇳 VND
                        </button>
                    </div>
                    
                    <!-- Middle East & Africa -->
                    <div class="text-xs font-semibold text-gray-600 mb-1">Middle East & Africa</div>
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <button onclick="window.dashboard.selectSettlementCurrency('AED')" class="bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded p-2 text-sm font-medium transition-colors">
                            🇦🇪 AED
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('SAR')" class="bg-green-100 hover:bg-green-200 border border-green-300 rounded p-2 text-sm font-medium transition-colors">
                            🇸🇦 SAR
                        </button>
                    </div>
                    
                    <!-- Europe -->
                    <div class="text-xs font-semibold text-gray-600 mb-1">Europe</div>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="window.dashboard.selectSettlementCurrency('EUR')" class="bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded p-2 text-sm font-medium transition-colors">
                            🇪🇺 EUR
                        </button>
                        <button onclick="window.dashboard.selectSettlementCurrency('GBP')" class="bg-red-100 hover:bg-red-200 border border-red-300 rounded p-2 text-sm font-medium transition-colors">
                            🇬🇧 GBP
                        </button>
                    </div>
                </div>
            `;
            
            this.addChatMessage('agent', currencySelectionHtml);
        }, 1000);
    }

    // Handle settlement currency selection
    selectSettlementCurrency(currency) {
        this.settlementData.selectedCurrency = currency;
        
        // Add user selection message
        this.addChatMessage('user', `Selected currency: ${currency}`);
        
        setTimeout(() => {
            this.addChatMessage('agent', `Perfect! Let me confirm your deposit details:`);
        }, 800);
        
        setTimeout(() => {
            this.showSettlementDepositDetails(currency);
        }, 1500);
    }

    // Show settlement deposit details with selected currency
    showSettlementDepositDetails(currency) {
        const { rechargeAmount, bonusRewards } = this.settlementData;
        
        // Convert amounts to selected currency (mock conversion rates)
        const conversionRates = {
            'HKD': 7.8, 'SGD': 1.35, 'JPY': 110, 'KRW': 1200,
            'TWD': 28, 'THB': 33, 'MYR': 4.2, 'IDR': 14500,
            'VND': 23000, 'AED': 3.67, 'SAR': 3.75, 'EUR': 0.85, 'GBP': 0.73
        };
        
        const rate = conversionRates[currency] || 1;
        const convertedRechargeAmount = Math.floor(rechargeAmount * rate);
        const convertedBonusRewards = Math.floor(bonusRewards * rate);
        const convertedTotalCredit = convertedRechargeAmount + convertedBonusRewards;
        
        // Store converted amounts
        this.settlementData.convertedAmounts = {
            rechargeAmount: convertedRechargeAmount,
            bonusRewards: convertedBonusRewards,
            totalCredit: convertedTotalCredit,
            currency: currency
        };
        
        const detailsHtml = `
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div class="text-center mb-4">
                    <div class="text-blue-800 font-bold text-lg">💳 Deposit Confirmation</div>
                    <div class="text-blue-600 text-sm">Settlement Recharge Details</div>
                </div>
                
                <div class="space-y-3 bg-white rounded-lg p-4 border border-blue-100">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-gray-600">Recharge Amount:</span>
                        <span class="font-bold text-gray-800">${convertedRechargeAmount.toLocaleString()} ${currency}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-gray-600">Bonus Rewards:</span>
                        <span class="font-bold text-green-600">+${convertedBonusRewards.toLocaleString()} ${currency}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-t-2 border-blue-200">
                        <span class="text-blue-800 font-bold">Total Credit:</span>
                        <span class="font-bold text-blue-800 text-lg">${convertedTotalCredit.toLocaleString()} ${currency}</span>
                    </div>
                </div>
                
                <div class="mt-4 space-y-2">
                    <button onclick="window.dashboard.confirmSettlementDepositDetails()" 
                            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-check-circle mr-2"></i>
                        Confirm Deposit Details
                    </button>
                    <button onclick="window.dashboard.showSettlementCurrencySelection()" 
                            class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Change Currency
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', detailsHtml);
    }

    // Confirm settlement deposit details and show bank details
    confirmSettlementDepositDetails() {
        const { convertedAmounts } = this.settlementData;
        
        // Add user confirmation message
        this.addChatMessage('user', `✅ Confirm deposit: ${convertedAmounts.rechargeAmount.toLocaleString()} ${convertedAmounts.currency}`);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Excellent! I\'m connecting you to our secure deposit system for your settlement recharge...');
        }, 800);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Generating your personalized bank transfer details...');
        }, 1500);
        
        setTimeout(() => {
            this.showSettlementBankDetails();
        }, 2500);
    }

    // Show bank details for settlement deposit
    showSettlementBankDetails() {
        const { convertedAmounts } = this.settlementData;
        
        // Generate random bank details
        const bankNames = ['Standard Chartered Bank', 'HSBC Bank', 'Citibank', 'DBS Bank', 'UOB Bank'];
        const accountNumbers = ['8234567891', '9876543210', '5432109876', '7890123456', '6543217890'];
        const accountNames = ['EPAY SETTLEMENT LTD', 'EPAY PROCESSING CO', 'EPAY FINANCIAL SERVICES', 'EPAY HOLDINGS PTE'];
        
        const randomBank = bankNames[Math.floor(Math.random() * bankNames.length)];
        const randomAccount = accountNumbers[Math.floor(Math.random() * accountNumbers.length)];
        const randomName = accountNames[Math.floor(Math.random() * accountNames.length)];
        
        // Store bank details for later reference
        this.settlementData.bankDetails = {
            bankName: randomBank,
            accountNumber: randomAccount,
            accountName: randomName
        };
        
        const bankDetailsHtml = `
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 max-w-md mx-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-university text-2xl text-green-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-green-800 mb-2">Settlement Deposit Details</h3>
                    <p class="text-green-700 text-sm">Complete your transfer to activate settlement</p>
                </div>
                
                <div class="bg-white rounded-lg border border-green-200 p-4 mb-4">
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-gray-600 font-medium">Bank Name:</span>
                            <span class="text-gray-800 font-bold">${randomBank}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-gray-600 font-medium">Account Number:</span>
                            <span class="text-gray-800 font-bold font-mono">${randomAccount}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-gray-600 font-medium">Account Name:</span>
                            <span class="text-gray-800 font-bold">${randomName}</span>
                        </div>
                        <div class="flex justify-between pt-2 border-t-2 border-green-200">
                            <span class="text-green-700 font-bold">Transfer Amount:</span>
                            <span class="text-green-800 font-bold text-lg">${convertedAmounts.rechargeAmount.toLocaleString()} ${convertedAmounts.currency}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
                        <div class="text-xs text-yellow-800">
                            <div class="font-medium mb-1">Important Instructions:</div>
                            <ul class="space-y-1">
                                <li>• Transfer exact amount: ${convertedAmounts.rechargeAmount.toLocaleString()} ${convertedAmounts.currency}</li>
                                <li>• Upload proof after transfer completion</li>
                                <li>• Processing time: 2-5 minutes after verification</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <button onclick="window.dashboard.proceedToSettlementUpload()" 
                        class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    <i class="fas fa-upload mr-2"></i>
                    I've Completed the Transfer - Upload Proof
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', bankDetailsHtml);
    }

    // Proceed to settlement upload
    proceedToSettlementUpload() {
        // Add user message
        this.addChatMessage('user', '✅ Transfer completed - Ready to upload proof');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Perfect! Please upload your transfer receipt for verification:');
        }, 800);
        
        setTimeout(() => {
            this.showSettlementUploadInterface();
        }, 1500);
    }    // Show settlement upload interface
    showSettlementUploadInterface() {
        const uploadHtml = `
            <div id="settlement-deposit-upload" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-upload text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Upload Transfer Proof</h3>
                    <p class="text-center text-blue-100 text-sm">Settlement deposit verification</p>
                </div>
                
                <div class="p-6">
                    <div onclick="document.getElementById('settlement-deposit-file-input').click()" id="settlement-deposit-upload-area" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <div class="space-y-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <i class="fas fa-cloud-upload-alt text-2xl text-blue-600"></i>
                            </div>
                            <div>
                                <p class="text-gray-600 font-medium">Click to upload or drag & drop</p>
                                <p class="text-gray-500 text-sm">Transfer receipt, screenshot, or photo</p>
                            </div>
                            <p class="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                        </div>
                    </div>
                    
                    <input type="file" id="settlement-deposit-file-input" class="hidden" accept=".png,.jpg,.jpeg,.pdf" onchange="window.dashboard.handleFileSelect(this)">
                    
                    <!-- Alternative visible file input -->
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Or select file directly:</label>
                        <input type="file" class="w-full p-2 border border-gray-300 rounded-lg" accept=".png,.jpg,.jpeg,.pdf" onchange="window.dashboard.handleFileSelect(this)">
                    </div>
                    
                    <div id="settlement-deposit-file-preview" class="hidden mt-4 p-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-file text-blue-600"></i>
                                </div>
                                <div>
                                    <p id="settlement-deposit-file-name" class="text-sm font-medium text-gray-800"></p>
                                    <p id="settlement-deposit-file-size" class="text-xs text-gray-500"></p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="window.dashboard.removeSelectedFile()" class="text-red-600 hover:text-red-700 text-xs">Remove</button>
                            </div>
                        </div>
                    </div>
                    
                    <button id="settlement-deposit-submit-proof" onclick="window.dashboard.submitSelectedFile()"
                            class="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                            disabled>
                        <i class="fas fa-check-circle mr-2"></i>
                        Submit Transfer Proof
                    </button>
                    
                    <!-- Test button for quick demo -->
                    <button onclick="window.dashboard.testSubmitFile()" 
                            class="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg">
                        <i class="fas fa-play mr-2"></i>
                        Test Submit (Demo File)
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', uploadHtml);
        
        // Setup upload listeners after DOM is updated
        setTimeout(() => {
            this.setupSettlementDepositUploadListeners();
        }, 500);
    }

    // Setup settlement deposit upload event listeners
    setupSettlementDepositUploadListeners() {
        const self = this;
        const uploadArea = document.getElementById('settlement-deposit-upload-area');
        const fileInput = document.getElementById('settlement-deposit-file-input');
        const filePreview = document.getElementById('settlement-deposit-file-preview');
        const fileName = document.getElementById('settlement-deposit-file-name');
        const fileSize = document.getElementById('settlement-deposit-file-size');
        const changeFileBtn = document.getElementById('settlement-deposit-change-file');
        const removeFileBtn = document.getElementById('settlement-deposit-remove-file');
        const submitBtn = document.getElementById('settlement-deposit-submit-proof');

        if (!uploadArea || !fileInput || !submitBtn) return;

        let selectedFile = null;

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-blue-400', 'bg-blue-50');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        // Upload area click
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Change file button
        changeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        // Remove file button
        removeFileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile();
        });

        // Submit button
        submitBtn.addEventListener('click', () => {
            if (selectedFile) {
                self.submitSettlementDepositProof(selectedFile);
            }
        });

        function handleFile(file) {
            selectedFile = file;
            showFilePreview(file);
            enableSubmitButton();
        }

        function showFilePreview(file) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            filePreview.classList.remove('hidden');
            uploadArea.style.display = 'none';
        }

        function removeFile() {
            selectedFile = null;
            filePreview.classList.add('hidden');
            uploadArea.style.display = 'block';
            fileInput.value = '';
            disableSubmitButton();
        }

        function enableSubmitButton() {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        function disableSubmitButton() {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    // Submit settlement deposit proof
    submitSettlementDepositProof(file) {
        // Show user message
        this.addChatMessage('user', `✅ Transfer proof uploaded: ${file.name}`);
        
        // Show processing message
        setTimeout(() => {
            this.addChatMessage('agent', 'Perfect! I\'m verifying your transfer proof now...');
        }, 1000);

        // Show verification loading
        setTimeout(() => {
            this.showSettlementDepositVerificationLoading();
        }, 2000);

        // After 4 seconds, show success
        setTimeout(() => {
            this.hideSettlementDepositVerificationLoading();
            this.showSettlementDepositSuccess();
        }, 6000);
    }

    // Show settlement deposit verification loading
    showSettlementDepositVerificationLoading() {
        const loadingHtml = `
            <div id="settlement-deposit-verification-loading" class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md mx-auto">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-search text-lg"></i>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-center mb-1">Verifying Transfer</h3>
                    <p class="text-center text-blue-100 text-sm">Processing settlement deposit</p>
                </div>
                
                <div class="px-6 py-8 text-center">
                    <div class="relative mb-6">
                        <div class="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                        </div>
                        <div class="text-lg font-semibold text-gray-800 mb-2">Processing Transfer</div>
                        <div class="text-sm text-gray-600">Crediting to your account...</div>
                    </div>
                    
                    <div class="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>Transfer proof verified</span>
                        </div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            <span>Processing settlement deposit...</span>
                        </div>
                        <div class="flex items-center text-gray-400">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Crediting bonus rewards...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', loadingHtml);
    }

    // Hide settlement deposit verification loading
    hideSettlementDepositVerificationLoading() {
        const loadingElement = document.getElementById('settlement-deposit-verification-loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            loadingElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                loadingElement.remove();
            }, 300);
        }
    }

    // Show settlement deposit success
    showSettlementDepositSuccess() {
        const { convertedAmounts } = this.settlementData;
        
        // Update user balance with the total credit (convert back to USD for balance)
        const currentBalance = this.userData.balance;
        const conversionRate = this.getUSDConversionRate(convertedAmounts.currency);
        const usdEquivalent = convertedAmounts.totalCredit / conversionRate;
        const newBalance = currentBalance + usdEquivalent;
        this.userData.balance = newBalance;
        
        // Update balance display
        this.updateBalanceDisplay();
        
        const successHtml = `
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 max-w-md mx-auto">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-4xl text-green-600"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-green-800 mb-2">🎉 Deposit Successful!</h3>
                    <p class="text-green-700">Settlement recharge completed</p>
                </div>
                
                <div class="bg-white rounded-lg border border-green-200 p-4 mb-4">
                    <div class="space-y-3 text-sm">
                        <div class="text-center text-green-800 font-bold mb-3">✅ Auto-Credited to Your Account</div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-gray-600">Recharge Amount:</span>
                            <span class="text-gray-800 font-bold">${convertedAmounts.rechargeAmount.toLocaleString()} ${convertedAmounts.currency}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-100 pb-2">
                            <span class="text-gray-600">Bonus Rewards:</span>
                            <span class="text-green-600 font-bold">+${convertedAmounts.bonusRewards.toLocaleString()} ${convertedAmounts.currency}</span>
                        </div>
                        <div class="flex justify-between pt-2 border-t-2 border-green-200">
                            <span class="text-green-800 font-bold">Total Credited:</span>
                            <span class="text-green-800 font-bold text-lg">${convertedAmounts.totalCredit.toLocaleString()} ${convertedAmounts.currency}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-blue-600 mt-1 mr-2"></i>
                        <div class="text-xs text-blue-800">
                            <div class="font-medium mb-1">Settlement Status Updated:</div>
                            <div>• Your account balance has been updated</div>
                            <div>• Settlement transfer is now available</div>
                            <div>• You can now proceed with urgent transfers</div>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <button onclick="window.dashboard.returnToMainMenu()" 
                            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-home mr-2"></i>
                        Return to Dashboard
                    </button>
                    <button onclick="window.dashboard.checkSettlementStatus()" 
                            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-chart-line mr-2"></i>
                        Check Settlement Status
                    </button>
                </div>
            </div>
        `;
        
        this.addChatMessage('agent', successHtml);
        
        // Reset settlement flow flag
        this.isSettlementFlow = false;
        
        // Clear settlement data
        this.settlementData = null;
    }

    // Helper function to get USD conversion rate
    getUSDConversionRate(currency) {
        const conversionRates = {
            'HKD': 7.8, 'SGD': 1.35, 'JPY': 110, 'KRW': 1200,
            'TWD': 28, 'THB': 33, 'MYR': 4.2, 'IDR': 14500,
            'VND': 23000, 'AED': 3.67, 'SAR': 3.75, 'EUR': 0.85, 'GBP': 0.73
        };
        return conversionRates[currency] || 1;
    }

    // Check settlement status (placeholder function)
    checkSettlementStatus() {
        this.addChatMessage('user', 'Check settlement status');
        
        setTimeout(() => {
            this.addChatMessage('agent', '✅ **Settlement Status:** Active and ready for urgent transfers!\n\n💰 **Available Balance:** $' + this.formatNumber(this.userData.balance) + '\n🎯 **Settlement Capacity:** Unlimited\n⚡ **Transfer Speed:** Instant processing');
        }, 1000);
        
        setTimeout(() => {
            this.returnToMainMenu();
        }, 2000);
    }

    // Handle task assistance
    handleTaskAssistance() {
        this.addChatMessage('agent', 'I\'m here to help you with task-related questions! What do you need assistance with?');
        
        setTimeout(() => {
            const taskHelpOptions = `
                <div class="space-y-2">
                    <button onclick="window.dashboard.explainTasks()" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">How do tasks work?</div>
                    </button>
                    <button onclick="window.dashboard.taskTroubleshoot()" 
                            class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Task not loading/working</div>
                    </button>
                    <button onclick="window.dashboard.taskEarnings()" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Commission calculation</div>
                    </button>
                    <button onclick="window.dashboard.returnToMainMenu()" 
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Back to main menu</div>
                    </button>
                </div>
            `;
            this.addChatMessage('agent', taskHelpOptions);
        }, 1000);
    }

    // Handle withdrawal support
    handleWithdrawalSupport() {
        this.addChatMessage('agent', 'I\'ll help you with withdrawal questions. What do you need to know?');
        
        setTimeout(() => {
            const withdrawalInfo = `
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <div class="font-bold text-purple-800 mb-2">💰 Withdrawal Information:</div>
                    <div class="space-y-2 text-sm text-gray-700">
                        <div>• Minimum withdrawal: $50</div>
                        <div>• Processing time: 30 minutes to 1 hour</div>
                        <div>• Available methods: Bank transfer, USDT</div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', withdrawalInfo);
        }, 1000);
        
        setTimeout(() => {
            const withdrawalOptions = `
                <div class="space-y-2">
                    <button onclick="window.dashboard.returnToMainMenu()" 
                            class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>
                        Back to main menu
                    </button>
                </div>
            `;
            this.addChatMessage('agent', withdrawalOptions);
        }, 1800);
    }

    // Handle other questions
    handleOtherQuestions() {
        this.addChatMessage('agent', 'I\'m here to help with any other questions you might have. Please feel free to ask me anything about ePay!');
        
        setTimeout(() => {
            const otherOptions = `
                <div class="space-y-2">
                    <button onclick="window.dashboard.showFAQ()" 
                            class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Frequently Asked Questions</div>
                    </button>
                    <button onclick="window.dashboard.contactHuman()" 
                            class="w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Speak to human agent</div>
                    </button>
                    <button onclick="window.dashboard.reportIssue()" 
                            class="w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Report an issue</div>
                    </button>
                    <button onclick="window.dashboard.returnToMainMenu()" 
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors">
                        <div class="font-medium text-gray-800">Back to main menu</div>
                    </button>
                </div>
            `;
            this.addChatMessage('agent', otherOptions);
        }, 1000);
    }

    // Start deposit process from chat
    startDepositProcess() {
        this.addChatMessage('user', 'Yes, help me deposit now');
          setTimeout(() => {
            if (this.currentChatLevel && this.currentChatAmount && this.currentChatConfig) {
                this.addChatMessage('agent', `Perfect! I see you want to activate ${this.currentChatConfig.name} (Level ${this.currentChatLevel}). You need to deposit ${this.formatAccounting(this.currentChatAmount)}.`);
                
                // Set tempDepositData for consistency with the deposit flow
                this.tempDepositData = {
                    level: this.currentChatLevel,
                    amountNeeded: this.currentChatAmount,
                    config: this.currentChatConfig
                };
                
                setTimeout(() => {
                    this.addChatMessage('agent', 'Let me help you with the deposit process. Please provide your email address:');
                    this.showEmailInput();
                }, 1000);
            } else {
                this.addChatMessage('agent', 'Let me help you choose the right level first. Which level would you like to activate?');
                this.showLevelSelection();
            }
        }, 800);
    }

    // Show level information
    showLevelInformation() {
        this.addChatMessage('user', 'Show me level information first');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Here\'s detailed information about all agent levels:');
        }, 800);
        
        setTimeout(() => {
            const levelInfo = `
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div class="font-bold text-gray-800 mb-2">📊 Agent Level Details:</div>
                    <div class="space-y-2 text-xs">
                        <div class="bg-amber-100 p-2 rounded">
                            <div class="font-medium">Level 1 Member</div>
                            <div>Deposit: $200 | Tasks: 65/day | Commission: 0.6% | Earning: $7-12/day</div>
                        </div>
                        <div class="bg-gray-100 p-2 rounded">
                            <div class="font-medium">Level 2 Member</div>
                            <div>Deposit: $1,800 | Tasks: 85/day | Commission: 1% | Earning: $50-60/day</div>
                        </div>
                        <div class="bg-yellow-100 p-2 rounded">
                            <div class="font-medium">Level 3 Member</div>
                            <div>Deposit: $3,500 | Tasks: 100/day | Commission: 3% | Earning: $300-400/day</div>
                        </div>
                        <div class="bg-purple-100 p-2 rounded">
                            <div class="font-medium">Level 4 Member</div>
                            <div>Deposit: $4,500 | Tasks: 140/day | Commission: 5% | Earning: $400-500/day</div>
                        </div>
                        <div class="bg-blue-100 p-2 rounded">
                            <div class="font-medium">Level 5 Member</div>
                            <div>Deposit: $8,000 | Tasks: 160/day | Commission: 8% | Earning: $500-600/day</div>
                        </div>
                    </div>
                </div>
            `;
            this.addChatMessage('agent', levelInfo);
        }, 1200);
        
        setTimeout(() => {
            this.addChatMessage('agent', 'Which level interests you the most? I can help you get started with the deposit process.');
            this.showActivationOptions();
        }, 2000);
    }

    // Return to main support menu
    returnToMainMenu() {
        this.addChatMessage('user', 'Back to main menu');
        
        setTimeout(() => {
            this.addChatMessage('agent', 'No problem! Here are the support options again:');
            this.showSupportOptions();
        }, 800);
    }

    // Placeholder functions for additional features
    explainTasks() {
        this.addChatMessage('user', 'How do tasks work?');
        setTimeout(() => {
            this.addChatMessage('agent', 'Tasks are simple promotional activities that help merchants increase their visibility. You complete tasks like viewing products, leaving reviews, and sharing content. Each completed task earns you commission based on your agent level.');
        }, 1000);
    }

    taskTroubleshoot() {
        this.addChatMessage('user', 'Task not loading/working');
        setTimeout(() => {
            this.addChatMessage('agent', 'If tasks aren\'t loading, try refreshing the page or clearing your browser cache. If the problem persists, I can escalate this to our technical team immediately.');
        }, 1000);
    }

    taskEarnings() {
        this.addChatMessage('user', 'Commission calculation');
        setTimeout(() => {
            this.addChatMessage('agent', 'Your commission is calculated as: Task Value × Your Level Commission Rate. For example, if you\'re a Level 3 Member (1% commission) and complete a $100 task, you earn $1. Higher levels earn more per task!');
        }, 1000);
    }

    initiateWithdrawal() {
        this.addChatMessage('user', 'Start withdrawal process');
        setTimeout(() => {
            this.addChatMessage('agent', 'I\'ll redirect you to the withdrawal page where you can request your earnings. Your current balance is ' + this.formatAccounting(this.userData.balance));
            setTimeout(() => {
                window.location.href = 'history.html';
            }, 2000);
        }, 1000);
    }

    checkWithdrawalStatus() {
        this.addChatMessage('user', 'Check withdrawal status');
        setTimeout(() => {
            this.addChatMessage('agent', 'Let me check your recent withdrawal requests... You don\'t have any pending withdrawals at the moment. Would you like to make a new withdrawal request?');
        }, 1000);
    }

    showFAQ() {
        this.addChatMessage('user', 'Frequently Asked Questions');
        setTimeout(() => {
            this.addChatMessage('agent', 'Here are some commonly asked questions. Which topic interests you?');
        }, 1000);
    }

    contactHuman() {
        this.addChatMessage('user', 'Speak to human agent');
        setTimeout(() => {
            this.addChatMessage('agent', 'I\'m connecting you to a human agent. Please wait a moment... A specialist will be with you shortly to provide personalized assistance.');
        }, 1000);
    }

    reportIssue() {
        this.addChatMessage('user', 'Report an issue');
        setTimeout(() => {
            this.addChatMessage('agent', 'I\'m sorry to hear you\'re experiencing an issue. Please describe the problem and I\'ll make sure it gets resolved quickly.');
        }, 1000);
    }

    showLevelSelection() {
        const levelSelectionHtml = `
            <div class="space-y-2">
                <button onclick="window.dashboard.selectChatLevel(1)" class="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg p-2 text-left transition-colors">
                    <div class="font-medium text-gray-800">Level 1 Member</div>
                    <div class="text-xs text-gray-600">$200 deposit • 65 daily tasks • 0.6% commission</div>
                </button>
                <button onclick="window.dashboard.selectChatLevel(2)" class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors">
                    <div class="font-medium text-gray-800">Level 2 Member</div>
                    <div class="text-xs text-gray-600">$1,800 deposit • 85 daily tasks • 1% commission</div>
                </button>
                <button onclick="window.dashboard.selectChatLevel(3)" class="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-2 text-left transition-colors">
                    <div class="font-medium text-gray-800">Level 3 Member</div>
                    <div class="text-xs text-gray-600">$3,500 deposit • 100 daily tasks • 3% commission</div>
                </button>
                <button onclick="window.dashboard.selectChatLevel(4)" class="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 text-left transition-colors">
                    <div class="font-medium text-gray-800">Level 4 Member</div>
                    <div class="text-xs text-gray-600">$4,500 deposit • 140 daily tasks • 5% commission</div>
                </button>
                <button onclick="window.dashboard.selectChatLevel(5)" class="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-left transition-colors">
                    <div class="font-medium text-gray-800">Level 5 Member</div>
                    <div class="text-xs text-gray-600">$8,000 deposit • 160 daily tasks • 8% commission</div>
                </button>
            </div>
        `;
        
        this.addChatMessage('agent', levelSelectionHtml);
    }

    selectChatLevel(level) {
        const config = this.levels[level];
        const levelProgress = this.userData.levelProgress[level];
        const amountNeeded = config.minDeposit - (levelProgress.deposited || 0);
          // Store for later use
        this.currentChatLevel = level;
        this.currentChatAmount = amountNeeded;
        this.currentChatConfig = config;
        
        // Also set tempDepositData for the deposit flow
        this.tempDepositData = {
            level: level,
            amountNeeded: amountNeeded,
            config: config
        };
        
        this.addChatMessage('user', `Level ${level} - ${config.name}`);
        
        setTimeout(() => {
            this.addChatMessage('agent', `Excellent choice! ${config.name} requires a ${this.formatAccounting(config.minDeposit)} deposit. You'll be able to complete ${config.dailyTasks} tasks daily with ${config.commissionRate}% commission rate.`);
            
            setTimeout(() => {
                this.addChatMessage('agent', 'Now, please provide your email address to proceed:');
                this.showEmailInput();
            }, 1200);
        }, 800);
    }

    showEmailInput() {
        const emailInputHtml = `
            <div class="space-y-3">
                <p class="text-gray-700 font-medium">📧 Please enter your email address:</p>
                <div class="space-y-2">
                    <input type="email" id="user-email-input" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                           placeholder="Enter your email address" />
                    <button onclick="window.dashboard.submitEmail()" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        <i class="fas fa-envelope mr-2"></i>
                        Submit Email
                    </button>
                </div>
            </div>
        `;
          this.addChatMessage('agent', emailInputHtml);
    }

    submitEmail() {
        const emailInput = document.getElementById('user-email-input');
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (!email) {
            this.addChatMessage('agent', '⚠️ Please enter your email address.');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.addChatMessage('agent', '⚠️ Please enter a valid email address.');
            return;
        }
        
        // Store email
        this.userEmail = email;
        
        // Add user message
        this.addChatMessage('user', email);
        
        // Check if this is a settlement flow
        if (this.isSettlementFlow && this.tempDepositData && this.tempDepositData.isSettlement) {
            setTimeout(() => {
                this.addChatMessage('agent', `Perfect! For your settlement recharge of ${this.formatAccounting(this.tempDepositData.rechargeAmount)}, please choose your deposit method:`);
            }, 800);
        } else {
            setTimeout(() => {
                this.addChatMessage('agent', 'Thank you! Now please choose your deposit method:');
            }, 800);
        }
        
        setTimeout(() => {
            this.showDepositMethods();        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Get banking details based on currency
    getBankingDetails(currencyCode) {
        const bankingDetails = {
            'USD': {
                bankName: 'First National Bank',
                accountName: 'ePay Global Ltd',
                accountNumber: '1234567890',
                bankCode: '123456789',
                additionalInfo: 'Routing Number'
            },
            'HKD': {
                bankName: 'HSBC Hong Kong',
                accountName: 'ePay Asia Pacific Ltd',
                accountNumber: '123-456789-001',
                bankCode: '004',
                additionalInfo: 'Bank Code'
            },
            'SGD': {
                bankName: 'DBS Bank Singapore',
                accountName: 'ePay Singapore Pte Ltd',
                accountNumber: '0123456789',
                bankCode: '7171',
                additionalInfo: 'Bank Code'
            },
            'JPY': {
                bankName: 'Mitsubishi UFJ Bank',
                accountName: 'ePay Japan Co Ltd',
                accountNumber: '1234567',
                bankCode: '0005',
                additionalInfo: 'Bank Code'
            },
            'KRW': {
                bankName: 'KB Kookmin Bank',
                accountName: 'ePay Korea Ltd',
                accountNumber: '123456-01-123456',
                bankCode: '004',
                additionalInfo: 'Bank Code'
            },
            'TWD': {
                bankName: 'Cathay United Bank',
                accountName: 'ePay Taiwan Co Ltd',
                accountNumber: '123-456-789012',
                bankCode: '013',
                additionalInfo: 'Bank Code'
            },
            'THB': {
                bankName: 'Bangkok Bank',
                accountName: 'ePay Thailand Co Ltd',
                accountNumber: '123-4-56789-0',
                bankCode: '002',
                additionalInfo: 'Bank Code'
            },
            'MYR': {
                bankName: 'Maybank Malaysia',
                accountName: 'ePay Malaysia Sdn Bhd',
                accountNumber: '123456789012',
                bankCode: '1234',
                additionalInfo: 'Bank Code'
            },
            'IDR': {
                bankName: 'Bank Central Asia',
                accountName: 'PT ePay Indonesia',
                accountNumber: '1234567890',
                bankCode: '014',
                additionalInfo: 'Bank Code'
            },
            'VND': {
                bankName: 'Vietcombank',
                accountName: 'ePay Vietnam Co Ltd',
                accountNumber: '1234567890123',
                bankCode: '970436',
                additionalInfo: 'Bank Code'
            },
            'AED': {
                bankName: 'Emirates NBD Bank',
                accountName: 'ePay Middle East LLC',
                accountNumber: '1234567890123',
                bankCode: 'EBILAEAD',
                additionalInfo: 'SWIFT Code'
            },
            'SAR': {
                bankName: 'Al Rajhi Bank',
                accountName: 'ePay Saudi Arabia LLC',
                accountNumber: '123456789012345',
                bankCode: 'RJHISARI',
                additionalInfo: 'SWIFT Code'
            },
            'EUR': {
                bankName: 'Deutsche Bank',
                accountName: 'ePay Europe GmbH',
                accountNumber: 'DE89370400440532013000',
                bankCode: 'DEUTDEFF',
                additionalInfo: 'SWIFT Code'
            },
            'GBP': {
                bankName: 'Barclays Bank',
                accountName: 'ePay UK Limited',
                accountNumber: '12345678',
                bankCode: 'BARCGB22',
                additionalInfo: 'SWIFT Code'
            }
        };        return bankingDetails[currencyCode] || bankingDetails['USD'];
    }

    // Handle file selection for settlement upload
    handleFileSelect(input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.selectedFile = file;
            this.showFilePreview(file);
            this.enableSubmitButton();
        }
    }

    // Show file preview
    showFilePreview(file) {
        const fileName = document.getElementById('settlement-deposit-file-name');
        const fileSize = document.getElementById('settlement-deposit-file-size');
        const filePreview = document.getElementById('settlement-deposit-file-preview');
        const uploadArea = document.getElementById('settlement-deposit-upload-area');

        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        if (filePreview) filePreview.classList.remove('hidden');
        if (uploadArea) uploadArea.style.display = 'none';
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Enable submit button
    enableSubmitButton() {
        const submitBtn = document.getElementById('settlement-deposit-submit-proof');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Remove selected file
    removeSelectedFile() {
        this.selectedFile = null;
        const filePreview = document.getElementById('settlement-deposit-file-preview');
        const uploadArea = document.getElementById('settlement-deposit-upload-area');
        const fileInputs = document.querySelectorAll('input[type="file"]');

        if (filePreview) filePreview.classList.add('hidden');
        if (uploadArea) uploadArea.style.display = 'block';
        
        // Clear all file inputs
        fileInputs.forEach(input => input.value = '');
        
        // Disable submit button
        const submitBtn = document.getElementById('settlement-deposit-submit-proof');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    // Submit selected file
    submitSelectedFile() {
        if (this.selectedFile) {
            this.submitSettlementDepositProof(this.selectedFile);
        } else {
            alert('Please select a file first');
        }
    }

    // Test submit file function
    testSubmitFile() {
        const mockFile = {
            name: 'test_receipt.jpg',
            size: 245760, // 240KB
            type: 'image/jpeg'
        };
        
        this.submitSettlementDepositProof(mockFile);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new AgentDashboard();
    
    // Setup live chat events
    window.dashboard.setupLiveChatEvents();
    
    // Add button to open live chat (if needed)
    const helpButton = document.createElement('button');
    helpButton.innerHTML = '<i class="fas fa-comments"></i> Live Chat';
    helpButton.className = 'fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center space-x-2';
    helpButton.onclick = () => window.dashboard.openLiveChat();
    document.body.appendChild(helpButton);
});
