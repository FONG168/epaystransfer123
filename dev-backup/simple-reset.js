// Simple Reset Functionality
// This is a minimal implementation just for the reset data feature

// Global function for reset button
window.resetAllData = function() {
    showResetConfirmationModal();
};

function showResetConfirmationModal() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
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
                        <button onclick="closeResetModal()" class="flex-1 btn-secondary px-4 py-3 text-center font-semibold">
                            Cancel
                        </button>
                        <button onclick="confirmReset()" class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function confirmReset() {
    closeResetModal();
    showResetLoadingModal();
    
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
            performDataReset();
        }
    }, 1000);
}

function showResetLoadingModal() {
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
}

function performDataReset() {
    try {
        // Clear all localStorage data for EPay system
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('epay')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Also clear some common keys
        localStorage.removeItem('epay_data');
        localStorage.removeItem('epay_balance');
        localStorage.removeItem('epay_tasks');
        localStorage.removeItem('epay_history');
        localStorage.removeItem('epay_profile');
        localStorage.removeItem('epay_agent_stats');
        
        showResetSuccessModal();
    } catch (error) {
        console.error('Reset failed:', error);
        showResetErrorModal();
    }
}

function showResetSuccessModal() {
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
                        <button onclick="reloadPage()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                            Continue
                        </button>
                        <button onclick="redirectToLogin()" class="w-full btn-secondary px-4 py-3 font-semibold">
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showResetErrorModal() {
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
                        <button onclick="closeResetModal()" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition font-semibold">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function closeResetModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}

function reloadPage() {
    closeResetModal();
    // Show notification
    alert('Account data has been reset successfully!');
    // Refresh the page to reload with reset data
    window.location.reload();
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple reset functionality loaded');
});
