import React from 'react'

interface LogoProps {
  size?: number | string
  variant?: 'full' | 'icon'
  darkMode?: boolean
  className?: string
}

/**
 * LogoUntunginLOH - Komponen Logo Resmi UntunginLOH (Minimalis & Elegan)
 */
export function LogoUntunginLOH({
  size = 40,
  variant = 'full',
  darkMode = false,
  className = '',
}: LogoProps) {
  // 1. Iconmark Saja (Untuk Favicon, Header Kasir, Avatar Mobile)
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Icon UntunginLOH"
      >
        <defs>
          <linearGradient id="uilBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="50%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#0F5132" />
          </linearGradient>
          <linearGradient id="uilGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#uilBg)" />
        <rect x="34" y="34" width="444" height="444" rx="110" fill="none" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="4" />
        <circle cx="256" cy="256" r="170" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="2" strokeDasharray="8 8" />

        {/* U Growth Arc & Arrow */}
        <path
          d="M 148 160 L 148 268 C 148 334 196 384 256 384 C 316 384 364 334 364 268 L 364 220"
          stroke="#FFFFFF"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 312 210 L 364 158 L 416 210"
          stroke="#FFFFFF"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Golden Margin Coin */}
        <circle cx="256" cy="240" r="54" fill="url(#uilGold)" />
        <circle cx="256" cy="240" r="44" stroke="#FEF3C7" strokeWidth="4" strokeOpacity="0.8" />
        <path
          d="M 244 222 L 244 258 M 244 222 L 258 222 C 267 222 272 227 272 233 C 272 240 267 244 258 244 L 244 244 M 256 244 L 268 258"
          stroke="#78350F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // 2. Full Brand Lockup (Logomark + Untungin + LOH!) Tanpa Subtitle Panjang
  const numSize = typeof size === 'number' ? size : 40
  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      <LogoUntunginLOH size={numSize} variant="icon" />
      <div className="flex items-center gap-1.5 leading-none">
        <span
          className={`font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          style={{ fontSize: `${numSize * 0.58}px` }}
        >
          Untungin
        </span>
        <span
          className="bg-emerald-700 text-white font-black px-2 py-0.5 rounded-lg tracking-wide shadow-sm"
          style={{ fontSize: `${numSize * 0.42}px` }}
        >
          LOH!
        </span>
      </div>
    </div>
  )
}

export default LogoUntunginLOH
