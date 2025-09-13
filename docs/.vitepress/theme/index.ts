import DefaultTheme from 'vitepress/theme'
import './styles/vars.css'
import './styles/overrides.css'

const components = [
  'HomeHero',
  'FeatureCard',
  'TechShowcase',
  'CodeDemo',
  'FeatureCards',
  'ShowCase',
  'StatsCards',
]

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app }) => {
    const imports = components.map(name =>
      import(`./components/${name}.vue`).then((module) => {
        app.component(name, module.default)
      }),
    )

    await Promise.all(imports)
  },
}
