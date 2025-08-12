import './App.css'
import { bottleMonitorInit } from '@bottle-monitor/core'

function App() {
  const bottleMonitor = bottleMonitorInit({
    userId: '12',
    dsnURL: 'http://localhost:3000/api/collect'
  })
  console.log(bottleMonitor)
  return (
    <>
      <div>Why!</div>
    </>
  )
}

export default App
