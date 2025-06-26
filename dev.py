#!/usr/bin/env python3
"""
Super simple dev server - just watches files and regenerates instantly
"""
import os
import time
import threading
import subprocess
from http.server import SimpleHTTPRequestHandler, HTTPServer

class YAMLProcessor:
    def __init__(self):
        self.data = {}
    
    def simple_yaml_parse(self, content):
        """Parse YAML content - handles metrics list structure"""
        # For metrics.yml, we know it's a list of metric objects
        if 'id:' in content and 'title:' in content:
            return self.parse_metrics_list(content)
        
        # For other YAML files, use simple key-value parsing
        result = {}
        lines = content.strip().split('\n')
        current_key = None
        current_value = ""
        
        for line in lines:
            stripped = line.strip()
            if not stripped or stripped.startswith('#'):
                continue
                
            if ':' in stripped and not stripped.startswith(' '):
                # Save previous key-value
                if current_key:
                    result[current_key] = self.parse_value(current_value.strip())
                
                # Start new key-value
                key, value = stripped.split(':', 1)
                current_key = key.strip()
                current_value = value.strip()
            else:
                # Continuation of current value
                current_value += " " + stripped
        
        # Don't forget the last key-value
        if current_key:
            result[current_key] = self.parse_value(current_value.strip())
            
        return result
    
    def parse_metrics_list(self, content):
        """Parse the metrics.yml file which is a list of metric objects"""
        metrics = []
        lines = content.strip().split('\n')
        current_metric = {}
        current_list = []
        current_list_key = None
        in_list = False
        
        for line in lines:
            stripped = line.strip()
            if not stripped or stripped.startswith('#'):
                continue
            
            # New metric starts with "- id:"
            if stripped.startswith('- id:'):
                # Save previous metric
                if current_metric:
                    if current_list_key and current_list:
                        current_metric[current_list_key] = current_list
                    metrics.append(current_metric)
                
                # Start new metric
                current_metric = {}
                current_list = []
                current_list_key = None
                in_list = False
                
                # Parse the id
                _, value = stripped[2:].split(':', 1)
                current_metric['id'] = value.strip()
                
            elif ':' in stripped and not stripped.startswith('-') and not stripped.startswith(' '):
                # Top-level key in metric
                if current_list_key and current_list:
                    current_metric[current_list_key] = current_list
                    current_list = []
                
                key, value = stripped.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                if key in ['controls', 'results']:
                    current_list_key = key
                    in_list = True
                else:
                    current_metric[key] = self.parse_value(value)
                    in_list = False
                    
            elif stripped.startswith('- ') and in_list:
                # List item in controls or results
                item_content = stripped[2:].strip()
                if ':' in item_content:
                    key, value = item_content.split(':', 1)
                    current_list.append({key.strip(): self.parse_value(value.strip())})
                else:
                    current_list.append(self.parse_value(item_content))
                    
            elif ':' in stripped and stripped.startswith(' ') and current_list:
                # Nested property in list item
                key, value = stripped.split(':', 1)
                key = key.strip()
                value = value.strip()
                if current_list and isinstance(current_list[-1], dict):
                    current_list[-1][key] = self.parse_value(value)
        
        # Don't forget the last metric
        if current_metric:
            if current_list_key and current_list:
                current_metric[current_list_key] = current_list
            metrics.append(current_metric)
            
        return metrics
    
    def parse_value(self, value):
        """Parse a YAML value"""
        if not value:
            return ""
        
        # Remove quotes
        if (value.startswith('"') and value.endswith('"')) or \
           (value.startswith("'") and value.endswith("'")):
            return value[1:-1]
        
        # Try to parse as number
        try:
            if '.' in value:
                return float(value)
            return int(value)
        except ValueError:
            pass
        
        # Boolean
        if value.lower() in ['true', 'yes', 'on']:
            return True
        if value.lower() in ['false', 'no', 'off']:
            return False
            
        return value
    
    def load_data(self):
        """Load YAML data files"""
        self.data = {}
        
        yaml_files = ['site.yml', 'metrics.yml', 'benchmarks.yml']
        loaded = []
        
        for filename in yaml_files:
            filepath = os.path.join('_data', filename)
            if os.path.exists(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    key = filename.replace('.yml', '')
                    if key == 'metrics':
                        self.data[key] = self.parse_metrics_list(content)
                    else:
                        self.data[key] = self.simple_yaml_parse(content)
                    loaded.append(key)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
        
        print(f"Loaded data: {loaded}")
        return self.data
    
    def generate_calculator_js(self):
        """Generate the calculator JavaScript file"""
        self.load_data()
        
        # Get data
        site_data = self.data.get('site', {})
        metrics_data = self.data.get('metrics', [])
        benchmarks_data = self.data.get('benchmarks', {})
        
        # Manually structure the metrics data since YAML parsing is complex
        structured_metrics = self.structure_metrics_data(metrics_data)
        
        js_content = f'''// Generated from YAML data - DO NOT EDIT MANUALLY
const siteData = {str(site_data).replace("'", '"')};
const metricsData = {str(structured_metrics).replace("'", '"')};
const benchmarks = {str(benchmarks_data).replace("'", '"')};

document.addEventListener('DOMContentLoaded', function() {{
    console.log('Loading metrics calculator with', metricsData.length, 'metric cards');
    
    // Generate metric cards dynamically
    generateMetricCards(metricsData);
    
    // Initialize calculations after cards are created
    initializeCalculations();
}});

function generateMetricCards(metrics) {{
    const container = document.getElementById('metrics-grid');
    if (!container) {{
        console.error('Metrics grid container not found');
        return;
    }}
    
    // Clear existing content
    container.innerHTML = '';
    
    metrics.forEach(metric => {{
        const card = createMetricCard(metric);
        container.appendChild(card);
    }});
}}

function createMetricCard(metric) {{
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.id = metric.id + '-card';
    
    card.innerHTML = `
        <div class="card-header">
            <span class="material-symbols-outlined">${{metric.icon}}</span>
            <h3>${{metric.title}}</h3>
        </div>
        <div class="metric-controls">
            ${{generateControls(metric.controls || [], metric.id)}}
        </div>
        <div class="results">
            ${{generateResults(metric.results || [])}}
        </div>
    `;
    
    return card;
}}

function generateControls(controls, metricId) {{
    if (!controls || controls.length === 0) {{
        return '<p>No controls defined</p>';
    }}
    
    return controls.map(control => `
        <div class="slider-group">
            <label for="${{control.id}}">${{control.label}}</label>
            <div class="slider-container">
                <input type="range" id="${{control.id}}" 
                       min="${{control.min}}" max="${{control.max}}" 
                       value="${{control.default}}" 
                       ${{control.step ? `step="${{control.step}}"` : ''}}
                       class="slider" data-metric="${{metricId}}">
                <input type="number" id="${{control.id}}-input" 
                       min="${{control.min}}" max="${{control.max}}" 
                       value="${{control.default}}" 
                       ${{control.step ? `step="${{control.step}}"` : ''}}
                       class="number-input" data-metric="${{metricId}}">
            </div>
        </div>
    `).join('');
}}

function generateResults(results) {{
    if (!results || results.length === 0) {{
        return '<p>No results defined</p>';
    }}
    
    return results.map(result => `
        <div class="result-item">
            <div class="result-value" id="${{result.id}}">Calculating...</div>
            <div class="result-label">${{result.label}}</div>
            <div class="benchmark" id="${{result.id}}-benchmark">Calculating...</div>
        </div>
    `).join('');
}}

// Initialize all metrics after cards are created
function initializeCalculations() {{
    // Benchmark data
    const benchmarks = {{
        security_team_ratio: {{
            engineering: {{ healthy: {{ min: 1.0, max: 2.5 }}, warning: {{ min: 0.5, max: 1.0 }}, critical: {{ min: 0.0, max: 0.5 }} }},
            company: {{ healthy: {{ min: 1.0, max: 2.0 }}, warning: {{ min: 0.5, max: 1.0 }}, critical: {{ min: 0.0, max: 0.5 }} }}
        }},
        users_per_security_person: {{
            healthy: {{ min: 50, max: 400 }}, warning: {{ min: 400, max: 800 }}, critical: {{ min: 800, max: 2000 }}
        }},
        records_per_security_person: {{
            healthy: {{ min: 0.1, max: 5.0 }}, warning: {{ min: 5.0, max: 15.0 }}, critical: {{ min: 15.0, max: 50.0 }}
        }},
        vulns_per_repo: {{
            healthy: {{ min: 0, max: 2 }}, warning: {{ min: 2, max: 5 }}, critical: {{ min: 5, max: 20 }}
        }},
        exploitable_percentage: {{
            healthy: {{ min: 0, max: 5 }}, warning: {{ min: 5, max: 15 }}, critical: {{ min: 15, max: 50 }}
        }},
        vuln_sla_compliance: {{
            healthy: {{ min: 85, max: 100 }}, warning: {{ min: 70, max: 85 }}, critical: {{ min: 0, max: 70 }}
        }},
        mean_time_to_fix: {{
            healthy: {{ min: 0, max: 30 }}, warning: {{ min: 30, max: 90 }}, critical: {{ min: 90, max: 365 }}
        }},
        budget_vs_revenue: {{
            healthy: {{ min: 1.0, max: 3.0 }}, warning: {{ min: 0.5, max: 1.0 }}, critical: {{ min: 0.0, max: 0.5 }}
        }},
        budget_vs_opex: {{
            healthy: {{ min: 2.0, max: 8.0 }}, warning: {{ min: 1.0, max: 2.0 }}, critical: {{ min: 0.0, max: 1.0 }}
        }},
        budget_per_employee: {{
            healthy: {{ min: 2000, max: 5000 }}, warning: {{ min: 1000, max: 2000 }}, critical: {{ min: 0, max: 1000 }}
        }},
        cost_per_end_user: {{
            healthy: {{ min: 50, max: 200 }}, warning: {{ min: 20, max: 50 }}, critical: {{ min: 0, max: 20 }}
        }},
        training_cost_per_employee: {{
            healthy: {{ min: 100, max: 500 }}, warning: {{ min: 50, max: 100 }}, critical: {{ min: 0, max: 50 }}
        }},
        training_completion_rate: {{
            healthy: {{ min: 90, max: 100 }}, warning: {{ min: 75, max: 90 }}, critical: {{ min: 0, max: 75 }}
        }},
        phishing_failure_rate: {{
            healthy: {{ min: 0, max: 5 }}, warning: {{ min: 5, max: 15 }}, critical: {{ min: 15, max: 50 }}
        }},
        security_awareness_score: {{
            healthy: {{ min: 85, max: 100 }}, warning: {{ min: 70, max: 85 }}, critical: {{ min: 0, max: 70 }}
        }}
    }};

    // Initialize event listeners for all cards
    metricsData.forEach(metric => {{
        initializeMetric(metric.id);
    }});

    function initializeMetric(metricId) {{
        const metricCard = document.getElementById(metricId + '-card');
        if (!metricCard) return;

        // Find all sliders and inputs for this metric
        const sliders = metricCard.querySelectorAll('.slider[data-metric="' + metricId + '"]');
        const inputs = metricCard.querySelectorAll('.number-input[data-metric="' + metricId + '"]');

        // Set up sync for each slider/input pair
        sliders.forEach(slider => {{
            const input = document.getElementById(slider.id + '-input');
            if (input) {{
                syncSliderAndInput(slider, input, metricId);
            }}
        }});

        // Initial calculation
        calculateMetric(metricId);
    }}

    function syncSliderAndInput(slider, input, metricId) {{
        slider.addEventListener('input', function () {{
            input.value = slider.value;
            calculateMetric(metricId);
        }});

        input.addEventListener('input', function () {{
            slider.value = input.value;
            calculateMetric(metricId);
        }});
    }}

    function calculateMetric(metricId) {{
        switch (metricId) {{
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
        }}
    }}

    function calculateSecurityOrgSize() {{
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
    }}

    function calculateCustomerBase() {{
        const customerAccounts = getInputValue('customer-accounts');
        const endUsers = getInputValue('end-users');
        const dataRecords = getInputValue('data-records');

        const usersPerCustomer = (endUsers / customerAccounts);
        const recordsPerCustomer = (dataRecords * 1000000 / customerAccounts / 1000); // Convert to K
        const dataDensityScore = Math.min(100, Math.round((recordsPerCustomer / 10) * 25 + (usersPerCustomer / 10) * 25 + 50));

        updateResult('users-per-customer', usersPerCustomer, 'number', 'users_per_customer');
        updateResult('records-per-customer', recordsPerCustomer, 'number', 'records_per_customer', ' K');
        updateResult('data-density-score', dataDensityScore, 'score', 'data_density_score');
    }}

    function calculateVulnManagement() {{
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
    }}

    function calculateSecurityBudget() {{
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
    }}

    function calculateTrainingCulture() {{
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
    }}

    function getInputValue(id) {{
        const element = document.getElementById(id) || document.getElementById(id + '-input');
        return element ? parseFloat(element.value) || 0 : 0;
    }}

    function updateResult(elementId, value, format, benchmarkKey, suffix = '') {{
        const element = document.getElementById(elementId);
        if (!element) return;

        let formattedValue;
        switch (format) {{
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
        }}

        element.textContent = formattedValue;

        // Update benchmark
        const benchmarkElement = document.getElementById(elementId + '-benchmark');
        if (benchmarkElement && benchmarkKey) {{
            updateBenchmark(benchmarkElement, value, benchmarkKey);
        }}
    }}

    function updateBenchmark(element, value, benchmarkKey) {{
        const benchmark = getBenchmark(benchmarkKey);
        if (!benchmark) {{
            element.textContent = 'No benchmark';
            return;
        }}

        if (value >= benchmark.healthy.min && value <= benchmark.healthy.max) {{
            element.textContent = `Healthy: ${{benchmark.healthy.min}}-${{benchmark.healthy.max}}`;
            element.className = 'benchmark healthy';
        }} else if (value >= benchmark.warning.min && value <= benchmark.warning.max) {{
            element.textContent = `Warning: ${{benchmark.warning.min}}-${{benchmark.warning.max}}`;
            element.className = 'benchmark warning';
        }} else {{
            element.textContent = `Critical: ${{benchmark.critical.min}}-${{benchmark.critical.max}}`;
            element.className = 'benchmark critical';
        }}
    }}

    function getBenchmark(key) {{
        const keys = key.split('.');
        let result = benchmarks;
        for (const k of keys) {{
            result = result[k];
            if (!result) return null;
        }}
        return result;
    }}
}}'''
        
        return js_content
    
    def structure_metrics_data(self, flat_data):
        """Convert flat metrics data to structured format with controls and results"""
        structured = []
        current_metric = None
        
        for item in flat_data:
            # Check if this is a metric card (has title and icon)
            if item.get('title') and item.get('icon'):
                # Save previous metric if exists
                if current_metric:
                    structured.append(current_metric)
                
                # Start new metric
                current_metric = {
                    'id': item.get('id'),
                    'title': item.get('title'),
                    'icon': item.get('icon'),
                    'status': item.get('status'),
                    'description': item.get('description'),
                    'controls': [],
                    'results': []
                }
            elif current_metric and item.get('type') == 'range':
                # This is a control for the current metric
                current_metric['controls'].append(item)
            elif current_metric and item.get('format'):
                # This is a result for the current metric
                current_metric['results'].append(item)
        
        # Don't forget the last metric
        if current_metric:
            structured.append(current_metric)
            
        return structured

class SimpleDevServer(SimpleHTTPRequestHandler):
    def end_headers(self):
        # No cache headers for instant refresh
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def regenerate_files():
    """Regenerate script.js from YAML data"""
    # Regenerate JavaScript
    processor = YAMLProcessor()
    with open('script.js', 'w') as f:
        f.write(processor.generate_calculator_js())
    
    print("✅ JavaScript regenerated")

def compile_scss():
    """Compile SCSS to CSS"""
    if os.path.exists('_sass/main.scss'):
        with open('_sass/main.scss', 'r') as f:
            scss_content = f.read()
        with open('styles.css', 'w') as f:
            f.write(scss_content)
        print("✅ SCSS compiled to CSS")

def watch_files():
    """Watch for file changes and regenerate instantly"""
    last_modified = {}
    
    def get_mtime(filepath):
        try:
            return os.path.getmtime(filepath)
        except:
            return 0
    
    while True:
        try:
            changed = False
            
            # Watch key files
            watch_files = [
                '_data/metrics.yml',
                '_data/benchmarks.yml', 
                '_data/site.yml',
                '_sass/main.scss',
                'index.html'
            ]
            
            for filepath in watch_files:
                if os.path.exists(filepath):
                    current_time = get_mtime(filepath)
                    if filepath not in last_modified:
                        last_modified[filepath] = current_time
                    elif current_time > last_modified[filepath]:
                        print(f"🔄 {filepath} changed")
                        last_modified[filepath] = current_time
                        
                        # Regenerate JS for YAML changes
                        if filepath.endswith(('.yml', '.yaml')):
                            changed = True
                        # Compile SCSS for style changes
                        elif filepath.endswith('.scss'):
                            compile_scss()
            
            if changed:
                regenerate_files()
            
            time.sleep(1)  # Check every second
        except KeyboardInterrupt:
            break

def main():
    print("🚀 Starting simple dev server...")
    
    # Initial generation
    regenerate_files()
    compile_scss()
    
    # Start file watcher in background
    watcher = threading.Thread(target=watch_files, daemon=True)
    watcher.start()
    
    # Start HTTP server
    PORT = 8000
    with HTTPServer(("", PORT), SimpleDevServer) as httpd:
        print(f"✅ Server running at http://localhost:{PORT}")
        print("📁 Watching files - changes will regenerate instantly")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Stopping server...")

if __name__ == "__main__":
    main() 