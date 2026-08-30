import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * AdSense Route Policy & Publisher Content Demarcation
 * Ensures compliance with Google AdSense Policies:
 * - "Google-served ads on screens without publisher content"
 * - "Ads on transactional, authentication, or alert screens"
 */

// Routes where AdSense auto-ads or ad units are PERMITTED (Rich Publisher Content)
export const ALLOWED_CONTENT_PATTERNS = [
  /^\/$/,                                // Homepage
  /^\/about-us$/,                        // About Us
  /^\/contact-us$/,                      // Contact Us
  /^\/privacy-policy$/,                  // Privacy Policy
  /^\/terms-and-conditions$/,            // Terms & Conditions
  /^\/refund-policy$/,                   // Refund Policy
  /^\/courses(\/.*)?$/,                  // Courses & Paper Overviews
  /^\/course-details\/[^/]+\/[^/]+$/,    // Course Detail Pages
  /^\/faculties(\/.*)?$/,                // Faculty Catalog & Profiles
  /^\/test-series$/,                     // Test Series & Mock Exam Hub
  /^\/resources(\/.*)?$/,                // Free Learning Hub, Notes, MCQs, Articles
  /^\/study-materials(\/.*)?$/,          // Study Materials
];

// Utility, transactional, dashboard, and authentication paths where ads are STRICTLY PROHIBITED
export const DISALLOWED_UTILITY_PATTERNS = [
  /^\/login/,
  /^\/register/,
  /^\/auth\//,
  /^\/forgot-password/,
  /^\/reset-password/,
  /^\/cart/,
  /^\/checkout/,
  /^\/payment/,
  /^\/order-success/,
  /^\/order-failed/,
  /^\/student-dashboard/,
  /^\/admin-dashboard/,
  /^\/partner-dashboard/,
  /^\/profile/,
  /^\/downloads/,
];

/**
 * Checks if the current pathname is an AdSense-eligible publisher content page.
 * @param {string} pathname
 * @returns {boolean}
 */
export function isAdSenseEligibleRoute(pathname) {
  // Always disallow if it matches a utility pattern
  for (const pattern of DISALLOWED_UTILITY_PATTERNS) {
    if (pattern.test(pathname)) {
      return false;
    }
  }

  // Must match an allowed content pattern
  for (const pattern of ALLOWED_CONTENT_PATTERNS) {
    if (pattern.test(pathname)) {
      return true;
    }
  }

  return false;
}

/**
 * React hook to manage AdSense state across client-side route transitions in the SPA.
 * Automatically disables or pauses ads on utility, dashboard, and auth screens.
 */
export function useAdSenseRouteGuard() {
  const location = useLocation();

  useEffect(() => {
    const isEligible = isAdSenseEligibleRoute(location.pathname);

    if (typeof window !== 'undefined') {
      try {
        if (!isEligible) {
          // Mark body as non-ad screen
          document.body.setAttribute('data-adsense-allowed', 'false');
          
          // If Google auto-ads is initialized, pause ad requests on utility screens
          if (window.adsbygoogle) {
            window.adsbygoogle.pauseAdRequests = 1;
          }

          // Remove any stray auto-ads iframes on login/checkout/dashboard screens
          const autoAdContainers = document.querySelectorAll('.google-auto-placed, ins.adsbygoogle[data-ad-status="unfilled"]');
          autoAdContainers.forEach(el => {
            el.style.display = 'none';
          });
        } else {
          document.body.setAttribute('data-adsense-allowed', 'true');
          
          // Resume normal ad serving on publisher content pages
          if (window.adsbygoogle) {
            window.adsbygoogle.pauseAdRequests = 0;
          }
        }
      } catch (err) {
        console.warn('AdSense route guard notice:', err);
      }
    }
  }, [location.pathname]);
}
