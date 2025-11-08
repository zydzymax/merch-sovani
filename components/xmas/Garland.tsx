'use client'

export function Garland() {
  return (
    <div className="absolute top-0 left-0 w-full h-20 overflow-hidden z-20">
      <svg className="w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
        {/* Garland string */}
        <path
          d="M0,40 Q100,20 200,40 T400,40 T600,40 T800,40 T1000,40 T1200,40"
          stroke="#1F3D2B"
          strokeWidth="3"
          fill="none"
        />

        {/* Light bulbs */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = i * 100 + 100
          const y = i % 2 === 0 ? 35 : 45
          const colors = ['#B4002D', '#E8C16A', '#1F3D2B', '#FAF3E7']
          const color = colors[i % colors.length]
          const delay = i * 0.2

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={color}
                opacity="0.9"
                className="animate-twinkle"
                style={{ animationDelay: `${delay}s` }}
              />
              <circle
                cx={x - 2}
                cy={y - 2}
                r="3"
                fill="white"
                opacity="0.6"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
