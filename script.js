// Security Program Scorecards - Interactive Calculator
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Security Organization Size calculator
    initSecurityOrgCalculator();

    // Add smooth loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

function initSecurityOrgCalculator() {
    // Get all the input elements
    const securitySlider = document.getElementById('security-headcount');
    const securityInput = document.getElementById('security-headcount-input');
    const engineeringSlider = document.getElementById('engineering-headcount');
    const engineeringInput = document.getElementById('engineering-headcount-input');
    const companySlider = document.getElementById('company-headcount');
    const companyInput = document.getElementById('company-headcount-input');

    // Get result elements
    const securityVsEngPercent = document.getElementById('security-vs-eng-percent');
    const securityVsEngBenchmark = document.getElementById('security-vs-eng-benchmark');
    const securityVsCompanyPercent = document.getElementById('security-vs-company-percent');
    const securityVsCompanyBenchmark = document.getElementById('security-vs-company-benchmark');

    // Sync sliders with number inputs
    function syncSliderWithInput(slider, input) {
        slider.addEventListener('input', function () {
            input.value = slider.value;
            calculateAndUpdate();
            animateValueChange(input);
        });

        input.addEventListener('input', function () {
            // Validate input within slider range
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            let value = parseInt(input.value) || min;

            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
            slider.value = value;
            calculateAndUpdate();
        });

        input.addEventListener('blur', function () {
            // Ensure valid value on blur
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            let value = parseInt(input.value) || min;

            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
            slider.value = value;
            calculateAndUpdate();
        });
    }

    // Initialize all slider-input pairs
    syncSliderWithInput(securitySlider, securityInput);
    syncSliderWithInput(engineeringSlider, engineeringInput);
    syncSliderWithInput(companySlider, companyInput);

    // Calculate percentages and update display
    function calculateAndUpdate() {
        const securityCount = parseInt(securityInput.value) || 0;
        const engineeringCount = parseInt(engineeringInput.value) || 0;
        const companyCount = parseInt(companyInput.value) || 0;

        // Validate that company >= engineering >= security (logical constraints)
        let adjustedSecurityCount = Math.min(securityCount, engineeringCount);
        let adjustedEngineeringCount = Math.min(engineeringCount, companyCount);

        // Calculate percentages
        const securityVsEng = adjustedEngineeringCount > 0 ?
            (adjustedSecurityCount / adjustedEngineeringCount) * 100 : 0;
        const securityVsCompany = companyCount > 0 ?
            (adjustedSecurityCount / companyCount) * 100 : 0;

        // Update percentage displays with animation
        updatePercentageDisplay(securityVsEngPercent, securityVsEng);
        updatePercentageDisplay(securityVsCompanyPercent, securityVsCompany);

        // Update benchmarks with status
        updateBenchmark(securityVsEngBenchmark, securityVsEng, {
            healthy: { min: 1, max: 2, label: "Healthy: 1-2%" },
            warning: { min: 0.5, max: 3, label: "Acceptable: 0.5-3%" },
            critical: { label: "Outside typical range" }
        });

        updateBenchmark(securityVsCompanyBenchmark, securityVsCompany, {
            healthy: { min: 0.2, max: 0.8, label: "Healthy: 0.2-0.8%" },
            warning: { min: 0.1, max: 1.5, label: "Acceptable: 0.1-1.5%" },
            critical: { label: "Outside typical range" }
        });

        // Add visual feedback for the active card
        const card = document.getElementById('security-org-card');
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }

    // Update percentage display with smooth animation
    function updatePercentageDisplay(element, value) {
        const currentValue = parseFloat(element.textContent) || 0;
        const targetValue = parseFloat(value.toFixed(1));

        // Animate the number change
        animateNumber(element, currentValue, targetValue, 300);
    }

    // Animate number changes
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smooth animation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeProgress;

            element.textContent = current.toFixed(1) + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Update benchmark status with color coding
    function updateBenchmark(element, value, thresholds) {
        let status = 'critical';
        let text = thresholds.critical.label;

        if (value >= thresholds.healthy.min && value <= thresholds.healthy.max) {
            status = 'healthy';
            text = thresholds.healthy.label;
        } else if (value >= thresholds.warning.min && value <= thresholds.warning.max) {
            status = 'warning';
            text = thresholds.warning.label;
        }

        // Remove existing status classes
        element.classList.remove('healthy', 'warning', 'critical');
        element.classList.add(status);
        element.textContent = text;

        // Add pulse animation for status changes
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    // Add visual feedback for input changes
    function animateValueChange(element) {
        element.style.backgroundColor = '#e8f2ff';
        element.style.transform = 'scale(1.05)';

        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.transform = '';
        }, 200);
    }

    // Initialize with default calculations
    calculateAndUpdate();

    // Add keyboard shortcuts for power users
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    resetToDefaults();
                    break;
            }
        }
    });

    // Reset to default values
    function resetToDefaults() {
        securitySlider.value = 10;
        securityInput.value = 10;
        engineeringSlider.value = 500;
        engineeringInput.value = 500;
        companySlider.value = 2500;
        companyInput.value = 2500;

        calculateAndUpdate();

        // Visual feedback for reset
        const card = document.getElementById('security-org-card');
        card.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
        setTimeout(() => {
            card.style.background = '';
        }, 500);
    }
}

// Add smooth scroll behavior for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all metric cards for scroll animations
document.querySelectorAll('.metric-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add loading states and error handling
function showLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.style.opacity = '';
    element.style.pointerEvents = '';
}

// Export functions for potential future use
window.SecurityProgramScorecard = {
    resetToDefaults: () => {
        const event = new CustomEvent('reset-defaults');
        document.dispatchEvent(event);
    }
}; 