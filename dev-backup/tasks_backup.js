// Task Completion System
class TaskManager {
    constructor() {
        this.userData = this.loadUserData();
        this.currentTask = null;
        this.completedTasks = [];
        this.currencyPairs = this.initializeCurrencyPairs();        this.init();
    }    loadUserData() {
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
            
            // Ensure profile compatibility fields exist
            data.personalInfo = data.personalInfo || {
                fullName: data.agentName || 'Agent User',
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
            
            data.paymentMethods = data.paymentMethods || {
                bankAccounts: [],
                cryptoWallets: []
            };
            
            data.securitySettings = data.securitySettings || {
                twoFactorEnabled: false,
                loginNotifications: true,
                passwordLastChanged: new Date().toISOString(),
                securityQuestions: []
            };
            
            data.joinDate = data.joinDate || new Date().toISOString();
            data.agentName = data.agentName || 'Agent User';
            data.transactions = data.transactions || [];
            
            console.log('Loaded user data:', data); // Debug log
            return data;
        }
        
        console.log('No saved data found, using defaults'); // Debug log
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
            personalInfo: {
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
            },
            paymentMethods: {
                bankAccounts: [],
                cryptoWallets: []
            },
            securitySettings: {
                twoFactorEnabled: false,
                loginNotifications: true,
                passwordLastChanged: new Date().toISOString(),
                securityQuestions: []
            },
            joinDate: new Date().toISOString(),
            agentName: 'Agent User',
            transactions: []
        };
    }saveUserData() {
        console.log('Saving user data:', this.userData); // Debug log
        localStorage.setItem('epay_data', JSON.stringify(this.userData));
        console.log('Data saved to localStorage'); // Debug log
    }

    initializeCurrencyPairs() {
        // All transactions now use USD as sender currency for easier commission calculations
        return [
            // USD to major currencies
            { from: 'USD', to: 'EUR', fromFlag: '🇺🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 0.92 },
            { from: 'USD', to: 'GBP', fromFlag: '🇺🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 0.79 },
            { from: 'USD', to: 'JPY', fromFlag: '🇺🇸', toFlag: '🇯🇵', minAmount: 100, maxAmount: 10000, rate: 157 },
            { from: 'USD', to: 'CNY', fromFlag: '🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 7.2 },
            { from: 'USD', to: 'KRW', fromFlag: '🇸', toFlag: '��', minAmount: 100, maxAmount: 10000, rate: 1350 },
            
            // USD to Asian currencies
            { from: 'USD', to: 'VND', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 24000 },
            { from: 'USD', to: 'THB', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 36 },
            { from: 'USD', to: 'IDR', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 15500 },
            { from: 'USD', to: 'MYR', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 4.7 },
            { from: 'USD', to: 'PHP', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 56 },
            { from: 'USD', to: 'SGD', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 1.35 },
            { from: 'USD', to: 'INR', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 83 },
            { from: 'USD', to: 'HKD', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 7.8 },
            { from: 'USD', to: 'TWD', fromFlag: '��', toFlag: '🇹�', minAmount: 50, maxAmount: 5000, rate: 31.5 },
            
            // USD to other major currencies
            { from: 'USD', to: 'AUD', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 1.51 },
            { from: 'USD', to: 'CAD', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 1.35 },
            { from: 'USD', to: 'CHF', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 0.89 },
            { from: 'USD', to: 'NZD', fromFlag: '🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 1.62 },
            { from: 'USD', to: 'NOK', fromFlag: '🇸', toFlag: '🇳�', minAmount: 50, maxAmount: 5000, rate: 10.8 },
            { from: 'USD', to: 'SEK', fromFlag: '🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 10.4 },
            
            // USD to emerging markets
            { from: 'USD', to: 'BRL', fromFlag: '��', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 5.2 },
            { from: 'USD', to: 'MXN', fromFlag: '��', toFlag: '🇲�', minAmount: 50, maxAmount: 5000, rate: 17.8 },
            { from: 'USD', to: 'ZAR', fromFlag: '🇺🇸', toFlag: '��', minAmount: 50, maxAmount: 5000, rate: 18.5 },
            { from: 'USD', to: 'TRY', fromFlag: '🇺🇸', toFlag: '🇹🇷', minAmount: 50, maxAmount: 5000, rate: 30.2 },
        ];
    }

    getLevelsConfig() {
        return {
            1: { name: 'Bronze Agent', minDeposit: 300, dailyTasks: 20, commissionRate: 0.2 },
            2: { name: 'Silver Agent', minDeposit: 1500, dailyTasks: 30, commissionRate: 0.6 },
            3: { name: 'Gold Agent', minDeposit: 3000, dailyTasks: 40, commissionRate: 1 },
            4: { name: 'Platinum Agent', minDeposit: 5000, dailyTasks: 50, commissionRate: 2 },            5: { name: 'Diamond Agent', minDeposit: 10000, dailyTasks: 60, commissionRate: 3 }
        };
    }

    init() {
        this.updateDisplay();
        this.loadNextTask();
    }    updateDisplay() {
        const currentLevel = this.userData.currentLevel || 1;
        const levels = this.getLevelsConfig();
        const currentLevelConfig = levels[currentLevel];
        const progress = this.userData.levelProgress[currentLevel] || { deposited: 0, tasksCompleted: 0, earned: 0 };
        
        document.getElementById('balance-display').textContent = this.formatCurrency(this.userData.balance || 0);
        
        // Use global tasks completed to match homepage and profile pages
        const globalTasksCompleted = this.userData.tasksCompleted || 0;
        document.getElementById('tasks-completed').textContent = globalTasksCompleted;
        
        // For remaining tasks, calculate based on what the user sees as "completed"
        // If they see 12 completed, then remaining should be 20 - 12 = 8 (if 12 <= 20)
        // But if global tasks exceed daily limit, show 0 remaining
        const effectiveCompleted = Math.min(globalTasksCompleted, currentLevelConfig.dailyTasks);
        const tasksRemaining = Math.max(0, currentLevelConfig.dailyTasks - effectiveCompleted);
        
        document.getElementById('tasks-remaining').textContent = tasksRemaining;
        document.getElementById('earned-today').textContent = this.formatCurrency(progress.earned || 0);
        document.getElementById('commission-rate').textContent = `${currentLevelConfig.commissionRate}%`;
        
        // Progress bar should be based on what the user sees
        const progressPercent = Math.min((effectiveCompleted / currentLevelConfig.dailyTasks) * 100, 100);
        document.getElementById('daily-progress').style.width = `${progressPercent}%`;
        document.getElementById('progress-text').textContent = `${progressPercent.toFixed(1)}% Complete`;
    }

    // Utility: Format number as accounting currency
    formatCurrency(value, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2
        }).format(value);
    }

    generateRandomTask() {
        // Since all transactions now use USD as sender, we just pick a random receiver currency
        const availablePairs = this.currencyPairs;
        const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
        
        // Get current user level to determine amount range
        const currentLevel = this.userData.currentLevel || 1;
        
        // Define amount ranges per level
        const levelAmountRanges = {
            1: { min: 10, max: 50 },       // Level 1: $10-$50
            2: { min: 30, max: 90 },       // Level 2: $30-$90 (mostly middle)
            3: { min: 50, max: 120 },      // Level 3: $50-$120 (mostly middle)
            4: { min: 50, max: 100 },      // Level 4: $50-$100 (mostly middle)
            5: { min: 50, max: 100 }       // Level 5: $50-$100 (mostly middle)
        };
        
        const range = levelAmountRanges[currentLevel] || levelAmountRanges[1];
        
        // Generate random amount within the level's range
        // For levels 2-5, bias towards middle amounts (75% chance of middle range)
        let amount;
        if (currentLevel === 1) {
            // Level 1: completely random between min-max
            amount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        } else {
            // Levels 2-5: bias towards middle amounts
            if (Math.random() < 0.75) {
                // 75% chance: middle range (25%-75% of the full range)
                const middleMin = range.min + Math.floor((range.max - range.min) * 0.25);
                const middleMax = range.min + Math.floor((range.max - range.min) * 0.75);
                amount = Math.floor(Math.random() * (middleMax - middleMin + 1)) + middleMin;
            } else {
                // 25% chance: full range (including extremes)
                amount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }

        // Eurozone countries and name pools
        const euroCountries = [
            { code: 'FR', country: 'France', names: ['Jean Dupont', 'Marie Dubois', 'Pierre Martin', 'Sophie Bernard', 'Luc Moreau'] },
            { code: 'DE', country: 'Germany', names: ['Hans Müller', 'Anna Schmidt', 'Peter Schneider', 'Julia Fischer', 'Thomas Weber'] },
            { code: 'ES', country: 'Spain', names: ['Juan García', 'María Rodríguez', 'Antonio Fernández', 'Carmen López', 'José Martínez'] },
            { code: 'IT', country: 'Italy', names: ['Luca Rossi', 'Giulia Bianchi', 'Marco Romano', 'Francesca Greco', 'Alessandro Conti'] },
            { code: 'NL', country: 'Netherlands', names: ['Jan de Vries', 'Sanne Jansen', 'Pieter Bakker', 'Emma Visser', 'Tom Smit'] },
            { code: 'BE', country: 'Belgium', names: ['Jean Peeters', 'Marie Dubois', 'Luc Janssens', 'Sophie Lambert', 'Marc Willems'] },
            { code: 'PT', country: 'Portugal', names: ['João Silva', 'Maria Fernandes', 'Pedro Costa', 'Ana Sousa', 'Luis Martins'] },
            { code: 'IE', country: 'Ireland', names: ['Liam O’Connor', 'Aoife Murphy', 'Sean Walsh', 'Emma Byrne', 'Conor Kelly'] },
            { code: 'FI', country: 'Finland', names: ['Mikko Virtanen', 'Anna Korhonen', 'Jari Nieminen', 'Laura Mäkinen', 'Juha Heikkinen'] },
            { code: 'AT', country: 'Austria', names: ['Lukas Gruber', 'Anna Bauer', 'Florian Wagner', 'Julia Mayer', 'David Steiner'] },
            { code: 'GR', country: 'Greece', names: ['Giorgos Papadopoulos', 'Maria Ioannou', 'Nikos Georgiou', 'Eleni Pappas', 'Dimitris Nikolaou'] },
            { code: 'SK', country: 'Slovakia', names: ['Martin Novak', 'Katarina Horvathova', 'Peter Varga', 'Jana Kováčová', 'Marek Tóth'] },
            { code: 'SI', country: 'Slovenia', names: ['Matej Novak', 'Ana Kovač', 'Luka Zupančič', 'Nina Horvat', 'Tina Kralj'] },
            { code: 'EE', country: 'Estonia', names: ['Kristjan Tamm', 'Liis Saar', 'Martin Mägi', 'Katrin Kask', 'Jaanus Oja'] },
            { code: 'LV', country: 'Latvia', names: ['Janis Ozols', 'Liga Berzina', 'Andris Kalnins', 'Ilze Jansone', 'Edgars Liepins'] },
            { code: 'LT', country: 'Lithuania', names: ['Tomas Petrauskas', 'Asta Jankauskiene', 'Mantas Kazlauskas', 'Rasa Vaitkiene', 'Darius Zukauskas'] }
        ];

        // Name pools by country/currency
        const namePools = {
            'VND': { country: 'Vietnam', names: [
                'Nguyen Van An', 'Tran Thi Hoa', 'Le Quang Hieu', 'Pham Minh Chau', 'Vo Thi Mai',
                'Nguyen Thi Lan', 'Bui Van Nam', 'Phuong Linh', 'Huy Hoang', 'Duc Anh',
                'Bao Chau', 'Quoc Toan', 'Minh Tu', 'Nguyen Tuan Anh', 'Tran Quoc Bao',
                'Le Thi Bich', 'Pham Van Cuong', 'Doan Thi Dao', 'Hoang Van Duy', 'Nguyen Thi Giang',
                'Tran Van Hai', 'Le Thi Hong', 'Pham Van Hung', 'Nguyen Thi Huong', 'Tran Van Khoa',
                'Le Thi Mai', 'Pham Van Minh', 'Nguyen Thi Nga', 'Tran Van Nam', 'Le Thi Phuong',
                'Pham Van Quang', 'Nguyen Thi Quyen', 'Tran Van Son', 'Le Thi Thanh', 'Pham Van Thao',
                'Nguyen Thi Thu', 'Tran Van Tien', 'Le Thi Trang', 'Pham Van Tuan', 'Nguyen Thi Xuan',
            ] },
            'THB': { country: 'Thailand', names: [
                'Somchai Jaidee', 'Kanya Phan', 'Somsak Prasert', 'Somsri Suksan', 'Anong Chaiyaporn',
                'Niran Boonmee', 'Pimchanok Lertsakul', 'Suda Chaiyaporn', 'Wichai Srisuk', 'Malee Srisuk',
                'Chaiya Boonmee', 'Nattapong Jaidee', 'Sirilak Suksan', 'Prapaporn Lertsakul', 'Sompong Prasert',
                'Kittisak Jaidee', 'Suwanna Boonmee', 'Nattaya Srisuk',
            ] },
            'IDR': { country: 'Indonesia', names: [
                'Siti Nurhaliza', 'Putri Ayu', 'Dewi Sartika', 'Wira Saputra', 'Budi Santoso',
                'Agus Salim', 'Sri Rahayu', 'Dewi Lestari', 'Rizky Pratama', 'Yuni Astuti',
                'Andi Wijaya', 'Fitriani Putri', 'Hendra Gunawan', 'Ratna Sari', 'Dian Puspita',
                'Eka Saputra', 'Indah Permata', 'Fajar Nugroho', 'Lestari Dewi',
            ] },
            'MYR': { country: 'Malaysia', names: [
                'Siti Aminah', 'Ahmad Faizal', 'Nurul Izzah', 'Mohd Hafiz', 'Aisyah Rahman',
                'Faridah Binti', 'Zulkifli Bin', 'Rosmah Mansor', 'Syafiqah Binti', 'Azman Bin',
                'Nadia Binti', 'Hafizah Binti', 'Shahrul Bin', 'Aminah Binti', 'Hakim Bin',
            ] },
            'PHP': { country: 'Philippines', names: [
                'Jose Santos', 'Maria Clara', 'Juan Dela Cruz', 'Ana Reyes', 'Pedro Ramos',
                'Luzviminda Cruz', 'Antonio Garcia', 'Carmela Santos', 'Ramon Bautista', 'Isabel Flores',
                'Miguel Torres', 'Angelica Cruz', 'Roberto Reyes', 'Cynthia Ramos', 'Fernando Garcia',
            ] },
            'SGD': { country: 'Singapore', names: [
                'Lee Wei Ming', 'Tan Hui Ling', 'Lim Jun Jie', 'Ong Siew Ling', 'Chong Wei',
                'Ng Chee Meng', 'Goh Chok Tong', 'Teo Chee Hean', 'Chan Chun Sing', 'Heng Swee Keat',
                'Ho Ching', 'Sim Ann', 'Grace Fu', 'Desmond Lee', 'Josephine Teo',
                'Wong Kan Seng', 'Vivian Balakrishnan', 'Shanmugam', 'Pritam Singh', 'Sylvia Lim',
            ] },
            'CNY': { country: 'China', names: [
                'Wang Wei', 'Li Jie', 'Zhang Wei', 'Liu Yang', 'Chen Jie',
                'Yang Li', 'Huang Lei', 'Zhao Ming', 'Wu Jing', 'Zhou Qiang',
                'Xu Hui', 'Sun Li', 'Ma Jun', 'Zhu Lin', 'Hu Wei',
            ] },
            'JPY': { country: 'Japan', names: [
                'Yuki Tanaka', 'Haruto Sato', 'Sakura Yamamoto', 'Sota Suzuki', 'Yui Kobayashi',
                'Kaito Watanabe', 'Hinata Takahashi', 'Riko Ito', 'Ren Nakamura', 'Aoi Kondo',
            ] },
            'KRW': { country: 'South Korea', names: [
                'Kim Min-jun', 'Lee Ji-eun', 'Park Ji-hoon', 'Choi Soo-min', 'Jung Woo-sung',
                'Kang Min-kyu', 'Yoon Ji-hye', 'Lim Ji-yeon', 'Shin Hye-sun', 'Han Ji-min',
            ] },
            'INR': { country: 'India', names: [
                'Amit Sharma', 'Priya Singh', 'Rahul Verma', 'Sneha Patel', 'Vikram Gupta',
                'Anjali Mehta', 'Rohit Kumar', 'Pooja Rani', 'Suresh Nair', 'Neha Joshi',
            ] },
            'EUR': { country: 'European Union', names: [
                'John Smith', 'Maria Garcia', 'David Wilson', 'Lisa Chen', 'Emma Thompson',
                'James Miller', 'Anna Kowalski', 'Carlos Rodriguez', 'Sofia Rossi', 'Liam O’Connor',
                'Chloe Dubois', 'Lucas Müller', 'Olga Ivanova', 'Mateo Silva', 'Ava Brown',
            ] },
            'GBP': { country: 'United Kingdom', names: [
                'Oliver Smith', 'Amelia Jones', 'Harry Williams', 'Emily Taylor', 'Jack Brown',
                'Isabella Davies', 'Charlie Wilson', 'Sophie Evans', 'Thomas Johnson', 'Jessica Robinson',
            ] },
            'USD': { country: 'United States', names: [
                'James Johnson', 'Mary Smith', 'Robert Williams', 'Patricia Brown', 'John Jones',
                'Jennifer Garcia', 'Michael Miller', 'Linda Davis', 'William Rodriguez', 'Elizabeth Martinez',
                'David Anderson', 'Susan Wilson', 'Richard Moore', 'Jessica Taylor', 'Joseph Thomas',
                'Sarah Jackson', 'Christopher White', 'Lisa Harris', 'Matthew Martin', 'Nancy Thompson',
            ] },
            'HKD': { country: 'Hong Kong', names: [
                'Wong Ka Ming', 'Chan Wai Ling', 'Li Chun Hei', 'Cheung Mei Ling', 'Lau Wing Hang',
                'Tam Siu Fung', 'Ng Ka Yi', 'Leung Wai Man', 'Ho Ching Yin', 'Tsang Ming Kit',
            ] },
            'TWD': { country: 'Taiwan', names: [
                'Chen Wei Ming', 'Lin Mei Hua', 'Wang Chih Hao', 'Liu Ya Ting', 'Zhang Jun Hong',
                'Yang Shu Fen', 'Huang Ming Jie', 'Wu Xiao Yu', 'Xu Li Fen', 'Zheng Da Wei',
            ] },
            'AUD': { country: 'Australia', names: [
                'James Anderson', 'Sarah Thompson', 'Michael Smith', 'Emma Wilson', 'William Brown',
                'Olivia Johnson', 'Daniel Davis', 'Sophia Miller', 'Matthew Taylor', 'Isabella Garcia',
            ] },
            'CAD': { country: 'Canada', names: [
                'John MacDonald', 'Emily Smith', 'Michael Johnson', 'Sarah Wilson', 'David Brown',
                'Jessica Davis', 'Ryan Miller', 'Ashley Garcia', 'Kevin Martinez', 'Amanda Lopez',
            ] },
            'NZD': { country: 'New Zealand', names: [
                'James Wilson', 'Sarah Smith', 'Michael Brown', 'Emma Johnson', 'David Taylor',
                'Sophie Davis', 'Ryan Miller', 'Olivia Anderson', 'Matthew Wilson', 'Jessica Thomas',
            ] },
            'CHF': { country: 'Switzerland', names: [
                'Hans Müller', 'Anna Fischer', 'Peter Weber', 'Maria Schmid', 'Thomas Meyer',
                'Sarah Keller', 'Michael Huber', 'Julia Brunner', 'Daniel Steiner', 'Lisa Zimmermann',
            ] },
            'NOK': { country: 'Norway', names: [
                'Erik Hansen', 'Anna Johansen', 'Lars Andersen', 'Maria Nilsen', 'Per Larsen',
                'Ingrid Olsen', 'Tor Pedersen', 'Kari Kristiansen', 'Ole Mortensen', 'Lise Berg',
            ] },
            'SEK': { country: 'Sweden', names: [
                'Erik Andersson', 'Anna Johansson', 'Lars Karlsson', 'Maria Nilsson', 'Per Eriksson',
                'Ingrid Larsson', 'Johan Olsson', 'Karin Persson', 'Mikael Svensson', 'Lena Gustafsson',
            ] },
            'BRL': { country: 'Brazil', names: [
                'João Silva', 'Maria Santos', 'José Oliveira', 'Ana Costa', 'Carlos Souza',
                'Fernanda Lima', 'Paulo Ferreira', 'Juliana Rodrigues', 'Antonio Almeida', 'Camila Barbosa',
            ] },
            'MXN': { country: 'Mexico', names: [
                'José García', 'María Rodríguez', 'Juan Martínez', 'Ana López', 'Carlos González',
                'Fernanda Hernández', 'Luis Pérez', 'Sofia Sánchez', 'Miguel Ramírez', 'Daniela Torres',
            ] },
            'ZAR': { country: 'South Africa', names: [
                'John Smith', 'Sarah van der Merwe', 'David Botha', 'Lisa Pretorius', 'Michael Nel',
                'Emma Kruger', 'James Steyn', 'Sophie du Plessis', 'Ryan Fourie', 'Jessica Venter',
            ] },
            'TRY': { country: 'Turkey', names: [
                'Mehmet Yılmaz', 'Ayşe Kaya', 'Ali Demir', 'Fatma Şahin', 'Ahmet Çelik',
                'Zeynep Öztürk', 'Mustafa Arslan', 'Elif Doğan', 'Hüseyin Koç', 'Merve Aydın',
            ] },
            // ...existing code...
            'IDR': { country: 'Indonesia', names: [
                'Siti Nurhaliza', 'Putri Ayu', 'Dewi Sartika', 'Wira Saputra', 'Budi Santoso',
                'Agus Salim', 'Sri Rahayu', 'Dewi Lestari', 'Rizky Pratama', 'Yuni Astuti',
                'Andi Wijaya', 'Fitriani Putri', 'Hendra Gunawan', 'Ratna Sari', 'Dian Puspita',
                'Eka Saputra', 'Indah Permata', 'Fajar Nugroho', 'Lestari Dewi',
            ] },
            // ...add more as needed for all supported currencies...
        };

        function pickName(currency) {
            const pool = namePools[currency];
            if (pool && pool.names.length > 0) {
                return pool.names[Math.floor(Math.random() * pool.names.length)];
            }
            // fallback: generic name
            return 'Alex Smith';
        }

        function pickNameAndCountry(currency) {
            if (currency === 'EUR') {
                // Pick a random eurozone country
                const euro = euroCountries[Math.floor(Math.random() * euroCountries.length)];
                return {
                    name: euro.names[Math.floor(Math.random() * euro.names.length)],
                    country: euro.country
                };
            }
            const pool = namePools[currency];
            if (pool && pool.names.length > 0) {
                return {
                    name: pool.names[Math.floor(Math.random() * pool.names.length)],
                    country: pool.country
                };
            }
            return { name: 'Alex Smith', country: 'Unknown' };
        }

        const sender = pickNameAndCountry('USD'); // Always use USD sender
        let receiver;
        do {
            receiver = pickNameAndCountry(pair.to); // Receiver based on target currency
        } while (receiver.name === sender.name && receiver.country === sender.country);

        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            customerName: sender.name,
            receiverName: receiver.name,
            fromCurrency: 'USD', // Always USD
            toCurrency: pair.to,
            fromFlag: pair.fromFlag,
            toFlag: pair.toFlag,
            amount: amount,
            convertedAmount: (amount * pair.rate).toFixed(2),
            rate: pair.rate,
            senderCountry: sender.country,
            receiverCountry: receiver.country,
            timestamp: new Date().toISOString(),
            urgency: Math.random() > 0.7 ? 'high' : 'normal'
        };
    }    loadNextTask() {
        const currentLevel = this.userData.currentLevel || 1;
        const levels = this.getLevelsConfig();
        const currentLevelConfig = levels[currentLevel];
        const globalTasksCompleted = this.userData.tasksCompleted || 0;
        
        // Check if daily tasks are completed based on what the user sees (global tasks)
        if (globalTasksCompleted >= currentLevelConfig.dailyTasks) {
            this.showCompletionMessage();
            return;
        }

        this.currentTask = this.generateRandomTask();
        this.renderCurrentTask();
    }renderCurrentTask() {
        const task = this.currentTask;
        const urgencyClass = task.urgency === 'high' ? 'border-red-500/50 bg-red-900/10' : 'border-blue-500/30 bg-blue-900/10';
        const urgencyIcon = task.urgency === 'high' ? 'fas fa-exclamation-circle text-red-400' : 'fas fa-clock text-blue-400';
        const currentLevel = this.userData.currentLevel || 1;
        const minDeposit = this.getLevelsConfig()[currentLevel].minDeposit;
        const progress = this.userData.levelProgress[currentLevel] || { deposited: 0, tasksCompleted: 0, earned: 0 };
        const hasSufficientDeposit = (progress.deposited || 0) >= minDeposit;
          // Check if daily tasks are completed based on global tasks (what user sees)
        const levels = this.getLevelsConfig();
        const currentLevelConfig = levels[currentLevel];
        const globalTasksCompleted = this.userData.tasksCompleted || 0;
        const dailyTasksCompleted = globalTasksCompleted >= currentLevelConfig.dailyTasks;

        document.getElementById('current-task').innerHTML = `
            <div id="task-fade" style="opacity:0; transition: opacity 0.7s;">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Transfer Order #${task.id}</h3>
                    <div class="flex items-center ${task.urgency === 'high' ? 'text-red-400' : 'text-blue-400'}">
                        <i class="${urgencyIcon} mr-2"></i>
                        <span class="text-sm font-semibold">${task.urgency === 'high' ? 'HIGH PRIORITY' : 'NORMAL'}</span>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Sender Info -->
                    <div class="bg-gray-800/30 rounded-lg p-4">
                        <h4 class="font-semibold mb-3 text-green-400">Sender Information</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-300">Name:</span>
                                <span class="font-semibold">${task.customerName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Amount:</span>
                                <span class="font-semibold">${task.fromFlag} ${this.formatCurrency(task.amount, task.fromCurrency)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Country:</span>
                                <span class="font-semibold">${task.fromFlag} ${this.getCountryName(task.fromCurrency)}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Receiver Info -->
                    <div class="bg-gray-800/30 rounded-lg p-4">
                        <h4 class="font-semibold mb-3 text-blue-400">Receiver Information</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-300">Name:</span>
                                <span class="font-semibold">${task.receiverName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Receives:</span>
                                <span class="font-semibold">${this.getCurrencySymbol(task.toCurrency)} ${this.formatCurrency(task.convertedAmount, task.toCurrency).replace(/[^\d.,]+/, '')}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Country:</span>
                                <span class="font-semibold">${this.getCountryName(task.toCurrency)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Exchange Rate -->
                <div class="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Exchange Rate:</span>
                        <span class="text-xl font-bold text-purple-400">1 ${task.fromCurrency} = ${this.formatCurrency(task.rate, task.toCurrency).replace(/[^\d.,]+/, '')} ${task.toCurrency}</span>
                    </div>
                </div>                <!-- Commission Preview -->
                <div class="mt-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Your Commission (${this.getLevelsConfig()[this.userData.currentLevel].commissionRate}%):</span>
                        <span class="text-xl font-bold text-green-400">${this.formatCurrency(this.calculateCommissionInUSD(task), 'USD')}</span>
                    </div>
                </div>
                <!-- Action Button -->
                <div class="mt-6 flex space-x-4">
                    <button 
                        id="complete-transfer-btn"
                        class="btn-primary flex-1 py-3"
                        ${(!hasSufficientDeposit || dailyTasksCompleted) ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}
                    >
                        <span id="complete-transfer-btn-text">
                            <i class="fas fa-check mr-2"></i>
                            ${dailyTasksCompleted ? 'Tasks Completed for Today' : (!hasSufficientDeposit ? 'Insufficient Deposit' : 'Complete Transfer')}
                        </span>
                    </button>
                </div>
                <!-- Confirmation Modal -->
                <div id="confirm-modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
                    <div class="bg-gray-900 rounded-lg p-8 max-w-sm w-full text-center">
                        <h3 class="text-xl font-bold mb-4">Confirm Transfer</h3>
                        <p class="mb-6">Are you sure you want to complete this transfer?<br><span class='text-green-400 font-bold'>${task.fromFlag} ${this.formatCurrency(task.amount, task.fromCurrency)}</span> → <span class='text-blue-400 font-bold'>${task.toFlag} ${this.formatCurrency(task.convertedAmount, task.toCurrency)}</span></p>
                        <div class="flex justify-center gap-4">
                            <button id="confirm-transfer-btn" class="btn-primary">Yes, Complete</button>
                            <button id="cancel-transfer-btn" class="btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
                <!-- Loading Modal -->
                <div id="loading-modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
                    <div class="bg-gray-900 rounded-lg p-8 max-w-xs w-full text-center flex flex-col items-center">
                        <i class="fas fa-spinner fa-spin text-3xl text-green-400 mb-4"></i>
                        <div class="text-lg font-semibold text-green-300 mb-2">Verifying transfer...</div>
                        <div class="text-gray-400 text-sm">Please wait while we verify your transaction.</div>
                    </div>
                </div>
                <!-- Timer -->
                <div class="mt-4 text-center">
                    <div class="text-sm text-gray-400">Task expires in: <span id="task-timer" class="text-yellow-400 font-bold">03:00</span></div>
                </div>
            </div>
        `;

        // Fade in effect
        setTimeout(() => {
            const fadeDiv = document.getElementById('task-fade');
            if (fadeDiv) fadeDiv.style.opacity = 1;
        }, 30);

        // Add event listeners for confirmation and loading modal
        setTimeout(() => {
            const completeBtn = document.getElementById('complete-transfer-btn');
            const confirmModal = document.getElementById('confirm-modal');
            const confirmBtn = document.getElementById('confirm-transfer-btn');
            const cancelBtn = document.getElementById('cancel-transfer-btn');
            const loadingModal = document.getElementById('loading-modal');
            
            if (completeBtn) {
                completeBtn.onclick = (e) => {
                    if (completeBtn.disabled) {
                        // Show different alerts based on the reason it's disabled
                        if (dailyTasksCompleted) {
                            alert(`🎉 Congratulations! You have already completed all ${currentLevelConfig.dailyTasks} tasks for today at Level ${currentLevel} (${currentLevelConfig.name}).\n\nCome back tomorrow for more tasks!`);
                        } else if (!hasSufficientDeposit) {
                            alert(`⚠️ Insufficient deposit! You need to deposit at least $${currentLevelConfig.minDeposit} to complete tasks at Level ${currentLevel} (${currentLevelConfig.name}).`);
                        }
                        return;
                    }
                    confirmModal.classList.remove('hidden');
                };
            }
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    confirmModal.classList.add('hidden');
                };
            }
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    confirmModal.classList.add('hidden');
                    // Show loading modal for 4 seconds
                    loadingModal.classList.remove('hidden');
                    setTimeout(() => {
                        loadingModal.classList.add('hidden');
                        this.completeTask();
                    }, 4000);
                };
            }
        }, 0);

        this.startTaskTimer();
    }

    // Calculate commission in USD (simplified since all sender amounts are now USD)
    calculateCommissionInUSD(task) {
        const commissionRate = this.getLevelsConfig()[this.userData.currentLevel].commissionRate / 100;
        // Since all task amounts are now in USD, we can calculate directly
        return task.amount * commissionRate;
    }
    
    // Convert any currency amount to USD
    convertToUSD(amount, fromCurrency) {
        // Exchange rates to USD (approximate rates)
        const usdRates = {
            'USD': 1,
            'EUR': 1.08,
            'GBP': 1.26,
            'VND': 0.000041,
            'PHP': 0.018,
            'IDR': 0.000064,
            'THB': 0.028,
            'MYR': 0.21,
            'AUD': 0.66,
            'CAD': 0.74,
            'SGD': 0.74,
            'HKD': 0.13,
            'JPY': 0.0067,
            'KRW': 0.00074,
            'INR': 0.012,
            'BDT': 0.0091,
            'LKR': 0.0031,
            'CNY': 0.14
        };
        
        const rate = usdRates[fromCurrency] || 1;
        return amount * rate;
    }    completeTask() {
        if (!this.currentTask) return;
        const currentLevel = this.userData.currentLevel || 1;
        const levels = this.getLevelsConfig();
        const currentLevelConfig = levels[currentLevel];
        const globalTasksCompleted = this.userData.tasksCompleted || 0;
        
        // Double-check if daily tasks are already completed based on global tasks
        if (globalTasksCompleted >= currentLevelConfig.dailyTasks) {
            alert(`🎉 You have already completed all ${currentLevelConfig.dailyTasks} tasks for today at Level ${currentLevel} (${currentLevelConfig.name})!\n\nCome back tomorrow for more tasks!`);
            this.showCompletionMessage();
            return;
        }

        // Calculate commission in USD
        const commissionUSD = this.calculateCommissionInUSD(this.currentTask);
        
        // Check if this completion will finish all tasks for the level (before incrementing)
        const willCompleteAllTasks = (globalTasksCompleted + 1) >= currentLevelConfig.dailyTasks;
        
        console.log('Debug completion check:', {
            globalTasksCompleted,
            currentLevel,
            dailyTasksRequired: currentLevelConfig.dailyTasks,
            nextTaskCount: globalTasksCompleted + 1,
            willCompleteAllTasks
        });
        
        // Update user data
        this.userData.balance += commissionUSD;
        this.userData.totalEarned += commissionUSD;
        this.userData.tasksCompleted++;
        this.userData.levelProgress[this.userData.currentLevel].tasksCompleted++;
        this.userData.levelProgress[this.userData.currentLevel].earned += commissionUSD;
        // Update display immediately so UI reflects new count before modal
        this.updateDisplay();
        // Add to completed tasks (both in memory and saved data)
        const completedTask = {
            ...this.currentTask,
            commission: commissionUSD,
            completedAt: new Date().toISOString()
        };
        
        this.completedTasks.unshift(completedTask);
        
        // Save completed tasks to userData for history page access
        if (!this.userData.completedTasks) {
            this.userData.completedTasks = [];
        }
        this.userData.completedTasks.unshift(completedTask);
        
        // Keep only last 100 completed tasks to prevent storage bloat
        if (this.userData.completedTasks.length > 100) {
            this.userData.completedTasks.splice(100);
        }
        
        this.saveUserData();
        this.addToTaskHistory(this.currentTask, commissionUSD);
        this.showCompletionModal(this.currentTask.amount, commissionUSD, willCompleteAllTasks);
        // Removed window.location.reload() from here
    }showCompletionModal(amount, commission, allTasksCompleted = false) {
        console.log('showCompletionModal called with allTasksCompleted:', allTasksCompleted);
        
        // Update modal values if present
        const transferAmountEl = document.getElementById('transfer-amount');
        const commissionEarnedEl = document.getElementById('commission-earned');
        if (transferAmountEl) transferAmountEl.textContent = this.formatCurrency(amount);
        if (commissionEarnedEl) commissionEarnedEl.textContent = this.formatCurrency(commission, 'USD');
        
        // Show/hide withdraw button based on whether all tasks are completed
        const withdrawBtn = document.getElementById('withdraw-btn');
        const continueBtn = document.querySelector('#completion-modal button[onclick="loadNextTask()"]');
        
        console.log('Withdraw button found:', withdrawBtn);
        console.log('Continue button found:', continueBtn);
        
        if (withdrawBtn) {
            if (allTasksCompleted) {
                console.log('Setting withdraw button to SHOW');
                withdrawBtn.style.display = 'block';
            } else {
                console.log('Setting withdraw button to HIDE');
                withdrawBtn.style.display = 'none';
                // Also try setting visibility hidden as backup
                withdrawBtn.style.visibility = 'hidden';
            }
        } else {
            console.log('Withdraw button NOT found!');
        }
        
        // Update continue button text and behavior
        if (continueBtn) {
            if (allTasksCompleted) {
                continueBtn.textContent = 'Return to Dashboard';
                continueBtn.setAttribute('onclick', "goToPage('dashboard.html')");
            } else {
                continueBtn.textContent = 'Continue to Next Task';
                continueBtn.setAttribute('onclick', 'loadNextTask()');
            }
        }
        
        // Show the completion modal (no overlay, no reload)
        const completionModalEl = document.getElementById('completion-modal');
        if (completionModalEl) completionModalEl.classList.remove('hidden');
    }

    skipTask() {
        this.loadNextTask();
    }

    expireTask() {
        alert('Task expired! Loading new task...');
        this.loadNextTask();
    }

    addToTaskHistory(task, commission) {
        const historyContainer = document.getElementById('task-history');
        if (!historyContainer) return; // Prevent error if not present
        // Ensure the completed tasks section is visible
        const completedSection = document.getElementById('completed-tasks-section');
        if (completedSection) completedSection.classList.remove('hidden');
        // Remove any 'no tasks' message
        const noTasksMsg = document.getElementById('no-tasks-msg');
        if (noTasksMsg) noTasksMsg.remove();

        const taskElement = document.createElement('div');
        taskElement.className = 'glass-card bg-green-900/20 backdrop-blur-md rounded-lg p-4 border border-green-500/30 fade-in';
        taskElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-semibold">${task.fromFlag}${task.toFlag} ${task.fromCurrency}→${task.toCurrency}</div>
                    <div class="text-sm text-gray-300">${task.customerName} → ${task.receiverName}</div>
                    <div class="text-sm text-gray-400">${new Date(task.timestamp).toLocaleTimeString()}</div>
                </div>                <div class="text-right">
                    <div class="text-lg font-bold text-green-400">+${this.formatCurrency(commission, 'USD')}</div>
                    <div class="text-sm text-gray-300">${this.formatCurrency(task.amount, task.fromCurrency)}</div>
                </div>
            </div>
        `;
        historyContainer.insertBefore(taskElement, historyContainer.firstChild);
        // Scroll new task into view
        setTimeout(() => { taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }

    showCompletionMessage() {
        document.getElementById('current-task').innerHTML = `
            <div class="text-center py-12">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-trophy text-white text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold mb-4">Congratulations!</h3>
                <p class="text-gray-300 mb-6">You have completed all tasks for today!</p>
                <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-500/30">
                    <div class="text-xl font-bold text-green-400 mb-2">
                        Today's Earnings: $${this.userData.levelProgress[this.userData.currentLevel].earned.toFixed(2)}
                    </div>
                    <div class="text-gray-300">
                        Tasks Completed: ${this.userData.tasksCompleted || 0}
                    </div>
                </div>
                <button id="withdraw-btn" class="btn-primary w-full bg-gradient-to-r from-purple-600 to-blue-600 mt-6 mb-2">Withdraw Earnings</button>
                <button onclick="goToPage('dashboard.html')" class="btn-primary">
                    <i class="fas fa-home mr-2"></i>
                    Return to Dashboard
                </button>
            </div>
        `;

        // After rendering, re-attach withdrawal logic
        setTimeout(() => {
            const withdrawBtn = document.getElementById('withdraw-btn');
            if (withdrawBtn) {
                withdrawBtn.addEventListener('click', () => {
                    const withdrawalModal = document.getElementById('withdrawal-modal');
                    const withdrawalForm = document.getElementById('withdrawal-form');
                    const withdrawDetails = document.getElementById('withdraw-details');
                    const withdrawSuccess = document.getElementById('withdraw-success');
                    withdrawalModal.classList.remove('hidden');
                    withdrawSuccess.classList.add('hidden');
                    withdrawalForm.reset();
                    withdrawDetails.innerHTML = '';
                });
            }
        }, 0);
    }

    // Helper: Get full country name by currency code
    getCountryName(currencyCode) {
        const map = {
            'USD': 'United States',
            'VND': 'Vietnam',
            'PHP': 'Philippines',
            'IDR': 'Indonesia',
            'THB': 'Thailand',
            'MYR': 'Malaysia',
            'EUR': 'European Union',
            'GBP': 'United Kingdom',
            'CHF': 'Switzerland',
            'SEK': 'Sweden',
            'NOK': 'Norway',
            'DKK': 'Denmark',
            'PLN': 'Poland',
            'CZK': 'Czech Republic',
            'HUF': 'Hungary',
            'RON': 'Romania',
            'BGN': 'Bulgaria',
            'HRK': 'Croatia',
            'ISK': 'Iceland',
            'JPY': 'Japan',
            'KRW': 'South Korea',
            'INR': 'India',
            'CNY': 'China',
            'SGD': 'Singapore',
            'HKD': 'Hong Kong',
            'TWD': 'Taiwan',
            'AUD': 'Australia',
            'CAD': 'Canada',
            'NZD': 'New Zealand',
            'BRL': 'Brazil',
            'MXN': 'Mexico',
            'ZAR': 'South Africa',
            'TRY': 'Turkey',
            'RUB': 'Russia',
            'EGP': 'Egypt',
            'SAR': 'Saudi Arabia',
            'AED': 'United Arab Emirates',
            'ILS': 'Israel',
            'KWD': 'Kuwait',
            'QAR': 'Qatar',
            'OMR': 'Oman',
            'BHD': 'Bahrain',
            'JOD': 'Jordan',
            'PKR': 'Pakistan',
            'BDT': 'Bangladesh',
            'LKR': 'Sri Lanka',
            'NGN': 'Nigeria',
            'KES': 'Kenya',
            'TZS': 'Tanzania',
            'GHS': 'Ghana',
            'UGX': 'Uganda',
            'MAD': 'Morocco',
            'DZD': 'Algeria',
            'TND': 'Tunisia',
            'UAH': 'Ukraine',
            'CLP': 'Chile',
            'COP': 'Colombia',
            'PEN': 'Peru',
            'ARS': 'Argentina',
            'UYU': 'Uruguay',
            'BOB': 'Bolivia',
            'JPY': 'Japan',
            'KRW': 'South Korea',
            'INR': 'India',
            'CNY': 'China',
            'SGD': 'Singapore',
            'HKD': 'Hong Kong',
            'AUD': 'Australia',
            'CAD': 'Canada',
            'BRL': 'Brazil',
            'MXN': 'Mexico',
            'ZAR': 'South Africa',
            'TRY': 'Turkey',
            'RUB': 'Russia',
            'EGP': 'Egypt',
            'SAR': 'Saudi Arabia',
            'AED': 'United Arab Emirates',
            'ILS': 'Israel',
            'KWD': 'Kuwait',
            'QAR': 'Qatar',
            'OMR': 'Oman',
            'BHD': 'Bahrain',
            'JOD': 'Jordan',
            'PKR': 'Pakistan',
            'BDT': 'Bangladesh',
            'LKR': 'Sri Lanka',
            'NGN': 'Nigeria',
            'KES': 'Kenya',
            'TZS': 'Tanzania',
            'GHS': 'Ghana',
            'UGX': 'Uganda',
            'MAD': 'Morocco',
            'DZD': 'Algeria',
            'TND': 'Tunisia',
            'UAH': 'Ukraine',
            'CLP': 'Chile',
            'COP': 'Colombia',
            'PEN': 'Peru',
            'ARS': 'Argentina',
            'UYU': 'Uruguay',
            'BOB': 'Bolivia',
            'PYG': 'Paraguay',
            'VEF': 'Venezuela',
            'DOP': 'Dominican Republic',
            'JMD': 'Jamaica',
            'TTD': 'Trinidad and Tobago',
            'XCD': 'Antigua and Barbuda',
            'BBD': 'Barbados',
            'BSD': 'Bahamas',
            'BZD': 'Belize',
            'GTQ': 'Guatemala',
            'HNL': 'Honduras',
            'NIO': 'Nicaragua',
            'CRC': 'Costa Rica',
            'PAB': 'Panama',
            'BMD': 'Bermuda',
            'FJD': 'Fiji',
            'PGK': 'Papua New Guinea',
            'WST': 'Samoa',
            'TOP': 'Tonga',
            'SBD': 'Solomon Islands',
            'VUV': 'Vanuatu',
            'XPF': 'French Polynesia',
            'MMK': 'Myanmar',
            'KHR': 'Cambodia',
            'LAK': 'Laos',
            'BND': 'Brunei',
            'LYD': 'Libya',
            'SDG': 'Sudan',
            'YER': 'Yemen',
            'SYP': 'Syria',
            'IQD': 'Iraq',
            'LBP': 'Lebanon',
        };
        return map[currencyCode] || currencyCode;
    }

    // Add this helper to get currency symbol by code
    getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$', 'VND': '₫', 'PHP': '₱', 'IDR': 'Rp', 'THB': '฿', 'MYR': 'RM', 'EUR': '€',
            'GBP': '£', 'JPY': '¥', 'KRW': '₩', 'INR': '₹', 'CNY': '¥', 'SGD': 'S$', 'HKD': 'HK$', 'TWD': 'NT$',
            'AUD': 'A$', 'CAD': 'C$', 'NZD': 'NZ$', 'BRL': 'R$', 'MXN': 'Mex$', 'ZAR': 'R', 'TRY': '₺', 'RUB': '₽',
            'PLN': 'zł', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr', 'CHF': 'Fr', 'EGP': 'E£',
            'SAR': '﷼', 'AED': 'د.إ', 'ILS': '₪', 'KWD': 'د.ك', 'QAR': 'ر.ق', 'OMR': 'ر.ع.', 'BHD': 'ب.د',
            'JOD': 'د.ا', 'PKR': '₨', 'BDT': '৳', 'LKR': '₨', 'NGN': '₦', 'KES': 'KSh', 'TZS': 'TSh',
            'GHS': '₵', 'UGX': 'USh', 'MAD': 'د.م.', 'DZD': 'دج', 'TND': 'د.ت', 'UAH': '₴', 'CZK': 'Kč',
            'HUF': 'Ft', 'RON': 'lei', 'BGN': 'лв', 'HRK': 'kn', 'ISK': 'kr', 'CLP': '$', 'COP': '$',
            'PEN': 'S/', 'ARS': '$', 'UYU': '$U', 'BOB': 'Bs.', 'PYG': '₲', 'VEF': 'Bs.', 'DOP': 'RD$',
            'JMD': 'J$', 'TTD': 'TT$', 'XCD': 'EC$', 'BBD': 'Bds$', 'BSD': 'B$', 'BZD': 'BZ$', 'GTQ': 'Q',
            'HNL': 'L', 'NIO': 'C$', 'CRC': '₡', 'PAB': 'B/.', 'BMD': 'BD$', 'FJD': 'FJ$', 'PGK': 'K',
            'WST': 'WS$', 'TOP': 'T$', 'SBD': 'SI$', 'VUV': 'VT', 'XPF': '₣'
        };
        return symbols[currency] || currency;
    }

    startTaskTimer() {
        // Clear any previous timer
        if (this.taskTimerInterval) clearInterval(this.taskTimerInterval);
        let timeLeft = 180; // 3 minutes in seconds
        const timerEl = document.getElementById('task-timer');
        if (timerEl) timerEl.textContent = this.formatTime(timeLeft);
        this.taskTimerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = this.formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(this.taskTimerInterval);
                this.expireTask();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
}

// Utility functions
function goBack() {
    window.location.href = 'dashboard.html';
}

function goToPage(page) {
    window.location.href = page;
}

function loadNextTask() {
    document.getElementById('completion-modal').classList.add('hidden');
    taskManager.loadNextTask();
}

// Returns the full country name for a given currency code
function getCountryName(currencyCode) {
    switch (currencyCode) {
        case 'USD': return 'United States';
        case 'VND': return 'Vietnam';
        case 'PHP': return 'Philippines';
        case 'IDR': return 'Indonesia';
        case 'THB': return 'Thailand';
        case 'MYR': return 'Malaysia';
        case 'EUR': return 'European Union';
        case 'GBP': return 'United Kingdom';
        case 'CHF': return 'Switzerland';
        case 'SEK': return 'Sweden';
        case 'NOK': return 'Norway';
        case 'DKK': return 'Denmark';
        case 'PLN': return 'Poland';
        case 'CZK': return 'Czech Republic';
        case 'HUF': return 'Hungary';
        case 'RON': return 'Romania';
        case 'BGN': return 'Bulgaria';
        case 'HRK': return 'Croatia';
        case 'ISK': return 'Iceland';
        case 'JPY': return 'Japan';
        case 'KRW': return 'South Korea';
        case 'INR': return 'India';
        case 'CNY': return 'China';
        case 'SGD': return 'Singapore';
        case 'HKD': return 'Hong Kong';
        case 'AUD': return 'Australia';
        case 'CAD': return 'Canada';
        case 'BRL': return 'Brazil';
        case 'MXN': return 'Mexico';
        case 'ZAR': return 'South Africa';
        case 'TRY': return 'Turkey';
        case 'RUB': return 'Russia';
        case 'EGP': return 'Egypt';
        case 'SAR': return 'Saudi Arabia';
        case 'AED': return 'United Arab Emirates';
        case 'ILS': return 'Israel';
        case 'KWD': return 'Kuwait';
        case 'QAR': return 'Qatar';
        case 'OMR': return 'Oman';
        case 'BHD': return 'Bahrain';
        case 'JOD': return 'Jordan';
        case 'PKR': return 'Pakistan';
        case 'BDT': return 'Bangladesh';
        case 'LKR': return 'Sri Lanka';
        case 'NGN': return 'Nigeria';
        case 'KES': return 'Kenya';
        case 'TZS': return 'Tanzania';
        case 'GHS': return 'Ghana';
        case 'UGX': return 'Uganda';
        case 'MAD': return 'Morocco';
        case 'DZD': return 'Algeria';
        case 'TND': return 'Tunisia';
        case 'UAH': return 'Ukraine';
        case 'CLP': return 'Chile';
        case 'COP': return 'Colombia';
        case 'PEN': return 'Peru';
        case 'ARS': return 'Argentina';
        case 'UYU': return 'Uruguay';
        case 'BOB': return 'Bolivia';
        case 'PYG': return 'Paraguay';
        case 'VEF': return 'Venezuela';
        case 'DOP': return 'Dominican Republic';
        case 'JMD': return 'Jamaica';
        case 'TTD': return 'Trinidad and Tobago';
        case 'XCD': return 'Antigua and Barbuda';
        case 'BBD': return 'Barbados';
        case 'BSD': return 'Bahamas';
        case 'BZD': return 'Belize';
        case 'GTQ': return 'Guatemala';
        case 'HNL': return 'Honduras';
        case 'NIO': return 'Nicaragua';
        case 'CRC': return 'Costa Rica';
        case 'PAB': return 'Panama';
        case 'BMD': return 'Bermuda';
        case 'FJD': return 'Fiji';
        case 'PGK': return 'Papua New Guinea';
        case 'WST': return 'Samoa';
        case 'TOP': return 'Tonga';
        case 'SBD': return 'Solomon Islands';
        case 'VUV': return 'Vanuatu';
        case 'XPF': return 'French Polynesia';
        case 'MMK': return 'Myanmar';
        case 'KHR': return 'Cambodia';
        case 'LAK': return 'Laos';
        case 'BND': return 'Brunei';
        case 'LYD': return 'Libya';
        case 'SDG': return 'Sudan';
        case 'YER': return 'Yemen';
        case 'SYP': return 'Syria';
        case 'IQD': return 'Iraq';
        case 'LBP': return 'Lebanon';
        default: return currencyCode;
    }
}

// Initialize task manager
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
    window.taskManager = taskManager;
});
