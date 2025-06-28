// ePay's Website JavaScript

// Enhanced Mobile Menu Toggle with Animation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = mobileMenuBtn?.querySelector('i');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                // Add animation classes
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    mobileMenu.style.transition = 'all 0.3s ease-out';
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';
                }, 10);
                
                // Change hamburger to X
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('fa-bars');
                    hamburgerIcon.classList.add('fa-times');
                }
            } else {
                mobileMenu.style.transition = 'all 0.3s ease-in';
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                // Change X back to hamburger
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('fa-times');
                    hamburgerIcon.classList.add('fa-bars');
                }
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('fa-times');
                    hamburgerIcon.classList.add('fa-bars');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (hamburgerIcon) {
                        hamburgerIcon.classList.remove('fa-times');
                        hamburgerIcon.classList.add('fa-bars');
                    }
                }
            }
        });
    }
    
    // DISABLED: Navigation Scroll Effects - No scroll animations
    /*
    let lastScroll = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            // Scrolling down
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            // Scrolling up
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        
        // Add background blur when scrolled
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    */
});

// Exchange Rates Data
const exchangeRates = {
    'USD/EUR': { rate: 0.85, change: '+0.02', flag: '🇺🇸→🇪🇺' },
    'USD/GBP': { rate: 0.73, change: '-0.01', flag: '🇺🇸→🇬🇧' },
    'USD/INR': { rate: 83.25, change: '+0.45', flag: '🇺🇸→🇮🇳' },
    'USD/JPY': { rate: 150.30, change: '+1.20', flag: '🇺🇸→🇯🇵' },
    'EUR/USD': { rate: 1.18, change: '-0.03', flag: '🇪🇺→🇺🇸' },
    'GBP/USD': { rate: 1.37, change: '+0.02', flag: '🇬🇧→🇺🇸' },
    'USD/CAD': { rate: 1.35, change: '+0.01', flag: '🇺🇸→🇨🇦' },
    'USD/AUD': { rate: 1.52, change: '-0.02', flag: '🇺🇸→🇦🇺' },
    'USD/MXN': { rate: 17.25, change: '+0.15', flag: '🇺🇸→🇲🇽' },
    'USD/PHP': { rate: 56.80, change: '+0.30', flag: '🇺🇸→🇵🇭' },
    'USD/NGN': { rate: 815.50, change: '+5.25', flag: '🇺🇸→🇳🇬' },
    'USD/BDT': { rate: 109.75, change: '+0.50', flag: '🇺🇸→🇧🇩' }
};

// Update Exchange Rates Display
function updateExchangeRates() {
    const container = document.getElementById('exchange-preview');
    if (!container) return;
    
    container.innerHTML = '';
    
    const mainPairs = ['USD/EUR', 'USD/GBP', 'USD/INR', 'USD/JPY'];
    
    mainPairs.forEach(pair => {
        const data = exchangeRates[pair];
        const changeClass = data.change.startsWith('+') ? 'price-up' : 
                           data.change.startsWith('-') ? 'price-down' : 'price-neutral';
        
        const card = document.createElement('div');
        card.className = 'exchange-card rounded-2xl p-6 text-center card-hover';
        card.innerHTML = `
            <div class="text-2xl mb-2">${data.flag}</div>
            <div class="text-lg font-bold text-dark-gray mb-1">${pair}</div>
            <div class="text-2xl font-bold text-electric-blue mb-2">${data.rate}</div>
            <div class="text-sm ${changeClass} flex items-center justify-center">
                <i class="fas fa-arrow-${data.change.startsWith('+') ? 'up' : 'down'} mr-1"></i>
                ${data.change}
            </div>
        `;
        container.appendChild(card);
    });
}

// Full Exchange Rates Grid
function updateFullExchangeRates() {
    const container = document.getElementById('exchange-rates-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(exchangeRates).forEach(([pair, data]) => {
        const changeClass = data.change.startsWith('+') ? 'price-up' : 
                           data.change.startsWith('-') ? 'price-down' : 'price-neutral';
        
        const card = document.createElement('div');
        card.className = 'exchange-card rounded-2xl p-6 text-center card-hover';
        card.innerHTML = `
            <div class="text-3xl mb-3">${data.flag}</div>
            <div class="text-lg font-bold text-dark-gray mb-2">${pair}</div>
            <div class="text-2xl font-bold text-electric-blue mb-3">${data.rate}</div>
            <div class="text-sm ${changeClass} flex items-center justify-center">
                <i class="fas fa-arrow-${data.change.startsWith('+') ? 'up' : 'down'} mr-1"></i>
                ${data.change}
            </div>
            <div class="text-xs text-gray-500 mt-2">Updated: ${new Date().toLocaleTimeString()}</div>
        `;
        container.appendChild(card);
    });
}

// Update Last Updated Time
function updateLastUpdated() {
    const element = document.getElementById('last-updated');
    if (element) {
        element.textContent = new Date().toLocaleString();
    }
}

// Send Money Calculator
function initSendMoneyCalculator() {
    const sendAmountInput = document.getElementById('send-amount');
    const fromCountrySelect = document.getElementById('from-country');
    const toCountrySelect = document.getElementById('to-country');
    
    if (!sendAmountInput || !fromCountrySelect || !toCountrySelect) return;
    
    function calculateTransfer() {
        const amount = parseFloat(sendAmountInput.value) || 1000;
        const fromCurrency = fromCountrySelect.value;
        const toCurrency = toCountrySelect.value;
        
        // Mock exchange rates for calculation
        const rates = {
            'US-IN': 83.25,
            'US-PH': 56.80,
            'US-MX': 17.25,
            'US-NG': 815.50,
            'GB-IN': 103.75,
            'CA-IN': 61.50,
            'EU-IN': 98.20
        };
        
        const rateKey = `${fromCurrency}-${toCurrency}`;
        const exchangeRate = rates[rateKey] || 1;
        const fee = Math.max(2.99, amount * 0.005); // Min $2.99 or 0.5%
        const totalCost = amount + fee;
        const recipientAmount = amount * exchangeRate;
        
        // Update display
        document.getElementById('exchange-rate').textContent = `1 ${getCurrencyCode(fromCurrency)} = ${exchangeRate} ${getCurrencyCode(toCurrency)}`;
        document.getElementById('transfer-fee').textContent = `$${fee.toFixed(2)}`;
        document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
        document.getElementById('recipient-amount').textContent = `${getCurrencySymbol(toCurrency)}${recipientAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    function getCurrencyCode(country) {
        const codes = {
            'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'EU': 'EUR', 'AU': 'AUD',
            'IN': 'INR', 'PH': 'PHP', 'MX': 'MXN', 'NG': 'NGN', 'BD': 'BDT',
            'PK': 'PKR', 'VN': 'VND', 'ID': 'IDR'
        };
        return codes[country] || 'USD';
    }
    
    function getCurrencySymbol(country) {
        const symbols = {
            'US': '$', 'GB': '£', 'CA': 'C$', 'EU': '€', 'AU': 'A$',
            'IN': '₹', 'PH': '₱', 'MX': '$', 'NG': '₦', 'BD': '৳',
            'PK': '₨', 'VN': '₫', 'ID': 'Rp'
        };
        return symbols[country] || '$';
    }
    
    // Event listeners
    sendAmountInput.addEventListener('input', calculateTransfer);
    fromCountrySelect.addEventListener('change', calculateTransfer);
    toCountrySelect.addEventListener('change', calculateTransfer);
    
    // Initial calculation
    calculateTransfer();
}

// FAQ Toggle
function initFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const target = document.getElementById(this.dataset.target);
            const icon = this.querySelector('i');
            
            if (target.classList.contains('hidden')) {
                target.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                target.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// FAQ Toggle Function
function toggleFAQ(faqId) {
    const faqContent = document.getElementById(faqId);
    const faqIcon = document.getElementById(faqId + '-icon');
    
    if (faqContent && faqIcon) {
        const isExpanded = faqContent.classList.contains('expanded');
        
        if (!isExpanded) {
            // Show the FAQ answer with smooth animation
            faqContent.classList.remove('hidden', 'collapsed');
            
            // Small delay to ensure proper rendering before animation
            requestAnimationFrame(() => {
                faqContent.classList.add('expanded');
            });
            
            // Update icon with smooth rotation
            faqIcon.classList.remove('fa-plus');
            faqIcon.classList.add('fa-minus', 'rotated');
        } else {
            // Hide the FAQ answer with smooth animation
            faqContent.classList.remove('expanded');
            faqContent.classList.add('collapsed');
            
            // Update icon
            faqIcon.classList.remove('fa-minus', 'rotated');
            faqIcon.classList.add('fa-plus');
            
            // Add hidden class after animation completes
            setTimeout(() => {
                if (faqContent.classList.contains('collapsed')) {
                    faqContent.classList.add('hidden');
                }
            }, 450); // Slightly longer than CSS transition duration
        }
    }
}

// Search and Filter for Exchange Rates
function initExchangeRatesFilters() {
    const searchInput = document.getElementById('currency-search');
    const regionFilter = document.getElementById('region-filter');
    const refreshBtn = document.getElementById('refresh-rates');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterExchangeRates);
    }
    
    if (regionFilter) {
        regionFilter.addEventListener('change', filterExchangeRates);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('loading');
            setTimeout(() => {
                simulateRateUpdate();
                this.classList.remove('loading');
            }, 1000);
        });
    }
}

function filterExchangeRates() {
    const searchTerm = document.getElementById('currency-search')?.value.toLowerCase() || '';
    const selectedRegion = document.getElementById('region-filter')?.value || 'all';
    const cards = document.querySelectorAll('#exchange-rates-grid .exchange-card');
    
    cards.forEach(card => {
        const pairText = card.textContent.toLowerCase();
        const matchesSearch = pairText.includes(searchTerm);
        const matchesRegion = selectedRegion === 'all' || checkRegionMatch(card, selectedRegion);
        
        if (matchesSearch && matchesRegion) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function checkRegionMatch(card, region) {
    // Simple region mapping based on currency pairs
    const regionMap = {
        'america': ['USD', 'CAD', 'MXN'],
        'europe': ['EUR', 'GBP'],
        'asia': ['INR', 'JPY', 'PHP', 'VND', 'IDR', 'BDT', 'PKR'],
        'africa': ['NGN'],
        'oceania': ['AUD']
    };
    
    const currencies = regionMap[region] || [];
    const cardText = card.textContent;
    
    return currencies.some(currency => cardText.includes(currency));
}

function simulateRateUpdate() {
    // Simulate small rate changes
    Object.keys(exchangeRates).forEach(pair => {
        const currentRate = exchangeRates[pair].rate;
        const change = (Math.random() - 0.5) * 0.1; // Random change between -0.05 and +0.05
        const newRate = Math.max(0.01, currentRate + change);
        
        exchangeRates[pair].rate = parseFloat(newRate.toFixed(2));
        exchangeRates[pair].change = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
    });
    
    updateFullExchangeRates();
    updateLastUpdated();
}

// Form Submissions
function initFormHandlers() {
    // Transfer Form
    const transferForm = document.getElementById('transfer-form');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Transfer initiated! You would be redirected to the payment page.');
        });
    }
    
    // Agent Application Form
    const agentForm = document.getElementById('agent-application');
    if (agentForm) {
        agentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Application submitted successfully! We will review your application and contact you within 48 hours.');
        });
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Countries Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const showAllCountriesBtn = document.getElementById('show-all-countries');
    const countriesModal = document.getElementById('countries-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Show modal
    if (showAllCountriesBtn && countriesModal) {
        showAllCountriesBtn.addEventListener('click', function() {
            countriesModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // Close modal
    if (closeModalBtn && countriesModal) {
        closeModalBtn.addEventListener('click', function() {
            countriesModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside
    if (countriesModal) {
        countriesModal.addEventListener('click', function(e) {
            if (e.target === countriesModal) {
                countriesModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && countriesModal && !countriesModal.classList.contains('hidden')) {
            countriesModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});

// Auth Modal Functionality
function initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const openAuthModalBtn = document.getElementById('open-auth-modal');
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const modalTitle = document.getElementById('modal-title');

    // Open modal
    if (openAuthModalBtn && authModal) {
        openAuthModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            showLoginForm(); // Default to login form
        });
    }

    // Close modal
    if (closeAuthModalBtn && authModal) {
        closeAuthModalBtn.addEventListener('click', function() {
            authModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Switch to register form
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }

    // Switch to login form
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Show login form
    function showLoginForm() {
        if (loginForm && registerForm && modalTitle) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            modalTitle.textContent = 'Login to ePay\'s';
        }
    }

    // Initialize email validation when modal opens
    function initializeFormValidation() {
        initializeEmailValidation();
        initializeInviteCodeValidation();
    }

    function initializeEmailValidation() {
        // Email validation with typo detection
        const emailInput = document.querySelector('#auth-modal input[type="email"]');
        if (!emailInput) return;

        // Common email domain typos and their corrections
        const commonDomainTypos = {
            'gamil.com': 'gmail.com',
            'gamail.com': 'gmail.com',
            'gmaail.com': 'gmail.com',
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'gmail.con': 'gmail.com',
            'gmail.cmo': 'gmail.com',
            'gmail.comm': 'gmail.com',
            'gmail.cm': 'gmail.com',
            'gmailcom': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yahoo.co': 'yahoo.com',
            'yahoo.con': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'yahho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'hotmail.co': 'hotmail.com',
            'hotmail.con': 'hotmail.com',
            'hotmailcom': 'hotmail.com',
            'outlok.com': 'outlook.com',
            'outlook.co': 'outlook.com',
            'outlook.con': 'outlook.com',
            'outlookcom': 'outlook.com',
            'live.co': 'live.com',
            'live.con': 'live.com',
            'livecom': 'live.com'
        };

        let emailSuggestionDiv = null;

        function validateEmail(email) {
            // Basic email format validation
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            
            if (!emailRegex.test(email)) {
                return { valid: false, message: 'Please enter a valid email address' };
            }

            // Check for common domain typos
            const domain = email.split('@')[1];
            if (domain && commonDomainTypos[domain.toLowerCase()]) {
                return { 
                    valid: false, 
                    suggestion: true,
                    correctDomain: commonDomainTypos[domain.toLowerCase()],
                    correctedEmail: email.split('@')[0] + '@' + commonDomainTypos[domain.toLowerCase()],
                    message: `Did you mean "${email.split('@')[0] + '@' + commonDomainTypos[domain.toLowerCase()]}"?`
                };
            }

            // Check for valid domain extensions
            const validExtensions = ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.co.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.in', '.br', '.mx', '.it', '.es', '.ru', '.za', '.ng', '.ke', '.gh', '.tz', '.ug', '.zw', '.eg', '.ma', '.dz', '.ly', '.sd', '.et', '.ao', '.mz', '.mg', '.mu', '.sc', '.re', '.yt', '.tf', '.so', '.dj', '.er', '.km', '.st', '.cv', '.gw', '.gq', '.ga', '.cf', '.td', '.cm', '.ne', '.bf', '.ml', '.sn', '.gm', '.gn', '.sl', '.lr', '.ci', '.gh', '.tg', '.bj', '.ng', '.nf'];
            
            const hasValidExtension = validExtensions.some(ext => domain.toLowerCase().endsWith(ext));
            if (!hasValidExtension) {
                return { valid: false, message: 'Please enter an email with a valid domain extension (e.g., .com, .org, .net)' };
            }

            return { valid: true };
        }

        function createEmailSuggestion(suggestion, correctedEmail) {
            // Remove existing suggestion
            if (emailSuggestionDiv) {
                emailSuggestionDiv.remove();
            }

            emailSuggestionDiv = document.createElement('div');
            emailSuggestionDiv.className = 'mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm';
            emailSuggestionDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-yellow-300">
                        <i class="fas fa-lightbulb mr-2"></i>
                        ${suggestion}
                    </span>
                    <button type="button" class="use-suggestion ml-3 px-3 py-1 bg-yellow-500 text-black rounded text-xs font-medium hover:bg-yellow-400 transition-colors" data-email="${correctedEmail}">
                        Use this
                    </button>
                </div>
            `;

            emailInput.parentNode.appendChild(emailSuggestionDiv);

            // Add click event to use suggestion
            emailSuggestionDiv.querySelector('.use-suggestion').addEventListener('click', function() {
                emailInput.value = correctedEmail;
                emailSuggestionDiv.remove();
                emailSuggestionDiv = null;
                // Trigger validation again
                emailInput.dispatchEvent(new Event('blur'));
            });
        }

        function showEmailError(message) {
            emailInput.classList.add('border-red-500', 'focus:border-red-500');
            emailInput.classList.remove('border-white/20', 'border-green-500');
            
            // Remove existing error message
            const existingError = emailInput.parentNode.querySelector('.email-error');
            if (existingError) {
                existingError.remove();
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = 'email-error mt-1 text-red-400 text-xs';
            errorDiv.textContent = message;
            emailInput.parentNode.appendChild(errorDiv);
        }

        function showEmailSuccess() {
            emailInput.classList.add('border-green-500');
            emailInput.classList.remove('border-white/20', 'border-red-500');
            
            // Remove error message and suggestion
            const existingError = emailInput.parentNode.querySelector('.email-error');
            if (existingError) {
                existingError.remove();
            }
            if (emailSuggestionDiv) {
                emailSuggestionDiv.remove();
                emailSuggestionDiv = null;
            }
        }

        function clearEmailValidation() {
            emailInput.classList.remove('border-red-500', 'border-green-500');
            emailInput.classList.add('border-white/20');
            
            const existingError = emailInput.parentNode.querySelector('.email-error');
            if (existingError) {
                existingError.remove();
            }
            if (emailSuggestionDiv) {
                emailSuggestionDiv.remove();
                emailSuggestionDiv = null;
            }
        }

        // Real-time validation as user types
        emailInput.addEventListener('input', function(e) {
            const email = e.target.value.trim();
            
            if (email.length === 0) {
                clearEmailValidation();
                return;
            }

            // Only show basic validation while typing
            if (email.length > 3 && email.includes('@')) {
                const validation = validateEmail(email);
                if (validation.valid) {
                    showEmailSuccess();
                } else if (validation.suggestion) {
                    createEmailSuggestion(validation.message, validation.correctedEmail);
                    emailInput.classList.add('border-yellow-500');
                    emailInput.classList.remove('border-white/20', 'border-red-500', 'border-green-500');
                }
            }
        });

        // Full validation on blur
        emailInput.addEventListener('blur', function(e) {
            const email = e.target.value.trim();
            
            if (email.length === 0) {
                clearEmailValidation();
                return;
            }

            const validation = validateEmail(email);
            
            if (validation.valid) {
                showEmailSuccess();
            } else if (validation.suggestion) {
                createEmailSuggestion(validation.message, validation.correctedEmail);
                emailInput.classList.add('border-yellow-500');
                emailInput.classList.remove('border-white/20', 'border-red-500', 'border-green-500');
            } else {
                showEmailError(validation.message);
            }
        });
    }

    // Show register form
    function showRegisterForm() {
        if (loginForm && registerForm && modalTitle) {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            modalTitle.textContent = 'Create Business Account';
            
            // Initialize form validation after DOM is updated
            setTimeout(() => {
                initializeFormValidation();
            }, 100);
        }
    }

    // Close modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
            authModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.fa-eye');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.closest('div').querySelector('input');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Form submission handlers
    const loginFormElement = loginForm?.querySelector('button[type="submit"]');
    const registerFormElement = registerForm?.querySelector('button[type="submit"]');

    if (loginFormElement) {
        loginFormElement.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your login logic here
            alert('Login functionality would be implemented here!');
        });
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your registration logic here
            alert('Registration functionality would be implemented here!');
        });
    }
}

// Email validation with typo detection
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {        // Common email domain typos and their corrections
        const commonDomainTypos = {
            'gamil.com': 'gmail.com',
            'gamail.com': 'gmail.com',
            'gmaail.com': 'gmail.com',
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'gmail.con': 'gmail.com',
            'gmail.cmo': 'gmail.com',
            'gmail.comm': 'gmail.com',
            'gmail.cm': 'gmail.com',
            'gmailcom': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yahoo.co': 'yahoo.com',
            'yahoo.con': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'yahho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'hotmail.co': 'hotmail.com',
            'hotmail.con': 'hotmail.com',
            'hotmailcom': 'hotmail.com',
            'outlok.com': 'outlook.com',
            'outlook.co': 'outlook.com',
            'outlook.con': 'outlook.com',
            'outlookcom': 'outlook.com',
            'live.co': 'live.com',
            'live.con': 'live.com',
            'livecom': 'live.com'
        };

    let emailSuggestionDiv = null;

    function validateEmail(email) {
        // Basic email format validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        // Check for common domain typos
        const domain = email.split('@')[1];
        if (domain && commonDomainTypos[domain.toLowerCase()]) {
            return { 
                valid: false, 
                suggestion: true,
                correctDomain: commonDomainTypos[domain.toLowerCase()],
                correctedEmail: email.split('@')[0] + '@' + commonDomainTypos[domain.toLowerCase()],
                message: `Did you mean "${email.split('@')[0] + '@' + commonDomainTypos[domain.toLowerCase()]}"?`
            };
        }

        // Check for valid domain extensions
        const validExtensions = ['.com', '.org', '.net', '.edu', '.gov', '.mil', '.co.uk', '.ca', '.au', '.de', '.fr', '.jp', '.cn', '.in', '.br', '.mx', '.it', '.es', '.ru', '.za', '.ng', '.ke', '.gh', '.tz', '.ug', '.zw', '.eg', '.ma', '.dz', '.ly', '.sd', '.et', '.ao', '.mz', '.mg', '.mu', '.sc', '.re', '.yt', '.tf', '.so', '.dj', '.er', '.km', '.st', '.cv', '.gw', '.gq', '.ga', '.cf', '.td', '.cm', '.ne', '.bf', '.ml', '.sn', '.gm', '.gn', '.sl', '.lr', '.ci', '.gh', '.tg', '.bj', '.ng', '.nf'];
        
        const hasValidExtension = validExtensions.some(ext => domain.toLowerCase().endsWith(ext));
        if (!hasValidExtension) {
            return { valid: false, message: 'Please enter an email with a valid domain extension (e.g., .com, .org, .net)' };
        }

        return { valid: true };
    }

    function createEmailSuggestion(suggestion, correctedEmail) {
        // Remove existing suggestion
        if (emailSuggestionDiv) {
            emailSuggestionDiv.remove();
        }

        emailSuggestionDiv = document.createElement('div');
        emailSuggestionDiv.className = 'mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm';
        emailSuggestionDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-yellow-300">
                    <i class="fas fa-lightbulb mr-2"></i>
                    ${suggestion}
                </span>
                <button type="button" class="use-suggestion ml-3 px-3 py-1 bg-yellow-500 text-black rounded text-xs font-medium hover:bg-yellow-400 transition-colors" data-email="${correctedEmail}">
                    Use this
                </button>
            </div>
        `;

        emailInput.parentNode.appendChild(emailSuggestionDiv);

        // Add click event to use suggestion
        emailSuggestionDiv.querySelector('.use-suggestion').addEventListener('click', function() {
            emailInput.value = correctedEmail;
            emailSuggestionDiv.remove();
            emailSuggestionDiv = null;
            // Trigger validation again
            emailInput.dispatchEvent(new Event('blur'));
        });
    }

    function showEmailError(message) {
        emailInput.classList.add('border-red-500', 'focus:border-red-500');
        emailInput.classList.remove('border-white/20', 'border-green-500');
        
        // Remove existing error message
        const existingError = emailInput.parentNode.querySelector('.email-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error mt-1 text-red-400 text-xs';
        errorDiv.textContent = message;
        emailInput.parentNode.appendChild(errorDiv);
    }

    function showEmailSuccess() {
        emailInput.classList.add('border-green-500');
        emailInput.classList.remove('border-white/20', 'border-red-500');
        
        // Remove error message and suggestion
        const existingError = emailInput.parentNode.querySelector('.email-error');
        if (existingError) {
            existingError.remove();
        }
        if (emailSuggestionDiv) {
            emailSuggestionDiv.remove();
            emailSuggestionDiv = null;
        }
    }

    function clearEmailValidation() {
        emailInput.classList.remove('border-red-500', 'border-green-500');
        emailInput.classList.add('border-white/20');
        
        const existingError = emailInput.parentNode.querySelector('.email-error');
        if (existingError) {
            existingError.remove();
        }
        if (emailSuggestionDiv) {
            emailSuggestionDiv.remove();
            emailSuggestionDiv = null;
        }
    }

    // Real-time validation as user types
    emailInput.addEventListener('input', function(e) {
        const email = e.target.value.trim();
        
        if (email.length === 0) {
            clearEmailValidation();
            return;
        }

        // Only show basic validation while typing
        if (email.length > 3 && email.includes('@')) {
            const validation = validateEmail(email);
            if (validation.valid) {
                showEmailSuccess();
            } else if (validation.suggestion) {
                createEmailSuggestion(validation.message, validation.correctedEmail);
                emailInput.classList.add('border-yellow-500');
                emailInput.classList.remove('border-white/20', 'border-red-500', 'border-green-500');
            }
        }
    });

    // Full validation on blur
    emailInput.addEventListener('blur', function(e) {
        const email = e.target.value.trim();
        
        if (email.length === 0) {
            clearEmailValidation();
            return;
        }

        const validation = validateEmail(email);
        
        if (validation.valid) {
            showEmailSuccess();
        } else if (validation.suggestion) {
            createEmailSuggestion(validation.message, validation.correctedEmail);
            emailInput.classList.add('border-yellow-500');
            emailInput.classList.remove('border-white/20', 'border-red-500', 'border-green-500');
        } else {
            showEmailError(validation.message);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateExchangeRates();
    updateFullExchangeRates();
    updateLastUpdated();
    initSendMoneyCalculator();
    initFAQ();
    initExchangeRatesFilters();
    initFormHandlers();
    initSmoothScroll();
    initAuthModal();
    initPrivacyPolicyModal();
    
    // Auto-refresh exchange rates every 30 seconds
    setInterval(() => {
        simulateRateUpdate();
        updateExchangeRates();
    }, 30000);
});

// Enhanced Click Effects for Business Account Page
document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to all sections
    addSectionClickEffects();
    addAgentLevelInteractions();
    addStatAnimations();
    addSuccessStoryEffects();
    addHoverEffects();
});

// Section Click Effects
function addSectionClickEffects() {
    // Add click effects to main sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.addEventListener('click', function(e) {
            // Don't trigger on button clicks
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            // Add ripple effect
            createRippleEffect(e, this);
            
            // Add section highlight effect
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'scale(1.002)';
            this.style.boxShadow = '0 0 50px rgba(0, 212, 255, 0.1)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            }, 300);
        });
    });
}

// Agent Level Card Interactions
function addAgentLevelInteractions() {
    // Only target cards that are NOT in the leadership section
    const levelCards = document.querySelectorAll('.glass-card:not(section:has(h2:contains("Leadership Team")) .glass-card)');
    
    // Alternative approach: only target cards in specific sections (excluding leadership)
    const businessCards = document.querySelectorAll('section:not(:has(h2:contains("Leadership"))) .glass-card');
    
    businessCards.forEach(card => {
        // Skip cards in leadership section
        const leadershipSection = card.closest('section')?.querySelector('h2')?.textContent;
        if (leadershipSection && leadershipSection.includes('Leadership')) {
            return;
        }
        
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove active class from all cards
            businessCards.forEach(c => c.classList.remove('agent-card-active'));
            
            // Add active class to clicked card
            this.classList.add('agent-card-active');
            
            // Create floating particles effect
            createParticleEffect(this);
            
            // Add bounce animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'cardBounce 0.6s ease-out';
            }, 10);
            
            // Show level details with animation
            showLevelDetails(this);
        });
        
        // Add hover sound effect (visual representation)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
            
            // Add glow pulse
            const glow = document.createElement('div');
            glow.className = 'absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 rounded-2xl animate-pulse pointer-events-none';
            this.style.position = 'relative';
            this.appendChild(glow);
            
            setTimeout(() => glow.remove(), 2000);
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('agent-card-active')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            }
        });
    });
}

// Animated Statistics
function addStatAnimations() {
    const stats = document.querySelectorAll('.flex.items-center.space-x-2');
    
    stats.forEach((stat, index) => {
        stat.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add counter animation
            const textElement = this.querySelector('span:last-child');
            if (textElement) {
                animateStatText(textElement);
            }
            
            // Add icon spin
            const icon = this.querySelector('div');
            if (icon) {
                icon.style.animation = 'spin 1s ease-in-out';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 1000);
            }
            
            // Create expanding ring effect
            createExpandingRing(this);
        });
    });
}

// Success Story Interactions
function addSuccessStoryEffects() {
    const storyCards = document.querySelectorAll('.bg-gray-50');
    
    storyCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add card flip effect
            this.style.transform = 'rotateY(10deg) scale(1.05)';
            this.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.3)';
            
            // Add sparkle effect
            createSparkleEffect(this);
            
            setTimeout(() => {
                this.style.transform = 'rotateY(0deg) scale(1)';
                this.style.boxShadow = '';
            }, 500);
            
            // Animate earnings number
            const earnings = this.querySelector('.text-2xl.font-bold.text-electric-blue');
            if (earnings) {
                animateEarnings(earnings);
            }
        });
    });
}

// Enhanced Hover Effects
function addHoverEffects() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('button, .glass-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            createButtonClickEffect(this, e);
        });
    });
}

// Utility Functions for Effects

function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.8s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

function createParticleEffect(element) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #00D4FF, #8B5CF6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat 2s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = (rect.width / 2) + 'px';
        particle.style.top = (rect.height / 2) + 'px';
        particle.style.animationDelay = (i * 0.1) + 's';
        
        element.style.position = 'relative';
        element.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

function createExpandingRing(element) {
    const ring = document.createElement('div');
    ring.style.cssText = `
        position: absolute;
        inset: 0;
        border: 2px solid rgba(0, 212, 255, 0.6);
        border-radius: 50%;
        animation: expandRing 1s ease-out forwards;
        pointer-events: none;
        z-index: 100;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ring);
    
    setTimeout(() => ring.remove(), 1000);
}

function createSparkleEffect(element) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle 1.5s ease-out forwards;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
        `;
        
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1500);
    }
}

function createButtonClickEffect(button, event) {
    const effect = document.createElement('div');
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    effect.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        animation: buttonRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(effect);
    
    setTimeout(() => effect.remove(), 600);
}

function animateStatText(element) {
    const originalText = element.textContent;
    element.style.color = '#00D4FF';
    element.style.transform = 'scale(1.2)';
    element.style.fontWeight = 'bold';
    
    setTimeout(() => {
        element.style.color = '';
        element.style.transform = 'scale(1)';
        element.style.fontWeight = '';
    }, 500);
}

function animateEarnings(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    let current = 0;
    const increment = number / 30;
    const symbol = text.replace(/[0-9]/g, '');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = symbol.replace(/[0-9]/g, '') + Math.floor(current).toLocaleString();
    }, 50);
}

function showLevelDetails(card) {
    // Create floating info panel
    const infoPanel = document.createElement('div');
    infoPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 20px;
        padding: 30px;
        z-index: 10000;
        color: white;
        text-align: center;
        min-width: 300px;
        animation: scaleIn 0.3s ease-out forwards;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    `;
    
    const levelTitle = card.querySelector('h3').textContent;
    const commissionRate = card.querySelector('.text-2xl.font-bold').textContent;
    
    infoPanel.innerHTML = `
        <h3 style="font-size: 24px; margin-bottom: 15px; color: #00D4FF;">${levelTitle} Selected!</h3>
        <p style="margin-bottom: 10px;">Commission Rate: <span style="color: #FCD34D; font-weight: bold;">${commissionRate}</span></p>
        <p style="margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Click anywhere to close</p>
        <div style="animation: pulse 2s infinite; font-size: 30px;">🎉</div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // Close on click
    infoPanel.addEventListener('click', () => {
        infoPanel.style.animation = 'scaleOut 0.3s ease-in forwards';
        setTimeout(() => infoPanel.remove(), 300);
    });
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (infoPanel.parentNode) {
            infoPanel.style.animation = 'scaleOut 0.3s ease-in forwards';
            setTimeout(() => infoPanel.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes cardBounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
        }
        40% {
            transform: translateY(-10px) scale(1.05);
        }
        60% {
            transform: translateY(-5px) scale(1.02);
        }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--random-x, 50px), var(--random-y, -50px)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes expandRing {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes buttonRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes scaleIn {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes scaleOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
    .agent-card-active {
        border-color: #00D4FF !important;
        box-shadow: 0 0 30px rgba(0, 212, 255, 0.4) !important;
        transform: scale(1.05) !important;
    }
`;

document.head.appendChild(styleSheet);

// Privacy Policy Modal Functionality
function initPrivacyPolicyModal() {
    const privacyPolicyLink = document.getElementById('privacy-policy-link');
    const privacyPolicyModal = document.getElementById('privacy-policy-modal');
    const closePrivacyModal = document.getElementById('close-privacy-modal');
    const closePrivacyModalFooter = document.getElementById('close-privacy-modal-footer');
    
    if (!privacyPolicyLink || !privacyPolicyModal) return;
    
    // Open Privacy Policy Modal
    privacyPolicyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyPolicyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add entrance animation
        const modalContent = privacyPolicyModal.querySelector('.glass-card');
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                modalContent.style.transition = 'all 0.3s ease-out';
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        }
    });
    
    // Close Privacy Policy Modal
    function closeModal() {
        const modalContent = privacyPolicyModal.querySelector('.glass-card');
        if (modalContent) {
            modalContent.style.transition = 'all 0.3s ease-in';
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
        }
        
        setTimeout(() => {
            privacyPolicyModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
    
    // Close modal event listeners
    if (closePrivacyModal) {
        closePrivacyModal.addEventListener('click', closeModal);
    }
    
    if (closePrivacyModalFooter) {
        closePrivacyModalFooter.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    privacyPolicyModal.addEventListener('click', function(e) {
        if (e.target === privacyPolicyModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !privacyPolicyModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Initialize Privacy Policy Modal when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    initPrivacyPolicyModal();
});
