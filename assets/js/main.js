/**
 * Dr. Sebastian Müller-Bellé - Personal Website
 * Progressive enhancement JavaScript
 * Works without JS - enhances experience when available
 */

(function() {
    'use strict';
    
    // ==========================================================================
    // Feature Detection & Setup
    // ==========================================================================
    
    // Remove no-js class if present (for progressive enhancement)
    document.documentElement.classList.remove('no-js');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ==========================================================================
    // Theme Toggle
    // ==========================================================================
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeAuto = document.getElementById('theme-auto');
    const htmlElement = document.documentElement;
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredValue(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function setStoredValue(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // localStorage not available - degrade gracefully
        }
    }

    function removeStoredValue(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            // localStorage not available - degrade gracefully
        }
    }

    function getSystemTheme() {
        return systemThemeQuery.matches ? 'dark' : 'light';
    }

    function isAutoThemeMode() {
        const savedMode = getStoredValue('theme-mode');
        const savedTheme = getStoredValue('theme');
        return savedMode === 'auto' || (!savedMode && !savedTheme);
    }
    
    /**
     * Get the user's preferred theme
     * Priority: manual localStorage preference > system preference
     */
    function getPreferredTheme() {
        if (isAutoThemeMode()) {
            return getSystemTheme();
        }

        const savedTheme = getStoredValue('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        return getSystemTheme();
    }
    
    /**
     * Set the theme and update UI
     */
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        htmlElement.setAttribute('data-theme-mode', isAutoThemeMode() ? 'auto' : 'manual');
        
        // Update toggle button aria-label
        if (themeToggle) {
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        }

        if (themeAuto) {
            const isAuto = isAutoThemeMode();
            themeAuto.classList.toggle('is-active', isAuto);
            themeAuto.setAttribute('aria-pressed', isAuto ? 'true' : 'false');
            themeAuto.setAttribute('title', isAuto ? 'Following system theme' : 'Follow system theme');
        }
    }

    /**
     * Save an explicit manual theme choice
     */
    function setManualTheme(theme) {
        setStoredValue('theme-mode', 'manual');
        setStoredValue('theme', theme);
        setTheme(theme);
    }

    /**
     * Return to automatic system theme mode
     */
    function setAutoTheme() {
        setStoredValue('theme-mode', 'auto');
        removeStoredValue('theme');
        setTheme(getSystemTheme());
    }
    
    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setManualTheme(newTheme);
    }
    
    // Initialize theme toggle
    if (themeToggle) {
        // Set initial state
        setTheme(getPreferredTheme());
        
        // Handle click
        themeToggle.addEventListener('click', toggleTheme);
        
        // Handle keyboard (already handled by button, but explicit for clarity)
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    if (themeAuto) {
        themeAuto.addEventListener('click', setAutoTheme);
    }
    
    // Listen for system preference changes
    function handleSystemThemeChange(e) {
        // Only update while automatic mode is active
        if (isAutoThemeMode()) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    }

    if (systemThemeQuery.addEventListener) {
        systemThemeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (systemThemeQuery.addListener) {
        systemThemeQuery.addListener(handleSystemThemeChange);
    }
    
    // ==========================================================================
    // Smooth Scroll Fallback
    // ==========================================================================
    
    /**
     * Check if CSS smooth scroll is supported
     */
    function supportsSmoothScroll() {
        return 'scrollBehavior' in document.documentElement.style;
    }
    
    /**
     * Smooth scroll to element (fallback)
     */
    function smoothScrollTo(element, duration) {
        if (prefersReducedMotion) {
            element.scrollIntoView();
            return;
        }
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function: cubic-bezier(0.2, 0.8, 0.2, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Add smooth scroll fallback for anchor links
    if (!supportsSmoothScroll()) {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target, 600);
                    
                    // Update URL
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }
    
    // ==========================================================================
    // Active Navigation (IntersectionObserver)
    // ==========================================================================
    
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section[id]');
    
    /**
     * Update active navigation state
     */
    function setActiveNav(sectionId) {
        navLinks.forEach(function(link) {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }
    
    // Set up IntersectionObserver for active nav tracking
    if ('IntersectionObserver' in window && sections.length > 0) {
        const headerHeight = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')) || 64;
        
        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight + 100}px 0px -50% 0px`,
            threshold: 0
        };
        
        const navObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    setActiveNav(entry.target.id);
                }
            });
        }, observerOptions);
        
        sections.forEach(function(section) {
            navObserver.observe(section);
        });
        
        // Set initial active state
        setActiveNav('intro');
    }
    
    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================
    
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0 && !prefersReducedMotion) {
        const revealObserverOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };
        
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealObserverOptions);
        
        revealElements.forEach(function(element) {
            revealObserver.observe(element);
        });
    } else {
        // No IntersectionObserver or reduced motion - show all immediately
        revealElements.forEach(function(element) {
            element.classList.add('is-visible');
        });
    }
    
    // ==========================================================================
    // Details/Summary Enhancement
    // ==========================================================================
    
    // The <details>/<summary> elements work natively without JS
    // This enhancement adds smooth height animation if desired
    // Currently relying on native behavior for accessibility
    
    const detailsElements = document.querySelectorAll('details');
    
    detailsElements.forEach(function(details) {
        const summary = details.querySelector('summary');
        
        if (summary) {
            // Announce state change for screen readers
            summary.addEventListener('click', function() {
                // Small delay to let the browser update the open state
                setTimeout(function() {
                    const isOpen = details.hasAttribute('open');
                    const announcement = isOpen ? 'Biography expanded' : 'Biography collapsed';
                    
                    // Create live region announcement
                    announceToScreenReader(announcement);
                }, 100);
            });
        }
    });
    
    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(function() {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // ==========================================================================
    // Keyboard Navigation Enhancement
    // ==========================================================================
    
    // Handle escape key to close expanded details
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openDetails = document.querySelector('details[open]');
            if (openDetails) {
                openDetails.removeAttribute('open');
                const summary = openDetails.querySelector('summary');
                if (summary) {
                    summary.focus();
                }
            }
        }
    });
    
    // ==========================================================================
    // Performance: Defer non-critical operations
    // ==========================================================================
    
    // All critical functionality loaded - page is fully interactive
    document.documentElement.classList.add('js-loaded');
    
})();
