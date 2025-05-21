// JavaScript code will go here
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeModeLabel = document.querySelector('.theme-mode-label'); // Assuming you have one
    const body = document.body;

    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeModeLabel) themeModeLabel.textContent = 'Dark Mode';
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if (themeModeLabel) themeModeLabel.textContent = 'Light Mode';
            if (themeToggle) themeToggle.checked = false;
        }
    }

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Check for prefers-color-scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    // Event listener for the toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Temporarily remove focus from the link to avoid interference with scrolling
                this.blur(); 
                
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Optional: Update active link state immediately on click
                // This can be helpful if scroll events are slow or jerky
                document.querySelectorAll('nav ul.nav-links a.active').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul.nav-links a'); // More specific selector
    const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 70; // Fallback if header not found

    function changeNavActiveState() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (headerHeight + 50)) { // Added 50px offset
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
        
        // Explicitly set 'home' as active if at the very top or above the first section
        // and no other section is marked as current.
        if (currentSectionId === '' && pageYOffset < sections[0].offsetTop - (headerHeight + 50)) {
            const homeLink = document.querySelector('nav ul.nav-links a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        } else if (currentSectionId === '' && sections.length > 0 && pageYOffset < sections[0].offsetTop - (headerHeight + 50) ) {
            // If currentSectionId is empty (meaning we are above all sections or first section not yet "active")
            // and we are indeed above the first section, make "Home" active.
             const homeLink = document.querySelector('nav ul.nav-links a[href="#home"]');
             if (homeLink) {
                 navLinks.forEach(a => a.classList.remove('active')); // Clear others
                 homeLink.classList.add('active');
             }
        }
    }

    window.addEventListener('scroll', changeNavActiveState);
    window.addEventListener('load', changeNavActiveState); // Also run on load

    // Listen for changes in prefers-color-scheme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only if no user preference is set in localStorage
        if (!localStorage.getItem('theme')) { 
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Update copyright year
    const yearSpan = document.querySelector('footer p'); // Be more specific if needed
    if (yearSpan && yearSpan.innerHTML.includes('&lt;current_year&gt;')) { // Check for HTML entity
         yearSpan.innerHTML = yearSpan.innerHTML.replace('&lt;current_year&gt;', new Date().getFullYear());
    } else if (yearSpan && yearSpan.textContent.includes('<current_year>')) { // Fallback for direct text
         yearSpan.innerHTML = yearSpan.innerHTML.replace('<current_year>', new Date().getFullYear());
    }
});
