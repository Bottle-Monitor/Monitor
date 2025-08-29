import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layout'
import { Hello } from '../views/Hello'
import { Why } from '../views/Why'

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'hello',
        Component: Hello,
        index: true,
      },
      {
        path: 'why',
        Component: Why,
      },
    ],
  },
]

const router = createBrowserRouter(routes)

export default router
