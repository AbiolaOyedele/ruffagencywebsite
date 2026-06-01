import Image from 'next/image'
import Link from 'next/link'
import { LottieBurger } from '@/components/features/shared/LottieBurger'

/**
 * Fixed top navigation bar.
 * Logo is a Server Component; burger button is a Client Component.
 */
export function Nav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none text-accent-fg">
      {/* Logo */}
      <div className="absolute ~left-2/[5.625rem] ~top-4/[2.125rem] pointer-events-auto">
        <Link href="/" aria-label="The Ruff Agency — home">
          <Image
            src="/images/ruff-logo.svg"
            alt="The Ruff Agency"
            width={56}
            height={56}
            className="h-10 lg:h-14 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Burger — Client Component */}
      <LottieBurger />
    </div>
  )
}
