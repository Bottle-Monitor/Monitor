import DefaultTheme from 'vitepress/theme'
import CodeDemo from './components/CodeDemo.vue'
import FeatureCard from './components/FeatureCard.vue'
import HomeHero from './components/HomeHero.vue'
import TechShowcase from './components/TechShowcase.vue'
import './styles/vars.css'
import './styles/overrides.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('FeatureCard', FeatureCard)
    app.component('TechShowcase', TechShowcase)
    app.component('CodeDemo', CodeDemo)
  },
}
