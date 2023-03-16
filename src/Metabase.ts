export interface MetabaseConfig {
  readonly baseUrl: string
  readonly email: string
  readonly password: ConfigSecret
}

const make = ({ baseUrl, email, password }: MetabaseConfig) =>
  Do($ => {
    const page = $(Puppeteer.Page.access)

    const url = (path: string) => `${baseUrl}${path}`

    const pdf = (path: string) =>
      page.with(async page => {
        await page.goto(url(path), {
          waitUntil: "networkidle0",
          timeout: 5 * 60 * 1000,
        })

        await page.evaluate(() => {
          document.documentElement.setAttribute("style", "width: 100%;")
          const content = document.querySelector(
            "div[data-testid=dashboard-parameters-and-cards]",
          )
          if (content) {
            document.body.appendChild(content)
            document.getElementById("root")?.remove()

            content.setAttribute("id", "dashboard")
            content.setAttribute("class", "")
            content.setAttribute(
              "style",
              "height: auto; box-sizing: content-box; padding-bottom: 75px;",
            )
          }
        })

        const dashboard = await page.$("#dashboard")
        let boundingBox = await dashboard?.boundingBox()
        let height = Math.ceil(boundingBox!.height)
        let width = Math.ceil(boundingBox!.width)

        await page.setViewport({
          height,
          width,
          deviceScaleFactor: 2,
        })

        await page.evaluate(`const bodyStyle = document.getElementsByTagName('body')[0].style;
  bodyStyle.width = '${width}px';
  bodyStyle.height = '${height}px';`)

        return page.pdf({
          height: height,
          width,
          pageRanges: "1",
          printBackground: true,
        })
      })

    $(
      page.with(async page => {
        await page.goto(url("/auth/login"))
        await page.waitForSelector("input[name=username]", { visible: true })

        await page.type("input[name=username]", email)
        await page.type("input[name=password]", password.value)
        await page.keyboard.press("Enter")

        await page.waitForNetworkIdle()
      }),
    )

    return { url, pdf }
  })

export interface Metabase extends Effect.Success<ReturnType<typeof make>> {}
export const Metabase = Tag<Metabase>()
export const makeLayer = (_: Config.Wrap<MetabaseConfig>) =>
  Config.unwrap(_).config.flatMap(make).toLayer(Metabase)
