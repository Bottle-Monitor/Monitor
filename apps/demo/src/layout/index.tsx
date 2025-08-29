import { bottleMonitorInit, userPlugin } from '@bottle-monitor/core'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  const [dataList, setDataList] = useState<string[]>([])

  const beforeTransport = (data: unknown) => {
    console.log('beforeTransport: ', data)
  }

  const longTask = () => {
    const timer = setInterval(() => {
      for (let i = 0; i < 10000000; i++) {
        Date.now()
      }
      clearInterval(timer)
      console.log('long task out of time')
    }, 5)
  }

  const [doms, setDoms] = useState<number[]>([])
  const repaint = () => {
    setDoms([...doms, 1])
  }

  useEffect(() => {
    const eventSource = new EventSource('/api/data')
    eventSource.onmessage = (e) => {
      setDataList(prev => [...prev, JSON.parse(e.data)])
    }

    longTask()

    // setTimeout(() => {
    //     const CLSBlock = document.querySelector('.cls-block')
    //     if (CLSBlock) {
    //         const img = new Image()
    //         img.src = 'https://picsum.photos/50/100'
    //         CLSBlock.appendChild(img)
    //     }
    // }, 300)
  }, [])

  const userplugin = userPlugin({
    options: {
      click: true,
    },
    breadcrumbs: {

    },
  })

  /* 相对路径才会代理 */
  bottleMonitorInit({
    userId: '12',
    dsnURL: '/api/report',
    plugins: [userplugin],
    hook: {
      beforeTransport,
    },
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
      <h3>
        current route:
        {location.href}
      </h3>
      <div
        className="route-block"
        style={{
          width: '550px',
          height: '100px',
          border: '2px solid lightblue',
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
          padding: '25px',
          overflowY: 'auto',
          whiteSpace: 'wrap',
        }}
      >
        <ul
          style={{
            padding: '0',
            margin: 0,
            listStyle: 'inside',
            wordBreak: 'break-word',
          }}
        >
          {dataList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <button className="repaint" onClick={repaint}>add DOM</button>
      <ul
        className="doms"
        style={{
          border: '1px solid #bebe',
        }}
      >
        {
          doms.map((dom, index) => <li key={index}>{dom}</li>)
        }
      </ul>
      <img src="./vite.svg" alt="" {...{ elementtiming: 'big-banner' }} />
      <NavLink to="/why">To Why</NavLink>
      <hr />
      <NavLink to="/hello">To Hello</NavLink>
      <hr />
      <a href="#">Test for hash route!</a>
      <hr />
      <a href="https://www.bilibili.com/">
        I'm a link! Test for history route!
      </a>
      <div
        className="cls-block"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid lightgreen',
          padding: '5px',
        }}
      >
        CLS Test
      </div>
    </>
  )
}
