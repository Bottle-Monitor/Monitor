import { Req, Res } from '../types'
import { SourceMapConsumer } from 'source-map'
import fs from 'fs'
import path from 'path'

interface GeneratedPosition {
    line: number
    column: number
}

async function handleSourceMap(
    mapFilePath: string,
    generatedPosition: GeneratedPosition
) {
    const mapFile = path.resolve(__dirname, mapFilePath)
    const rawSourceMap = JSON.parse(fs.readFileSync(mapFile, 'utf-8'))

    const consumer = await new SourceMapConsumer(rawSourceMap)
    const originalPostion = consumer.originalPositionFor(generatedPosition)

    consumer.destroy()

    return originalPostion
}

export function handleCode(req: Req, res: Res) {
    const { data } = req.body // includes file name and version
    const originalData = handleSourceMap('./dist', data)

    res.send({
        status: 200,
        message: originalData
    })
}
