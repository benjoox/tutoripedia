import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { IconBook, IconCalculator, IconAlertTriangle } from '@tabler/icons-react'
import ResponsiveChart from '@/components/charts/ResponsiveChart'
import MobileTooltip from '@/components/charts/MobileTooltip'
import { useIsMobile } from '@/hooks/use-mobile'

/**
 * Phase 1: What is VWAP?
 */
export const VWAPIntroductionPhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()
  const isMobile = useIsMobile()

  if (!chartData || !chartData.intradayData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconBook className="w-5 h-5 text-info" />
            Beyond Simple Averages: The Importance of Volume 📈
          </h3>
          <p className="text-base leading-relaxed">
            In financial markets, not all prices are created equal. A price where one million shares traded is far more significant than a price where only one hundred shares traded. A Simple Moving Average (SMA) treats every closing price the same, regardless of the trading activity.
          </p>
          <p className="text-base leading-relaxed mt-3">
            The <strong>Volume-Weighted Average Price (VWAP)</strong> solves this by creating an average price that is weighted by volume. It represents the "true" average price of a stock over a specific time period (typically one day). [1] Think of it as the market's financial center of gravity for the day.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>VWAP vs. Simple Moving Average (SMA)</CardTitle>
          <CardDescription>
            Notice how VWAP (purple) reacts more to price moves accompanied by high volume, while the SMA (green) moves more uniformly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveChart 
            height={400} 
            mobileHeight={300}
            enableTouch={true}
            className="mb-4"
          >
            <ComposedChart data={chartData.intradayData}>
              <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
              <XAxis 
                dataKey="time" 
                label={isMobile ? null : { value: 'Time of Day', position: 'insideBottom', offset: -5 }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? 'preserveStartEnd' : 0}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="hsl(var(--primary))" 
                label={isMobile ? null : { value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 50 : 60}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--success))" 
                label={isMobile ? null : { value: 'Volume', angle: 90, position: 'insideRight' }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 50 : 60}
              />
              <Tooltip 
                content={<MobileTooltip 
                  formatter={(value, name) => {
                    if (name === 'volume') return [value.toLocaleString(), 'Volume']
                    if (name === 'price') return [`$${value.toFixed(2)}`, 'Price']
                    if (name === 'vwap') return [`$${value.toFixed(2)}`, 'VWAP']
                    if (name === 'sma') return [`$${value.toFixed(2)}`, '20-period SMA']
                    return [`$${value.toFixed(2)}`, name]
                  }}
                />}
              />
              <Legend />
              <Bar yAxisId="right" dataKey="volume" fill="hsl(var(--success))" name="Volume" barSize={isMobile ? 15 : 20} />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="hsl(var(--destructive))" dot={false} name="Price" strokeWidth={isMobile ? 2 : 1} />
              <Line yAxisId="left" type="monotone" dataKey="vwap" stroke="hsl(var(--primary))" strokeWidth={isMobile ? 3 : 2} dot={false} name="VWAP" />
              <Line yAxisId="left" type="monotone" dataKey="sma" stroke="hsl(var(--success))" strokeWidth={isMobile ? 3 : 2} strokeDasharray="5 5" dot={false} name="20-period SMA" />
            </ComposedChart>
          </ResponsiveChart>
          
          {/* Mobile chart labels */}
          {isMobile && (
            <div className="text-center text-xs text-muted-foreground mb-4 space-y-1">
              <div>X-axis: Time of Day</div>
              <div>Left Y-axis: Price ($) | Right Y-axis: Volume</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 2: The VWAP Calculation
 */
export const VWAPCalculationPhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()

  if (!chartData || !chartData.calculationData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading calculation data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <p className="text-lg mb-6 leading-relaxed">
          VWAP is calculated by taking the total dollar value traded for every transaction (Price multiplied by Volume) and then dividing it by the total shares traded for the day. This calculation starts fresh at the market open each day.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalculator />
            The VWAP Formula
          </CardTitle>
          <CardDescription>
            The formula aggregates price-volume data cumulatively throughout the day.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
          <p className="text-4xl font-mono text-center text-primary" style={{ fontFamily: 'KaTeX_Main, Times New Roman, serif' }}>
            {'VWAP = Σ(Price × Volume) / Σ(Volume)'}
          </p>
          <p className="text-center mt-4 text-muted-foreground">
            Where 'Price' is the typical price for the period, often calculated as (High + Low + Close) / 3.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Calculation Example</CardTitle>
          <CardDescription>
            Here's how the VWAP is calculated over three 5-minute periods. Each new period's data is added to the running totals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Price ($)</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Price x Volume</th>
                  <th className="px-4 py-3">Cumulative (P x V)</th>
                  <th className="px-4 py-3">Cumulative Volume</th>
                  <th className="px-4 py-3 font-bold text-primary">VWAP ($)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.calculationData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{row.time}</td>
                    <td className="px-4 py-2">{row.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{row.volume.toLocaleString()}</td>
                    <td className="px-4 py-2">{row.pv.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2">{row.cumulativePV.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2">{row.cumulativeVol.toLocaleString()}</td>
                    <td className="px-4 py-2 font-bold text-primary">{row.vwap.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 3: Trading Strategies with VWAP
 */
export const VWAPStrategyPhase = () => {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-3">From Benchmark to Trading Signal 🎯</h3>
          <p className="text-lg leading-relaxed">
            VWAP serves two primary roles: as a benchmark for trade execution quality and as a real-time indicator of intraday market sentiment.
          </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>VWAP Strategy Framework</CardTitle>
          <CardDescription>
            Different market participants use VWAP to achieve different goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Institutional Use */}
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-bold text-accent mb-2">Institutional Use: Fair Value Benchmark</h4>
              <p className="text-sm text-muted-foreground mb-3">Large funds aim to execute orders with minimal market impact. VWAP is their yardstick for a "good" fill.</p>
              <p className="font-semibold">Execution Logic:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>For Buyers:</strong> Aim to buy shares at or **below** the VWAP to ensure their average entry price is favorable.</li>
                <li><strong>For Sellers:</strong> Aim to sell shares at or **above** the VWAP to maximize their exit price.</li>
                <li>Algorithms are often programmed to break large orders into smaller pieces and execute them around the VWAP.</li>
              </ul>
            </div>
            {/* Retail Use */}
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-bold text-primary mb-2">Retail Use: Intraday Trend & Reversion</h4>
              <p className="text-sm text-muted-foreground mb-3">Retail traders use VWAP as a dynamic support and resistance level to gauge intraday control.</p>
              <p className="font-semibold">Potential Strategies:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><strong>Trend Confirmation:</strong> If the price is consistently trading **above** VWAP, it suggests bullish sentiment for the day. Traders might look for long entries on pullbacks to the VWAP.</li>
                <li><strong>Mean Reversion:</strong> When the price moves significantly far away from VWAP, it may be "overextended" and likely to revert back toward the VWAP line.</li>
              </ul>
            </div>
          </div>
          <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Use Case - Identifying Trend Shifts:</strong> A crossover is a key signal. When the price crosses **above** the VWAP line with strong volume, it can signal a potential shift to a bullish intraday trend. Conversely, a cross **below** can signal a bearish shift.
              </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Phase 4: Limitations and Advanced Concepts
 */
export const VWAPRiskManagementPhase = ({ tutorialHook }) => {
  const { chartData } = tutorialHook()
  const isMobile = useIsMobile()

  if (!chartData || !chartData.idealData || !chartData.choppyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading market scenario data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <div className="bg-destructive/10 p-8 rounded-wabi-card border-l-4 border-destructive mb-8 wabi-sabi-texture">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <IconAlertTriangle className="w-5 h-5 text-destructive" />
            Important Caveats: VWAP is Not a Magic Line
          </h3>
          <p className="text-base leading-relaxed">
            While extremely useful, VWAP has limitations that every trader must understand to avoid costly mistakes. Context is everything.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li><strong>Lagging Indicator:</strong> VWAP is based on past data. It tells you what has happened, not what will happen.</li>
            <li><strong>Intraday Only:</strong> It resets every single day. Yesterday's VWAP has no bearing on today's price action.</li>
            <li><strong>Increasing Lag:</strong> As the day progresses, more data is included, making the VWAP slower to react to new price changes.</li>
          </ul>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ideal vs. Problematic Market Conditions</CardTitle>
          <CardDescription>
            VWAP is most reliable in liquid, trending markets. It can be deceptive in choppy, low-volume conditions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Clean Trend (Good for VWAP)</h4>
            <ResponsiveChart 
              height={300} 
              mobileHeight={250}
              enableTouch={true}
            >
              <LineChart data={chartData.idealData}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 50}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => {
                      if (name === 'price') return [`$${value.toFixed(2)}`, 'Price']
                      if (name === 'vwap') return [`$${value.toFixed(2)}`, 'VWAP']
                      return [`$${value.toFixed(2)}`, name]
                    }}
                  />}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--destructive))" dot={false} name="Price" strokeWidth={isMobile ? 2 : 1} />
                <Line type="monotone" dataKey="vwap" stroke="hsl(var(--primary))" strokeWidth={isMobile ? 3 : 2} dot={false} name="VWAP" />
              </LineChart>
            </ResponsiveChart>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-center">Choppy Market (Bad for VWAP)</h4>
            <ResponsiveChart 
              height={300} 
              mobileHeight={250}
              enableTouch={true}
            >
              <LineChart data={chartData.choppyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={isMobile ? 0.3 : 0.5} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 50}
                />
                <Tooltip 
                  content={<MobileTooltip 
                    formatter={(value, name) => {
                      if (name === 'price') return [`$${value.toFixed(2)}`, 'Price']
                      if (name === 'vwap') return [`$${value.toFixed(2)}`, 'VWAP']
                      return [`$${value.toFixed(2)}`, name]
                    }}
                  />}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--warning))" dot={false} name="Price" strokeWidth={isMobile ? 2 : 1} />
                <Line type="monotone" dataKey="vwap" stroke="hsl(var(--primary))" strokeWidth={isMobile ? 3 : 2} dot={false} name="VWAP" />
              </LineChart>
            </ResponsiveChart>
          </div>
          
          {/* Mobile chart labels */}
          {isMobile && (
            <div className="md:col-span-2 text-center text-xs text-muted-foreground mb-4 space-y-1">
              <div>X-axis: Time | Y-axis: Price ($)</div>
            </div>
          )}
          
          <div className="md:col-span-2 bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
              <p className="text-sm leading-relaxed text-foreground">
                <strong>Advanced Concept - VWAP Bands:</strong> To better understand when a price is "too far" from the VWAP, traders often plot standard deviation bands around the VWAP line. These bands expand and contract with volatility. A price touching the outer bands might be considered overextended, signaling a potential reversion opportunity. This transforms VWAP from a single line into a dynamic range of expected values.
              </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}