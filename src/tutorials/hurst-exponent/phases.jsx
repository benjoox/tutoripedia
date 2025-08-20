import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { IconBook, IconTrendingUp, IconCalculator, IconShieldCheck, IconInfoCircle } from '@tabler/icons-react'

/**
 * Phase 1: Understanding Time Series Behavior
 */
export const IntroductionPhase = ({ tutorialHook }) => {
    const { chartData } = tutorialHook()

    return (
        <div className="space-y-8">
            <div className="prose max-w-none">
                <div className="bg-info/10 p-8 rounded-wabi-card border-l-4 border-info mb-8 wabi-sabi-texture">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <IconInfoCircle className="w-5 h-5 text-info" />
                        Random Walks, Trends, and Mean Reversion
                    </h3>
                    <p className="text-base leading-relaxed">
                        Before we can measure anything, we need to understand the different "personalities" a financial time series can have. Broadly, they fall into three categories.
                    </p>
                    <ul className="list-disc pl-5 mt-3 space-y-2">
                        <li><strong>Random Walk:</strong> Price movements are independent and unpredictable. The past has no bearing on the future. This is the foundation of the Efficient Market Hypothesis.</li>
                        <li><strong>Trending (Persistent):</strong> The series has "memory." A positive price move is likely to be followed by another positive move. This is the basis for momentum strategies.</li>
                        <li><strong>Mean-Reverting (Anti-Persistent):</strong> The series is self-correcting. A positive price move is likely to be followed by a negative one, pulling it back towards an average. This is the basis for pairs trading.</li>
                    </ul>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visualizing Time Series Behaviors</CardTitle>
                    <CardDescription>
                        These three charts simulate asset paths exhibiting each distinct behavior. Notice how different their structures are.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-center">Mean-Reverting</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData.meanRevertingSeries}>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-center">Random Walk</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData.randomWalkSeries}>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-center">Trending</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData.trendingSeries}>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#ffc658" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


/**
 * Phase 2: Defining the Hurst Exponent (H)
 */
export const HurstDefinitionPhase = ({ tutorialHook }) => {
    const { parameters, chartData, calculations } = tutorialHook()

    return (
        <div className="space-y-8">
            <div className="prose max-w-none">
                <p className="text-lg mb-6 leading-relaxed">
                    The **Hurst Exponent (H)** is a single number that quantifies which of the three behaviors a time series exhibits. It measures the long-term memory of a series.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-success/10 rounded-lg">
                        <h4 className="font-bold">0 ≤ H &lt; 0.5</h4>
                        <p>Mean-Reverting</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-bold">H = 0.5</h4>
                        <p>Random Walk</p>
                    </div>
                    <div className="p-4 bg-warning/10 rounded-lg">
                        <h4 className="font-bold">0.5 &lt; H ≤ 1</h4>
                        <p>Trending</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Interactive Hurst Exponent Simulation</CardTitle>
                    <CardDescription>
                        Adjust the slider in the sidebar to set the Hurst Exponent (H). The chart will update with a new simulated series that follows the selected H value.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData.interactiveSeries}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture mt-6 text-center">
                        <p className="text-xl font-semibold text-foreground">
                            Current H Value: {parameters.H.toFixed(2)}
                        </p>
                        <p className="text-lg text-muted-foreground mt-2">
                            Classification: <strong>{calculations.classification}</strong>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Phase 3: Application in Financial Strategy
 */
export const StrategyPhase = ({ tutorialHook }) => {
    const { parameters } = tutorialHook()

    return (
        <div className="space-y-8">
            <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Matching Strategy to Market Behavior</h3>
                <p className="text-lg leading-relaxed">
                    The Hurst Exponent is not just a theoretical number; it's a practical guide for selecting the right type of trading or investment strategy. Using a trend-following strategy in a mean-reverting market (or vice versa) is likely to lead to poor results.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Strategy Selection Framework</CardTitle>
                    <CardDescription>
                        The H value of an asset or market suggests which family of strategies is most likely to be successful.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="text-center mb-4">
                            <p className="font-mono text-xl">Calculate Hurst Exponent (H) for an Asset</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Mean Reversion Path */}
                            <div className={`p-4 rounded-md text-center border-2 ${parameters.H < 0.5 ? 'border-success bg-success/10' : 'border-transparent'}`}>
                                <h4 className="font-bold text-success mb-2">IF H &lt; 0.5 (Mean-Reverting)</h4>
                                <p className="text-sm text-muted-foreground">Asset price is likely to revert to its average.</p>
                                <hr className="my-3" />
                                <p className="font-semibold">Appropriate Strategies:</p>
                                <p className="text-sm">Pairs Trading, Swing Trading, Selling Volatility</p>
                            </div>
                            {/* Random Walk Path */}
                            <div className={`p-4 rounded-md text-center border-2 ${parameters.H >= 0.45 && parameters.H <= 0.55 ? 'border-primary bg-primary/10' : 'border-transparent'}`}>
                                <h4 className="font-bold text-primary mb-2">IF H ≈ 0.5 (Random Walk)</h4>
                                <p className="text-sm text-muted-foreground">Past prices offer no predictive power.</p>
                                <hr className="my-3" />
                                <p className="font-semibold">Appropriate Strategies:</p>
                                <p className="text-sm">Passive Investing, Index Funds, Diversification</p>
                            </div>
                            {/* Trending Path */}
                            <div className={`p-4 rounded-md text-center border-2 ${parameters.H > 0.5 ? 'border-warning bg-warning/10' : 'border-transparent'}`}>
                                <h4 className="font-bold text-warning mb-2">IF H &gt; 0.5 (Trending)</h4>
                                <p className="text-sm text-muted-foreground">Price trends are likely to continue.</p>
                                <hr className="my-3" />
                                <p className="font-semibold">Appropriate Strategies:</p>
                                <p className="text-sm">Momentum Investing, Trend Following</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture">
                        <p className="text-sm leading-relaxed text-foreground">
                            <strong>Key Insight:</strong> Calculating H on different timeframes (e.g., daily, weekly) can reveal different behaviors. An asset might be mean-reverting on a short-term basis but trending over the long term. This allows for a more nuanced, multi-layered strategy.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


/**
 * Phase 4: Hurst Exponent in Risk Management
 */
export const RiskManagementPhase = ({ tutorialHook }) => {
    const { chartData } = tutorialHook()

    return (
        <div className="space-y-8">
            <div className="prose max-w-none">
                <div className="bg-destructive/10 p-8 rounded-wabi-card border-l-4 border-destructive mb-8 wabi-sabi-texture">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <IconShieldCheck className="w-5 h-5 text-destructive" />
                        Beyond Volatility: Understanding the Nature of Risk
                    </h3>
                    <p className="text-base leading-relaxed">
            Standard risk models often assume price changes are random and normally distributed (H=0.5). The Hurst Exponent shows this is often not true. A trending series (H &gt; 0.5) is far more likely to experience extreme events—so-called "fat tails" or "black swans"—than a random one.
                    </p>
                    <p className="text-base leading-relaxed mt-3">
                        Recognizing this allows risk managers to build more robust models. If a portfolio's returns show a high H value, it means long, sustained drawdowns are a greater risk than a standard VaR model might predict.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>The Impact of H on Return Distributions</CardTitle>
                    <CardDescription>
            A trending series (H &gt; 0.5) has "fatter tails," meaning a higher probability of extreme outcomes compared to a random walk.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={chartData.distributionComparison}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="return" label={{ value: 'Portfolio Return', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="randomWalk" stackId="1" stroke="#8884d8" fill="#8884d8" name="Random Walk (H=0.5)" />
                            <Area type="monotone" dataKey="trending" stackId="1" stroke="#ffc658" fill="#ffc658" name="Trending (H=0.75)" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="bg-muted p-6 rounded-wabi-card wabi-sabi-texture mt-6">
                        <p className="text-sm leading-relaxed mb-4 text-foreground">
                            <strong>Key Insight:</strong> The chart shows that for the trending series, the probability of returns in the far left and right tails is significantly higher. This means that a risk manager using a model that assumes a random walk would be systematically underestimating the likelihood of large, sudden losses (and gains).
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            <strong>Practical Application:</strong> A portfolio manager might use H to adjust position sizes. For an asset with H &gt; 0.7, they might use a smaller position size than for an asset with H = 0.5, even if their historical volatilities are identical, to account for the increased tail risk.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Phase definitions for the tutorial system
 */
export const hurstExponentPhases = [
    {
        id: 'introduction',
        title: 'Time Series Behavior',
        icon: <IconBook className="w-6 h-6" />,
        shortTitle: 'Introduction',
        content: IntroductionPhase
    },
    {
        id: 'hurst-definition',
        title: 'Defining the Hurst Exponent',
        icon: <IconCalculator className="w-6 h-6" />,
        shortTitle: 'Definition',
        content: HurstDefinitionPhase
    },
    {
        id: 'strategy',
        title: 'Application in Financial Strategy',
        icon: <IconTrendingUp className="w-6 h-6" />,
        shortTitle: 'Strategy',
        content: StrategyPhase
    },
    {
        id: 'risk-management',
        title: 'Hurst Exponent in Risk Management',
        icon: <IconShieldCheck className="w-6 h-6" />,
        shortTitle: 'Risk Management',
        content: RiskManagementPhase
    }
]