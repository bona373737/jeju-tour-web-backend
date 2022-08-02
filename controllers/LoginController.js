/** 
 * @Filename: LoginController.js
 * @Author: 구나래(nrggrnngg@gmail.com)
 * @Description: 로그인 여부 확인하고 로그인/로그아웃 분기처리
 */
import logger from "../helper/LogHelper.js";
import express from "express";
import BadRequestException from "../exceptions/BadRequestException.js";

export default () => {
    const router = express.Router();

    router
        .post("/session/login", (req, res, next) => {
            // 사용자가 입력한 아이디
            const id = req.post('userid');
            // 사용자가 입력한 비밀번호
            const pw = req.post('password');

            logger.debug("id=" + id);
            logger.debug("id=" + pw);

            // 아이디가 node가 아니거나, 비밀번호가 1234가 아니라면? 에러 발생!
            // 기존에 입력된 DB와 같은지 체크해주는 부분
            if (id != "node" || pw != "1234") {
                const error = new BadRequestException('아이디나 비밀번호를 확인하세요.');
                return next(error);
            }

            req.session.userid = id;
            req.session.userpw = pw;

            res.sendResult();
        });
};