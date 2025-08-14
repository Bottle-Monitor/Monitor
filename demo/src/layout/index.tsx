import { bottleMonitorInit } from '@bottle-monitor/core'
import { Outlet, NavLink } from 'react-router-dom'

export function Layout() {
    /* 相对路径才会代理 */
    const bottleMonitor = bottleMonitorInit({
        userId: '12',
        dsnURL: '/api/report',
        breadcrumb: [
            {
                breadcrumbType: 'abnormal',
                capacity: 1
            },
            {
              breadcrumbType: 'vitals',
              capacity: 1
            },
            {
                breadcrumbType: 'user',
                capacity: 2
            }
        ],
        // silent: {
        //   unhandledrejection: true,
        //   resource: true
        // }
    })
    // Promise.reject({
    //   type: 'user',
    //   message: 'why!'
    // })
    // const a= 1
    // a = 0
    // console.log(bottleMonitor)
    return (
        <>
            <div>Why!</div>
            <h3>current route: {location.href}</h3>
            <div className="route-block" style={{
                width: '500px',
                height: '100px',
                border: '2px solid lightblue'
            }}>
                <Outlet />
            </div>
            <NavLink to="/why">To Why</NavLink>
            <hr />
            <NavLink to="/hello">To Hello</NavLink>
            <hr />
            <a href="https://www.bilibili.com/">I'm a link! Test for history route!</a>
        </>
    )
}