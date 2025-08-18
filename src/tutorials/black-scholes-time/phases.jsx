import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts'
import { IconBook, IconTrendingUp, IconCalculator, IconInfoCircle } from '@tabler/icons-react'
import ResponsiveChart from '@/components/charts/ResponsiveChart'
import MobileTooltip from '@/components/charts/MobileTooltip'
import { useIsMobile } from '@/hooks/use-mobile'

/**
 * Phase 1: Introduction to Risk-Neutral Pricing and Time (T)
 */
export const IntroductionPhase = ({ tutorialHook }) => {
  const { parameters, calculations } = tutorialHook()

  return (
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
}

/**
 * Phase 2: Time's Role in Stock Price Evolution
 */
export const StockPriceEvolutionPhase = ({ tutorialHook }) => {
  const { parameters, calculations, chartData } = tutorialHook()
  const isMobile = useIsMobile()

  return (
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
            See how the distribution spreads out as time increases (currently {parameters.timeToMaturity} days)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveChart 
              height={400} 
              mobileHeight={300}
              enableTouch={true}
              className="mb-4"
            >
              <AreaChart data={chartData.stockPricePDF}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="ST" 
                  label={isMobile ? null : { value: 'Stock Price at Expiration (ST)', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  label={isMobile ? null : { value: 'Probability Density', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => [value.toFixed(4), name === 'normalizedDensity' ? 'Density (×100)' : name]}
                  />}
                />
                <Area 
                  type="monotone" 
                  dataKey="normalizedDensity" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.3}
                  strokeWidth={isMobile ? 2 : 1}
                />
              </AreaChart>
            </ResponsiveChart>
            
            {/* Mobile chart labels */}
            {isMobile && (
              <div className="text-center text-xs text-muted-foreground mb-4 space-y-1">
                <div>X-axis: Stock Price at Expiration (ST)</div>
                <div>Y-axis: Probability Density</div>
              </div>
            )}
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> As T increases, the distribution becomes wider and flatter, 
                representing greater uncertainty about the final stock price. This is because the variance 
                of W<sub>T</sub><sup>Q</sup> is proportional to T.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Setting:</strong> With {parameters.timeToMaturity} days to expiration, the stock price distribution 
                shows the range of possible outcomes. Adjust the time slider in the sidebar to see how the distribution changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 3: The Lebesgue Integral and Option Pricing
 */
export const LebesgueIntegralPhase = ({ tutorialHook }) => {
  const { parameters, calculations, chartData } = tutorialHook()
  const isMobile = useIsMobile()

  return (
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
            See how all components come together to determine the option price (currently {parameters.timeToMaturity} days to expiration)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ResponsiveChart 
              height={400} 
              mobileHeight={300}
              enableTouch={true}
              className="mb-4"
            >
              <LineChart data={chartData.optionPriceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="days" 
                  label={isMobile ? null : { value: 'Time to Maturity (Days)', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  label={isMobile ? null : { value: 'Option Price ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 50 : 60}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => {
                      if (name === 'optionPrice') return [`$${value.toFixed(2)}`, 'Option Price']
                      return [value, name]
                    }}
                  />}
                />
                <Line 
                  type="monotone" 
                  dataKey="optionPrice" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={isMobile ? 3 : 2}
                  dot={isMobile ? false : true}
                  dotSize={isMobile ? 0 : 4}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => calculations.optionPrice} 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={isMobile ? 4 : 3}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveChart>
            
            {/* Mobile chart labels */}
            {isMobile && (
              <div className="text-center text-xs text-muted-foreground mb-4 space-y-1">
                <div>X-axis: Time to Maturity (Days)</div>
                <div>Y-axis: Option Price ($)</div>
              </div>
            )}
            
            <div className="bg-accent/10 p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Mathematical Insight:</strong> The option price is non-linear in T because:
                <br />• Longer time increases the probability of favorable outcomes (higher S<sub>T</sub>)
                <br />• But also increases the discount factor (reduces present value)
                <br />• The balance between these effects creates the curved relationship you see above
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Analysis:</strong> With {parameters.timeToMaturity} days remaining, the option is worth ${calculations.optionPrice.toFixed(2)}. 
                The red dashed line shows your current position on the time-value curve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 4: The Impact of Volatility (σ)
 */
export const VolatilityImpactPhase = ({ tutorialHook }) => {
  const { parameters, calculations, chartData } = tutorialHook()
  const isMobile = useIsMobile()

  return (
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
            See how the distribution spreads out as volatility increases (currently {(parameters.volatility * 100).toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ResponsiveChart 
              height={400} 
              mobileHeight={300}
              enableTouch={true}
              className="mb-4"
            >
              <AreaChart data={chartData.stockPricePDF}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="ST" 
                  label={isMobile ? null : { value: 'Stock Price at Expiration (ST)', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  label={isMobile ? null : { value: 'Probability Density', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => [value.toFixed(4), name === 'normalizedDensity' ? 'Density (×100)' : name]}
                  />}
                />
                <Area 
                  type="monotone" 
                  dataKey="normalizedDensity" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  strokeWidth={isMobile ? 2 : 1}
                />
              </AreaChart>
            </ResponsiveChart>
            
            {/* Mobile chart labels */}
            {isMobile && (
              <div className="text-center text-xs text-muted-foreground mb-4 space-y-1">
                <div>X-axis: Stock Price at Expiration (ST)</div>
                <div>Y-axis: Probability Density</div>
              </div>
            )}
            
            <div className="bg-muted p-4 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm text-foreground">
                <strong>Key Insight:</strong> As volatility (σ) increases, the distribution becomes wider and flatter, 
                representing greater uncertainty about the final stock price. This increased uncertainty generally 
                increases option values because it raises the probability of favorable outcomes.
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                <strong>Current Setting:</strong> With {(parameters.volatility * 100).toFixed(1)}% volatility, the stock price distribution 
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
            <ResponsiveChart 
              height={400} 
              mobileHeight={300}
              enableTouch={true}
              className="mb-4"
            >
              <LineChart data={chartData.volatilityPriceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="volatility" 
                  label={isMobile ? null : { value: 'Volatility (%)', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  label={isMobile ? null : { value: 'Option Price ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 50 : 60}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => {
                      if (name === 'optionPrice') return [`$${value.toFixed(2)}`, 'Option Price']
                      if (name === 'volatility') return [`${value.toFixed(1)}%`, 'Volatility']
                      return [value, name]
                    }}
                  />}
                />
                <Line 
                  type="monotone" 
                  dataKey="optionPrice" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={isMobile ? 3 : 2}
                  dot={isMobile ? false : true}
                  dotSize={isMobile ? 0 : 4}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => calculations.optionPrice} 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={isMobile ? 4 : 3}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveChart>
            
            {/* Mobile chart labels */}
            {isMobile && (
              <div className="text-center text-xs text-muted-foreground mb-4 space-y-1">
                <div>X-axis: Volatility (%)</div>
                <div>Y-axis: Option Price ($)</div>
              </div>
            )}
            
            <div className="bg-primary/10 p-4 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm text-foreground">
                <strong>Mathematical Insight:</strong> The relationship between option price and volatility is convex:
                <br />• Higher volatility increases the probability of extreme favorable outcomes
                <br />• Option losses are capped at the premium paid, but gains are unlimited
                <br />• This asymmetry creates the convex (curved upward) relationship you see above
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                <strong>Current Analysis:</strong> At {(parameters.volatility * 100).toFixed(1)}% volatility, the option is worth ${calculations.optionPrice.toFixed(2)}. 
                The red dashed line shows your current position on the volatility-price curve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase definitions for the tutorial system
 */
export const blackScholesTimePhases = [
  {
    id: 'introduction',
    title: 'Introduction to Risk-Neutral Pricing and Time (T)',
    icon: <IconBook className="w-6 h-6" />,
    shortTitle: 'Introduction',
    content: IntroductionPhase
  },
  {
    id: 'stock-price-evolution',
    title: "Time's Role in Stock Price Evolution",
    icon: <IconTrendingUp className="w-6 h-6" />,
    shortTitle: 'Stock Evolution',
    content: StockPriceEvolutionPhase
  },
  {
    id: 'lebesgue-integral',
    title: 'The Lebesgue Integral and Option Pricing',
    icon: <IconCalculator className="w-6 h-6" />,
    shortTitle: 'Integration',
    content: LebesgueIntegralPhase
  },
  {
    id: 'volatility-impact',
    title: 'The Impact of Volatility (σ)',
    icon: <IconTrendingUp className="w-6 h-6" />,
    shortTitle: 'Volatility',
    content: VolatilityImpactPhase
  }
]