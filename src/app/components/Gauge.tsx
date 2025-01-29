import type React from "react"

interface PercentageGaugeProps {
  percentage: number
  label?: string
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  foregroundColor?: string
}

const PercentageGauge: React.FC<PercentageGaugeProps> = ({
  percentage,
  label,
  size = 100,
  strokeWidth = 20,
  backgroundColor = "#e6e6e6",
  foregroundColor = "#3b82f6",
}) => {
  // Ensure the percentage is between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  // Calculate the circumference of the circle
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Calculate the arc length based on the percentage
  const arcLength = (circumference * clampedPercentage) / 100

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />
        {/* Foreground arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={foregroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dasharray 0.5s ease-in-out",
          }}
        />
        {/* Percentage text */}
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold">
          {clampedPercentage}%
        </text>
      </svg>
      {label && <span className="mt-2 text-md font-semibold text-black">{label}</span>}
    </div>
  )
}

export default PercentageGauge

