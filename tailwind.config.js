// tailwind.config.js — CommonJS (no "type":"module" in package.json)
const fluid = require('fluid-tailwind')
const aspectRatio = require('@tailwindcss/aspect-ratio')

const fluidPlugin = fluid.default ?? fluid
const extract    = fluid.extract    ?? fluidPlugin.extract    ?? (() => [])
const screens    = fluid.screens    ?? fluidPlugin.screens    ?? {}
const fontSize   = fluid.fontSize   ?? fluidPlugin.fontSize   ?? {}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: ['./src/**/*.{ts,tsx,js,jsx}'],
    extract: {
      DEFAULT: extract,
    },
  },
  darkMode: 'class',
  theme: {
    screens,
    fontSize,
    extend: {
      fontFamily: {
        grandstander: ['"Grandstander"', 'sans-serif'],
        tiltwarp:     ['"TiltWarp"',     'sans-serif'],
      },
      colors: {
        'brand-aqua':   '#D5F3FF',
        'brand-blue':   '#634DFF',
        'brand-cream':  '#FFFDE0',
        'brand-green':  '#02B357',
        'brand-indigo': '#6E3F8D',
        'brand-lilac':  '#D5C1FF',
        'brand-mint':   '#C9FAA8',
        'brand-orange': '#FF7338',
        'brand-peach':  '#F6CCD7',
        'brand-pink':   '#FF78CB',
        'brand-red':    '#FF5050',
        'brand-yellow': '#FFCD00',
        'brand-black':  'rgb(var(--color-brand-black) / <alpha-value>)',
        'brand-white':  'rgb(var(--color-brand-white) / <alpha-value>)',
        'base-bg':      'rgb(var(--color-base-bg) / <alpha-value>)',
        'base-fg':      'rgb(var(--color-base-fg) / <alpha-value>)',
        'accent-bg':    'rgb(var(--color-accent-bg) / <alpha-value>)',
        'accent-fg':    'rgb(var(--color-accent-fg) / <alpha-value>)',
      },
      spacing: {
        'blocks':    'clamp(3rem, .71rem + 3.57vw, 5rem)',
        'blocks-2x': 'clamp(5rem, -.71rem + 8.93vw, 10rem)',
        'block':     'clamp(2rem, -.29rem + 3.57vw, 4rem)',
        'gutter':    'clamp(1.5rem, .36rem + 1.79vw, 2.5rem)',
        'text':      '1.5rem',
        'page':      'clamp(2rem, -.29rem + 3.57vw, 4rem)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'jump':    'letter-jump .2s cubic-bezier(.68,-.55,.265,1.55)',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translate(0)' },
          'to': { transform: 'translate(-100%)' },
        },
        'block-fall': {
          '0%':  { transform: 'translateY(-.5em) rotate(3deg)',    opacity: '1' },
          '30%': { transform: 'translateY(0) rotate(-4deg)',        opacity: '1' },
          '50%': { transform: 'translateY(-.1em) rotate(.5deg)',    opacity: '1' },
          '65%': { transform: 'translateY(0) rotate(0)',            opacity: '1' },
          '80%': { transform: 'translateY(-.01em) rotate(-.03deg)', opacity: '1' },
          '90%': { transform: 'translateY(0) rotate(0)',            opacity: '1' },
          'to':  { transform: 'translateY(0) rotate(0)',            opacity: '1' },
        },
        'letter-jump': {
          '0%':  { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
          'to':  { transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [fluidPlugin, aspectRatio],
}
