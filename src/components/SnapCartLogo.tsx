'use client'
import React from 'react'
import { ShoppingBag, Zap } from 'lucide-react'

interface SnapCartLogoProps {
  variant?: 'light' | 'dark' // 'light' for green/dark backgrounds, 'dark' for white/light backgrounds
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBadge?: boolean
  className?: string
}

export default function SnapCartLogo({
  variant = 'light',
  size = 'md',
  showBadge = false,
  className = '',
}: SnapCartLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }

  const bagSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }

  const zapSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl sm:text-[1.7rem]',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }

  const isLight = variant === 'light'

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`relative flex items-center justify-center rounded-xl md:rounded-2xl transition-transform duration-200 shadow-md ${
          isLight
            ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-emerald-950 shadow-black/15'
            : 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-emerald-700/25'
        } ${iconDimensions[size]}`}
      >
        <ShoppingBag
          className={`${bagSizes[size]} text-current`}
          strokeWidth={2.4}
        />
        {/* Fast Delivery Zap indicator */}
        <span
          className={`absolute -bottom-1 -right-1 rounded-full p-0.5 shadow-sm flex items-center justify-center ${
            isLight
              ? 'bg-emerald-900 text-amber-300 ring-2 ring-emerald-700'
              : 'bg-amber-400 text-emerald-950 ring-2 ring-white'
          }`}
        >
          <Zap
            className={zapSizes[size]}
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className={`font-black tracking-tight flex items-center ${textSizes[size]}`}>
          <span className={isLight ? 'text-white' : 'text-gray-900'}>
            Snap
          </span>
          <span
            className={
              isLight
                ? 'text-amber-300 font-black ml-0.5'
                : 'text-emerald-600 font-black ml-0.5'
            }
          >
            Cart
          </span>
        </div>
        {showBadge && (
          <span
            className={`text-[9px] font-bold tracking-wider uppercase -mt-0.5 ${
              isLight ? 'text-emerald-100/90' : 'text-emerald-700 font-semibold'
            }`}
          >
            ⚡ 10 Min Delivery
          </span>
        )}
      </div>
    </div>
  )
}
