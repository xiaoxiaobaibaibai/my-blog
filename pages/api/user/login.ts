import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {ironOptions} from "../../../config";
import { prepareConnection } from 'db/index'
import {ISession} from "../index";
import { User, UserAuth } from "../../../db/entity";

export default withIronSessionApiRoute(login, ironOptions)

async function login(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session
    const { phone = '', verify = '', identity_type = 'phone' } = req.body
    const db = await prepareConnection();
    const userRepo = db.getRepository(User)
    const userAuthRepo = db.getRepository(UserAuth)
    const users = await userRepo.find()
    console.log('数据库查询成功 ========', users)

    if(String(session.verifityCode) === String(verify)) {
        // 验证码正确，在user_auth表中查找identity_type是否有记录
        const userAuth = await userAuthRepo.findOne({
            // typeorm 0.3.x之后findOne => findOneBy
            identity_type,
            identifier: phone
        },{
            relations: ['user']
        })
    }
    if(userAuth) {

    }else {
        const user = new User();
        user.nickname = `用户_${Math.random() * 10000}`
        user.avatar =
    }
    res?.status(200).json({phone, verify, code: 0})
}
