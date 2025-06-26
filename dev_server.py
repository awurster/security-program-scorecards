#!/usr/bin/env python3
"""
Simple Jekyll-like development server
Processes YAML data files and templates, serves with auto-reload
"""

import os
import yaml
import json
import time
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

class TemplateProcessor:
    def __init__(self):
        self.data = {}
        self.load_data()
    
    def load_data(self):
        """Load all YAML data files"""
        data_dir = '_data'
        if os.path.exists(data_dir):
            for filename in os.listdir(data_dir):
                if filename.endswith('.yml') or filename.endswith('.yaml'):
                    filepath = os.path.join(data_dir, filename)
                    with open(filepath, 'r') as f:
                        key = filename.split('.')[0]
                        self.data[key] = yaml.safe_load(f)
        print(f"Loaded data: {list(self.data.keys())}")
    
    def generate_calculator_js(self):
        """Generate JavaScript calculator with embedded YAML data"""
        js_content = f'''
// Auto-generated Security Program Calculator from YAML data
document.addEventListener('DOMContentLoaded', function () {{
    // Embedded data from YAML files
    const yamlData = {json.dumps(self.data, indent=4)};
    const benchmarks = yamlData.benchmarks?.benchmarks || {{}};
    
    // Browser shortcuts handling
    document.addEventListener('keydown', function (e) {{
        if (e.metaKey || e.ctrlKey) {{ return true; }}
    }});

    // Logarithmic scaling configuration
    const logScaleConfig = {{
        'engineering-headcount': {{ min: 10, max: 5000, useLog: true }},
        'company-headcount': {{ min: 100, max: 100000, useLog: true }},
        'end-users': {{ min: 100, max: 10000000, useLog: true }},
        'data-records': {{ min: 1, max: 1000, useLog: true }},
        'customer-accounts': {{ min: 10, max: 1000000, useLog: true }},
        'end-users-base': {{ min: 100, max: 10000000, useLog: true }},
        'data-records-base': {{ min: 1, max: 1000, useLog: true }},
        'num-repos': {{ min: 1, max: 10000, useLog: true }},
        'active-vulns': {{ min: 0, max: 10000, useLog: true }},
        'annual-revenue': {{ min: 1, max: 10000, useLog: true }},
        'operating-costs': {{ min: 1, max: 1000, useLog: true }},
        'total-employees': {{ min: 10, max: 50000, useLog: true }},
        'training-budget': {{ min: 10, max: 5000, useLog: true }}
    }};

    // Initialize all metrics
    initializeMetric('security-org-size');
    initializeMetric('customer-base');
    initializeMetric('vulnerability-management');
    initializeMetric('security-budget');
    initializeMetric('training-culture');

    function initializeMetric(metricId) {{
        const metricCard = document.getElementById(metricId + '-card');
        if (!metricCard) return;

        const sliders = metricCard.querySelectorAll('.slider[data-metric="' + metricId + '"]');
        
        sliders.forEach(slider => {{
            const input = document.getElementById(slider.id + '-input');
            if (input) {{
                setupLogarithmicSlider(slider, input);
                syncSliderAndInput(slider, input, metricId);
            }}
        }});

        calculateMetric(metricId);
    }}

    function setupLogarithmicSlider(slider, input) {{
        const config = logScaleConfig[slider.id];
        if (!config || !config.useLog) return;

        slider.min = 0;
        slider.max = 100;
        const currentValue = parseFloat(input.value);
        slider.value = linearToLog(currentValue, config.min, config.max);
    }}

    function linearToLog(value, min, max) {{
        if (value <= min) return 0;
        if (value >= max) return 100;
        if (min === 0) {{
            min = 0.1;
            if (value === 0) return 0;
        }}
        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logValue = Math.log(value);
        return ((logValue - logMin) / (logMax - logMin)) * 100;
    }}

    function logToLinear(sliderValue, min, max) {{
        if (sliderValue <= 0) return min;
        if (sliderValue >= 100) return max;
        if (min === 0) {{
            if (sliderValue === 0) return 0;
            min = 0.1;
        }}
        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logValue = logMin + (sliderValue / 100) * (logMax - logMin);
        let result = Math.exp(logValue);
        if (result < 1) {{
            result = Math.round(result * 10) / 10;
        }} else {{
            result = Math.round(result);
        }}
        return Math.max(min === 0.1 ? 0 : min, Math.min(max, result));
    }}

    function syncSliderAndInput(slider, input, metricId) {{
        const config = logScaleConfig[slider.id];
        let isUserTyping = false;
        let typingTimeout;

        slider.addEventListener('input', function () {{
            if (isUserTyping) return;
            if (config && config.useLog) {{
                const linearValue = logToLinear(parseFloat(slider.value), config.min, config.max);
                input.value = linearValue;
            }} else {{
                input.value = slider.value;
            }}
            calculateMetric(metricId);
        }});

        input.addEventListener('input', function () {{
            isUserTyping = true;
            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {{
                let value = parseFloat(input.value);
                if (config && config.useLog) {{
                    if (!isNaN(value)) {{
                        slider.value = linearToLog(value, config.min, config.max);
                    }}
                }} else {{
                    const min = parseFloat(slider.min);
                    const max = parseFloat(slider.max);
                    if (isNaN(value) || input.value === '') value = parseFloat(slider.value);
                    if (value < min) value = min;
                    if (value > max) value = max;
                    input.value = value;
                    slider.value = value;
                }}
                calculateMetric(metricId);
                isUserTyping = false;
            }}, 300);
        }});

        input.addEventListener('focus', function () {{
            isUserTyping = true;
            if (typingTimeout) clearTimeout(typingTimeout);
        }});
    }}

    function calculateMetric(metricId) {{
        switch (metricId) {{
            case 'security-org-size': calculateSecurityOrgSize(); break;
            case 'customer-base': calculateCustomerBase(); break;
            case 'vulnerability-management': calculateVulnManagement(); break;
            case 'security-budget': calculateSecurityBudget(); break;
            case 'training-culture': calculateTrainingCulture(); break;
        }}
    }}

    function calculateSecurityOrgSize() {{
        const security = getInputValue('security-headcount');
        const engineering = getInputValue('engineering-headcount');
        const company = getInputValue('company-headcount');
        const endUsers = getInputValue('end-users');
        const dataRecords = getInputValue('data-records');

        updateResult('security-vs-eng-percent', (security / engineering) * 100, 'percentage', 'security_team_ratio.engineering');
        updateResult('security-vs-company-percent', (security / company) * 100, 'percentage', 'security_team_ratio.company');
        updateResult('users-per-security-person', Math.round(endUsers / security), 'number', 'users_per_security_person');
        updateResult('records-per-security-person', dataRecords / security, 'number', 'records_per_security_person', ' M');
    }}

    function calculateCustomerBase() {{
        const customerAccounts = getInputValue('customer-accounts');
        const endUsers = getInputValue('end-users-base');
        const dataRecords = getInputValue('data-records-base');

        const usersPerCustomer = endUsers / customerAccounts;
        const recordsPerCustomer = (dataRecords * 1000) / customerAccounts;
        
        let dataDensityScore = 50;
        if (usersPerCustomer >= 2 && usersPerCustomer <= 10) dataDensityScore += 25;
        else if (usersPerCustomer > 10 && usersPerCustomer <= 50) dataDensityScore += 10;
        
        if (recordsPerCustomer >= 1 && recordsPerCustomer <= 10) dataDensityScore += 25;
        else if (recordsPerCustomer > 10 && recordsPerCustomer <= 50) dataDensityScore += 10;

        updateResult('users-per-customer', usersPerCustomer, 'number', 'users_per_customer');
        updateResult('records-per-customer', recordsPerCustomer, 'number', 'records_per_customer', ' K');
        updateResult('data-density-score', dataDensityScore, 'score', 'data_density_score');
    }}

    function calculateVulnManagement() {{
        const repos = getInputValue('num-repos');
        const activeVulns = getInputValue('active-vulns');
        const exploitableVulns = getInputValue('exploitable-vulns');
        const vulnsPastSla = getInputValue('vulns-past-sla');
        const avgDaysOpen = getInputValue('avg-days-open');

        updateResult('sla-compliance-rate', ((activeVulns - vulnsPastSla) / activeVulns) * 100, 'percentage', 'vuln_sla_compliance');
        updateResult('vulns-per-repo', activeVulns / repos, 'number', 'vulns_per_repo');
        updateResult('exploitable-percentage', (exploitableVulns / activeVulns) * 100, 'percentage', 'exploitable_vuln_rate');
        updateResult('mean-time-to-fix', avgDaysOpen, 'number', 'mean_time_to_fix', ' days');
    }}

    function calculateSecurityBudget() {{
        const budget = getInputValue('security-budget') * 1000000;
        const revenue = getInputValue('annual-revenue') * 1000000;
        const opex = getInputValue('operating-costs') * 1000000;
        const employees = getInputValue('total-employees');
        const endUsers = getInputValue('end-users') || getInputValue('end-users-base') || 25000;

        updateResult('budget-vs-revenue', (budget / revenue) * 100, 'percentage', 'budget_vs_revenue');
        updateResult('budget-vs-opex', (budget / opex) * 100, 'percentage', 'budget_vs_opex');
        updateResult('budget-per-employee', budget / employees, 'currency', 'budget_per_employee');
        updateResult('cost-per-end-user', budget / endUsers, 'currency', 'cost_per_end_user');
    }}

    function calculateTrainingCulture() {{
        const trainingBudget = getInputValue('training-budget') * 1000;
        const employeesTrained = getInputValue('employees-trained');
        const totalEmployees = getInputValue('total-training-employees');
        const phishingTestsSent = getInputValue('phishing-tests-sent');
        const phishingFailures = getInputValue('phishing-failures');

        updateResult('training-cost-per-employee', trainingBudget / totalEmployees, 'currency', 'training_cost_per_employee');
        updateResult('training-completion-rate', (employeesTrained / totalEmployees) * 100, 'percentage', 'training_completion_rate');
        updateResult('phishing-failure-rate', (phishingFailures / phishingTestsSent) * 100, 'percentage', 'phishing_failure_rate');
        updateResult('security-awareness-score', Math.max(0, 100 - ((phishingFailures / phishingTestsSent) * 100)), 'score', 'security_awareness_score');
    }}

    function getInputValue(id) {{
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) || 0 : 0;
    }}

    function updateResult(elementId, value, format, benchmarkKey, suffix = '') {{
        const element = document.getElementById(elementId);
        const benchmarkElement = document.getElementById(elementId + '-benchmark');
        if (!element) return;

        let displayValue;
        switch (format) {{
            case 'percentage': displayValue = value.toFixed(1) + '%'; break;
            case 'currency': displayValue = '$' + Math.round(value).toLocaleString(); break;
            case 'number': displayValue = value.toFixed(1) + suffix; break;
            case 'score': displayValue = Math.round(value) + '/100'; break;
            default: displayValue = value.toFixed(1);
        }}
        element.textContent = displayValue;

        if (benchmarkElement && benchmarkKey) {{
            updateBenchmark(benchmarkElement, value, benchmarkKey);
        }}
    }}

    function updateBenchmark(element, value, benchmarkKey) {{
        const benchmark = getBenchmark(benchmarkKey);
        if (!benchmark) {{
            element.textContent = 'Calculating...';
            return;
        }}

        let status, message;
        if (value >= benchmark.healthy.min && value <= benchmark.healthy.max) {{
            status = 'healthy';
            message = `Healthy: ${{benchmark.healthy.min}}-${{benchmark.healthy.max}}`;
        }} else if (benchmark.warning && value >= benchmark.warning.min && value <= benchmark.warning.max) {{
            status = 'warning';
            message = `Warning: ${{benchmark.warning.min}}-${{benchmark.warning.max}}`;
        }} else {{
            status = 'critical';
            message = 'Critical: Outside normal range';
        }}

        element.textContent = message;
        element.className = `benchmark ${{status}}`;
    }}

    function getBenchmark(key) {{
        const parts = key.split('.');
        let benchmark = benchmarks;
        for (const part of parts) {{
            benchmark = benchmark[part];
            if (!benchmark) return null;
        }}
        return benchmark;
    }}
}});
'''
        return js_content

class DevServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Add cache-busting headers for development
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            super().do_GET()
        except:
            pass
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def watch_files(processor):
    """Simple file watcher using polling"""
    last_modified = {}
    
    def get_file_time(filepath):
        try:
            return os.path.getmtime(filepath)
        except:
            return 0
    
    def check_files():
        changed = False
        for root, dirs, files in os.walk('.'):
            # Skip hidden directories and _site
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != '_site']
            
            for file in files:
                if file.endswith(('.yml', '.yaml')):
                    filepath = os.path.join(root, file)
                    current_time = get_file_time(filepath)
                    
                    if filepath not in last_modified:
                        last_modified[filepath] = current_time
                    elif current_time > last_modified[filepath]:
                        print(f"🔄 File changed: {{filepath}}")
                        last_modified[filepath] = current_time
                        changed = True
        
        if changed:
            processor.load_data()
            with open('script.js', 'w') as f:
                f.write(processor.generate_calculator_js())
            print("✅ Updated script.js with latest YAML data")
    
    # Initial check
    check_files()
    
    # Watch for changes
    import threading
    def watch_loop():
        while True:
            time.sleep(2)  # Check every 2 seconds
            check_files()
    
    watcher_thread = threading.Thread(target=watch_loop, daemon=True)
    watcher_thread.start()

def main():
    print("🚀 Starting Jekyll-like development server...")
    
    # Install required packages if missing
    try:
        import yaml
    except ImportError:
        print("Installing PyYAML...")
        os.system("pip3 install pyyaml")
        import yaml
    
    # Initialize template processor
    processor = TemplateProcessor()
    
    # Generate initial JavaScript file
    with open('script.js', 'w') as f:
        f.write(processor.generate_calculator_js())
    print("✅ Generated script.js with YAML data")
    
    # Start file watcher
    watch_files(processor)
    
    # Start HTTP server
    PORT = 8000
    
    class TCPServer(socketserver.TCPServer):
        allow_reuse_address = True
    
    try:
        with TCPServer(("", PORT), DevServer) as httpd:
            print(f"✅ Server running at http://localhost:{{PORT}}")
            print("📁 Watching YAML files for changes...")
            print("🔄 Auto-updating script.js when YAML changes")
            print("Press Ctrl+C to stop")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")

if __name__ == "__main__":
    main() 