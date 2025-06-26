// Generated from YAML data - DO NOT EDIT MANUALLY
const siteData = {"title": "Build better security programs,<br>one metric at a time", "tagline": "Assess your security program health with interactive metrics", "hero": "", "subtitle": "Benchmark your security organization health against industry standards", "footer": "", "text": "Built by and for Security Leaders", "year": 2025};
const metricsData = [{"id": "security-org-size", "title": "Organization Size", "icon": "tenancy", "status": "active", "description": "Track the size and efficiency of your security team relative to your organization", "controls": [{"id": "security-headcount", "label": "Security Team", "type": "range", "min": 1, "max": 500, "default": 10}, {"id": "engineering-headcount", "label": "Engineering/Technology", "type": "range", "min": 10, "max": 5000, "default": 500}, {"id": "company-headcount", "label": "Total Employees", "type": "range", "min": 100, "max": 100000, "default": 1500}], "results": [{"id": "security-vs-eng-percent", "label": "Security vs Engineering", "format": "percentage", "benchmark_key": "security_team_ratio.engineering"}, {"id": "security-vs-company-percent", "label": "Security vs Company", "format": "percentage", "benchmark_key": "security_team_ratio.company"}, {"id": "users-per-security-person", "label": "Users per Security Person", "format": "number", "benchmark_key": "users_per_security_person"}, {"id": "records-per-security-person", "label": "Data Records per Security Person (M)", "format": "number", "benchmark_key": "records_per_security_person"}]}, {"id": "customer-base", "title": "Customer & User Base", "icon": "groups", "status": "active", "description": "Track customer accounts, end users, and data records managed by your organization", "controls": [{"id": "customer-accounts", "label": "Customer Accounts", "type": "range", "min": 10, "max": 1000000, "default": 5000}, {"id": "end-users", "label": "Total End Users", "type": "range", "min": 100, "max": 10000000, "default": 25000}, {"id": "data-records", "label": "Data Records (millions)", "type": "range", "min": 1, "max": 1000, "default": 50}], "results": [{"id": "users-per-customer", "label": "Average Users per Customer", "format": "number", "benchmark_key": "users_per_customer"}, {"id": "records-per-customer", "label": "Data Records per Customer (K)", "format": "number", "benchmark_key": "records_per_customer"}, {"id": "data-density-score", "label": "Data Density Score", "format": "score", "benchmark_key": "data_density_score"}]}, {"id": "vulnerability-management", "title": "Vulnerability Management", "icon": "bug_report", "status": "active", "description": "Track your vulnerability remediation metrics, SLA compliance, and program maturity", "controls": [{"id": "num-repos", "label": "Code Repositories", "type": "range", "min": 1, "max": 10000, "default": 250}, {"id": "num-services", "label": "Services/Applications", "type": "range", "min": 1, "max": 1000, "default": 50}, {"id": "active-vulns", "label": "All Active Vulnerabilities", "type": "range", "min": 0, "max": 10000, "default": 850}, {"id": "exploitable-vulns", "label": "Active Exploitable Vulns", "type": "range", "min": 0, "max": 1000, "default": 45}, {"id": "vulns-past-sla", "label": "Vulnerabilities Past SLA", "type": "range", "min": 0, "max": 1000, "default": 12}, {"id": "avg-days-open", "label": "Average Days Open", "type": "range", "min": 1, "max": 365, "default": 45}], "results": [{"id": "sla-compliance-rate", "label": "SLA Compliance Rate", "format": "percentage", "benchmark_key": "vuln_sla_compliance"}, {"id": "vulns-per-repo", "label": "Vulnerabilities per Repository", "format": "number", "benchmark_key": "vulns_per_repo"}, {"id": "exploitable-percentage", "label": "Exploitable Vulnerability Rate", "format": "percentage", "benchmark_key": "exploitable_vuln_rate"}, {"id": "mean-time-to-fix", "label": "Mean Time to Fix (days)", "format": "number", "benchmark_key": "mean_time_to_fix"}]}, {"id": "security-budget", "title": "Security Budget Analysis", "icon": "account_balance", "status": "active", "description": "Analyze security spending patterns, ROI calculations, and budget optimization", "controls": [{"id": "security-budget", "label": "Annual Security Budget ($M)", "type": "range", "min": 0.1, "max": 100, "default": 2.5, "step": 0.1}, {"id": "operating-costs", "label": "Annual Operating Costs ($M)", "type": "range", "min": 1, "max": 1000, "default": 50}, {"id": "annual-revenue", "label": "Annual Revenue ($M)", "type": "range", "min": 1, "max": 10000, "default": 250}, {"id": "total-employees", "label": "Total Employees", "type": "range", "min": 10, "max": 50000, "default": 2500}], "results": [{"id": "budget-vs-revenue", "label": "Budget vs Revenue", "format": "percentage", "benchmark_key": "budget_vs_revenue"}, {"id": "budget-vs-opex", "label": "Budget vs Operating Costs", "format": "percentage", "benchmark_key": "budget_vs_opex"}, {"id": "budget-per-employee", "label": "Budget per Employee", "format": "currency", "benchmark_key": "budget_per_employee"}, {"id": "cost-per-end-user", "label": "Cost per End User", "format": "currency", "benchmark_key": "cost_per_end_user"}]}, {"id": "training-culture", "title": "Security Training & Culture", "icon": "school", "status": "active", "description": "Measure security awareness, training completion rates, and culture maturity", "controls": [{"id": "training-budget", "label": "Annual Training Budget ($K)", "type": "range", "min": 10, "max": 5000, "default": 250}, {"id": "employees-trained", "label": "Employees Completed Training", "type": "range", "min": 10, "max": 50000, "default": 2200}, {"id": "total-training-employees", "label": "Total Employees (Training Target)", "type": "range", "min": 10, "max": 50000, "default": 2500}, {"id": "phishing-tests-sent", "label": "Phishing Tests Sent", "type": "range", "min": 100, "max": 100000, "default": 12000}, {"id": "phishing-failures", "label": "Phishing Test Failures", "type": "range", "min": 0, "max": 10000, "default": 720}], "results": [{"id": "training-cost-per-employee", "label": "Training Cost per Employee", "format": "currency", "benchmark_key": "training_cost_per_employee"}, {"id": "training-completion-rate", "label": "Training Completion Rate", "format": "percentage", "benchmark_key": "training_completion_rate"}, {"id": "phishing-failure-rate", "label": "Phishing Failure Rate", "format": "percentage", "benchmark_key": "phishing_failure_rate"}, {"id": "security-awareness-score", "label": "Security Awareness Score", "format": "score", "benchmark_key": "security_awareness_score"}]}];
const benchmarks = {"company_sizes": "", "startup": "", "name": "Manufacturing", "employee_range": "10000+", "small": "", "medium": "", "large": "", "enterprise": "", "industries": "", "technology": "", "risk_multiplier": 0.9, "financial": "", "healthcare": "", "retail": "", "manufacturing": "", "benchmarks": "", "security_team_ratio": "", "engineering": "", "healthy": "{ min: 80, max: 100 }       # composite awareness score", "warning": "{ min: 60, max: 80 }", "critical": "{ min: 0, max: 60 }", "company": "", "users_per_security_person": "", "records_per_security_person": "", "users_per_customer": "", "saas_b2b": "", "consumer": "", "records_per_customer": "", "data_heavy": "", "data_density_score": "", "vuln_sla_compliance": "", "vulns_per_repo": "", "exploitable_vuln_rate": "", "mean_time_to_fix": "", "budget_per_employee": "", "budget_vs_revenue": "", "budget_vs_opex": "", "cost_per_end_user": "", "saas": "", "training_cost_per_employee": "", "training_completion_rate": "", "phishing_failure_rate": "", "security_awareness_score": ""};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading metrics calculator with', metricsData.length, 'metric cards');
    
    // Generate metric cards dynamically
    generateMetricCards(metricsData);
    
    // Initialize calculations after cards are created
    initializeCalculations();
});

function generateMetricCards(metrics) {
    const container = document.getElementById('metrics-grid');
    if (!container) {
        console.error('Metrics grid container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    metrics.forEach(metric => {
        const card = createMetricCard(metric);
        container.appendChild(card);
    });
}

function createMetricCard(metric) {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.id = metric.id + '-card';
    
    card.innerHTML = `
        <div class="card-header">
            <span class="material-symbols-outlined">${metric.icon}</span>
            <h3>${metric.title}</h3>
        </div>
        <div class="metric-controls">
            ${generateControls(metric.controls || [], metric.id)}
        </div>
        <div class="results">
            ${generateResults(metric.results || [])}
        </div>
    `;
    
    return card;
}

function generateControls(controls, metricId) {
    if (!controls || controls.length === 0) {
        return '<p>No controls defined</p>';
    }
    
    return controls.map(control => `
        <div class="slider-group">
            <label for="${control.id}">${control.label}</label>
            <div class="slider-container">
                <input type="range" id="${control.id}" 
                       min="${control.min}" max="${control.max}" 
                       value="${control.default}" 
                       ${control.step ? `step="${control.step}"` : ''}
                       class="slider" data-metric="${metricId}">
                <input type="number" id="${control.id}-input" 
                       min="${control.min}" max="${control.max}" 
                       value="${control.default}" 
                       ${control.step ? `step="${control.step}"` : ''}
                       class="number-input" data-metric="${metricId}">
            </div>
        </div>
    `).join('');
}

function generateResults(results) {
    if (!results || results.length === 0) {
        return '<p>No results defined</p>';
    }
    
    return results.map(result => `
        <div class="result-item">
            <div class="result-value" id="${result.id}">Calculating...</div>
            <div class="result-label">${result.label}</div>
            <div class="benchmark" id="${result.id}-benchmark">Calculating...</div>
        </div>
    `).join('');
}

// Initialize all metrics after cards are created
function initializeCalculations() {
    // Benchmark data
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

    // Initialize event listeners for all cards
    metricsData.forEach(metric => {
        initializeMetric(metric.id);
    });

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
            slider.value = input.value;
            calculateMetric(metricId);
        });
    }

    function calculateMetric(metricId) {
        switch (metricId) {
            case 'security-org-size':
                calculateSecurityOrgSize();
                break;
            case 'customer-base':
                calculateCustomerBase();
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
        const securityHeadcount = getInputValue('security-headcount');
        const engineeringHeadcount = getInputValue('engineering-headcount');
        const companyHeadcount = getInputValue('company-headcount');
        const endUsers = getInputValue('end-users');
        const dataRecords = getInputValue('data-records');

        const securityVsEngPercent = (securityHeadcount / engineeringHeadcount * 100);
        const securityVsCompanyPercent = (securityHeadcount / companyHeadcount * 100);
        const usersPerSecurityPerson = Math.round(endUsers / securityHeadcount);
        const recordsPerSecurityPerson = (dataRecords / securityHeadcount);

        updateResult('security-vs-eng-percent', securityVsEngPercent, 'percentage', 'security_team_ratio.engineering');
        updateResult('security-vs-company-percent', securityVsCompanyPercent, 'percentage', 'security_team_ratio.company');
        updateResult('users-per-security-person', usersPerSecurityPerson, 'number', 'users_per_security_person');
        updateResult('records-per-security-person', recordsPerSecurityPerson, 'number', 'records_per_security_person', ' M');
    }

    function calculateCustomerBase() {
        const customerAccounts = getInputValue('customer-accounts');
        const endUsers = getInputValue('end-users');
        const dataRecords = getInputValue('data-records');

        const usersPerCustomer = (endUsers / customerAccounts);
        const recordsPerCustomer = (dataRecords * 1000000 / customerAccounts / 1000); // Convert to K
        const dataDensityScore = Math.min(100, Math.round((recordsPerCustomer / 10) * 25 + (usersPerCustomer / 10) * 25 + 50));

        updateResult('users-per-customer', usersPerCustomer, 'number', 'users_per_customer');
        updateResult('records-per-customer', recordsPerCustomer, 'number', 'records_per_customer', ' K');
        updateResult('data-density-score', dataDensityScore, 'score', 'data_density_score');
    }

    function calculateVulnManagement() {
        const numRepos = getInputValue('num-repos');
        const activeVulns = getInputValue('active-vulns');
        const exploitableVulns = getInputValue('exploitable-vulns');
        const vulnsPastSla = getInputValue('vulns-past-sla');
        const avgDaysOpen = getInputValue('avg-days-open');

        const slaComplianceRate = ((activeVulns - vulnsPastSla) / activeVulns * 100);
        const vulnsPerRepo = (activeVulns / numRepos);
        const exploitablePercentage = (exploitableVulns / activeVulns * 100);
        const meanTimeToFix = avgDaysOpen;

        updateResult('sla-compliance-rate', slaComplianceRate, 'percentage', 'vuln_sla_compliance');
        updateResult('vulns-per-repo', vulnsPerRepo, 'number', 'vulns_per_repo');
        updateResult('exploitable-percentage', exploitablePercentage, 'percentage', 'exploitable_percentage');
        updateResult('mean-time-to-fix', meanTimeToFix, 'number', 'mean_time_to_fix', ' days');
    }

    function calculateSecurityBudget() {
        const securityBudget = getInputValue('security-budget') * 1000000; // Convert to dollars
        const annualRevenue = getInputValue('annual-revenue') * 1000000;
        const operatingCosts = getInputValue('operating-costs') * 1000000;
        const totalEmployees = getInputValue('total-employees');
        const endUsers = getInputValue('end-users') || 25000; // Fallback if not available

        const budgetVsRevenue = (securityBudget / annualRevenue * 100);
        const budgetVsOpex = (securityBudget / operatingCosts * 100);
        const budgetPerEmployee = (securityBudget / totalEmployees);
        const costPerEndUser = (securityBudget / endUsers);

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

        const trainingCostPerEmployee = (trainingBudget / totalEmployees);
        const trainingCompletionRate = (employeesTrained / totalEmployees * 100);
        const phishingFailureRate = (phishingFailures / phishingTestsSent * 100);
        const securityAwarenessScore = Math.round((100 - phishingFailureRate) * 0.6 + trainingCompletionRate * 0.4);

        updateResult('training-cost-per-employee', trainingCostPerEmployee, 'currency', 'training_cost_per_employee');
        updateResult('training-completion-rate', trainingCompletionRate, 'percentage', 'training_completion_rate');
        updateResult('phishing-failure-rate', phishingFailureRate, 'percentage', 'phishing_failure_rate');
        updateResult('security-awareness-score', securityAwarenessScore, 'score', 'security_awareness_score');
    }

    function getInputValue(id) {
        const element = document.getElementById(id) || document.getElementById(id + '-input');
        return element ? parseFloat(element.value) || 0 : 0;
    }

    function updateResult(elementId, value, format, benchmarkKey, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        let formattedValue;
        switch (format) {
            case 'percentage':
                formattedValue = value.toFixed(1) + '%';
                break;
            case 'currency':
                formattedValue = '$' + Math.round(value).toLocaleString();
                break;
            case 'score':
                formattedValue = Math.round(value) + '/100';
                break;
            default:
                formattedValue = value.toFixed(1) + suffix;
        }

        element.textContent = formattedValue;

        // Update benchmark
        const benchmarkElement = document.getElementById(elementId + '-benchmark');
        if (benchmarkElement && benchmarkKey) {
            updateBenchmark(benchmarkElement, value, benchmarkKey);
        }
    }

    function updateBenchmark(element, value, benchmarkKey) {
        const benchmark = getBenchmark(benchmarkKey);
        if (!benchmark) {
            element.textContent = 'No benchmark';
            return;
        }

        if (value >= benchmark.healthy.min && value <= benchmark.healthy.max) {
            element.textContent = `Healthy: ${benchmark.healthy.min}-${benchmark.healthy.max}`;
            element.className = 'benchmark healthy';
        } else if (value >= benchmark.warning.min && value <= benchmark.warning.max) {
            element.textContent = `Warning: ${benchmark.warning.min}-${benchmark.warning.max}`;
            element.className = 'benchmark warning';
        } else {
            element.textContent = `Critical: ${benchmark.critical.min}-${benchmark.critical.max}`;
            element.className = 'benchmark critical';
        }
    }

    function getBenchmark(key) {
        const keys = key.split('.');
        let result = benchmarks;
        for (const k of keys) {
            result = result[k];
            if (!result) return null;
        }
        return result;
    }
}