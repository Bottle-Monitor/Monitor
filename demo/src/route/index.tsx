import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Hello } from '../views/Hello'
import { Why } from '../views/Why'
import { Layout } from '../layout'

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Layout,
        children: [
            {
                path: 'hello',
                Component: Hello,
                index: true
            },
            {
                path: 'why',
                Component: Why
            }
        ]
    }
]

const router = createBrowserRouter(routes)

export default router