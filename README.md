# Interactive Learning Tutorials

A modern web application for hosting interactive educational tutorials on complex topics. Currently featuring an in-depth Black-Scholes option pricing tutorial with real-time visualizations and mathematical explanations.

## 🎯 Overview

This platform provides interactive, visual learning experiences for complex mathematical and technical concepts. Each tutorial combines theoretical foundations with hands-on exploration through dynamic charts, real-time parameter adjustments, and step-by-step guided learning phases.

### Current Tutorial: Black-Scholes Option Pricing
An in-depth exploration of the Black-Scholes option pricing model, focusing on the role of time to maturity (T) in option valuation. Through four comprehensive phases, users learn about risk-neutral pricing, stock price evolution, Lebesgue integrals, and volatility impacts.

## ✨ Features

### Tutorial Features
- **Multi-Phase Learning** - Structured progression through complex topics
- **Interactive Visualizations** - Real-time charts and graphs that respond to parameter changes
- **Mathematical Rigor** - Proper mathematical notation and explanations
- **Hands-On Exploration** - Adjustable parameters to see immediate effects

#### Black-Scholes Tutorial Phases:
1. **Introduction to Risk-Neutral Pricing and Time (T)** - Fundamental concepts and mathematical framework
2. **Time's Role in Stock Price Evolution** - Geometric Brownian Motion and probability distributions
3. **The Lebesgue Integral and Option Pricing** - Mathematical integration and complete price analysis
4. **The Impact of Volatility (σ)** - Volatility effects and convexity relationships

### Real-Time Visualizations
- **Stock Price Distribution Charts** - See how probability distributions change with time and volatility
- **Option Price vs Time Analysis** - Interactive charts showing time decay effects
- **Volatility Impact Curves** - Convex relationship between volatility and option prices
- **Real-time Parameter Updates** - All charts update instantly as you adjust parameters

### Interactive Controls
- **Time to Maturity Slider** - 1 day to 2 years
- **Stock Price Control** - $50 to $200
- **Strike Price Adjustment** - $50 to $200
- **Volatility Control** - 5% to 80%
- **Risk-free Rate** - 0.1% to 15%

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0 with Vite
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS 4.1.7 with custom design system
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd black-scholes-tutorial
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🏗️ Architecture

This platform is designed to be extensible for multiple tutorial topics:

- **Modular Tutorial System** - Easy to add new tutorials and learning phases
- **Reusable UI Components** - Consistent design system across all tutorials
- **Interactive Parameter Controls** - Flexible slider and input systems
- **Responsive Visualizations** - Charts that adapt to different data types and ranges

## 📚 Current Tutorial: Black-Scholes Mathematics

### Core Formula
The Black-Scholes tutorial is built around the fundamental option pricing formula:

```
V = e^(-rT) 𝔼^Q[Φ(S_T)]
```

Where:
- **V** = Option price
- **e^(-rT)** = Discount factor
- **𝔼^Q** = Risk-neutral expectation
- **Φ(S_T)** = Payoff function at expiration
- **r** = Risk-free rate
- **T** = Time to maturity

### Stock Price Evolution
Under the risk-neutral measure, stock prices follow Geometric Brownian Motion:

```
dS_t = rS_t dt + σS_t dW_t^Q
```

With solution:
```
S_T = S_0 e^((r - ½σ²)T + σW_T^Q)
```

## 🎨 UI Components

The application uses a comprehensive design system built on:
- **shadcn/ui** components for consistent styling
- **Radix UI** primitives for accessibility
- **Custom color palette** with light/dark mode support
- **Responsive design** optimized for desktop learning

## 📊 Learning Approach

This platform emphasizes:

- **Visual Learning** - Complex concepts explained through interactive charts and animations
- **Progressive Complexity** - Concepts build upon each other in logical sequence
- **Immediate Feedback** - Real-time updates as parameters change
- **Mathematical Rigor** - Proper notation and theoretical foundations
- **Practical Application** - Real-world relevance and applications

### Black-Scholes Tutorial Outcomes
After completing the Black-Scholes tutorial, users will understand:

1. **Risk-neutral pricing fundamentals** and why it's used in derivatives pricing
2. **Time's dual role** in option pricing (discounting vs. uncertainty)
3. **Probability distributions** and how they evolve with time
4. **Volatility's impact** on option values and the convex relationship
5. **Mathematical integration** in the context of expectation calculations

## 🔧 Customization

### Adding New Tutorials
To add new tutorials, create a new component following the existing pattern:

```javascript
const tutorials = [
  {
    id: 'black-scholes',
    title: 'Black-Scholes Option Pricing',
    component: BlackScholesApp
  },
  {
    id: 'your-tutorial',
    title: 'Your Tutorial Title',
    component: YourTutorialApp
  }
]
```

### Adding New Phases
To add new educational phases to existing tutorials, modify the `phases` array:

```javascript
const phases = [
  // existing phases...
  {
    title: "Your New Phase",
    icon: <YourIcon className="w-6 h-6" />,
    content: (
      <div>
        {/* Your educational content */}
      </div>
    )
  }
]
```

### Modifying Parameters
Parameter ranges and defaults can be adjusted in the control sections of each tutorial.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React and Vite for optimal performance
- UI components powered by Radix UI and Tailwind CSS
- Interactive charts created with Recharts library
- Mathematical formulations based on established academic sources

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Happy Learning!** 🎓�✨