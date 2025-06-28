// Universal Modal Handler for ePay's Website
// This script handles all modal popups across the website

document.addEventListener('DOMContentLoaded', function() {
    
    // Generic Modal Handler Function
    function createModalHandler(linkSelector, modalId, closeButtonId, closeFooterButtonId) {
        const link = document.querySelector(linkSelector);
        const modal = document.getElementById(modalId);
        const closeButton = document.getElementById(closeButtonId);
        const closeFooterButton = document.getElementById(closeFooterButtonId);

        if (!link || !modal) return;

        // Open modal function
        function openModal(e) {
            e.preventDefault();
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add fade-in animation
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.transition = 'opacity 0.3s ease-in-out';
                modal.style.opacity = '1';
            }, 10);
        }

        // Close modal function
        function closeModal() {
            modal.style.transition = 'opacity 0.3s ease-in-out';
            modal.style.opacity = '0';
            
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        // Event listeners
        link.addEventListener('click', openModal);
        
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }
        
        if (closeFooterButton) {
            closeFooterButton.addEventListener('click', closeModal);
        }

        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Initialize all modal handlers
    createModalHandler('a[href="#careers"]', 'careers-modal', 'close-careers-modal', 'close-careers-modal-footer');
    createModalHandler('a[href="#press"]', 'press-modal', 'close-press-modal', 'close-press-modal-footer');
    createModalHandler('#privacy-policy-link', 'privacy-policy-modal', 'close-privacy-modal', 'close-privacy-modal-footer');
    createModalHandler('#terms-policy-link', 'terms-modal', 'close-terms-modal', 'close-terms-modal-footer');
    createModalHandler('#compliance-policy-link', 'compliance-modal', 'close-compliance-modal', 'close-compliance-modal-footer');
});
