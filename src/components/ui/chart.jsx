import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
  light: "",
  dark: ".dark"
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // Base layout with Japanese aesthetics
          "flex aspect-video justify-center " +
          // Typography with Japanese principles
          "text-xs tracking-wide " +
          // Recharts styling with Japanese-inspired colors and subtle aesthetics
          // Axis and grid styling with muted, natural colors
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground/80 " +
          "[&_.recharts-cartesian-grid_line]:stroke-border/30 " +
          "[&_.recharts-polar-grid_line]:stroke-border/30 " +
          // Cursor and interaction styling
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border/60 " +
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/20 " +
          // Reference line styling
          "[&_.recharts-reference-line_line]:stroke-border/40 " +
          // Background and sector styling
          "[&_.recharts-radial-bar-background-sector]:fill-muted/30 " +
          // Dot and stroke styling for clean appearance
          "[&_.recharts-dot]:stroke-transparent " +
          "[&_.recharts-sector]:stroke-transparent " +
          // Focus and outline management
          "[&_.recharts-layer]:outline-hidden " +
          "[&_.recharts-sector]:outline-hidden " +
          "[&_.recharts-surface]:outline-hidden " +
          // Gentle transitions for Seijaku (tranquility)
          "[&_.recharts-layer]:transition-all [&_.recharts-layer]:duration-250 [&_.recharts-layer]:ease-gentle " +
          // Subtle shadow for depth
          "shadow-xs " +
          // Wabi-sabi inspired subtle asymmetry
          "rounded-wabi-card " +
          // Padding for Ma (negative space)
          "p-2",
          className
        )}
        {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({
  id,
  config
}) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
.map(([key, itemConfig]) => {
const color =
  itemConfig.theme?.[theme] ||
  itemConfig.color
return color ? `  --color-${key}: ${color};` : null
})
.join("\n")}
}
`)
          .join("\n"),
      }} />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn(
          // Typography with Japanese aesthetics
          "font-medium text-sm tracking-wide text-foreground",
          labelClassName
        )}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null
    }

    return (
      <div className={cn(
        // Typography with Japanese aesthetics
        "font-medium text-sm tracking-wide text-foreground",
        labelClassName
      )}>
        {value}
      </div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        // Base styling with Japanese aesthetics
        "bg-background/95 backdrop-blur-sm " +
        // Border and shadow with Wabi-sabi inspiration
        "border border-border/40 rounded-wabi-gentle " +
        "shadow-wabi-gentle " +
        // Layout and spacing with Ma (negative space) principles
        "grid min-w-[9rem] items-start gap-2 px-3 py-2.5 " +
        // Typography
        "text-xs tracking-wide " +
        // Gentle transitions for Seijaku (tranquility)
        "transition-all duration-200 ease-gentle " +
        // Subtle backdrop effect
        "ring-1 ring-border/20",
        className
      )}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-2">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            <div
              key={item.dataKey}
              className={cn(
                // Layout with generous spacing
                "flex w-full flex-wrap items-stretch gap-2.5 " +
                // Icon styling
                "[&>svg]:text-muted-foreground/70 [&>svg]:h-3 [&>svg]:w-3",
                indicator === "dot" && "items-center"
              )}>
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          // Base indicator styling with Wabi-sabi asymmetry
                          "shrink-0 rounded-wabi-subtle border-(--color-border) bg-(--color-bg) " +
                          // Gentle transitions
                          "transition-all duration-200 ease-gentle",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1 h-4": indicator === "line",
                            "w-0 border-2 border-dashed bg-transparent h-4":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor
                          }
                        } />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-relaxed",
                      nestLabel ? "items-end" : "items-center"
                    )}>
                    <div className="grid gap-1">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground/80 text-xs tracking-wide">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums text-sm">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        // Base layout with Japanese aesthetics
        "flex items-center justify-center gap-6 " +
        // Typography with proper spacing
        "text-sm tracking-wide " +
        // Spacing with Ma (negative space) principles
        verticalAlign === "top" ? "pb-4" : "pt-4",
        className
      )}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn(
              // Layout with generous spacing
              "flex items-center gap-2 " +
              // Icon styling
              "[&>svg]:text-muted-foreground/70 [&>svg]:h-3.5 [&>svg]:w-3.5 " +
              // Gentle transitions
              "transition-all duration-200 ease-gentle " +
              // Interactive states
              "hover:text-foreground cursor-default " +
              // Selection state
              "select-none"
            )}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className={cn(
                  // Base indicator with Wabi-sabi asymmetry
                  "h-2.5 w-2.5 shrink-0 rounded-wabi-subtle " +
                  // Gentle transitions
                  "transition-all duration-200 ease-gentle " +
                  // Subtle shadow
                  "shadow-xs"
                )}
                style={{
                  backgroundColor: item.color,
                }} />
            )}
            <span className="text-muted-foreground/80 hover:text-foreground transition-colors duration-200 ease-gentle">
              {itemConfig?.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
