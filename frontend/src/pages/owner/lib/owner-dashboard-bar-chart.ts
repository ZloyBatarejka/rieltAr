export const OWNER_DASHBOARD_BAR_CHART_HEIGHT = 280

export const OWNER_DASHBOARD_BAR_CHART_MARGIN = {
  top: 8,
  right: 8,
  left: 8,
  bottom: 8,
} as const

export const OWNER_DASHBOARD_BAR_CHART_GRID = {
  strokeDasharray: '3 3',
  stroke: 'var(--color-bg-border)',
} as const

export const OWNER_DASHBOARD_BAR_CHART_AXIS_TICK = {
  fill: 'var(--color-typo-secondary)',
  fontSize: 12,
} as const

export const OWNER_DASHBOARD_BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

export const OWNER_DASHBOARD_BAR_MAX_SIZE = 72

const Y_AXIS_COMPACT_THRESHOLD = 1000

export function formatOwnerDashboardBarChartYAxisTick(value: number): string {
  if (value >= Y_AXIS_COMPACT_THRESHOLD) {
    return `${Math.round(value / Y_AXIS_COMPACT_THRESHOLD)}k`
  }
  return String(value)
}
