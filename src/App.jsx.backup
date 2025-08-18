import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { IconChevronRight, IconChevronLeft, IconCalculator, IconTrendingUp, IconClock, IconBook, IconInfoCircle, IconSparkles, IconHeart } from '@tabler/icons-react'
import './App.css'

function App() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [timeToMaturity, setTimeToMaturity] = useState(90) // 90 days (3 months)
  const [stockPrice, setStockPrice] = useState(100)
  const [strikePrice, setStrikePrice] = useState(100)
  const [riskFreeRate, setRiskFreeRate] = useState(0.05)
  const [volatility, setVolatility] = useState(0.2)

  // Convert days to years for calculations
  const timeInYears = timeToMaturity / 365

  // Mathematical calculations
  const calculateDiscountFactor = (r, T) => Math.exp(-r * T)
  
  const calculateStockPricePDF = (S0, r, sigma, T) => {
    const points = []
    const numPoints = 200
    const minW = -4
    const maxW = 4
    const step = (maxW - minW) / numPoints
    
    for (let i = 0; i <= numPoints; i++) {
      const w = minW + i * step
      const ST = S0 * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * w)
      const density = (1 / Math.sqrt(2 * Math.PI * T)) * Math.exp(-(w * w) / (2 * T))
      points.push({
        w: w,
        ST: ST,
        density: density,
        normalizedDensity: density * 100 // Scale for better visualization
      })
    }
    return points
  }

  const calculateCallOptionPrice = (S0, K, r, sigma, T) => {
    // Simplified Black-Scholes for call option
    const d1 = (Math.log(S0 / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T))
    const d2 = d1 - sigma * Math.sqrt(T)
    
    // Normal CDF approximation
    const normalCDF = (x) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)))
    }
    
    const erf = (x) => {
      // Abramowitz and Stegun approximation
      const a1 =  0.254829592
      const a2 = -0.284496736
      const a3 =  1.421413741
      const a4 = -1.453152027
      const a5 =  1.061405429
      const p  =  0.3275911
      
      const sign = x >= 0 ? 1 : -1
      x = Math.abs(x)
      
      const t = 1.0 / (1.0 + p * x)
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
      
      return sign * y
    }
    
    const callPrice = S0 * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2)
    return Math.max(callPrice, 0)
  }

  const discountFactorData = () => {
    const data = []
    for (let days = 1; days <= 730; days += 5) { // Up to 2 years in days
      const t = days / 365
      data.push({
        days: days,
        time: t,
        discountFactor: calculateDiscountFactor(riskFreeRate, t)
      })
    }
    return data
  }

  const optionPriceData = () => {
    const data = []
    for (let days = 1; days <= 730; days += 5) { // Up to 2 years in days
      const t = days / 365
      data.push({
        days: days,
        time: t,
        optionPrice: calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, t)
      })
    }
    return data
  }

  const volatilityPriceData = () => {
    const data = []
    for (let vol = 0.05; vol <= 0.8; vol += 0.01) {
      data.push({
        volatility: vol * 100, // Convert to percentage for display
        optionPrice: calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, vol, timeInYears)
      })
    }
    return data
  }

  const phases = [
    {
      title: "Introduction to Risk-Neutral Pricing and Time (T)",
      icon: <IconBook className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="prose max-w-none">
            <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                <IconInfoCircle className="w-5 h-5 text-info" />
                What is Risk-Neutral Pricing and Why is it Important?
              </h3>
              <p className="text-base leading-relaxed">
                Risk-neutral pricing is a fundamental concept in financial mathematics used to value derivatives, such as options. 
                It assumes that investors are indifferent to risk, meaning they only care about expected returns. In a risk-neutral world, 
                all assets are expected to grow at the risk-free rate. This framework simplifies the valuation of complex financial 
                instruments by allowing us to use a special probability measure (the risk-neutral measure, Q) under which the discounted 
                price of any asset is a martingale.
              </p>
              <p className="text-base leading-relaxed mt-3">
                This approach is crucial because it provides a consistent and robust method for pricing options, regardless of individual 
                investor risk preferences. It allows us to calculate the theoretical fair value of an option by focusing on the expected 
                payoff under a hypothetical risk-neutral world and then discounting that expectation back to the present at the risk-free rate.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold mb-6">The Core Formula</h3>
            <p className="text-lg mb-6 leading-relaxed">
              The price of an option (V) is the <strong>discounted expected value</strong> of its payoff at expiration, 
              calculated under the risk-neutral measure (Q).
            </p>
            <div className="bg-accent/10 p-6 rounded-wabi-card border-l-4 border-accent mb-8 wabi-sabi-texture">
              <p className="font-mono text-lg text-foreground">V = e<sup>-rT</sup> 𝔼<sup>Q</sup>[Φ(S<sub>T</sub>)]</p>
            </div>
            
            <h3 className="text-xl font-semibold mb-6">Variable Explanations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-accent mb-3">V - Option Price</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">The fair theoretical value of the option that we are trying to calculate (today's price).</p>
              </div>
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-success mb-3">e<sup>-rT</sup> - Discount Factor</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">Discounts future expected payoff back to present value. Depends on risk-free rate (r) and time to maturity (T).</p>
              </div>
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-primary mb-3">𝔼<sup>Q</sup> - Risk-Neutral Expectation</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">Expected value under the risk-neutral measure where all assets earn the risk-free rate.</p>
              </div>
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-warning mb-3">Φ(S<sub>T</sub>) - Payoff Function</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">Value of the option at expiration. For call: max(S<sub>T</sub> - K, 0). For put: max(K - S<sub>T</sub>, 0).</p>
              </div>
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-destructive mb-3">r - Risk-Free Rate</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">Theoretical rate of return of an investment with zero risk. Used for discounting future cash flows.</p>
              </div>
              <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                <h4 className="font-semibold text-accent mb-3">T - Time to Maturity</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">Remaining time until option expires. Affects both discounting and uncertainty of final stock price.</p>
              </div>
            </div>
            
            <div className="bg-warning/10 p-6 rounded-wabi-card border-l-4 border-warning wabi-sabi-texture">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Why T is Important:</strong> Time to maturity has two key effects:
                <br />• <strong>Discounting:</strong> Longer T means future payoff is discounted more, reducing present value
                <br />• <strong>Uncertainty:</strong> Longer T allows more time for stock price movement, increasing option value due to higher probability of favorable outcomes
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Time's Role in Stock Price Evolution",
      icon: <IconTrendingUp className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-lg mb-6 leading-relaxed">
              Under the risk-neutral measure, the stock price S<sub>t</sub> follows a <strong>Geometric Brownian Motion</strong>:
            </p>
            <div className="bg-success/10 p-6 rounded-wabi-card border-l-4 border-success mb-6 wabi-sabi-texture">
              <p className="font-mono text-lg text-foreground">dS<sub>t</sub> = rS<sub>t</sub>dt + σS<sub>t</sub>dW<sub>t</sub><sup>Q</sup></p>
            </div>
            <p className="mb-6 leading-relaxed">
              The solution gives us the stock price at expiration:
            </p>
            <div className="bg-success/10 p-6 rounded-wabi-card border-l-4 border-success mb-6 wabi-sabi-texture">
              <p className="font-mono text-lg text-foreground">S<sub>T</sub> = S<sub>0</sub>e<sup>(r - ½σ²)T + σW<sub>T</sub><sup>Q</sup></sup></p>
            </div>
            <p className="leading-relaxed">
              Notice how <strong>T</strong> appears in both the drift term and affects the variance of W<sub>T</sub><sup>Q</sup> ~ N(0,T). 
              <strong>The uncertainty increases with time!</strong>
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution of Stock Price at Expiration (S<sub>T</sub>)</CardTitle>
              <CardDescription>
                See how the distribution spreads out as time increases (currently {timeToMaturity} days)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={calculateStockPricePDF(stockPrice, riskFreeRate, volatility, timeInYears)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ST" label={{ value: 'Stock Price at Expiration (ST)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => [value.toFixed(4), name === 'normalizedDensity' ? 'Density (×100)' : name]} />
                    <Area type="monotone" dataKey="normalizedDensity" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                  <p className="text-sm leading-relaxed mb-4 text-foreground">
                    <strong>Key Insight:</strong> As T increases, the distribution becomes wider and flatter, 
                    representing greater uncertainty about the final stock price. This is because the variance 
                    of W<sub>T</sub><sup>Q</sup> is proportional to T.
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong>Current Setting:</strong> With {timeToMaturity} days to expiration, the stock price distribution 
                    shows the range of possible outcomes. Adjust the time slider in the sidebar to see how the distribution changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "The Lebesgue Integral and Option Pricing",
      icon: <IconCalculator className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="prose max-w-none">
            <p className="text-lg mb-6 leading-relaxed">
              The expectation 𝔼<sup>Q</sup>[Φ(S<sub>T</sub>)] is a <strong>Lebesgue integral</strong>, which for Black-Scholes becomes:
            </p>
            <div className="bg-primary/10 p-6 rounded-wabi-card border-l-4 border-primary mb-6 wabi-sabi-texture">
              <p className="font-mono text-sm text-foreground">
                𝔼<sup>Q</sup>[Φ(S<sub>T</sub>)] = ∫<sub>-∞</sub><sup>∞</sup> Φ(S₀e<sup>(r-½σ²)T+σw</sup>) × (1/√(2πT))e<sup>-w²/(2T)</sup> dw
              </p>
            </div>
            <p className="leading-relaxed">
              Notice how <strong>T</strong> appears in the density function (1/√(2πT))e<sup>-w²/(2T)</sup>. 
              This represents the probability density of Brownian motion at time T.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Complete Option Price Analysis</CardTitle>
              <CardDescription>
                See how all components come together to determine the option price (currently {timeToMaturity} days to expiration)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={optionPriceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="days" label={{ value: 'Time to Maturity (Days)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Option Price ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'optionPrice') return [`$${value.toFixed(2)}`, 'Option Price']
                      return [value, name]
                    }} />
                    <Line type="monotone" dataKey="optionPrice" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line 
                      type="monotone" 
                      dataKey={() => calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears)} 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="bg-accent/10 p-6 rounded-wabi-card wabi-sabi-texture">
                  <p className="text-sm leading-relaxed mb-4 text-foreground">
                    <strong>Mathematical Insight:</strong> The option price is non-linear in T because:
                    <br />• Longer time increases the probability of favorable outcomes (higher S<sub>T</sub>)
                    <br />• But also increases the discount factor (reduces present value)
                    <br />• The balance between these effects creates the curved relationship you see above
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong>Current Analysis:</strong> With {timeToMaturity} days remaining, the option is worth ${calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears).toFixed(2)}. 
                    The red dashed line shows your current position on the time-value curve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "The Impact of Volatility (σ)",
      icon: <IconTrendingUp className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <div className="prose max-w-none">
            <div className="bg-primary/10 p-8 rounded-wabi-card border-l-4 border-primary mb-8 wabi-sabi-texture">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                <IconInfoCircle className="w-5 h-5 text-primary" />
                What is Volatility and Why is it Important?
              </h3>
              <p className="text-base leading-relaxed">
                Volatility (σ) in the Black-Scholes model represents the degree of variation of a trading price series over time, 
                typically measured by the standard deviation of logarithmic returns. It is a crucial input because it quantifies 
                the uncertainty or risk associated with the underlying asset's price movements. Higher volatility implies a greater 
                chance of extreme price swings, both upwards and downwards.
              </p>
              <p className="text-base leading-relaxed mt-3">
                For options, volatility is a key determinant of price. Higher volatility generally leads to higher option prices 
                (for both calls and puts) because it increases the probability of the underlying asset reaching the strike price 
                (or moving further in-the-money) before expiration. This increased potential for profit, without a corresponding 
                increase in potential loss (as option losses are capped at the premium paid), makes options more valuable.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Volatility's Role in Stock Price Evolution</h3>
            <p className="text-lg mb-4">
              In the Geometric Brownian Motion equation, volatility directly scales the stochastic term:
            </p>
            <div className="bg-primary/10 p-4 rounded-wabi-card border-l-4 border-primary mb-4 wabi-sabi-texture">
              <p className="font-mono text-lg text-foreground">dS<sub>t</sub> = rS<sub>t</sub>dt + <strong>σ</strong>S<sub>t</sub>dW<sub>t</sub><sup>Q</sup></p>
            </div>
            <p className="mb-4">
              Higher σ leads to larger random fluctuations in S<sub>t</sub>. In the solution:
            </p>
            <div className="bg-primary/10 p-4 rounded-wabi-card border-l-4 border-primary mb-6 wabi-sabi-texture">
              <p className="font-mono text-lg text-foreground">S<sub>T</sub> = S<sub>0</sub>e<sup>(r - ½<strong>σ²</strong>)T + <strong>σ</strong>W<sub>T</sub><sup>Q</sup></sup></p>
            </div>
            <p>
              Notice how <strong>σ</strong> appears twice: in the drift adjustment term (½σ²) and as a multiplier to W<sub>T</sub><sup>Q</sup>, 
              directly impacting the spread of the S<sub>T</sub> distribution.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution of Stock Price with Different Volatilities</CardTitle>
              <CardDescription>
                See how the distribution spreads out as volatility increases (currently {(volatility * 100).toFixed(1)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={calculateStockPricePDF(stockPrice, riskFreeRate, volatility, timeInYears)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ST" label={{ value: 'Stock Price at Expiration (ST)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => [value.toFixed(4), name === 'normalizedDensity' ? 'Density (×100)' : name]} />
                    <Area type="monotone" dataKey="normalizedDensity" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="bg-muted p-4 rounded-wabi-card wabi-sabi-texture">
                  <p className="text-sm text-foreground">
                    <strong>Key Insight:</strong> As volatility (σ) increases, the distribution becomes wider and flatter, 
                    representing greater uncertainty about the final stock price. This increased uncertainty generally 
                    increases option values because it raises the probability of favorable outcomes.
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    <strong>Current Setting:</strong> With {(volatility * 100).toFixed(1)}% volatility, the stock price distribution 
                    shows the range of possible outcomes. Adjust the volatility slider in the sidebar to see how the distribution changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Option Price vs. Volatility Analysis</CardTitle>
              <CardDescription>
                See how option price changes with volatility (convexity relationship)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={volatilityPriceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="volatility" label={{ value: 'Volatility (%)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Option Price ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'optionPrice') return [`$${value.toFixed(2)}`, 'Option Price']
                      if (name === 'volatility') return [`${value.toFixed(1)}%`, 'Volatility']
                      return [value, name]
                    }} />
                    <Line type="monotone" dataKey="optionPrice" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line 
                      type="monotone" 
                      dataKey={() => calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears)} 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="bg-primary/10 p-4 rounded-wabi-card wabi-sabi-texture">
                  <p className="text-sm text-foreground">
                    <strong>Mathematical Insight:</strong> The relationship between option price and volatility is convex:
                    <br />• Higher volatility increases the probability of extreme favorable outcomes
                    <br />• Option losses are capped at the premium paid, but gains are unlimited
                    <br />• This asymmetry creates the convex (curved upward) relationship you see above
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    <strong>Current Analysis:</strong> At {(volatility * 100).toFixed(1)}% volatility, the option is worth ${calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears).toFixed(2)}. 
                    The red dashed line shows your current position on the volatility-price curve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-background wabi-sabi-surface">
      <div className="flex h-screen">
        {/* Sidebar for Controls - Ma (negative space) with generous spacing */}
        <div className="w-80 bg-card shadow-wabi-gentle border-r border-border overflow-y-auto seijaku-slide-in-left">
          <div className="p-8 space-y-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <IconCalculator className="w-6 h-6" />
              Parameters
            </h2>
            
            {/* Time to Maturity Control - Ma principles with generous spacing */}
            <div className="mb-8">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Time to Maturity: {timeToMaturity} days ({(timeToMaturity/30).toFixed(1)} months)
              </Label>
              <Slider
                value={[timeToMaturity]}
                onValueChange={(value) => setTimeToMaturity(value[0])}
                max={730} // 2 years
                min={1}
                step={1}
                className="mt-4 mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 day</span>
                <span>2 years</span>
              </div>
            </div>

            {/* Stock Price Control - Ma principles with generous spacing */}
            <div className="mb-8">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Current Stock Price (S₀): ${stockPrice}
              </Label>
              <Slider
                value={[stockPrice]}
                onValueChange={(value) => setStockPrice(value[0])}
                max={200}
                min={50}
                step={1}
                className="mt-4 mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$50</span>
                <span>$200</span>
              </div>
            </div>

            {/* Strike Price Control - Ma principles with generous spacing */}
            <div className="mb-8">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Strike Price (K): ${strikePrice}
              </Label>
              <Slider
                value={[strikePrice]}
                onValueChange={(value) => setStrikePrice(value[0])}
                max={200}
                min={50}
                step={1}
                className="mt-4 mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$50</span>
                <span>$200</span>
              </div>
            </div>

            {/* Volatility Control - Ma principles with generous spacing */}
            <div className="mb-8">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Volatility (σ): {(volatility * 100).toFixed(1)}%
              </Label>
              <Slider
                value={[volatility]}
                onValueChange={(value) => setVolatility(value[0])}
                max={0.8}
                min={0.05}
                step={0.01}
                className="mt-4 mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>5%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Risk-free Rate Control - Ma principles with generous spacing */}
            <div className="mb-8">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                Risk-free Rate (r): {(riskFreeRate * 100).toFixed(1)}%
              </Label>
              <Slider
                value={[riskFreeRate]}
                onValueChange={(value) => setRiskFreeRate(value[0])}
                max={0.15}
                min={0.001}
                step={0.001}
                className="mt-4 mb-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0.1%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Current Values Display - Ma principles with generous spacing */}
            <div className="bg-muted p-6 rounded-wabi-card mt-8 seijaku-breathe wabi-sabi-texture">
              <h3 className="font-semibold text-foreground mb-4">Current Values</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Discount Factor:</span>
                  <span className="font-mono">{calculateDiscountFactor(riskFreeRate, timeInYears).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Option Price:</span>
                  <span className="font-mono text-accent">${calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Value:</span>
                  <span className="font-mono text-success">
                    ${Math.max(0, calculateCallOptionPrice(stockPrice, strikePrice, riskFreeRate, volatility, timeInYears) - Math.max(0, stockPrice - strikePrice)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Ma principles with generous spacing */}
          <div className="bg-card shadow-soft border-b border-border p-8 wabi-sabi-texture">
            <h1 className="text-3xl font-bold text-foreground mb-2">Black-Scholes Tutorial: Understanding Time to Maturity (T)</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore the mathematical foundations of how time affects option pricing through interactive visualizations
            </p>
          </div>

          {/* Phase Navigation - Engawa (transitional spaces) */}
          <div className="bg-card border-b border-border p-6">
            <div className="flex items-center justify-center gap-4">
              {phases.map((phase, index) => (
                <Button
                  key={index}
                  variant={currentPhase === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPhase(index)}
                  className="flex items-center gap-2 seijaku-transition"
                >
                  {phase.icon}
                  <span className="hidden sm:inline">Phase {index + 1}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content with Ma (negative space) and Seijaku (tranquility) */}
          <div className="flex-1 overflow-y-auto bg-background wabi-sabi-surface">
            <div className="max-w-6xl mx-auto p-8">
              <div className="mb-8 seijaku-enter">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  {phases[currentPhase].icon}
                  {phases[currentPhase].title}
                </h2>
              </div>
              
              <div className="seijaku-scale-enter">
                {phases[currentPhase].content}
              </div>
              
              {/* Navigation Controls - Engawa (transitional spaces) */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
                  disabled={currentPhase === 0}
                  className="flex items-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" />
                  Previous Phase
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Phase {currentPhase + 1} of {phases.length}</span>
                </div>
                
                <Button
                  onClick={() => setCurrentPhase(Math.min(phases.length - 1, currentPhase + 1))}
                  disabled={currentPhase === phases.length - 1}
                  className="flex items-center gap-2"
                >
                  Next Phase
                  <IconChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

