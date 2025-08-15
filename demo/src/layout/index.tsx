import { bottleMonitorInit } from '@bottle-monitor/core'
import { useEffect, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

export function Layout() {
    const [handledData, setHandledData] = useState('')

    // const beroreTransport = (data: any) => {
    //     console.log('beforeTransport: ', data)
    // }

    useEffect(() => {
        const eventSource = new EventSource('/api/data')
        eventSource.onmessage = (e) => {
            setHandledData(JSON.parse(e.data))
        }
    }, [])

    /* 相对路径才会代理 */
    const bottleMonitor = bottleMonitorInit({
        userId: '12',
        dsnURL: '/api/report',
        breadcrumbs: [
            {
                breadcrumbType: 'abnormal',
                perBeforePushBreadcrumb(data) {
                    console.log('before per push breadcrumb: ', data)
                },
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
        // hook: {
        //     beroreTransport
        // }
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
            <div
                className="route-block"
                style={{
                    width: '500px',
                    height: '100px',
                    border: '2px solid lightblue'
                }}
            >
                <Outlet />
            </div>
            <div
                className="data-block"
                style={{
                    width: '500px',
                    height: '300px',
                    border: '2px solid coral',
                    marginTop: '20px',
                    overflow: 'scroll'
                }}
            >
                {handledData}
            </div>
            <NavLink to="/why">To Why</NavLink>
            <hr />
            <NavLink to="/hello">To Hello</NavLink>
            <hr />
            <a href="#">Test for hash route!</a>
            <hr />
            <a href="https://www.bilibili.com/">
                I'm a link! Test for history route!
            </a>
        </>
    )
}
