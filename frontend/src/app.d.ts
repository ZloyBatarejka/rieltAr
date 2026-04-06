/// <reference types="react" />
type Nullable<T> = T | null

type Optional<T> = T | undefined

type Maybe<T> = T | Nullable<T> | Optional<T>
