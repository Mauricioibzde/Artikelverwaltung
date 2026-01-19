export function initTutorial() {
    const modal = document.getElementById('tutorial-modal');
    const helpBtn = document.getElementById('help-btn');
    const closeBtn = document.getElementById('close-tutorial-modal');
    const gotItBtn = document.getElementById('got-it-btn');

    // Key for localStorage
    const TUTORIAL_SEEN_KEY = 'artikelverwaltung_tutorial_seen_v1';

    // Show tutorial automatically if not seen yet
    if (!localStorage.getItem(TUTORIAL_SEEN_KEY)) {
        modal.style.display = 'flex';
    }

    // Open modal on help button click
    helpBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Close logic
    const closeModal = () => {
        modal.style.display = 'none';
        localStorage.setItem(TUTORIAL_SEEN_KEY, 'true'); // Mark as seen
        
        // Force scroll reset to top
        window.scrollTo(0, 0);
    };

    closeBtn.addEventListener('click', closeModal);
    gotItBtn.addEventListener('click', closeModal);
    
    // Close if clicked outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}
