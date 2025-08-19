import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts'
import { IconInfoCircle } from '@tabler/icons-react'

export const IntroductionPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconInfoCircle className="w-5 h-5" />
            Understanding Signals in Time and Frequency
          </CardTitle>
          <CardDescription>
            Every signal can be viewed in two domains: time domain (how it changes over time) and frequency domain (what frequencies it contains).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Fast Fourier Transform (FFT) is one of the most important algorithms in signal processing. 
            It allows us to decompose any signal into its constituent frequencies, revealing hidden patterns 
            and enabling powerful analysis techniques.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Key Concepts:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Time Domain:</strong> Shows how signal amplitude changes over time</li>
              <li><strong>Frequency Domain:</strong> Shows what frequencies are present in the signal</li>
              <li><strong>Fourier Transform:</strong> Mathematical tool to convert between domains</li>
              <li><strong>FFT:</strong> Fast algorithm to compute the Fourier Transform efficiently</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Time Domain Signal</h4>
            <p className="text-sm text-gray-600 mb-3">
              Current signal: {parameters.amplitude1.toFixed(1)} × sin(2π × {parameters.frequency1}Hz × t) + {parameters.amplitude2.toFixed(1)} × sin(2π × {parameters.frequency2}Hz × t)
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  type="number"
                  scale="linear"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(1)}s`}
                />
                <YAxis tickFormatter={(value) => value.toFixed(1)} />
                <Tooltip 
                  formatter={(value, name) => [value.toFixed(3), name]}
                  labelFormatter={(value) => `Time: ${value.toFixed(3)}s`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amplitude" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Combined Signal"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="signal1" 
                  stroke="#dc2626" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name={`${parameters.frequency1}Hz Component`}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="signal2" 
                  stroke="#16a34a" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name={`${parameters.frequency2}Hz Component`}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const FrequencyDomainPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequency Domain Analysis</CardTitle>
          <CardDescription>
            The FFT reveals the frequency content of our signal, showing peaks at the frequencies of our sine waves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            When we apply the Fourier Transform to our time-domain signal, we get a frequency-domain representation 
            that shows the magnitude and phase of each frequency component. Notice how the peaks in the spectrum 
            correspond exactly to the frequencies we used to create the signal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Expected Peaks:</h4>
              <ul className="text-sm mt-1">
                <li>• {parameters.frequency1} Hz (amplitude: {parameters.amplitude1})</li>
                <li>• {parameters.frequency2} Hz (amplitude: {parameters.amplitude2})</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Key Insights:</h4>
              <ul className="text-sm mt-1">
                <li>• Peak heights show signal strength</li>
                <li>• Peak locations show frequencies</li>
                <li>• Noise appears as background</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Frequency Spectrum (Magnitude)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="frequency" 
                  type="number"
                  scale="linear"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(0)} Hz`}
                />
                <YAxis tickFormatter={(value) => value.toFixed(2)} />
                <Tooltip 
                  formatter={(value, name) => [value.toFixed(4), name]}
                  labelFormatter={(value) => `Frequency: ${value.toFixed(1)} Hz`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="magnitude" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Magnitude"
                  dot={false}
                />
                <ReferenceLine x={parameters.frequency1} stroke="#dc2626" strokeDasharray="2 2" />
                <ReferenceLine x={parameters.frequency2} stroke="#16a34a" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Understanding the Spectrum:</h4>
            <p className="text-sm">
              The red and green dashed lines show where we expect to see peaks based on our input frequencies. 
              The actual peaks in the blue line should align with these reference lines, confirming that the 
              FFT correctly identified the frequency components of our signal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const WindowingPhase = ({ tutorialHook }) => {
  const { parameters, chartData } = tutorialHook()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Windowing and Spectral Leakage</CardTitle>
          <CardDescription>
            Window functions help reduce spectral leakage, improving the quality of frequency analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            When we sample a signal for a finite duration, we're effectively multiplying it by a rectangular window. 
            This can cause spectral leakage - energy from one frequency "leaking" into adjacent frequencies. 
            Window functions like Hanning and Hamming help reduce this effect.
          </p>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Window Functions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Rectangular (None):</strong> Sharp cutoff, causes most leakage</li>
              <li><strong>Hanning:</strong> Smooth tapering, reduces leakage significantly</li>
              <li><strong>Hamming:</strong> Similar to Hanning with slightly different shape</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Windowed Signal</h4>
            <p className="text-sm text-gray-600 mb-3">
              Current window: {parameters.windowFunction === 'none' ? 'Rectangular (No windowing)' : 
                             parameters.windowFunction === 'hanning' ? 'Hanning Window' : 'Hamming Window'}
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.windowedSignal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  type="number"
                  scale="linear"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(1)}s`}
                />
                <YAxis tickFormatter={(value) => value.toFixed(1)} />
                <Tooltip 
                  formatter={(value, name) => [value.toFixed(3), name]}
                  labelFormatter={(value) => `Time: ${value.toFixed(3)}s`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amplitude" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Windowed Signal"
                  dot={false}
                />
                {parameters.windowFunction !== 'none' && (
                  <Line 
                    type="monotone" 
                    dataKey="window" 
                    stroke="#dc2626" 
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    name="Window Function"
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Try This:</h4>
            <p className="text-sm">
              Change the window function parameter and observe how it affects the signal shape. 
              Notice how windowing tapers the signal smoothly to zero at the edges, which helps 
              reduce artifacts in the frequency domain.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const SamplingPhase = ({ tutorialHook }) => {
  const { parameters, chartData, calculations } = tutorialHook()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sampling and the Nyquist Theorem</CardTitle>
          <CardDescription>
            Understanding how sampling rate affects our ability to accurately represent and analyze signals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Nyquist theorem states that to accurately represent a signal, we must sample at least twice 
            the highest frequency present. This is crucial for avoiding aliasing - where high frequencies 
            appear as false low frequencies in our sampled signal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Current Parameters:</h4>
              <ul className="text-sm mt-1 space-y-1">
                <li>• Sample Rate: {parameters.sampleRate} Hz</li>
                <li>• Nyquist Frequency: {calculations.nyquistFrequency} Hz</li>
                <li>• Max Signal Frequency: {Math.max(parameters.frequency1, parameters.frequency2)} Hz</li>
                <li>• Frequency Resolution: {calculations.frequencyResolution.toFixed(2)} Hz</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-sm">Quality Indicators:</h4>
              <ul className="text-sm mt-1 space-y-1">
                <li>• Samples: {calculations.numSamples}</li>
                <li>• Duration: {parameters.duration}s</li>
                <li>• Nyquist OK: {Math.max(parameters.frequency1, parameters.frequency2) < calculations.nyquistFrequency ? '✓' : '✗'}</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">⚠️ Nyquist Criterion Check:</h4>
            <p className="text-sm">
              {Math.max(parameters.frequency1, parameters.frequency2) < calculations.nyquistFrequency 
                ? "✅ All signal frequencies are below the Nyquist frequency. No aliasing expected."
                : "❌ Signal frequencies exceed the Nyquist frequency! Aliasing will occur."}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Signal Analysis Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{parameters.frequency1}</div>
                <div className="text-xs text-gray-600">Freq 1 (Hz)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{parameters.frequency2}</div>
                <div className="text-xs text-gray-600">Freq 2 (Hz)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{calculations.nyquistFrequency}</div>
                <div className="text-xs text-gray-600">Nyquist (Hz)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{calculations.frequencyResolution.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Resolution (Hz)</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Experiment:</h4>
            <p className="text-sm">
              Try reducing the sample rate below twice the maximum frequency to see aliasing effects. 
              Also experiment with different signal durations to see how it affects frequency resolution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}