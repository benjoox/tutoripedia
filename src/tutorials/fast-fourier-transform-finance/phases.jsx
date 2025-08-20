import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { IconShieldCheck, IconInfoCircle } from '@tabler/icons-react'

/**
 * Phase 1: Financial Data as a Signal
 */
export const IntroductionPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()

  // Safety check to ensure data is available
  if (!parameters || !chartData || !chartData.constituentCycles || !chartData.compositeSignal) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconInfoCircle className="w-5 h-5 text-info" />
            Beyond the Price Chart: Decomposing Market Behavior
          </h3>
          <p className="text-base leading-relaxed">
            Financial time series, like stock prices or economic data, are signals. We typically analyze them in the **time domain**—a chronological chart of price versus time. This shows us *what* happened, but not necessarily the underlying structure of *why*.
          </p>
          <p className="text-base leading-relaxed mt-3">
            The core idea of Fourier analysis in finance is that these complex price movements can be broken down into a combination of simpler cyclical components. [2] Think of a short-term trading cycle, a quarterly earnings cycle, and a long-term economic cycle all happening at once. The FFT is the tool that helps us identify these underlying cycles.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Building a Market Signal from Cycles</CardTitle>
          <CardDescription>
            A complex price chart (bottom) is often a sum of underlying cycles (top) plus random market noise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Underlying Market Cycles</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.constituentCycles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Trading Days', position: 'insideBottom', offset: -5 }} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="cycle1" stroke="#8884d8" dot={false} name={`Period: ${parameters.period1 || 0} days`} />
                <Line type="monotone" dataKey="cycle2" stroke="#82ca9d" dot={false} name={`Period: ${parameters.period2 || 0} days`} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Resulting Simulated Price Chart</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.compositeSignal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Trading Days', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#e53e3e" dot={false} name="Simulated Price" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 2: Using FFT to Uncover Dominant Cycles
 */
export const FFTCyclesPhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()

  // Safety check to ensure data is available
  if (!chartData || !chartData.compositeSignal || !chartData.frequencySpectrum) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <p className="text-lg mb-6 leading-relaxed">
          The **Fast Fourier Transform (FFT)** takes our price history (time domain) and converts it into a frequency spectrum. For finance, it's more intuitive to think of the x-axis as the **period** of a cycle (e.g., 30 days, 90 days, 250 days). The height of the bar (magnitude) shows how influential or dominant that specific cycle is within the data.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>From Price History to Cycle Spectrum</CardTitle>
          <CardDescription>
            The FFT analyzes the price chart (left) to produce a spectrum (right) that reveals the strength of various underlying cycles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Time Domain (Price Chart)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.compositeSignal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#e53e3e" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Frequency Domain (FFT Output)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.frequencySpectrum}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" label={{ value: 'Cycle Period (Days)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Magnitude (Strength)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="magnitude" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 3: Financial Strategy and Use Cases
 */
export const StrategyPhase = () => {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-3">Turning Cycles into Actionable Insights</h3>
          <p className="text-lg leading-relaxed">
            Identifying a dominant cycle is the first step. The next is to build a strategy that capitalizes on this information. The nature of the cycle dictates the appropriate strategy.
          </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cycle-Based Strategy Framework</CardTitle>
          <CardDescription>
            The characteristics of the dominant cycle(s) identified by the FFT can guide trading and investment decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Short-Term Cycle */}
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-bold text-accent mb-2">Dominant Short-Term Cycle (e.g., 10-40 days)</h4>
              <p className="text-sm text-muted-foreground mb-3">Indicates potential for regular, predictable swings around a central price.</p>
              <p className="font-semibold">Potential Strategies:</p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Mean Reversion / Swing Trading:</strong> Buy when the price deviates significantly below the cycle's path, sell when it's above.</li>
                <li><strong>Option Selling:</strong> Sell premium (e.g., iron condors) expecting the price to remain within the cycle's predictable range.</li>
              </ul>
            </div>
            {/* Long-Term Cycle */}
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-bold text-primary mb-2">Dominant Long-Term Cycle (e.g., 200+ days)</h4>
              <p className="text-sm text-muted-foreground mb-3">Suggests a persistent, underlying economic or business trend.</p>
              <p className="font-semibold">Potential Strategies:</p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Trend Following:</strong> Use the cycle's primary direction to confirm and hold long-term positions.</li>
                <li><strong>Sector Rotation:</strong> Identify which sectors exhibit strong cyclical behavior tied to the broader economy.</li>
              </ul>
            </div>
          </div>
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Use Case - Filtering Noise:</strong> FFT can be used as a filter. By transforming the data, removing the high-frequency "noise" components, and then inverse-transforming it back to the time domain, analysts can create a smoothed-out version of the price chart that makes the primary trend easier to see.
              </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 4: Implications, Limitations, and Risk Management
 */
export const RiskManagementPhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()

  // Safety check to ensure data is available
  if (!chartData || !chartData.cleanSpectrum || !chartData.noisySpectrum) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-destructive/10 p-8 rounded-wabi-card border-l-4 border-destructive mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconShieldCheck className="w-5 h-5 text-destructive" />
            Important Caveats: Markets Are Not Perfect Sine Waves
          </h3>
          <p className="text-base leading-relaxed">
            While powerful, the FFT is not a crystal ball. Financial markets are **non-stationary** (their statistical properties change over time) and extremely **noisy**. A cycle that was dominant last year might fade away this year due to a change in the economic regime.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>Risk of Overfitting:</strong> It's easy to find apparent cycles in random data. Any identified cycle must be statistically validated.</li>
            <li><strong>Lagging Nature:</strong> FFT requires a window of past data, so by the time a cycle is confirmed, it may already be shifting.</li>
          </ul>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Clean Signal vs. Real Market Noise</CardTitle>
          <CardDescription>
            The FFT of a clean, simulated signal is easy to interpret. The FFT of real market data is much noisier and requires careful analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">FFT of a Clean Signal</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.cleanSpectrum}>
                <XAxis dataKey="period" />
                <YAxis />
                <Bar dataKey="magnitude" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">FFT of Real Stock Data</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.noisySpectrum}>
                <XAxis dataKey="period" />
                <YAxis />
                <Bar dataKey="magnitude" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="md:col-span-2 bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Implication for Risk Management:</strong> By decomposing volatility into different frequencies, risk managers can better understand its source. For example, they can distinguish between short-term, high-frequency "jitter" and low-frequency, long-term trend risk. This can lead to more sophisticated inputs for risk models like VaR or for pricing complex derivatives that depend on the volatility term structure.
              </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


