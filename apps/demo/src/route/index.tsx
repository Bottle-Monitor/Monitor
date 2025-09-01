import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layout'

// 动态导入页面组件
const Dashboard = () => import('../views/Dashboard')
const ErrorMonitoring = () => import('../views/ErrorMonitoring')
const PerformanceMonitoring = () => import('../views/PerformanceMonitoring')
const UserBehavior = () => import('../views/UserBehavior')
const ErrorTest = () => import('../views/TestPages/ErrorTest')
const PerformanceTest = () => import('../views/TestPages/PerformanceTest')
const UserTest = () => import('../views/TestPages/UserTest')

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        lazy: Dashboard,
      },
      {
        path: 'dashboard',
        lazy: Dashboard,
      },
      {
        path: 'errors',
        lazy: ErrorMonitoring,
      },
      {
        path: 'performance',
        lazy: PerformanceMonitoring,
      },
      {
        path: 'user-behavior',
        lazy: UserBehavior,
      },
      {
        path: 'test-pages',
        children: [
          {
            path: 'error-test',
            lazy: ErrorTest,
          },
          {
            path: 'performance-test',
            lazy: PerformanceTest,
          },
          {
            path: 'user-test',
            lazy: UserTest,
          },
        ],
      },
    ],
  },
]

const router = createBrowserRouter(routes)

export default router
