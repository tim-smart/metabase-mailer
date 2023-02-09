import * as P from "puppeteer"

export const PuppeteerConfig = Tag<P.PuppeteerLaunchOptions>()

export class LaunchError {
  readonly _tag = "LaunchError"
  constructor(readonly reason: unknown) {}
}

const makeBrowser = Effect.serviceWithEffect(PuppeteerConfig, opts =>
  Effect.tryCatchPromise(P.launch(opts), reason => new LaunchError(reason)),
).acquireRelease(browser => Effect.promise(browser.close()))

export class NewPageError {
  readonly _tag = "NewPageError"
  constructor(readonly reason: unknown) {}
}

const newPage = makeBrowser
  .flatMap(browser =>
    Effect.tryCatchPromise(
      () => browser.newPage(),
      reason => new NewPageError(reason),
    ),
  )
  .acquireRelease(page => Effect.promise(() => page.close()))

export const makePage = Do($ => {
  const page = $(newPage)

  const withPage = <A>(f: (p: P.Page) => Promise<A>, __tsplusTrace?: string) =>
    Effect.tryCatchPromise(
      () => f(page),
      reason => new WithPageError(reason, __tsplusTrace),
    )

  return {
    page,
    with: withPage,
  }
})

export interface Page extends Effect.Success<typeof makePage> {}
export const Page = Tag<Page>()
export const PageLive = makePage.toLayerScoped(Page)
export const makeLayer = (_: P.PuppeteerLaunchOptions) =>
  makePage.provideService(PuppeteerConfig, _).toLayerScoped(Page)

export class WithPageError {
  readonly _tag = "WithPageError"
  constructor(readonly reason: unknown, readonly trace?: string) {}
}

export const withPage = <A>(f: (p: P.Page) => Promise<A>) =>
  Effect.serviceWithEffect(Page, page => page.with(f))
