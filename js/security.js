// ===================================
// SkillOrbit - Security Module
// Anti-Inspect & Content Protection
// ===================================

(function () {
    'use strict';

    const SecurityModule = {
        // Configuration
        config: {
            disableRightClick: true,
            disableKeyShortcuts: true,
            detectDevTools: true,
            preventTextSelection: false, // Only on protected pages
            showWarningOnDetect: true,
            redirectOnDetect: false,
            watermarkEnabled: true
        },

        // Initialize security measures
        init: function (options = {}) {
            this.config = { ...this.config, ...options };

            if (this.config.disableRightClick) {
                this.disableRightClick();
            }

            if (this.config.disableKeyShortcuts) {
                this.disableKeyboardShortcuts();
            }

            if (this.config.detectDevTools) {
                this.detectDevToolsOpen();
            }

            // Prevent console access
            this.protectConsole();

            console.log('%c⚠️ Warning!', 'color: red; font-size: 40px; font-weight: bold;');
            console.log('%cThis is a protected area. Unauthorized access is prohibited.', 'color: red; font-size: 16px;');
        },

        // Disable right-click context menu
        disableRightClick: function () {
            document.addEventListener('contextmenu', function (e) {
                if (document.body.classList.contains('protected-content')) {
                    e.preventDefault();
                    SecurityModule.showWarning('Right-click is disabled on this page.');
                    return false;
                }
            });
        },

        // Disable keyboard shortcuts
        disableKeyboardShortcuts: function () {
            document.addEventListener('keydown', function (e) {
                // F12 - DevTools
                if (e.key === 'F12') {
                    e.preventDefault();
                    SecurityModule.showWarning('Developer tools are disabled.');
                    return false;
                }

                // Ctrl+Shift+I - DevTools
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    SecurityModule.showWarning('Developer tools are disabled.');
                    return false;
                }

                // Ctrl+Shift+J - Console
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                    e.preventDefault();
                    return false;
                }

                // Ctrl+Shift+C - Element Inspector
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    return false;
                }

                // Ctrl+U - View Source
                if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    SecurityModule.showWarning('View source is disabled.');
                    return false;
                }

                // Ctrl+S - Save Page
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    return false;
                }

                // Ctrl+Shift+K - Firefox DevTools
                if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                    e.preventDefault();
                    return false;
                }
            });
        },

        // Detect if DevTools is open
        detectDevToolsOpen: function () {
            const threshold = 160;
            let devToolsOpen = false;

            const checkDevTools = () => {
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;

                if (widthThreshold || heightThreshold) {
                    if (!devToolsOpen) {
                        devToolsOpen = true;
                        this.onDevToolsDetected();
                    }
                } else {
                    devToolsOpen = false;
                }
            };

            // Check periodically
            setInterval(checkDevTools, 1000);

            // Also use debugger detection
            const detectDebugger = () => {
                const start = performance.now();
                debugger;
                const end = performance.now();

                if (end - start > 100) {
                    this.onDevToolsDetected();
                }
            };

            // Run debugger detection occasionally (not too frequently)
            // Commented out as it can be intrusive
            // setInterval(detectDebugger, 5000);
        },

        // Called when DevTools is detected
        onDevToolsDetected: function () {
            if (this.config.showWarningOnDetect) {
                this.showSecurityOverlay();
            }

            if (this.config.redirectOnDetect) {
                window.location.href = '/security-warning.html';
            }

            // Log the event (in production, send to server)
            console.warn('DevTools access detected');
        },

        // Show warning toast
        showWarning: function (message) {
            if (window.SkillOrbit && window.SkillOrbit.showToast) {
                window.SkillOrbit.showToast(message, 'warning');
            } else {
                // Fallback warning
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #FF6B6B;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    z-index: 99999;
                    font-family: sans-serif;
                    animation: fadeIn 0.3s ease;
                `;
                toast.textContent = message;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        },

        // Show security overlay when DevTools detected
        showSecurityOverlay: function () {
            // Only show on protected pages
            if (!document.body.classList.contains('protected-content')) {
                return;
            }

            const overlay = document.createElement('div');
            overlay.className = 'security-overlay';
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-shield-alt" style="font-size: 64px; color: #FF6B6B; margin-bottom: 20px;"></i>
                    <h2>Security Alert</h2>
                    <p style="color: #B4B4C7; margin-bottom: 20px;">
                        Developer tools have been detected.<br>
                        Please close them to continue viewing.
                    </p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Refresh Page
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
        },

        // Protect console
        protectConsole: function () {
            // Clear console periodically on protected pages
            if (document.body.classList.contains('protected-content')) {
                setInterval(() => {
                    console.clear();
                    console.log('%c⚠️ Protected Content', 'color: red; font-size: 20px;');
                }, 2000);
            }
        },

        // Add watermark
        addWatermark: function (userEmail) {
            if (!this.config.watermarkEnabled) return;

            // Create multiple watermarks
            const positions = [
                { top: '20%', left: '20%' },
                { top: '20%', right: '20%' },
                { top: '50%', left: '50%' },
                { bottom: '20%', left: '20%' },
                { bottom: '20%', right: '20%' }
            ];

            positions.forEach((pos, index) => {
                const watermark = document.createElement('div');
                watermark.className = 'watermark';
                watermark.textContent = userEmail || 'SkillOrbit User';
                Object.assign(watermark.style, pos);
                watermark.style.transform = `rotate(-30deg) translate(-50%, -50%)`;
                document.body.appendChild(watermark);
            });
        },

        // Prevent text selection on protected content
        preventSelection: function () {
            if (this.config.preventTextSelection) {
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.msUserSelect = 'none';
            }
        },

        // Prevent video download
        protectVideo: function (videoElement) {
            if (!videoElement) return;

            // Remove download attribute
            videoElement.removeAttribute('download');

            // Prevent right-click on video
            videoElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });

            // Disable controls that allow download
            videoElement.controlsList = 'nodownload';

            // Prevent drag
            videoElement.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        },

        // Session timeout
        initSessionTimeout: function (timeoutMinutes = 30) {
            let timeout;

            const resetTimeout = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.showWarning('Session expired. Please refresh the page.');
                    // Redirect to login
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 3000);
                }, timeoutMinutes * 60 * 1000);
            };

            // Reset on user activity
            ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, resetTimeout, true);
            });

            resetTimeout();
        },

        // Obfuscate sensitive data in DOM
        obfuscateData: function () {
            // This would be used to encode sensitive data
            // Example: Convert video URLs to encrypted tokens
        }
    };

    // Auto-initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        SecurityModule.init();
    });

    // Export module
    window.SecurityModule = SecurityModule;

})();
