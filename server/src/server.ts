import app from './app'
import config from './config'

const { port } = config

app.listen(port, () => {
  console.log(`服务器已运行在端口${port}`)
})
