// ===================================
// SkillOrbit - Main Application Logic
// ===================================

// Sample course data (will be replaced with Firebase data)
const sampleCourses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        category: "Web Development",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
        price: 2999,
        originalPrice: 9999,
        rating: 4.8,
        students: 5420,
        duration: "45 hours",
        badge: "Bestseller"
    },
    {
        id: 2,
        title: "Digital Marketing Masterclass",
        category: "Marketing",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        price: 1999,
        originalPrice: 6999,
        rating: 4.7,
        students: 3210,
        duration: "32 hours",
        badge: "Popular"
    },
    {
        id: 3,
        title: "Python Programming for Beginners",
        category: "Programming",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
        price: 1499,
        originalPrice: 4999,
        rating: 4.9,
        students: 8750,
        duration: "28 hours",
        badge: "Hot"
    },
    {
        id: 4,
        title: "UI/UX Design Fundamentals",
        category: "Design",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        price: 2499,
        originalPrice: 7999,
        rating: 4.6,
        students: 2890,
        duration: "38 hours",
        badge: ""
    },
    {
        id: 5,
        title: "Data Science with Python",
        category: "Data Science",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        price: 3499,
        originalPrice: 11999,
        rating: 4.8,
        students: 4120,
        duration: "52 hours",
        badge: "New"
    },
    {
        id: 6,
        title: "Mobile App Development with React Native",
        category: "Mobile Development",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        price: 2799,
        originalPrice: 8999,
        rating: 4.7,
        students: 3450,
        duration: "42 hours",
        badge: ""
    }
];

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const coursesGrid = document.getElementById('coursesGrid');
const toastContainer = document.getElementById('toastContainer');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollTop();
    initFAQ();
    loadCourses();
    initSmoothScroll();
});

// Navbar scroll effect
function initNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// Scroll to top button
function initScrollTop() {
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// FAQ accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Load courses
function loadCourses() {
    if (coursesGrid) {
        coursesGrid.innerHTML = sampleCourses.map(course => createCourseCard(course)).join('');
    }
}

// Create course card HTML
function createCourseCard(course) {
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                ${course.badge ? `<span class="course-badge">${course.badge}</span>` : ''}
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-users"></i> ${course.students.toLocaleString()}</span>
                </div>
                <div class="course-footer">
                    <div class="course-price">
                        ₹${course.price.toLocaleString()}
                        <span class="original">₹${course.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="course-rating">
                        <i class="fas fa-star"></i>
                        ${course.rating}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navLinks) navLinks.classList.remove('active');
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Toast notification system
function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility: Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Export for use in other files
window.SkillOrbit = {
    showToast,
    formatCurrency,
    sampleCourses
};
