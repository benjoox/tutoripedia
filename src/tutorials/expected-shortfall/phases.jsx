import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { IconBook, IconInfoCircle } from '@tabler/icons-react'

/**
 * Phase 1: Introduction to Value at Risk (VaR)
 */
export const IntroductionPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconInfoCircle className="w-5 h-5 text-info" />
            What is Value at Risk (VaR) and Why Do We Need It?
          </h3>
          <p className="text-base leading-relaxed">
            Value at Risk (VaR) is a widely used financial metric that estimates the potential loss on an investment over a specific time period for a given confidence level. [1] For example, a 1-day 95% VaR of $1 million means there is a 5% chance that the portfolio will lose more than $1 million over the next day. [1]
          </p>
          <p className="text-base leading-relaxed mt-3">
            It's a useful tool because it summarizes the downside risk of a portfolio into a single, easy-to-understand number. [1] However, VaR has a significant limitation: it tells you the maximum you might lose *if a bad day occurs*, but it doesn't tell you anything about *how much worse* it could get on the days that exceed that threshold. It answers "how bad is bad?", but not "if things get bad, how much can I expect to lose?". [2]
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribution of Portfolio Returns with VaR</CardTitle>
          <CardDescription>
            This chart shows a probability distribution of daily returns. The VaR is the point on the left tail beyond which the worst losses occur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData.returnsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="return" label={{ value: 'Portfolio Return (%)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area type="monotone" dataKey="density" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Line type="monotone" dataKey="varLine" stroke="#ff0000" strokeWidth={2} name="VaR Threshold" />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> The red line marks the VaR threshold. The area under the curve to the left of this line represents the probability of a loss exceeding the VaR (e.g., 5% for a 95% confidence level). VaR only tells us where this tail begins, not its shape or size.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Setting:</strong> With a confidence level of {parameters.confidenceLevel * 100}%, the VaR is calculated at the threshold of the worst {(100 - parameters.confidenceLevel * 100).toFixed(0)}% of outcomes. Adjust the confidence level slider to see how the VaR line moves.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { IconTrendingUp } from '@tabler/icons-react'

/**
 * Phase 2: Defining and Visualizing Expected Shortfall
 */
export const ExpectedShortfallPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold mb-6">Introducing Expected Shortfall (ES)</h3>
        <p className="text-lg mb-6 leading-relaxed">
          Expected Shortfall (ES), also known as Conditional Value at Risk (CVaR), is a risk measure that addresses the main shortcoming of VaR. [3, 4] It calculates the **expected loss on the days when the loss exceeds the VaR threshold**. [4]
        </p>
        <div className="bg-accent/10 p-6 rounded-wabi-card border-l-4 border-accent mb-8 wabi-sabi-texture">
         <p className="text-lg text-foreground">In simple terms: <strong>ES = Average loss in the worst (1-α)% cases</strong>, where α is the confidence level.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Identifying the Expected Shortfall</CardTitle>
          <CardDescription>
            The shaded area to the left of the VaR line represents the "tail" of the distribution. Expected Shortfall is the average value of all outcomes within this tail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData.returnsDistributionWithTail}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="return" label={{ value: 'Portfolio Return (%)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area type="monotone" dataKey="density" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="tailDensity" stroke="#e53e3e" fill="#e53e3e" fillOpacity={0.6} name="Losses > VaR" />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> Expected Shortfall provides a more complete picture of risk by considering the severity of losses in the tail. By averaging all the outcomes in the red shaded area, ES gives a better estimate of the potential damage in a worst-case scenario.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Setting:</strong> At a {parameters.confidenceLevel * 100}% confidence level, ES is the average of all returns in the worst {(100 - parameters.confidenceLevel * 100).toFixed(0)}% of scenarios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { IconCalculator } from '@tabler/icons-react'

/**
 * Phase 3: VaR vs. ES: A Direct Comparison
 */
export const ComparisonPhase = ({ tutorialHook }) => {
  const { parameters, calculations, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <p className="text-lg mb-6 leading-relaxed">
          By definition, the Expected Shortfall will always be a value indicating a greater loss than the Value at Risk at the same confidence level. This is because ES is the average of a range of losses, all of which are worse than the single VaR value.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>VaR and ES on the Distribution</CardTitle>
          <CardDescription>
            See the exact points for both VaR and ES on the returns distribution. Notice that ES is always further into the tail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.returnsDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="return" domain={[-10, 10]} label={{ value: 'Portfolio Return (%)', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="density" stroke="#8884d8" dot={false} />
                    <ReferenceLine x={calculations.varValue} stroke="red" strokeWidth={2} label={{ value: `VaR: ${calculations.varValue.toFixed(2)}%`, fill: 'red', position: 'insideTop' }} />
                    <ReferenceLine x={calculations.esValue} stroke="purple" strokeWidth={2} label={{ value: `ES: ${calculations.esValue.toFixed(2)}%`, fill: 'purple', position: 'insideBottom' }} />
                </LineChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> The visualization clearly shows that the Expected Shortfall (purple line) represents a larger potential loss than the Value at Risk (red line). This makes ES a more conservative and comprehensive measure of tail risk.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Analysis:</strong> For a confidence level of {parameters.confidenceLevel * 100}%, the VaR is {calculations.varValue.toFixed(2)}%, while the Expected Shortfall is {calculations.esValue.toFixed(2)}%. Change the volatility or confidence level to see how both values are affected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconInfoCircle } from '@tabler/icons-react'

/**
 * Phase 4: Why Expected Shortfall is a "Coherent" Risk Measure
 */
export const CoherencePhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-primary/10 p-8 rounded-wabi-card border-l-4 border-primary mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconInfoCircle className="w-5 h-5 text-primary" />
            The Importance of Coherence and Subadditivity
          </h3>
          <p className="text-base leading-relaxed">
            Expected Shortfall is considered a "coherent" risk measure, while VaR is not. [5] One of the most important properties of a coherent risk measure is **subadditivity**. This means that the risk of a combined portfolio should not be greater than the sum of the risks of its individual components. In other words, diversification should not increase risk. [6]
          </p>
          <p className="text-base leading-relaxed mt-3">
             VaR can violate this principle in certain scenarios (especially with assets that have skewed, fat-tailed returns), meaning it can discourage diversification. Expected Shortfall always satisfies subadditivity, providing a more reliable measure for portfolio optimization. [5, 6]
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subadditivity in Practice</CardTitle>
          <CardDescription>
            This chart compares the risk of two individual assets (A and B) with the risk of a combined portfolio (A+B).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.subadditivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="VaR" fill="#ff7300" name="Value at Risk" />
                    <Bar dataKey="ES" fill="#387908" name="Expected Shortfall" />
                </BarChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> In this example, the VaR of the combined portfolio is greater than the sum of the individual VaRs (VaR(A+B) > VaR(A) + VaR(B)), violating subadditivity and incorrectly penalizing diversification. However, the Expected Shortfall of the combined portfolio is less than the sum of the individual ES values (ES(A+B) <= ES(A) + ES(B)), correctly reflecting the benefits of diversification.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Practical Implication:</strong> Because ES is a coherent risk measure, it provides a more robust and reliable foundation for risk management and portfolio construction decisions, especially when dealing with complex financial instruments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}