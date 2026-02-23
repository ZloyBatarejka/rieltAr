import type { PropsWithChildren, ReactNode } from 'react'

type ShowProps<T> = PropsWithChildren<{
  when: T
  fallback?: ReactNode
}>

export function Show<T>({ when, fallback, children }: ShowProps<T>): ReactNode {
  if (!when) {
    return fallback ?? null
  }
  return children
}
