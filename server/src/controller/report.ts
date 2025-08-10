import { Req, Res } from "../types"

export function handleReport(req: Req, res: Res){
    const data = req.body
    console.log(data);

    res.send({
        status: 200,
        message: `发过来的 ${data} 已接收!`
    })
}