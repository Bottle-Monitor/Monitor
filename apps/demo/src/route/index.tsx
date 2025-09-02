import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout'
import Dashboard from '../views/Dashboard'
import DataIntegrationDemo from '../views/DataIntegrationDemo'
import ErrorMonitoring from '../views/ErrorMonitoring'
import PerformanceMonitoring from '../views/PerformanceMonitoring'
import ErrorTest from '../views/TestPages/ErrorTest'
import PerformanceTest from '../views/TestPages/PerformanceTest'
import UserTest from '../views/TestPages/UserTest'
import UserBehavior from '../views/UserBehavior'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'error-monitoring',
        element: <ErrorMonitoring />,
      },
      {
        path: 'performance-monitoring',
        element: <PerformanceMonitoring />,
      },
      {
        path: 'user-behavior',
        element: <UserBehavior />,
      },
      {
        path: 'data-integration-demo',
        element: <DataIntegrationDemo />,
      },
      {
        path: 'error-test',
        element: <ErrorTest />,
      },
      {
        path: 'performance-test',
        element: <PerformanceTest />,
      },
      {
        path: 'user-test',
        element: <UserTest />,
      },
    ],
  },
])

export default router
