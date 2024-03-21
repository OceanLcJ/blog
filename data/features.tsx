import WebDeveloperSvg from '@site/static/svg/undraw_web_developer.svg'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'
import SpiderSvg from '@site/static/svg/undraw_spider.svg'
import Translate, { translate } from '@docusaurus/Translate'

export type FeatureItem = {
  title: string
  text: JSX.Element
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
}

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.developer',
      message: '全栈工程师',
    }),
    text: (
      <Translate>
        作为一名全栈工程师，为项目提供类型安全的保障，提高代码质量和开发效率。
      </Translate>
    ),
    Svg: WebDeveloperSvg,
  },
  {
    title: translate({
      id: 'homepage.feature.spider',
      message: '会点AI',
    }),
    text: (
      <Translate>
        一名AI的使用者。
      </Translate>
    ),
    Svg: SpiderSvg,
  },
  {
    title: translate({
      id: 'homepage.feature.enthusiast',
      message: '开源爱好者',
    }),
    text: (
      <Translate>
        作为一名开源爱好者，积极参与开源社区，为开源项目贡献代码，希望有生之年能够构建出一个知名的开源项目。
      </Translate>
    ),
    Svg: OpenSourceSvg,
  },
]

export default FEATURES
