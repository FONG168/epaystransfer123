// ePay Data Synchronization Module
// Include this script in all pages to ensure data consistency

window.ePayDataSync = {
    // Standard localStorage key used across all pages
    STORAGE_KEY: 'epay_agent_data',
    
    // Load user data with consistent structure and validation
    loadUserData() {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                return this.validateAndFixUserData(data);
            } catch (e) {
                console.error('Error parsing saved data, using defaults:', e);
                return this.getDefaultUserData();
            }
        }
        return this.getDefaultUserData();
    },
    
    // Save user data with validation
    saveUserData(userData) {
        try {
            const validatedData = this.validateAndFixUserData(userData);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validatedData));
            console.log('User data saved successfully');
            return true;
        } catch (e) {
            console.error('Error saving user data:', e);
            return false;
        }
    },
    
    // Validate and fix user data structure
    validateAndFixUserData(data) {
        // Ensure basic structure exists
        const validated = {
            balance: Number(data.balance) || 0,
            totalEarned: Number(data.totalEarned) || 0,
            tasksCompleted: Number(data.tasksCompleted) || 0,
            currentLevel: Number(data.currentLevel) || 1,
            levelProgress: data.levelProgress || {},
            lastWithdrawal: data.lastWithdrawal || null,
            canWithdraw: data.canWithdraw !== undefined ? data.canWithdraw : true,
            joinDate: data.joinDate || new Date().toISOString(),
            agentName: data.agentName || 'Agent User',
            transactions: data.transactions || []
        };
        
        // Fix currentLevel if it's 0 or invalid
        if (validated.currentLevel === 0 || validated.currentLevel < 1 || validated.currentLevel > 5) {
            validated.currentLevel = 1;
        }
        
        // Ensure all levels have complete progress objects
        for (let level = 1; level <= 5; level++) {
            if (!validated.levelProgress[level]) {
                validated.levelProgress[level] = { deposited: 0, tasksCompleted: 0, earned: 0 };
            } else {
                validated.levelProgress[level].deposited = Number(validated.levelProgress[level].deposited) || 0;
                validated.levelProgress[level].tasksCompleted = Number(validated.levelProgress[level].tasksCompleted) || 0;
                validated.levelProgress[level].earned = Number(validated.levelProgress[level].earned) || 0;
            }
        }
        
        return validated;
    },
    
    // Get default user data structure
    getDefaultUserData() {
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
            lastWithdrawal: null,
            canWithdraw: true,
            joinDate: new Date().toISOString(),
            agentName: 'Agent User',
            transactions: []
        };
    },
    
    // Sync data across all open tabs/windows
    syncData() {
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.STORAGE_KEY,
            newValue: localStorage.getItem(this.STORAGE_KEY)
        }));
    },
    
    // Add a deposit to user data
    addDeposit(amount, level = null) {
        const userData = this.loadUserData();
        const targetLevel = level || userData.currentLevel;
        
        userData.balance += amount;
        userData.levelProgress[targetLevel].deposited += amount;
        
        return this.saveUserData(userData);
    },
    
    // Complete a task and update data
    completeTask(commission, level = null) {
        const userData = this.loadUserData();
        const targetLevel = level || userData.currentLevel;
        
        userData.balance += commission;
        userData.totalEarned += commission;
        userData.tasksCompleted++;
        userData.levelProgress[targetLevel].tasksCompleted++;
        userData.levelProgress[targetLevel].earned += commission;
        
        return this.saveUserData(userData);
    },
    
    // Debug function to show current data
    debugData() {
        const data = this.loadUserData();
        console.table(data);
        console.log('Level Progress:', data.levelProgress);
        return data;
    },
    
    // Fix corrupted data
    fixData() {
        const data = this.loadUserData();
        const fixed = this.validateAndFixUserData(data);
        this.saveUserData(fixed);
        console.log('Data fixed and saved');
        return fixed;
    }
};

// Auto-fix data on page load
document.addEventListener('DOMContentLoaded', () => {
    window.ePayDataSync.fixData();
    console.log('ePay Data Sync loaded and data validated');
});

// Listen for storage changes to sync across tabs
window.addEventListener('storage', (e) => {
    if (e.key === window.ePayDataSync.STORAGE_KEY && e.newValue) {
        console.log('Data synced from another tab');
        // Trigger page-specific data refresh if function exists
        if (typeof window.refreshData === 'function') {
            window.refreshData();
        }
    }
});
