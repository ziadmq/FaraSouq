import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { BannerSlide } from '../../types'

interface BannerSliderProps {
  slides: BannerSlide[]
  onButtonClick: (slide: BannerSlide) => void
}

export default function BannerSlider({ slides, onButtonClick }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isPaused, setIsPaused] = useState(false)

  const goNext = useCallback(() => {
    setDirection('forward')
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goPrev = useCallback(() => {
    setDirection('backward')
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 'forward' : 'backward')
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (isPaused || slides.length <= 1) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [isPaused, goNext, slides.length])

  if (!slides || slides.length === 0) {
    return (
      <div className="relative h-[380px] md:h-[450px] rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <Flame className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-slate-400 text-lg font-medium">لا توجد عروض متاحة حالياً</p>
          <p className="text-slate-600 text-sm mt-1">تابعنا للحصول على أحدث العروض</p>
        </div>
      </div>
    )
  }

  const slide = slides[currentIndex]

  const variants = {
    enter: (dir: string) => ({
      x: dir === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: string) => ({
      x: dir === 'forward' ? -100 : 100,
      opacity: 0,
    }),
  }

  return (
    <div
      className="relative h-[380px] md:h-[450px] rounded-3xl overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined,
              backgroundSize: slide.imageFit === "contain" ? "contain" : "cover",
              backgroundPosition: slide.imagePosition || "center"
            }}
          />

          {/* Overlay gradient - dark left-to-right (RTL: right is start) */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Ambient glow */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />

          {/* Content - RTL layout */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-14 text-right" dir="rtl">
            <div className="max-w-lg">

              {/* Badge */}
              {slide.badgeText && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 shadow-lg shadow-amber-500/10"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{slide.badgeText}</span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              >
                {slide.title}
              </motion.h2>

              {/* Subtitle */}
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                  className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* CTA Button */}
              {slide.buttonText && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onButtonClick(slide)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base px-7 py-3 rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-200 cursor-pointer border border-amber-400/30"
                >
                  {slide.buttonText}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow Buttons */}
      {slides.length > 1 && (
        <>
          {/* Left arrow (next in RTL) */}
          <button
            onClick={goNext}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-amber-500/80 border border-white/10 hover:border-amber-400/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow (prev in RTL) */}
          <button
            onClick={goPrev}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-amber-500/80 border border-white/10 hover:border-amber-400/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === currentIndex
                  ? 'w-6 h-2.5 bg-amber-400 shadow-md shadow-amber-500/50'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 z-10 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg pointer-events-none" />
      <div className="absolute bottom-4 right-4 z-10 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg pointer-events-none" />
    </div>
  )
}
