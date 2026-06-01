/**
 * Type declarations for packages that don't ship their own TypeScript types.
 */

declare module 'lottie-colorify' {
  /**
   * Replace every occurrence of sourceColor in the animation JSON with targetColor.
   * @param sourceColor – hex string e.g. "#1e1e23"
   * @param targetColor – hex string e.g. "#feb3d2"
   * @param animationData – parsed Lottie JSON object
   */
  export function replaceColor(
    sourceColor: string,
    targetColor: string,
    animationData: object,
  ): object
}
