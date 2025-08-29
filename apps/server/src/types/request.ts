import type { Request, Response } from 'express'
import type * as QueryString from 'qs'

export type Req = Request<any, any, any, QueryString.ParsedQs>
export type Res = Response<any, Record<string, any>>
