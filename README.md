# Security Program Scorecards

A modern, interactive web application for assessing security program health metrics. Built with Jekyll-like templating, YAML-driven configuration, and elegant Material Design principles inspired by the OpenSSF Scorecard project.

## 🚀 Live Demo

Visit the live application: [Security Program Scorecards](https://awurster.github.io/security-program-scorecards)

## ✨ Features

- **Interactive Calculations**: Real-time updates with logarithmic sliders for smooth adjustment
- **Template-Driven**: YAML-based configuration for easy metric management
- **Modern UI**: GitHub dark theme with bright neon yellow accents and Cursor AI-inspired panels
- **Mobile Responsive**: Works beautifully on all devices
- **Benchmark Comparisons**: Industry-standard benchmarks with color-coded health indicators
- **Multiple Metrics**: 5 complete security assessment modules

## 📊 Current Metrics

### 1. Security Organization Size
- **Security Team Headcount**: Size of your security team (1-100)
- **Engineering Headcount**: Engineering organization size (10-5,000)
- **Company Headcount**: Total company size (100-100,000)
- **End Users**: Total end users supported (100-10M)
- **Data Records**: Data records managed in millions (1-1,000M)

**Calculated Results:**
- Security vs Engineering percentage (Target: 1-2.5%)
- Security vs Company percentage (Target: 1-2%)
- Users per Security Person (Target: 50-400)
- Data Records per Security Person (Target: 0.1-5M)

### 2. Customer & User Base
- **Customer Accounts**: Total customer accounts (10-1M)
- **Total End Users**: End users across all customers (100-10M)
- **Data Records**: Data records in millions (1-1,000M)

**Calculated Results:**
- Average Users per Customer (Target: 2-10)
- Data Records per Customer in thousands (Target: 1-10K)
- Data Density Score (Composite metric 0-100)

### 3. Vulnerability Management
- **Repositories**: Number of code repositories (1-10,000)
- **Active Vulnerabilities**: Current open vulnerabilities (0-10,000)
- **Exploitable Vulnerabilities**: High-risk exploitable vulns (0-1,000)
- **Vulnerabilities Past SLA**: Vulns exceeding remediation SLA (0-1,000)
- **Average Days Open**: Mean time vulnerabilities stay open (1-365)

**Calculated Results:**
- SLA Compliance Rate (Target: 85-100%)
- Vulnerabilities per Repository (Target: 0-2)
- Exploitable Vulnerability Percentage (Target: 0-5%)
- Mean Time to Fix in days (Target: 0-30)

### 4. Security Budget Analysis
- **Security Budget**: Annual security budget in millions ($1M-$100M)
- **Annual Revenue**: Company revenue in millions ($1M-$10B)
- **Operating Costs**: Annual OpEx in millions ($1M-$1B)
- **Total Employees**: Company headcount for budget analysis (10-50,000)

**Calculated Results:**
- Budget vs Revenue percentage (Target: 1-3%)
- Budget vs Operating Costs percentage (Target: 2-8%)
- Budget per Employee (Target: $2,000-$5,000)
- Cost per End User (Target: $50-$200)

### 5. Security Training & Culture
- **Training Budget**: Annual training budget in thousands ($10K-$5M)
- **Employees Trained**: Number who completed training (10-50,000)
- **Total Training Employees**: Total eligible for training (10-50,000)
- **Phishing Tests Sent**: Annual phishing simulation tests (100-100,000)
- **Phishing Failures**: Employees who failed tests (0-10,000)

**Calculated Results:**
- Training Cost per Employee (Target: $100-$500)
- Training Completion Rate (Target: 90-100%)
- Phishing Failure Rate (Target: 0-5%)
- Security Awareness Score (Target: 85-100)

## 🛠️ Technology Stack

- **Jekyll-like Templates**: YAML-driven configuration with auto-generation
- **Python Development Server**: No external dependencies, built-in file watching
- **HTML5**: Semantic, accessible markup with templated components
- **CSS3/SCSS**: Modern styling with CSS custom properties and GitHub dark theme
- **Vanilla JavaScript**: Auto-generated from YAML data, logarithmic sliders
- **Google Fonts**: Inter typeface for clean, professional typography
- **Material Icons**: Consistent iconography

## 🚀 Getting Started

### Prerequisites
- Python 3.6+ (built-in with macOS/Linux, standard library only)
- A modern web browser
- Git (for cloning the repository)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/awurster/security-program-scorecards.git
   cd security-program-scorecards
   ```

2. **Start the development server**
   ```bash
   # Use the Jekyll-like development server (recommended)
   python3 simple_dev_server.py
   
   # Server will start at http://localhost:8000
   # Watches YAML files and auto-regenerates JavaScript
   ```

3. **Alternative: Basic Python server**
   ```bash
   # Simple static file server (no auto-reload)
   python3 -m http.server 8000
   ```

### Development Workflow

The development server provides a Jekyll-like experience:

- **Edit YAML files** in `_data/` directory (metrics.yml, benchmarks.yml, site.yml)
- **Server auto-detects changes** and regenerates JavaScript
- **Refresh browser** to see updates
- **No manual JavaScript editing** required

**Key Files:**
- `_data/metrics.yml` - Define metric modules, controls, and results
- `_data/benchmarks.yml` - Set benchmark ranges for health indicators  
- `_data/site.yml` - Site configuration and metadata
- `simple_dev_server.py` - Development server with auto-reload

### Production Deployment

The repository includes both development and production files:

- **Development**: Use `simple_dev_server.py` for local development
- **Production**: Static files (`index.html`, `script.js`, `styles.css`) for deployment

### GitHub Pages Deployment

1. **Enable GitHub Pages**
   - Go to repository settings → Pages
   - Select "Deploy from a branch" 
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

2. **Your site will be available at:**
   ```
   https://yourusername.github.io/security-program-scorecards
   ```

## 🎮 Usage

### Basic Operation
1. **Adjust sliders** or **enter values directly** in number fields
2. **Logarithmic sliders** work like audio faders for wide ranges
3. **Real-time calculations** update as you make changes
4. **Color-coded benchmarks** show health status

### Keyboard Shortcuts
- `Ctrl+R` (or `Cmd+R` on Mac): Refresh page (browser shortcuts work normally)

### Health Indicators
- 🟢 **Healthy**: Metrics within recommended ranges
- 🟡 **Warning**: Acceptable but could be improved  
- 🔴 **Critical**: Outside typical ranges, needs attention

## 🎨 Design Philosophy

Modern GitHub-inspired design with:
- **GitHub Dark Theme**: Professional dark UI (#0d1117, #161b22, #21262d)
- **Neon Yellow Accents**: Bright highlights (#f7df1e) with glow effects
- **Cursor AI Panels**: Modern cards with subtle borders and hover states
- **Logarithmic Sliders**: Smooth adjustment across wide value ranges
- **Responsive Design**: Mobile-first approach with touch-friendly controls

## 🔧 Customization

### Adding New Metrics

1. **Edit `_data/metrics.yml`**
   ```yaml
   - id: new-metric
     title: New Metric Module
     icon: material-icon-name
     status: active
     description: "Description of what this measures"
     controls:
       - id: input-field
         label: Input Label
         type: range
         min: 1
         max: 100
         default: 10
     results:
       - id: calculated-result
         label: Result Label
         format: percentage
         benchmark_key: benchmark_name
   ```

2. **Add benchmarks in `_data/benchmarks.yml`**
   ```yaml
   benchmark_name:
     healthy: { min: 80, max: 100 }
     warning: { min: 60, max: 80 }
     critical: { min: 0, max: 60 }
   ```

3. **Restart development server** - JavaScript auto-generates!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Issues**: Found a bug? [Create an issue](https://github.com/awurster/security-program-scorecards/issues)
2. **Suggest Features**: Have ideas for new metrics? Let us know!
3. **Submit Pull Requests**: 
   - Fork the repository
   - Create a feature branch
   - Make your changes (edit YAML files, not JavaScript!)
   - Test with development server
   - Submit a pull request

## 📋 Roadmap

- [x] ~~Security Organization Size metrics~~
- [x] ~~Customer & User Base analysis~~
- [x] ~~Vulnerability Management Program~~
- [x] ~~Security Budget Analysis~~
- [x] ~~Training & Culture assessment~~
- [x] ~~Jekyll-like development server~~
- [x] ~~YAML-driven configuration~~
- [x] ~~Logarithmic sliders for UX~~
- [ ] Data export functionality (CSV, PDF reports)
- [ ] Custom benchmark configuration
- [ ] Industry-specific benchmark sets
- [ ] Multi-company comparison mode
- [ ] Historical tracking and trends
- [ ] API integration capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [OpenSSF Scorecard](https://scorecard.dev/) project
- GitHub's design system and dark theme
- Cursor AI's modern panel aesthetics
- Built with love for the security community
- Thanks to all contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/awurster/security-program-scorecards/issues)
- **Discussions**: [GitHub Discussions](https://github.com/awurster/security-program-scorecards/discussions)

---

**Built for security leaders, by security leaders.** 🛡️ 