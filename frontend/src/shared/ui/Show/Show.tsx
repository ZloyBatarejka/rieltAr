import type { ReactNode } from 'react'

type ShowProps<T> = {
  when: T
  fallback?: ReactNode
  children: ReactNode | ((value: NonNullable<T>) => ReactNode)
}

export function Show<T>({ when, fallback, children }: ShowProps<T>): ReactNode {
  if (!when) {
    return fallback ?? null
  }
  if (typeof children === 'function') {
    return children(when)
  }
  return children
}
