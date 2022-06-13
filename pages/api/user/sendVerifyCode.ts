import {format} from 'date-fns';
import md5 from 'md5';
import {encode} from "js-base64";
import { NextApiRequest, NextApiResponse} from  'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import request from "../../../service/fetch";
import { ironOptions } from "../../../config";
import {ISession} from "../index";

export default withIronSessionApiRoute(sendVerifyCode,ironOptions)


async function sendVerifyCode (req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session
    const {to= '', templateId= 1} = req.body
    const Appid = '8a216da880d67afb0181587c9a95163c'
    const AccountId = '8a216da880d67afb0181587c99a91635'
    const AuthToken = 'e473009c61034dffa2def85ec3a953ed'
    const NowDate = format(new Date(), 'yyyyMMddHHmmss')
    const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
    const Authorization =encode(`${AccountId}:${NowDate}`)
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000
    const expireMinute = '5'
    // 业务URL格式：/2013-12-26/Accounts/{accountSid}/SMS/{funcdes}?sig={SigParameter}
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`

    const response = await request.post(url, {
        to,
        templateId,
        appId: Appid,
        datas: [verifyCode, expireMinute]
    }, {
        headers: {
            Authorization
        }
    })

    console.log('response =====',response)

    const { statusCode, statusMsg, templateSMS } = response as any
    if(statusCode === '000000') {
        session.verifyCode = verifyCode
        await session.save()
        res.status(200).json({
            code: 0,
            msg: statusMsg,
            data: {
                name: 'bai',
                templateSMS
            }
        })
    }else {
        res.status(200).json({
            code: statusCode,
            msg: statusMsg
        })
    }
}
