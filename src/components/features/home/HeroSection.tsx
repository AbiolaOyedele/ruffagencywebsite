import Image from 'next/image'
import { LottieScrollPrompt } from '@/components/features/shared/LottieScrollPrompt'
import { WaveDivider } from '@/components/ui/WaveDivider'

interface HeroSectionProps {
  imageUrl: string
}

/**
 * Full-viewport hero image with scroll prompt and wave bottom edge.
 */
export function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Background image — fixed so it scrolls past */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt="The Ruff Agency studio"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Scroll prompt Lottie */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[15] w-20 h-20">
        <LottieScrollPrompt />
      </div>

      {/* Wave bottom edge */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
        <WaveDivider fillClass="fill-base-bg" />
      </div>
    </div>
  )
}
