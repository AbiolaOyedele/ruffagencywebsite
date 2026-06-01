'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface MenuContextValue {
  isMenuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        toggleMenu: () => setIsMenuOpen((v) => !v),
        closeMenu: () => setIsMenuOpen(false),
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within <MenuProvider>')
  return ctx
}
