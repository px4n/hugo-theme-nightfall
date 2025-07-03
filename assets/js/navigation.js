/**
 * ============================================================================
 * NAVIGATION ACTIVE STATE MANAGEMENT - NIGHTFALL THEME
 * ============================================================================
 *
 * Purpose: Automatically highlights the current page in the navigation menu
 * Dependencies: DOM manipulation, modern browser URL API
 * Related files:
 * - layouts/partials/header.html (navigation structure)
 * - scss/custom.scss (.active class styling)
 *
 * Features:
 * - Auto-detects current page from URL
 * - Handles both absolute and relative URLs
 * - Supports multilingual navigation
 * - Graceful error handling for malformed URLs
 *
 * Last modified: 2025-07-02
 * ============================================================================
 */

/**
 * Main navigation highlighting functionality
 * Runs when DOM is fully loaded to ensure all navigation elements exist
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get current page path in lowercase for case-insensitive matching
  const currentPath = window.location.pathname.toLowerCase();

  // Find all navigation links in the header
  const navLinks = document.querySelectorAll('.headerLinks a');

  /**
   * Process each navigation link to determine if it should be highlighted
   */
  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Skip processing if href is missing or empty
    if (!href) {
      return;
    }

    // Extract pathname from URL (handles both absolute and relative URLs)
    let linkPath;
    try {
      // Try parsing as absolute URL first
      linkPath = new URL(href).pathname.toLowerCase();
    } catch (e) {
      // If parsing fails, treat as relative URL
      linkPath = href.toLowerCase();

      // Ensure relative URLs start with forward slash
      if (!linkPath.startsWith('/')) {
        linkPath = '/' + linkPath;
      }
    }

    /**
     * Determine if current page matches this navigation link
     * Logic:
     * - Exact match: current path exactly equals link path
     * - Prefix match: current path starts with link path (but not for root "/" to avoid highlighting everything)
     */
    const isExactMatch = currentPath === linkPath;
    const isPrefixMatch = linkPath !== '/' && currentPath.startsWith(linkPath);
    const isMatch = isExactMatch || isPrefixMatch;

    // Apply or remove the active class based on match result
    if (isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});