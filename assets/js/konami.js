/**
 * ============================================================================
 * KONAMI CODE EASTER EGG - RETRO TERMINAL MODE
 * ============================================================================
 *
 * Purpose: Implements Konami code easter egg that toggles retro terminal mode
 * Dependencies: DOM manipulation, CSS animations, internationalization
 * Related files:
 * - scss/retro-mode.scss (retro mode styling)
 * - sass/components/_social.scss (retro social effects)
 * - layouts/baseof.html (i18n configuration)
 *
 * Features:
 * - Classic Konami code detection (↑↑↓↓←→←→BA)
 * - Alternative Ctrl+Shift+T shortcut
 * - Matrix-style terminal mode with CRT effects
 * - Typewriter animation for titles
 * - Console ASCII art and welcome message
 * - Internationalization support
 * - Toast notifications
 *
 * Last modified: 2025-07-02
 * ============================================================================
 */

(function() {
  'use strict';

  // ========================================================================
  // CONFIGURATION AND STATE
  // ========================================================================

  /**
   * The classic Konami code sequence
   * ↑↑↓↓←→←→BA
   */
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  /** Stores user input sequence for pattern matching */
  let userInput = [];

  /** Tracks current retro mode state */
  let retroModeActive = false;

  // ========================================================================
  // NOTIFICATION SYSTEM
  // ========================================================================

  /**
   * Displays a terminal-style notification toast
   * @param {string} message - The message to display
   * @param {number} duration - How long to show the notification (ms)
   */
  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'konami-notification';
    notification.innerHTML = `> ${message} <span class="terminal-cursor"></span>`;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);
  }

  // ========================================================================
  // RETRO MODE TOGGLE FUNCTIONALITY
  // ========================================================================

  /**
   * Toggles retro terminal mode on/off with visual effects
   */
  function toggleRetroMode() {
    retroModeActive = !retroModeActive;
    document.body.classList.toggle('retro-mode', retroModeActive);

    if (retroModeActive) {
      activateRetroMode();
    } else {
      deactivateRetroMode();
    }
  }

  /**
   * Activates retro mode with special effects
   */
  function activateRetroMode() {
    // Get author info for personalized message
    const authorName = document.querySelector('.indexHeader')?.textContent || 'user';

    // Get localized message or fallback to English
    const activatedMessage = window.i18n?.retro_mode_activated || 'RETRO_MODE_ACTIVATED // Welcome to the matrix';

    // Show activation notification
    showNotification(`${activatedMessage}, ${authorName}`);

    // Add typewriter effect to main title
    addTypewriterEffect();
  }

  /**
   * Deactivates retro mode and restores normal appearance
   */
  function deactivateRetroMode() {
    // Get localized message or fallback to English
    const restoredMessage = window.i18n?.normal_mode_restored || 'NORMAL_MODE_RESTORED // Back to the surface world';

    // Show deactivation notification
    showNotification(restoredMessage);

    // Restore original title appearance
    const title = document.querySelector('h1');
    if (title) {
      title.classList.remove('terminal-cursor');
    }
  }

  /**
   * Adds Matrix-style typewriter effect to the main page title
   */
  function addTypewriterEffect() {
    const title = document.querySelector('h1');
    if (!title) return;

    // Store original text and clear title
    const originalText = title.textContent;
    title.textContent = '';
    title.classList.add('terminal-cursor');

    // Typewriter animation
    let charIndex = 0;
    const typeWriter = setInterval(() => {
      if (charIndex < originalText.length) {
        title.textContent += originalText.charAt(charIndex);
        charIndex++;
      } else {
        // Animation complete, remove cursor
        title.classList.remove('terminal-cursor');
        clearInterval(typeWriter);
      }
    }, 100); // 100ms delay between characters
  }

  // ========================================================================
  // EVENT LISTENERS
  // ========================================================================

  /**
   * Listens for Konami code input sequence
   */
  document.addEventListener('keydown', function(event) {
    // Add current key to input sequence
    userInput.push(event.code);

    // Keep only the last N inputs (length of Konami code)
    if (userInput.length > konamiCode.length) {
      userInput.shift();
    }

    // Check if sequence matches when we have enough inputs
    if (userInput.length === konamiCode.length) {
      const isKonamiCode = userInput.every((input, index) => input === konamiCode[index]);

      if (isKonamiCode) {
        toggleRetroMode();
        userInput = []; // Reset sequence after successful activation
      }
    }
  });

  /**
   * Alternative activation method: Ctrl+Shift+T
   */
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyT') {
      event.preventDefault(); // Prevent browser default behavior
      toggleRetroMode();
    }
  });

  // ========================================================================
  // CONSOLE EASTER EGG
  // ========================================================================

  /**
   * Extracts author information from the page for console display
   * @returns {Object} Author name and description
   */
  function getAuthorInfo() {
    const authorName = document.querySelector('.indexHeader')?.textContent || 'user';
    const authorDesc = document.querySelector('.authorDescription')?.textContent || 'mystery person';
    return { name: authorName, desc: authorDesc };
  }

  /**
   * Displays ASCII art and welcome message in browser console
   */
  function showConsoleEasterEgg() {
    const author = getAuthorInfo();

    // Get localized messages or fallback to English
    const welcomeMsg = window.i18n?.console_welcome || 'Welcome to the matrix, fellow hacker!';
    const konamiHint = window.i18n?.console_konami_hint || 'Try the Konami code: ↑↑↓↓←→←→BA';
    const shortcutHint = window.i18n?.console_shortcut_hint || 'Or use Ctrl+Shift+T for quick access';

    // Display formatted console message with ASCII art
    console.log(`
  ╔══════════════════════════════════════╗
  ║                                      ║
  ║    ${author.name.padEnd(32)}    ║
  ║                                      ║
  ╚══════════════════════════════════════╝

  ${welcomeMsg}

  ${konamiHint}
  ${shortcutHint}

  > whoami
  ${author.desc}

  > ls -la secrets/
  total 1337
  -rw-r--r-- 1 ${author.name} users   42 Jan  1 1970 .hidden_projects
  -rw-r--r-- 1 ${author.name} users 2048 Jan  1 1970 cool_stuff.txt
  -rwxr-xr-x 1 ${author.name} users 1337 Jan  1 1970 deploy_to_prod.sh
  `);
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  /**
   * Initialize console easter egg when DOM is ready
   */
  document.addEventListener('DOMContentLoaded', showConsoleEasterEgg);

})();