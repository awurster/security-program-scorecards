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
        records_per_security_person: {
            healthy: { min: 0.1, max: 5.0 }, warning: { min: 5.0, max: 15.0 }, critical: { min: 15.0, max: 50.0 }
        },
        vulns_per_repo: {
            healthy: { min: 0, max: 2 }, warning: { min: 2, max: 5 }, critical: { min: 5, max: 20 }
        },
        exploitable_percentage: {
            healthy: { min: 0, max: 5 }, warning: { min: 5, max: 15 }, critical: { min: 15, max: 50 }
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
        budget_vs_opex: {
            healthy: { min: 2.0, max: 8.0 }, warning: { min: 1.0, max: 2.0 }, critical: { min: 0.0, max: 1.0 }
        },
        budget_per_employee: {
            healthy: { min: 2000, max: 5000 }, warning: { min: 1000, max: 2000 }, critical: { min: 0, max: 1000 }
        },
        cost_per_end_user: {
            healthy: { min: 50, max: 200 }, warning: { min: 20, max: 50 }, critical: { min: 0, max: 20 }
        },
        training_cost_per_employee: {
            healthy: { min: 100, max: 500 }, warning: { min: 50, max: 100 }, critical: { min: 0, max: 50 }
        },
        training_completion_rate: {
            healthy: { min: 90, max: 100 }, warning: { min: 75, max: 90 }, critical: { min: 0, max: 75 }
        },
        phishing_failure_rate: {
            healthy: { min: 0, max: 5 }, warning: { min: 5, max: 15 }, critical: { min: 15, max: 50 }
        },
        security_awareness_score: {
            healthy: { min: 85, max: 100 }, warning: { min: 70, max: 85 }, critical: { min: 0, max: 70 }
        }
    };

    // Logarithmic scaling configuration for sliders with wide ranges
    const logScaleConfig = {
        'engineering-headcount': { min: 10, max: 5000, useLog: true },
        'company-headcount': { min: 50, max: 50000, useLog: true },
        'end-users': { min: 100, max: 10000000, useLog: true },
        'data-records': { min: 1, max: 1000, useLog: true },
        'num-repos': { min: 1, max: 10000, useLog: true },
        'active-vulns': { min: 0, max: 10000, useLog: true },
        'exploitable-vulns': { min: 0, max: 1000, useLog: true },
        'vulns-past-sla': { min: 0, max: 1000, useLog: true },
        'annual-revenue': { min: 1, max: 10000, useLog: true },
        'operating-costs': { min: 1, max: 1000, useLog: true },
        'total-employees': { min: 10, max: 50000, useLog: true },
        'training-budget': { min: 10, max: 5000, useLog: true },
        'employees-trained': { min: 10, max: 50000, useLog: true },
        'total-training-employees': { min: 10, max: 50000, useLog: true },
        'phishing-tests-sent': { min: 100, max: 100000, useLog: true },
        'phishing-failures': { min: 0, max: 10000, useLog: true }
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
                setupLogarithmicSlider(slider, input);
                syncSliderAndInput(slider, input, metricId);
            }
        });

        // Initial calculation
        calculateMetric(metricId);
    }

    function setupLogarithmicSlider(slider, input) {
        const config = logScaleConfig[slider.id];
        if (!config || !config.useLog) return;

        // Convert slider to use 0-100 range for smooth logarithmic scaling
        slider.min = 0;
        slider.max = 100;

        // Set initial slider position based on current input value
        const currentValue = parseFloat(input.value);
        slider.value = linearToLog(currentValue, config.min, config.max);
    }

    function linearToLog(value, min, max) {
        if (value <= min) return 0;
        if (value >= max) return 100;

        // Handle zero values for ranges that include zero
        if (min === 0) {
            min = 0.1; // Use small positive number for log calculation
            if (value === 0) return 0;
        }

        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logValue = Math.log(value);

        return ((logValue - logMin) / (logMax - logMin)) * 100;
    }

    function logToLinear(sliderValue, min, max) {
        if (sliderValue <= 0) return min;
        if (sliderValue >= 100) return max;

        // Handle zero values for ranges that include zero
        if (min === 0) {
            if (sliderValue === 0) return 0;
            min = 0.1; // Use small positive number for log calculation
        }

        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logValue = logMin + (sliderValue / 100) * (logMax - logMin);

        let result = Math.exp(logValue);

        // Round to appropriate precision
        if (result < 1) {
            result = Math.round(result * 10) / 10;
        } else if (result < 100) {
            result = Math.round(result);
        } else {
            result = Math.round(result);
        }

        return Math.max(min === 0.1 ? 0 : min, Math.min(max, result));
    }

    function syncSliderAndInput(slider, input, metricId) {
        const config = logScaleConfig[slider.id];
        let isUserTyping = false;
        let typingTimeout;

        slider.addEventListener('input', function () {
            if (isUserTyping) return; // Don't update input while user is typing

            if (config && config.useLog) {
                const linearValue = logToLinear(parseFloat(slider.value), config.min, config.max);
                input.value = linearValue;
            } else {
                input.value = slider.value;
            }
            calculateMetric(metricId);
        });

        input.addEventListener('input', function () {
            isUserTyping = true;

            // Clear any existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Allow empty input for user editing
            if (input.value === '') {
                // Set a timeout to handle the empty state
                typingTimeout = setTimeout(() => {
                    isUserTyping = false;
                    if (input.value === '') {
                        // If still empty after delay, set to minimum value
                        if (config && config.useLog) {
                            input.value = config.min;
                            slider.value = linearToLog(config.min, config.min, config.max);
                        } else {
                            const min = parseFloat(slider.getAttribute('data-original-min') || slider.min);
                            input.value = min;
                            slider.value = min;
                        }
                        calculateMetric(metricId);
                    }
                }, 1000); // Wait 1 second before auto-filling
                return;
            }

            let value = parseFloat(input.value);
            if (isNaN(value)) {
                // Set a timeout to handle invalid input
                typingTimeout = setTimeout(() => {
                    isUserTyping = false;
                    if (isNaN(parseFloat(input.value))) {
                        // Reset to previous valid value
                        if (config && config.useLog) {
                            const currentValue = logToLinear(parseFloat(slider.value), config.min, config.max);
                            input.value = currentValue;
                        } else {
                            input.value = slider.value;
                        }
                        calculateMetric(metricId);
                    }
                }, 500);
                return;
            }

            if (config && config.useLog) {
                // Only clamp if the value is way outside bounds
                if (value < config.min * 0.1) value = config.min;
                if (value > config.max * 10) value = config.max;

                slider.value = linearToLog(value, config.min, config.max);
            } else {
                const min = parseFloat(slider.getAttribute('data-original-min') || slider.min);
                const max = parseFloat(slider.getAttribute('data-original-max') || slider.max);

                // Only clamp if the value is way outside bounds
                if (value < min * 0.1) value = min;
                if (value > max * 10) value = max;

                slider.value = value;
            }

            // Set a short timeout before calculating to allow for continued typing
            typingTimeout = setTimeout(() => {
                isUserTyping = false;
                calculateMetric(metricId);
            }, 300);
        });

        input.addEventListener('blur', function () {
            isUserTyping = false;

            // Clear any pending timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            let value = parseFloat(input.value);

            if (config && config.useLog) {
                if (isNaN(value) || input.value === '') {
                    value = logToLinear(parseFloat(slider.value), config.min, config.max);
                }

                if (value < config.min) value = config.min;
                if (value > config.max) value = config.max;

                input.value = value;
                slider.value = linearToLog(value, config.min, config.max);
            } else {
                const min = parseFloat(slider.getAttribute('data-original-min') || slider.min);
                const max = parseFloat(slider.getAttribute('data-original-max') || slider.max);

                if (isNaN(value) || input.value === '') {
                    value = parseFloat(slider.value);
                }

                if (value < min) value = min;
                if (value > max) value = max;

                input.value = value;
                slider.value = value;
            }

            calculateMetric(metricId);
        });

        input.addEventListener('focus', function () {
            isUserTyping = true;
            // Clear any pending timeout when user starts editing
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
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
        updateResult('records-per-security-person', recordsPerSecurity, 'number', 'records_per_security_person', ' M');
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
        updateResult('vulns-per-repo', vulnsPerRepo, 'number', 'vulns_per_repo');
        updateResult('exploitable-percentage', exploitablePercentage, 'percentage', 'exploitable_percentage');
        updateResult('mean-time-to-fix', avgDaysOpen, 'number', 'mean_time_to_fix', ' days');
    }

    function calculateSecurityBudget() {
        const budget = getInputValue('security-budget') * 1000000; // Convert to dollars
        const revenue = getInputValue('annual-revenue') * 1000000;
        const opex = getInputValue('operating-costs') * 1000000;
        const employees = getInputValue('total-employees');

        // Get end users from the security org size card - fallback to default if not found
        const endUsers = getInputValue('end-users') || 25000;

        // Calculate metrics
        const budgetVsRevenue = (budget / revenue * 100);
        const budgetVsOpex = (budget / opex * 100);
        const budgetPerEmployee = (budget / employees);
        const costPerEndUser = (budget / endUsers);

        // Update displays
        updateResult('budget-vs-revenue', budgetVsRevenue, 'percentage', 'budget_vs_revenue');
        updateResult('budget-vs-opex', budgetVsOpex, 'percentage', 'budget_vs_opex');
        updateResult('budget-per-employee', budgetPerEmployee, 'currency', 'budget_per_employee');
        updateResult('cost-per-end-user', costPerEndUser, 'currency', 'cost_per_end_user');
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
        updateResult('training-cost-per-employee', trainingCostPerEmployee, 'currency', 'training_cost_per_employee');
        updateResult('training-completion-rate', trainingCompletionRate, 'percentage', 'training_completion_rate');
        updateResult('phishing-failure-rate', phishingFailureRate, 'percentage', 'phishing_failure_rate');
        updateResult('security-awareness-score', awarenessScore, 'score', 'security_awareness_score');
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
        if (!benchmark) {
            element.textContent = 'Calculating...';
            return;
        }

        let status = '';
        let message = '';

        if (value >= benchmark.healthy.min && value <= benchmark.healthy.max) {
            status = 'healthy';
            message = `Healthy: ${benchmark.healthy.min}-${benchmark.healthy.max}`;
        } else if (benchmark.warning && value >= benchmark.warning.min && value <= benchmark.warning.max) {
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