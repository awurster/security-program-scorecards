// Security Program Calculator - Multi-Metric Support
document.addEventListener('DOMContentLoaded', function () {
    // Ensure browser shortcuts work properly and don't get captured
    document.addEventListener('keydown', function (e) {
        // Allow all browser shortcuts with modifier keys to work normally
        if (e.metaKey || e.ctrlKey) {
            // Don't prevent default for browser shortcuts
            return true;
        }
    });

    // Remove focus from any elements that might interfere with shortcuts
    document.addEventListener('click', function (e) {
        // If clicking outside of inputs/sliders, remove focus
        if (!e.target.matches('input, .slider')) {
            document.activeElement.blur();
        }
    });

    // Ensure no elements have unwanted tabindex attributes
    setTimeout(() => {
        document.querySelectorAll('[tabindex]').forEach(el => {
            if (!el.matches('input, button, .slider')) {
                el.removeAttribute('tabindex');
            }
        });
    }, 100);
    // Benchmark data (would ideally be loaded from _data/benchmarks.yml)
    const benchmarks = {
        security_team_ratio: {
            engineering: { healthy: { min: 1.0, max: 2.5 }, warning: { min: 0.5, max: 1.0 }, critical: { min: 0.0, max: 0.5 } },
            company: { healthy: { min: 1.0, max: 2.0 }, warning: { min: 0.5, max: 1.0 }, critical: { min: 0.0, max: 0.5 } }
        },
        users_per_security_person: {
            healthy: { min: 50, max: 400 }, warning: { min: 400, max: 800 }, critical: { min: 800, max: 2000 }
        },
        vuln_sla_compliance: {
            healthy: { min: 85, max: 100 }, warning: { min: 70, max: 85 }, critical: { min: 0, max: 70 }
        },
        mean_time_to_fix: {
            healthy: { min: 0, max: 30 }, warning: { min: 30, max: 90 }, critical: { min: 90, max: 365 }
        },
        budget_vs_revenue: {
            healthy: { min: 1.0, max: 3.0 }, warning: { min: 0.5, max: 1.0 }, critical: { min: 0.0, max: 0.5 }
        },
        budget_per_employee: {
            healthy: { min: 2000, max: 5000 }, warning: { min: 1000, max: 2000 }, critical: { min: 0, max: 1000 }
        },
        training_completion_rate: {
            healthy: { min: 90, max: 100 }, warning: { min: 75, max: 90 }, critical: { min: 0, max: 75 }
        },
        phishing_failure_rate: {
            healthy: { min: 0, max: 5 }, warning: { min: 5, max: 15 }, critical: { min: 15, max: 50 }
        }
    };

    // Initialize all metrics
    initializeMetric('security-org-size');
    initializeMetric('vulnerability-management');
    initializeMetric('security-budget');
    initializeMetric('training-culture');

    function initializeMetric(metricId) {
        const metricCard = document.getElementById(metricId + '-card');
        if (!metricCard) return;

        // Find all sliders and inputs for this metric
        const sliders = metricCard.querySelectorAll('.slider[data-metric="' + metricId + '"]');
        const inputs = metricCard.querySelectorAll('.number-input[data-metric="' + metricId + '"]');

        // Set up sync for each slider/input pair
        sliders.forEach(slider => {
            const input = document.getElementById(slider.id + '-input');
            if (input) {
                syncSliderAndInput(slider, input, metricId);
            }
        });

        // Initial calculation
        calculateMetric(metricId);
    }

    function syncSliderAndInput(slider, input, metricId) {
        slider.addEventListener('input', function () {
            input.value = slider.value;
            calculateMetric(metricId);
        });

        input.addEventListener('input', function () {
            // Allow empty input for user editing
            if (input.value === '') return;

            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            let value = parseFloat(input.value);

            if (isNaN(value)) return;

            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
            slider.value = value;
            calculateMetric(metricId);
        });

        input.addEventListener('blur', function () {
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            let value = parseFloat(input.value);

            if (isNaN(value) || input.value === '') {
                value = parseFloat(slider.value);
            }

            if (value < min) value = min;
            if (value > max) value = max;

            input.value = value;
            slider.value = value;
            calculateMetric(metricId);
        });
    }

    function calculateMetric(metricId) {
        switch (metricId) {
            case 'security-org-size':
                calculateSecurityOrgSize();
                break;
            case 'vulnerability-management':
                calculateVulnManagement();
                break;
            case 'security-budget':
                calculateSecurityBudget();
                break;
            case 'training-culture':
                calculateTrainingCulture();
                break;
        }
    }

    function calculateSecurityOrgSize() {
        const security = getInputValue('security-headcount');
        const engineering = getInputValue('engineering-headcount');
        const company = getInputValue('company-headcount');
        const endUsers = getInputValue('end-users');
        const dataRecords = getInputValue('data-records');

        // Calculate ratios
        const securityVsEng = ((security / engineering) * 100);
        const securityVsCompany = ((security / company) * 100);
        const usersPerSecurity = Math.round(endUsers / security);
        const recordsPerSecurity = (dataRecords / security);

        // Update displays
        updateResult('security-vs-eng-percent', securityVsEng, 'percentage', 'security_team_ratio.engineering');
        updateResult('security-vs-company-percent', securityVsCompany, 'percentage', 'security_team_ratio.company');
        updateResult('users-per-security-person', usersPerSecurity, 'number', 'users_per_security_person');
        updateResult('records-per-security-person', recordsPerSecurity, 'number', null, ' M');
    }

    function calculateVulnManagement() {
        const repos = getInputValue('num-repos');
        const activeVulns = getInputValue('active-vulns');
        const exploitableVulns = getInputValue('exploitable-vulns');
        const vulnsPastSla = getInputValue('vulns-past-sla');
        const avgDaysOpen = getInputValue('avg-days-open');

        // Calculate metrics
        const slaCompliance = ((activeVulns - vulnsPastSla) / activeVulns * 100);
        const vulnsPerRepo = (activeVulns / repos);
        const exploitablePercentage = (exploitableVulns / activeVulns * 100);

        // Update displays
        updateResult('sla-compliance-rate', slaCompliance, 'percentage', 'vuln_sla_compliance');
        updateResult('vulns-per-repo', vulnsPerRepo, 'number');
        updateResult('exploitable-percentage', exploitablePercentage, 'percentage');
        updateResult('mean-time-to-fix', avgDaysOpen, 'number', 'mean_time_to_fix', ' days');
    }

    function calculateSecurityBudget() {
        const budget = getInputValue('security-budget') * 1000000; // Convert to dollars
        const revenue = getInputValue('annual-revenue') * 1000000;
        const opex = getInputValue('operating-costs') * 1000000;
        const employees = getInputValue('total-employees');
        const endUsers = getInputValue('end-users') || 25000;

        // Calculate metrics
        const budgetVsRevenue = (budget / revenue * 100);
        const budgetVsOpex = (budget / opex * 100);
        const budgetPerEmployee = (budget / employees);
        const costPerEndUser = (budget / endUsers);

        // Update displays
        updateResult('budget-vs-revenue', budgetVsRevenue, 'percentage', 'budget_vs_revenue');
        updateResult('budget-vs-opex', budgetVsOpex, 'percentage');
        updateResult('budget-per-employee', budgetPerEmployee, 'currency', 'budget_per_employee');
        updateResult('cost-per-end-user', costPerEndUser, 'currency');
    }

    function calculateTrainingCulture() {
        const trainingBudget = getInputValue('training-budget') * 1000; // Convert to dollars
        const employeesTrained = getInputValue('employees-trained');
        const totalEmployees = getInputValue('total-training-employees');
        const phishingTestsSent = getInputValue('phishing-tests-sent');
        const phishingFailures = getInputValue('phishing-failures');

        // Calculate metrics
        const trainingCostPerEmployee = (trainingBudget / totalEmployees);
        const trainingCompletionRate = (employeesTrained / totalEmployees * 100);
        const phishingFailureRate = (phishingFailures / phishingTestsSent * 100);
        const awarenessScore = Math.max(0, 100 - phishingFailureRate);

        // Update displays
        updateResult('training-cost-per-employee', trainingCostPerEmployee, 'currency');
        updateResult('training-completion-rate', trainingCompletionRate, 'percentage', 'training_completion_rate');
        updateResult('phishing-failure-rate', phishingFailureRate, 'percentage', 'phishing_failure_rate');
        updateResult('security-awareness-score', awarenessScore, 'score');
    }

    function getInputValue(id) {
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) || 0 : 0;
    }

    function updateResult(elementId, value, format, benchmarkKey, suffix = '') {
        const element = document.getElementById(elementId);
        const benchmarkElement = document.getElementById(elementId + '-benchmark');

        if (!element) return;

        // Format and display value
        let displayValue;
        switch (format) {
            case 'percentage':
                displayValue = value.toFixed(1) + '%';
                break;
            case 'currency':
                displayValue = '$' + Math.round(value).toLocaleString();
                break;
            case 'number':
                displayValue = value.toFixed(1) + suffix;
                break;
            case 'score':
                displayValue = Math.round(value) + '/100';
                break;
            default:
                displayValue = value.toFixed(1);
        }

        element.textContent = displayValue;

        // Update benchmark if provided
        if (benchmarkElement && benchmarkKey) {
            updateBenchmark(benchmarkElement, value, benchmarkKey);
        }
    }

    function updateBenchmark(element, value, benchmarkKey) {
        const benchmark = getBenchmark(benchmarkKey);
        if (!benchmark) return;

        let status = '';
        let message = '';

        if (value >= benchmark.healthy.min && value <= benchmark.healthy.max) {
            status = 'healthy';
            message = `Healthy: ${benchmark.healthy.min}-${benchmark.healthy.max}`;
        } else if (value >= benchmark.warning.min && value <= benchmark.warning.max) {
            status = 'warning';
            message = `Warning: ${benchmark.warning.min}-${benchmark.warning.max}`;
        } else {
            status = 'critical';
            message = `Critical: Outside normal range`;
        }

        element.textContent = message;
        element.className = `benchmark ${status}`;
    }

    function getBenchmark(key) {
        const parts = key.split('.');
        let benchmark = benchmarks;

        for (const part of parts) {
            benchmark = benchmark[part];
            if (!benchmark) return null;
        }

        return benchmark;
    }
}); 