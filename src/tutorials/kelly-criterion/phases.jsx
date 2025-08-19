import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { IconInfoCircle } from '@tabler/icons-react'

/**
 * Phase 1: Introduction to the Kelly Criterion
 */
export const IntroductionPhase = ({ tutorialHook }) => {

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconInfoCircle className="w-5 h-5 text-info" />
            What is the Kelly Criterion and Why is it Important?
          </h3>
          <p className="text-base leading-relaxed">
            The Kelly Criterion is a mathematical formula that determines the optimal size for a bet or investment. [2, 6] It's designed to maximize the long-term growth of your capital. [2, 6] Originally developed by John L. Kelly Jr. at Bell Labs to analyze telephone signal noise, it was later adopted by gamblers and investors to manage their money effectively. [3, 8] Prominent investors like Warren Buffett are rumored to have used variations of this strategy. [3, 4]
          </p>
          <p className="text-base leading-relaxed mt-3">
            This approach is crucial because it provides a systematic way to balance risk and reward. [7] By calculating the ideal fraction of your capital to allocate to an opportunity, it helps in avoiding both overly aggressive bets that could lead to ruin and overly conservative bets that result in slow growth. [3]
          </p>
        </div>
        
        <h3 className="text-xl font-semibold mb-6">The Core Formula</h3>
        <p className="text-lg mb-6 leading-relaxed">
          The Kelly Criterion calculates the fraction of your capital (f*) you should bet, based on the probability of winning and the win/loss ratio.
        </p>
        <div className="bg-accent/10 p-6 rounded-wabi-card border-l-4 border-accent mb-8 wabi-sabi-texture">
          <p className="font-mono text-lg text-foreground">f* = p - q / b</p>
        </div>
        
        <h3 className="text-xl font-semibold mb-6">Variable Explanations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
            <h4 className="font-semibold text-accent mb-3">f* - Kelly Percentage</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">The fraction of your current capital you should bet. [3]</p>
          </div>
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
            <h4 className="font-semibold text-success mb-3">p - Probability of Winning</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">The likelihood of a positive outcome for your bet or investment. [3, 5]</p>
          </div>
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
            <h4 className="font-semibold text-primary mb-3">q - Probability of Losing</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">The likelihood of a negative outcome, which is calculated as 1 - p. [3, 5]</p>
          </div>
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
            <h4 className="font-semibold text-warning mb-3">b - Win/Loss Ratio</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">The ratio of the amount you stand to win to the amount you stand to lose. [14]</p>
          </div>
        </div>
        
        <div className="bg-warning/10 p-6 rounded-wabi-card border-l-4 border-warning wabi-sabi-texture">
          <p className="text-sm leading-relaxed text-foreground">
            <strong>Why is this important?</strong> The Kelly Criterion provides a disciplined approach to position sizing, preventing you from risking too much on a single venture while ensuring you capitalize on favorable opportunities. [7]
          </p>
        </div>
      </div>
    </div>
  )
}
/**
 * Phase 2: Visualizing the Kelly Bet Size
 */
export const KellyBetSizePhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <p className="text-lg mb-6 leading-relaxed">
          The core of the Kelly Criterion is finding the optimal bet size. Betting too little means leaving potential gains on the table, while betting too much significantly increases the risk of ruin.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Optimal Bet Size vs. Growth Rate</CardTitle>
          <CardDescription>
            See how the expected long-term growth rate of your capital changes as you vary the fraction of your bankroll you bet. The peak of the curve represents the Kelly Percentage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData.growthRateVsBetSize}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="betSize" label={{ value: 'Fraction of Bankroll Bet (%)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Long-Term Growth Rate', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="growthRate" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> The graph demonstrates that there's a single peak for the growth rate. This peak corresponds to the optimal bet size calculated by the Kelly Criterion. Betting any more or any less than this amount will result in a lower long-term growth rate.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Setting:</strong> With a win probability of {parameters.probabilityOfWinning * 100}% and a win/loss ratio of {parameters.winLossRatio}, the optimal bet size is {parameters.kellyPercentage.toFixed(2)}%. Adjust the sliders in the sidebar to see how the optimal bet size changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 3: Bankroll Growth Simulation
 */
export const BankrollGrowthPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <p className="text-lg mb-6 leading-relaxed">
          To truly understand the power of the Kelly Criterion, it's helpful to simulate how your capital might grow over a series of bets when using different betting strategies.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Simulated Bankroll Growth Over Time</CardTitle>
          <CardDescription>
            Compare the simulated growth of your initial bankroll over a series of bets for different betting fractions: Kelly, Half-Kelly, and Over-betting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData.bankrollGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="betNumber" label={{ value: 'Number of Bets', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Bankroll ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="kelly" stroke="#82ca9d" name="Kelly Bet" />
                <Line type="monotone" dataKey="halfKelly" stroke="#8884d8" name="Half-Kelly Bet" />
                <Line type="monotone" dataKey="overBet" stroke="#ffc658" name="Over-Betting" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> The simulation shows that while the "Kelly Bet" line achieves the highest long-term growth, it can also be quite volatile. A "Half-Kelly" approach (betting half the recommended Kelly fraction) often provides a smoother growth path with less risk. Over-betting, however, can quickly lead to significant losses and even bankruptcy.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Simulation:</strong> This simulation runs for {parameters.numberOfBets} bets. You can adjust the parameters in the sidebar and re-run the simulation to see how the outcomes change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 4: Fractional Kelly and Practical Considerations
 */
export const FractionalKellyPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-primary/10 p-8 rounded-wabi-card border-l-4 border-primary mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconInfoCircle className="w-5 h-5 text-primary" />
            Why Not Always Bet the Full Kelly Amount?
          </h3>
          <p className="text-base leading-relaxed">
            While the Kelly Criterion provides the optimal bet size for long-term growth, it has some practical limitations. The formula assumes you know the exact probabilities of winning and losing, which is rarely the case in the real world. Overestimating your edge can lead to over-betting and increased risk of ruin.
          </p>
          <p className="text-base leading-relaxed mt-3">
            To account for this uncertainty and reduce volatility, many practitioners use a "Fractional Kelly" strategy, where they bet a fraction (e.g., half or a quarter) of the amount suggested by the formula. [10] This approach still captures a significant portion of the growth potential while substantially reducing the risk.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Rate vs. Volatility for Fractional Kelly</CardTitle>
          <CardDescription>
            Compare the trade-off between the expected long-term growth rate and the volatility (risk) for different fractions of the Kelly bet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.fractionalKelly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fraction" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="growthRate" fill="#8884d8" name="Growth Rate" />
                    <Bar yAxisId="right" dataKey="volatility" fill="#82ca9d" name="Volatility" />
                </BarChart>
            </ResponsiveContainer>
            
            <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                <strong>Key Insight:</strong> This chart illustrates that as you decrease the fraction of the Kelly bet, both the expected growth rate and the volatility decrease. A fractional Kelly approach allows you to choose a risk-reward profile that aligns with your personal tolerance.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Current Analysis:</strong> The chart shows the trade-offs for different fractions of the full Kelly bet. Notice how a significant reduction in volatility can be achieved with only a moderate decrease in the long-term growth rate when using a fractional approach.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}