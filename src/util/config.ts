import { ConfigTypeId } from "@effect/io/Config"

export type WrapWithConfig<A> =
  | (A extends Record<string, any>
      ? {
          [K in keyof A]: WrapWithConfig<A[K]>
        }
      : never)
  | Config<A>

export const unwrapConfig = <A>(wrapped: WrapWithConfig<A>): Config<A> => {
  if (
    typeof wrapped === "object" &&
    wrapped != null &&
    ConfigTypeId in wrapped
  ) {
    return wrapped
  }

  return Config.struct(
    Object.fromEntries(
      Object.entries(wrapped).map(([k, a]) => [k, unwrapConfig(a)]),
    ),
  ) as any
}
