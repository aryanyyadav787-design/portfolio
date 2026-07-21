document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const interactiveElements = document.querySelectorAll('a, .nav-links li, .hotspot, .photo-item');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovering'));
    });

    // --- 2. Interactive Lighting on Hero Car ---
    const ambientLight = document.querySelector('.ambient-light');
    document.addEventListener('mousemove', (e) => {
        if(window.scrollY > window.innerHeight) return;
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        // Only move the ambient light, leave the car strictly static
        gsap.to(ambientLight, { left: `${40 + mouseX * 20}%`, top: `${40 + mouseY * 20}%`, duration: 1, ease: 'power1.out' });
    });

    // --- 3. Loading Sequence & Hero Startup ---
    const loader = document.getElementById('loader');
    const needle = document.querySelector('.speedo-needle');
    const loadNum = document.getElementById('load-num');
    
    // Make sure nav starts hidden for animation
    gsap.set('.instrument-cluster-nav', { top: '-100px', opacity: 0 });
    
    const loadObj = { val: 0 };
    gsap.to(loadObj, {
        val: 320,
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: () => {
            loadNum.textContent = Math.round(loadObj.val);
            const angle = -135 + (loadObj.val / 320) * 270;
            needle.style.transform = `rotate(${angle}deg)`;
        },
        onComplete: () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    loader.style.display = 'none';
                    startHeroAnimation();
                }
            });
        }
    });

    function startHeroAnimation() {
        gsap.set('.gs-reveal-hero', { opacity: 0, y: 28 });
        
        const heroTl = gsap.timeline();
        
        heroTl.to('.ambient-light', { opacity: 1, duration: 1 })
        .to('.gs-reveal-hero', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }, "-=0.5")
        .to('.instrument-cluster-nav', { opacity: 1, top: '20px', duration: 1, ease: 'back.out(1.5)' }, "-=1");
    }

    // --- 5. Global Scroll Reveals ---
    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, opacity: 1, duration: 1, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
            }
        );
    });



    // --- 7. Horizontal Scroll for Insta Cards ---
    const instaWrapper = document.querySelector('.driven-section');
    const instaContainer = document.querySelector('.insta-cards-container');
    
    if (instaWrapper && instaContainer) {
        let getScrollAmount = () => -(instaContainer.scrollWidth - window.innerWidth);
        
        gsap.to(instaContainer, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: instaWrapper,
                start: "center center",
                end: () => `+=${instaContainer.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }





    // --- 10. View All Articles ---
    const viewAllBtn = document.getElementById('view-all-articles');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const hiddenArticles = document.querySelectorAll('.hidden-article');
            hiddenArticles.forEach(article => {
                article.style.display = 'flex';
            });
            viewAllBtn.style.display = 'none';
            ScrollTrigger.refresh();
        });
    }

    // --- 11. Navigation ScrollSpy and Smooth Scroll ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = Array.from(navLinks).map(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith('#') ? document.querySelector(href) : null;
    }).filter(s => s);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    function updateNav() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If the top of the section is above or near the middle of the screen
            if (rect.top <= window.innerHeight / 2) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNav);
    window.addEventListener('load', updateNav);
    updateNav(); // Run immediately as well

    // --- 12. Real-time Clock ---
    const liveTimeElement = document.getElementById('live-time');
    if (liveTimeElement) {
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            liveTimeElement.textContent = `${hours}:${minutes}`;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // --- 13. Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinksContainer.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = navLinksContainer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('nav-active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

});
