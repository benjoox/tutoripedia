import { useState, useMemo, useCallback } from 'react'

/**
 * Custom hook for VWAP (Volume-Weighted Average Price) tutorial
 * Provides state management, calculations, and chart data generation
 */
export const useVWAP = (initialParams = {}) => {
  const [parameters, setParameters] = useState({
    stockPrice: 100,        // Base stock price
    volumeMultiplier: 1.0,  // Volume scaling factor
    marketVolatility: 0.2,  // Price movement volatility
    timeIntervals: 50,      // Number of intraday periods
    marketCondition: 'trending', // 'trending', 'choppy', or 'mixed'
    volumePattern: 'u-shaped', // 'u-shaped', 'declining', 'random', or 'spike'
    ...initialParams
  })

  // Generate realistic intraday market data with comprehensive scenarios
  const generateMarketData = useCallback((basePrice, volatility, intervals, condition, volumeMult, volumePattern = 'u-shaped') => {
    const data = []
    const startTime = 9.5 // 9:30 AM in decimal hours
    const endTime = 16 // 4:00 PM
    const timeStep = (endTime - startTime) / intervals
    
    let currentPrice = basePrice
    let cumulativePV = 0
    let cumulativeVolume = 0
    
    // Enhanced market condition logic
    const marketConfig = getMarketConfig(condition, basePrice, volatility)
    let trendMomentum = 0
    let lastPriceChange = 0
    
    for (let i = 0; i < intervals; i++) {
      const timeDecimal = startTime + (i * timeStep)
      const hours = Math.floor(timeDecimal)
      const minutes = Math.floor((timeDecimal - hours) * 60)
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      // Calculate progress through trading day (0 to 1)
      const dayProgress = i / (intervals - 1)
      
      // Generate price movement based on market condition
      const priceChange = generatePriceMovement(
        condition, 
        currentPrice, 
        basePrice, 
        volatility, 
        dayProgress, 
        trendMomentum, 
        lastPriceChange,
        marketConfig
      )
      
      // Update momentum and price
      trendMomentum = updateTrendMomentum(trendMomentum, priceChange, condition)
      lastPriceChange = priceChange
      currentPrice = Math.max(currentPrice + priceChange, basePrice * 0.7) // Prevent extreme drops
      currentPrice = Math.min(currentPrice, basePrice * 1.3) // Prevent extreme rises
      
      // Generate realistic volume based on pattern and market activity
      const volume = generateRealisticVolume(
        volumePattern,
        dayProgress,
        Math.abs(priceChange),
        volatility,
        volumeMult,
        condition
      )
      
      // Calculate OHLC data with realistic spreads
      const ohlcData = generateOHLCData(currentPrice, priceChange, volatility)
      const typicalPrice = (ohlcData.high + ohlcData.low + ohlcData.close) / 3
      
      // Calculate price-volume product and cumulative values
      const pv = typicalPrice * volume
      cumulativePV += pv
      cumulativeVolume += volume
      
      // Calculate VWAP
      const vwap = cumulativeVolume > 0 ? cumulativePV / cumulativeVolume : typicalPrice
      
      // Calculate simple moving average for comparison (20-period)
      const smaWindow = Math.min(20, i + 1)
      const smaStart = Math.max(0, i - smaWindow + 1)
      const smaSum = data.slice(smaStart).reduce((sum, item) => sum + item.price, 0) + currentPrice
      const sma = smaSum / smaWindow
      
      // Calculate additional metrics for analysis
      const vwapDeviation = ((currentPrice - vwap) / vwap * 100)
      const volumeMA = i >= 9 ? 
        data.slice(i - 9).reduce((sum, item) => sum + item.volume, 0) / 10 : 
        volume
      
      data.push({
        time: timeString,
        price: parseFloat(currentPrice.toFixed(2)),
        volume: volume,
        high: parseFloat(ohlcData.high.toFixed(2)),
        low: parseFloat(ohlcData.low.toFixed(2)),
        open: parseFloat(ohlcData.open.toFixed(2)),
        close: parseFloat(ohlcData.close.toFixed(2)),
        typicalPrice: parseFloat(typicalPrice.toFixed(2)),
        pv: parseFloat(pv.toFixed(2)),
        cumulativePV: parseFloat(cumulativePV.toFixed(2)),
        cumulativeVol: cumulativeVolume,
        vwap: parseFloat(vwap.toFixed(2)),
        sma: parseFloat(sma.toFixed(2)),
        vwapDeviation: parseFloat(vwapDeviation.toFixed(2)),
        volumeMA: Math.floor(volumeMA),
        priceChange: parseFloat(priceChange.toFixed(2)),
        momentum: parseFloat(trendMomentum.toFixed(3))
      })
    }
    
    return data
  }, [])

  // Helper function to get market configuration
  const getMarketConfig = (condition, basePrice, volatility) => {
    const configs = {
      trending: {
        trendStrength: 0.4,
        trendPersistence: 0.8,
        noiseLevel: 0.3,
        meanReversionStrength: 0.1,
        momentumDecay: 0.95
      },
      choppy: {
        trendStrength: 0.1,
        trendPersistence: 0.3,
        noiseLevel: 0.8,
        meanReversionStrength: 0.4,
        momentumDecay: 0.85
      },
      mixed: {
        trendStrength: 0.25,
        trendPersistence: 0.6,
        noiseLevel: 0.5,
        meanReversionStrength: 0.25,
        momentumDecay: 0.9
      }
    }
    return configs[condition] || configs.mixed
  }

  // Enhanced price movement generation
  const generatePriceMovement = (condition, currentPrice, basePrice, volatility, dayProgress, momentum, lastChange, config) => {
    let priceChange = 0
    
    if (condition === 'trending') {
      // Trending market: consistent directional movement with momentum
      const trendDirection = momentum !== 0 ? Math.sign(momentum) : (Math.random() > 0.5 ? 1 : -1)
      const trendComponent = trendDirection * config.trendStrength * volatility * (Math.random() * 0.5 + 0.5)
      const momentumComponent = momentum * config.trendPersistence
      const noiseComponent = (Math.random() - 0.5) * volatility * config.noiseLevel
      
      priceChange = trendComponent + momentumComponent + noiseComponent
      
    } else if (condition === 'choppy') {
      // Choppy market: frequent reversals and mean reversion
      const meanReversion = (basePrice - currentPrice) * config.meanReversionStrength
      const reversalTendency = -lastChange * 0.3 // Tendency to reverse recent moves
      const randomComponent = (Math.random() - 0.5) * volatility * config.noiseLevel
      
      priceChange = meanReversion + reversalTendency + randomComponent
      
    } else { // mixed
      // Mixed conditions: alternating between trending and choppy behavior
      const trendPhase = Math.sin(dayProgress * Math.PI * 3) > 0 // Multiple trend phases during day
      
      if (trendPhase) {
        const trendComponent = Math.sign(momentum || (Math.random() - 0.5)) * config.trendStrength * volatility
        const momentumComponent = momentum * config.trendPersistence
        priceChange = trendComponent + momentumComponent
      } else {
        const meanReversion = (basePrice - currentPrice) * config.meanReversionStrength
        const randomComponent = (Math.random() - 0.5) * volatility * config.noiseLevel
        priceChange = meanReversion + randomComponent
      }
    }
    
    return priceChange
  }

  // Update trend momentum
  const updateTrendMomentum = (currentMomentum, priceChange, condition) => {
    const config = getMarketConfig(condition)
    const newMomentum = currentMomentum * config.momentumDecay + priceChange * 0.1
    return Math.max(-0.5, Math.min(0.5, newMomentum)) // Clamp momentum
  }

  // Generate realistic volume based on patterns
  const generateRealisticVolume = (pattern, dayProgress, priceMovement, volatility, volumeMult, condition) => {
    const baseVolume = 8000 + Math.random() * 4000
    let patternMultiplier = 1
    
    switch (pattern) {
      case 'u-shaped':
        // High volume at open and close, lower in middle
        patternMultiplier = Math.pow(Math.sin(dayProgress * Math.PI), 0.3) + 0.4
        break
      case 'declining':
        // Declining volume throughout the day
        patternMultiplier = 1.5 - (dayProgress * 0.8)
        break
      case 'random':
        // Random volume distribution
        patternMultiplier = 0.5 + Math.random()
        break
      case 'spike':
        // Mid-day volume spike
        const spikeCenter = 0.5
        const spikeWidth = 0.2
        const distanceFromSpike = Math.abs(dayProgress - spikeCenter)
        patternMultiplier = distanceFromSpike < spikeWidth ? 
          2.0 - (distanceFromSpike / spikeWidth) : 
          0.6 + Math.random() * 0.4
        break
      default:
        patternMultiplier = 1
    }
    
    // Volume increases with price movement (volatility attracts volume)
    const volatilityMultiplier = 1 + (Math.abs(priceMovement) / volatility) * 0.5
    
    // Market condition affects volume patterns
    const conditionMultiplier = condition === 'choppy' ? 0.8 : 1.0
    
    const finalVolume = Math.floor(
      baseVolume * patternMultiplier * volatilityMultiplier * volumeMult * conditionMultiplier
    )
    
    return Math.max(1000, finalVolume) // Minimum volume threshold
  }

  // Generate realistic OHLC data
  const generateOHLCData = (currentPrice, priceChange, volatility) => {
    const spread = currentPrice * volatility * 0.01 // Typical bid-ask spread
    const intrabarVolatility = spread * (1 + Math.random())
    
    const open = currentPrice - priceChange
    const close = currentPrice
    
    // Generate high and low with realistic relationships
    const high = Math.max(open, close) + intrabarVolatility * Math.random()
    const low = Math.min(open, close) - intrabarVolatility * Math.random()
    
    return {
      open: Math.max(low, open),
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      close: close
    }
  }

  // Generate comprehensive step-by-step calculation data for the calculation phase
  const generateCalculationData = useCallback((basePrice = 100, scenario = 'realistic') => {
    let examples = []
    
    if (scenario === 'simple') {
      // Simple example for basic understanding
      examples = [
        { time: '09:30', price: 100.00, volume: 10000, description: 'Market opens at round price' },
        { time: '09:35', price: 100.50, volume: 15000, description: 'Price rises with increased volume' },
        { time: '09:40', price: 100.25, volume: 12000, description: 'Price pulls back slightly' },
        { time: '09:45', price: 100.75, volume: 8000, description: 'Price rises on lower volume' },
        { time: '09:50', price: 100.60, volume: 18000, description: 'Price consolidates with high volume' }
      ]
    } else if (scenario === 'trending') {
      // Trending market example
      examples = [
        { time: '09:30', price: basePrice, volume: 12000, description: 'Opening price establishes base' },
        { time: '09:35', price: basePrice + 0.25, volume: 15000, description: 'Initial upward movement' },
        { time: '09:40', price: basePrice + 0.45, volume: 18000, description: 'Trend continues with volume' },
        { time: '09:45', price: basePrice + 0.35, volume: 10000, description: 'Minor pullback on lower volume' },
        { time: '09:50', price: basePrice + 0.65, volume: 22000, description: 'Strong move higher' },
        { time: '09:55', price: basePrice + 0.80, volume: 16000, description: 'Trend acceleration' },
        { time: '10:00', price: basePrice + 0.70, volume: 14000, description: 'Slight consolidation' }
      ]
    } else { // realistic
      // Realistic market example with mixed movements
      const priceVariations = [0, 0.15, -0.05, 0.35, 0.20, -0.10, 0.25, 0.40, 0.15, 0.30]
      const volumeBase = 12000
      const volumeVariations = [1.0, 1.3, 0.8, 1.5, 1.1, 0.9, 1.4, 1.2, 0.7, 1.6]
      
      examples = priceVariations.map((priceVar, i) => {
        const time = `${Math.floor(9.5 + (i * 0.083))}:${String(Math.floor(((9.5 + (i * 0.083)) % 1) * 60)).padStart(2, '0')}`
        const price = basePrice + priceVar
        const volume = Math.floor(volumeBase * volumeVariations[i])
        
        let description = ''
        if (i === 0) description = 'Market opening price'
        else if (priceVar > priceVariations[i-1]) description = 'Price increase'
        else if (priceVar < priceVariations[i-1]) description = 'Price decrease'
        else description = 'Price unchanged'
        
        if (volumeVariations[i] > 1.2) description += ' with high volume'
        else if (volumeVariations[i] < 0.9) description += ' on low volume'
        
        return { time, price, volume, description }
      })
    }
    
    // Calculate step-by-step VWAP with detailed breakdown
    let cumulativePV = 0
    let cumulativeVol = 0
    
    return examples.map((item, index) => {
      // Calculate typical price (using close price for simplicity in examples)
      const typicalPrice = item.price
      const pv = typicalPrice * item.volume
      cumulativePV += pv
      cumulativeVol += item.volume
      const vwap = cumulativePV / cumulativeVol
      
      // Calculate simple moving average for comparison
      const smaWindow = Math.min(index + 1, 5)
      const smaSum = examples.slice(Math.max(0, index - smaWindow + 1), index + 1)
        .reduce((sum, ex) => sum + ex.price, 0)
      const sma = smaSum / smaWindow
      
      // Calculate percentage difference from VWAP
      const vwapDiff = ((typicalPrice - vwap) / vwap * 100)
      
      // Determine if this is a good entry/exit point based on VWAP
      let signal = 'neutral'
      if (Math.abs(vwapDiff) < 0.1) signal = 'at VWAP'
      else if (vwapDiff > 0.2) signal = 'above VWAP'
      else if (vwapDiff < -0.2) signal = 'below VWAP'
      
      return {
        step: index + 1,
        time: item.time,
        price: parseFloat(typicalPrice.toFixed(2)),
        volume: item.volume,
        pv: parseFloat(pv.toFixed(2)),
        cumulativePV: parseFloat(cumulativePV.toFixed(2)),
        cumulativeVol: cumulativeVol,
        vwap: parseFloat(vwap.toFixed(4)),
        sma: parseFloat(sma.toFixed(2)),
        vwapDiff: parseFloat(vwapDiff.toFixed(2)),
        signal: signal,
        description: item.description,
        // Additional educational fields
        pvContribution: parseFloat((pv / cumulativePV * 100).toFixed(1)),
        volumeContribution: parseFloat((item.volume / cumulativeVol * 100).toFixed(1)),
        priceImpact: index > 0 ? parseFloat((vwap - examples[index-1]?.vwap || vwap).toFixed(4)) : 0
      }
    })
  }, [])

  // Generate ideal trending market data with realistic characteristics
  const generateIdealData = useCallback((basePrice, trendDirection = 'up') => {
    const data = []
    const intervals = 40
    let price = basePrice
    let cumulativePV = 0
    let cumulativeVol = 0
    
    // Trend parameters
    const direction = trendDirection === 'up' ? 1 : -1
    const trendStrength = 0.02 // 2% total move over the period
    const dailyMove = (basePrice * trendStrength * direction) / intervals
    
    for (let i = 0; i < intervals; i++) {
      const timeDecimal = 9.5 + (i * 6.5 / intervals)
      const hours = Math.floor(timeDecimal)
      const minutes = Math.floor((timeDecimal - hours) * 60)
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      // Ideal trending: consistent directional movement with minimal noise
      const trendComponent = dailyMove * (0.8 + Math.random() * 0.4) // 80-120% of expected move
      const noiseComponent = (Math.random() - 0.5) * basePrice * 0.001 // Minimal noise (0.1%)
      
      price += trendComponent + noiseComponent
      
      // Volume pattern: higher volume on trend continuation, lower on pullbacks
      const priceChange = trendComponent + noiseComponent
      const volumeFromTrend = Math.abs(priceChange) > Math.abs(dailyMove) * 0.5 ? 1.3 : 0.9
      const timeOfDayVolume = 0.8 + 0.4 * Math.sin(Math.PI * i / intervals) // U-shaped
      const baseVolume = 12000 + Math.random() * 3000
      const volume = Math.floor(baseVolume * volumeFromTrend * timeOfDayVolume)
      
      const pv = price * volume
      cumulativePV += pv
      cumulativeVol += volume
      const vwap = cumulativePV / cumulativeVol
      
      // Calculate how price relates to VWAP in trending market
      const vwapRelation = ((price - vwap) / vwap * 100)
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        vwap: parseFloat(vwap.toFixed(2)),
        vwapRelation: parseFloat(vwapRelation.toFixed(2)),
        trendStrength: parseFloat((Math.abs(price - basePrice) / basePrice * 100).toFixed(2)),
        priceChange: parseFloat(priceChange.toFixed(3))
      })
    }
    
    return data
  }, [])

  // Generate choppy market data with realistic mean-reverting behavior
  const generateChoppyData = useCallback((basePrice) => {
    const data = []
    const intervals = 40
    let price = basePrice
    let cumulativePV = 0
    let cumulativeVol = 0
    let lastDirection = 1
    let consecutiveMoves = 0
    
    for (let i = 0; i < intervals; i++) {
      const timeDecimal = 9.5 + (i * 6.5 / intervals)
      const hours = Math.floor(timeDecimal)
      const minutes = Math.floor((timeDecimal - hours) * 60)
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      // Choppy market: frequent reversals and mean reversion
      let direction = lastDirection
      
      // Increase probability of reversal after consecutive moves in same direction
      const reversalProbability = Math.min(0.7, 0.3 + (consecutiveMoves * 0.1))
      if (Math.random() < reversalProbability) {
        direction = -lastDirection
        consecutiveMoves = 0
      } else {
        consecutiveMoves++
      }
      
      // Mean reversion component - stronger when further from base price
      const distanceFromBase = price - basePrice
      const meanReversionForce = -distanceFromBase * 0.15
      
      // Random component with higher volatility than trending market
      const randomComponent = (Math.random() - 0.5) * basePrice * 0.008 // 0.8% random moves
      
      // Directional component (smaller than trending market)
      const directionalComponent = direction * basePrice * 0.002 // 0.2% directional bias
      
      const priceChange = meanReversionForce + randomComponent + directionalComponent
      price += priceChange
      
      // Ensure price doesn't drift too far from base
      if (Math.abs(price - basePrice) > basePrice * 0.03) {
        price = basePrice + (price - basePrice) * 0.7 // Pull back toward base
      }
      
      // Volume in choppy markets: higher during reversals, lower during continuation
      const isReversal = Math.sign(priceChange) !== Math.sign(lastDirection)
      const reversalVolumeMultiplier = isReversal ? 1.4 : 0.8
      const volatilityVolumeMultiplier = 1 + Math.abs(priceChange) / (basePrice * 0.01)
      const baseVolume = 9000 + Math.random() * 4000
      const volume = Math.floor(baseVolume * reversalVolumeMultiplier * volatilityVolumeMultiplier)
      
      const pv = price * volume
      cumulativePV += pv
      cumulativeVol += volume
      const vwap = cumulativePV / cumulativeVol
      
      // Track choppiness metrics
      const vwapRelation = ((price - vwap) / vwap * 100)
      const choppiness = Math.abs(priceChange) / (basePrice * 0.01) // Relative to 1% moves
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        vwap: parseFloat(vwap.toFixed(2)),
        vwapRelation: parseFloat(vwapRelation.toFixed(2)),
        choppiness: parseFloat(choppiness.toFixed(2)),
        isReversal: isReversal,
        priceChange: parseFloat(priceChange.toFixed(3)),
        distanceFromBase: parseFloat(((price - basePrice) / basePrice * 100).toFixed(2))
      })
      
      lastDirection = Math.sign(priceChange) || lastDirection
    }
    
    return data
  }, [])

  // Helper function to calculate trend consistency
  const calculateTrendConsistency = useCallback((data) => {
    if (data.length < 2) return 0
    
    const priceChanges = data.slice(1).map((item, i) => item.price - data[i].price)
    const positiveChanges = priceChanges.filter(change => change > 0).length
    const negativeChanges = priceChanges.filter(change => change < 0).length
    
    return Math.abs(positiveChanges - negativeChanges) / priceChanges.length
  }, [])

  // Generate trading signal based on VWAP analysis
  const generateTradingSignal = useCallback((currentData, historicalData) => {
    const vwapDeviation = (currentData.price - currentData.vwap) / currentData.vwap * 100
    const recentTrend = historicalData.slice(-5)
    const trendDirection = recentTrend[recentTrend.length - 1].price - recentTrend[0].price
    
    if (Math.abs(vwapDeviation) < 0.1) return 'neutral'
    if (vwapDeviation > 0.5 && trendDirection < 0) return 'sell'
    if (vwapDeviation < -0.5 && trendDirection > 0) return 'buy'
    if (vwapDeviation > 0.2) return 'above_vwap'
    if (vwapDeviation < -0.2) return 'below_vwap'
    return 'neutral'
  }, [])

  // Calculate signal strength (0-100)
  const calculateSignalStrength = useCallback((currentData, historicalData) => {
    const vwapDeviation = Math.abs((currentData.price - currentData.vwap) / currentData.vwap * 100)
    const volumeStrength = currentData.volume / (historicalData.reduce((sum, item) => sum + item.volume, 0) / historicalData.length)
    
    const baseStrength = Math.min(vwapDeviation * 20, 50) // Max 50 from deviation
    const volumeBonus = Math.min((volumeStrength - 1) * 25, 30) // Max 30 from volume
    const momentumBonus = currentData.momentum ? Math.abs(currentData.momentum) * 20 : 0 // Max 20 from momentum
    
    return Math.min(100, Math.floor(baseStrength + volumeBonus + momentumBonus))
  }, [])

  // Assess overall market condition
  const assessMarketCondition = useCallback((data) => {
    const priceRange = Math.max(...data.map(d => d.price)) - Math.min(...data.map(d => d.price))
    const averagePrice = data.reduce((sum, d) => sum + d.price, 0) / data.length
    const rangePercent = (priceRange / averagePrice) * 100
    
    if (rangePercent < 1) return 'low_volatility'
    if (rangePercent > 3) return 'high_volatility'
    return 'normal_volatility'
  }, [])

  // Calculate VWAP effectiveness as a trading tool
  const calculateVwapEffectiveness = useCallback((data) => {
    if (data.length < 10) return 0
    
    // Count how often price reverts to VWAP after deviating
    let reversions = 0
    let deviations = 0
    
    for (let i = 1; i < data.length - 1; i++) {
      const prevDeviation = (data[i-1].price - data[i-1].vwap) / data[i-1].vwap
      const currentDeviation = (data[i].price - data[i].vwap) / data[i].vwap
      const nextDeviation = (data[i+1].price - data[i+1].vwap) / data[i+1].vwap
      
      if (Math.abs(currentDeviation) > 0.002) { // 0.2% deviation threshold
        deviations++
        if (Math.sign(currentDeviation) !== Math.sign(nextDeviation)) {
          reversions++
        }
      }
    }
    
    return deviations > 0 ? (reversions / deviations) * 100 : 0
  }, [])

  // Memoized calculations with comprehensive metrics
  const calculations = useMemo(() => {
    const intradayData = generateMarketData(
      parameters.stockPrice,
      parameters.marketVolatility,
      parameters.timeIntervals,
      parameters.marketCondition,
      parameters.volumeMultiplier,
      parameters.volumePattern || 'u-shaped'
    )
    
    if (intradayData.length === 0) return {}
    
    const lastDataPoint = intradayData[intradayData.length - 1]
    const firstDataPoint = intradayData[0]
    
    // Calculate additional metrics for comprehensive analysis
    const totalReturn = ((lastDataPoint.price - firstDataPoint.price) / firstDataPoint.price * 100)
    const vwapReturn = ((lastDataPoint.vwap - firstDataPoint.vwap) / firstDataPoint.vwap * 100)
    const averageVolume = intradayData.reduce((sum, item) => sum + item.volume, 0) / intradayData.length
    
    // Calculate volatility metrics
    const priceChanges = intradayData.slice(1).map((item, i) => 
      (item.price - intradayData[i].price) / intradayData[i].price
    )
    const volatility = Math.sqrt(
      priceChanges.reduce((sum, change) => sum + Math.pow(change, 2), 0) / priceChanges.length
    ) * Math.sqrt(252) // Annualized volatility
    
    // Calculate VWAP efficiency (how well VWAP tracks price)
    const vwapDeviations = intradayData.map(item => Math.abs(item.price - item.vwap) / item.vwap)
    const averageVwapDeviation = vwapDeviations.reduce((sum, dev) => sum + dev, 0) / vwapDeviations.length
    
    // Market condition analysis
    const trendConsistency = calculateTrendConsistency(intradayData)
    const volumeWeightedPrice = lastDataPoint.cumulativePV / lastDataPoint.cumulativeVol
    
    return {
      // Basic metrics
      currentVWAP: lastDataPoint.vwap,
      currentSMA: lastDataPoint.sma,
      totalVolume: lastDataPoint.cumulativeVol,
      totalPV: lastDataPoint.cumulativePV,
      currentPrice: lastDataPoint.price,
      priceVsVWAP: parseFloat(((lastDataPoint.price - lastDataPoint.vwap) / lastDataPoint.vwap * 100).toFixed(2)),
      
      // Advanced metrics
      totalReturn: parseFloat(totalReturn.toFixed(2)),
      vwapReturn: parseFloat(vwapReturn.toFixed(2)),
      averageVolume: Math.floor(averageVolume),
      annualizedVolatility: parseFloat((volatility * 100).toFixed(2)),
      averageVwapDeviation: parseFloat((averageVwapDeviation * 100).toFixed(2)),
      trendConsistency: parseFloat(trendConsistency.toFixed(2)),
      volumeWeightedPrice: parseFloat(volumeWeightedPrice.toFixed(2)),
      
      // Trading signals
      signal: generateTradingSignal(lastDataPoint, intradayData),
      signalStrength: calculateSignalStrength(lastDataPoint, intradayData),
      
      // Market condition assessment
      marketConditionScore: assessMarketCondition(intradayData),
      vwapEffectiveness: calculateVwapEffectiveness(intradayData)
    }
  }, [parameters, generateMarketData, calculateTrendConsistency, generateTradingSignal, calculateSignalStrength, assessMarketCondition, calculateVwapEffectiveness])

  // Generate mixed scenario data combining trending and choppy periods
  const generateMixedScenarioData = useCallback((basePrice, volatility) => {
    const data = []
    const intervals = 50
    let price = basePrice
    let cumulativePV = 0
    let cumulativeVol = 0
    let currentPhase = 'trending'
    let phaseLength = 0
    const maxPhaseLength = 12
    
    for (let i = 0; i < intervals; i++) {
      const timeDecimal = 9.5 + (i * 6.5 / intervals)
      const hours = Math.floor(timeDecimal)
      const minutes = Math.floor((timeDecimal - hours) * 60)
      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      // Switch phases periodically
      if (phaseLength >= maxPhaseLength || (phaseLength > 5 && Math.random() < 0.2)) {
        currentPhase = currentPhase === 'trending' ? 'choppy' : 'trending'
        phaseLength = 0
      }
      phaseLength++
      
      let priceChange = 0
      if (currentPhase === 'trending') {
        // Trending phase
        const trendDirection = i < intervals / 2 ? 1 : -1 // Up first half, down second half
        priceChange = trendDirection * volatility * (0.3 + Math.random() * 0.4)
      } else {
        // Choppy phase
        const meanReversion = (basePrice - price) * 0.1
        const randomMove = (Math.random() - 0.5) * volatility * 1.2
        priceChange = meanReversion + randomMove
      }
      
      price += priceChange
      
      // Volume varies by phase
      const baseVolume = currentPhase === 'trending' ? 14000 : 10000
      const phaseMultiplier = currentPhase === 'trending' ? 1.2 : 0.9
      const volume = Math.floor((baseVolume + Math.random() * 5000) * phaseMultiplier)
      
      const pv = price * volume
      cumulativePV += pv
      cumulativeVol += volume
      const vwap = cumulativePV / cumulativeVol
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        vwap: parseFloat(vwap.toFixed(2)),
        phase: currentPhase,
        vwapRelation: parseFloat(((price - vwap) / vwap * 100).toFixed(2))
      })
    }
    
    return data
  }, [])

  // Chart data for all phases with comprehensive scenarios
  const chartData = useMemo(() => {
    const intradayData = generateMarketData(
      parameters.stockPrice,
      parameters.marketVolatility,
      parameters.timeIntervals,
      parameters.marketCondition,
      parameters.volumeMultiplier,
      parameters.volumePattern || 'u-shaped'
    )
    
    // Generate multiple calculation examples for different scenarios
    const calculationData = {
      simple: generateCalculationData(parameters.stockPrice, 'simple'),
      realistic: generateCalculationData(parameters.stockPrice, 'realistic'),
      trending: generateCalculationData(parameters.stockPrice, 'trending')
    }
    
    // Generate comparison data for trending vs choppy markets
    const trendingUpData = generateIdealData(parameters.stockPrice, 'up')
    const trendingDownData = generateIdealData(parameters.stockPrice, 'down')
    const choppyData = generateChoppyData(parameters.stockPrice)
    
    // Generate mixed scenario data for advanced analysis
    const mixedData = generateMixedScenarioData(parameters.stockPrice, parameters.marketVolatility)
    
    return {
      intradayData,
      // Maintain backward compatibility - use realistic scenario as default
      calculationData: calculationData.realistic,
      // Provide access to all scenarios
      calculationScenarios: calculationData,
      trendingUpData,
      trendingDownData,
      choppyData,
      mixedData,
      // Legacy support for existing phases
      idealData: trendingUpData
    }
  }, [parameters, generateMarketData, generateCalculationData, generateIdealData, generateChoppyData, generateMixedScenarioData])

  // Parameter update function with useCallback optimization
  const updateParameter = useCallback((key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Batch parameter updates
  const updateParameters = useCallback((updates) => {
    setParameters(prev => ({ ...prev, ...updates }))
  }, [])

  // Reset to default parameters
  const resetParameters = useCallback(() => {
    setParameters({
      stockPrice: 100,
      volumeMultiplier: 1.0,
      marketVolatility: 0.2,
      timeIntervals: 50,
      marketCondition: 'trending',
      volumePattern: 'u-shaped'
    })
  }, [])

  // Validation
  const isValid = useMemo(() => {
    return (
      parameters.stockPrice > 0 &&
      parameters.volumeMultiplier > 0 &&
      parameters.marketVolatility > 0 &&
      parameters.timeIntervals > 0 &&
      ['trending', 'choppy', 'mixed'].includes(parameters.marketCondition) &&
      ['u-shaped', 'declining', 'random', 'spike'].includes(parameters.volumePattern)
    )
  }, [parameters])

  return {
    parameters,
    calculations,
    chartData,
    updateParameter,
    updateParameters,
    resetParameters,
    isValid
  }
}