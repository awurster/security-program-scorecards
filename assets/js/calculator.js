// Security Organization Size Calculator
document.addEventListener('DOMContentLoaded', function () {
    // Get all slider elements
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

    if (!securitySlider) return; // Exit if elements don't exist

    function syncSliderAndInput(slider, input) {
        slider.addEventListener('input', function () {
            input.value = slider.value;
            calculateMetrics();
        });

        input.addEventListener('input', function () {
            // Validate input bounds
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            let value = parseInt(input.value);

            if (value < min) value = min;
            if (value > max) value = max;
            if (isNaN(value)) value = parseInt(slider.value);

            input.value = value;
            slider.value = value;
            calculateMetrics();
        });
    }

    function calculateMetrics() {
        const security = parseInt(securitySlider.value);
        const engineering = parseInt(engineeringSlider.value);
        const company = parseInt(companySlider.value);

        // Calculate percentages
        const securityVsEng = ((security / engineering) * 100).toFixed(1);
        const securityVsCompany = ((security / company) * 100).toFixed(1);

        // Update display
        if (securityVsEngPercent) {
            securityVsEngPercent.textContent = securityVsEng + '%';
        }
        if (securityVsCompanyPercent) {
            securityVsCompanyPercent.textContent = securityVsCompany + '%';
        }

        // Update benchmarks with color coding
        updateBenchmark(securityVsEngBenchmark, parseFloat(securityVsEng), 1, 2, 'Security vs Engineering');
        updateBenchmark(securityVsCompanyBenchmark, parseFloat(securityVsCompany), 1, 2, 'Security vs Company');
    }

    function updateBenchmark(element, value, healthyMin, healthyMax, label) {
        if (!element) return;

        let status = '';
        let message = '';

        if (value >= healthyMin && value <= healthyMax) {
            status = 'healthy';
            message = `Healthy: ${healthyMin}-${healthyMax}%`;
        } else if (value < healthyMin) {
            status = 'warning';
            message = `Below target: ${healthyMin}-${healthyMax}%`;
        } else {
            status = 'critical';
            message = `Above target: ${healthyMin}-${healthyMax}%`;
        }

        element.textContent = message;
        element.className = `benchmark ${status}`;
    }

    // Initialize syncing
    syncSliderAndInput(securitySlider, securityInput);
    syncSliderAndInput(engineeringSlider, engineeringInput);
    syncSliderAndInput(companySlider, companyInput);

    // Initial calculation
    calculateMetrics();
}); 