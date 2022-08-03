/** 
 * @Filename: LoginController.js
 * @Author: 구나래(nrggrnngg@gmail.com)
 * @Description: 로그인 여부 확인하고 로그인/로그아웃 분기처리
 */
import express from "express";
import logger from "../helper/LogHelper.js";
import regexHelper from '../helper/RegexHelper.js';
import MemberService from '../services/MemberService.js';
import BadRequestException from "../exceptions/BadRequestException.js";

const LoginController = () => {
    const url = "/session/login";
    const router = express.Router();

    router
        // form id="before-login" submit 이벤트 발생 시 post 실행
        .post(url, async (req, res, next) => {
            // 사용자가 입력한 아이디, 비밀번호
            const id = req.post('userid');
            const pw = req.post('password');

            logger.debug("id=" + id);
            logger.debug("id=" + pw);

            // 아이디, 비밀번호 유효성 검사
            try { 
                regexHelper.value(id, '아이디를 입력하세요.');
                regexHelper.value(pw, '비밀번호를 입력하세요.');
            } catch(e) {
                return next(err);
            }

            // 일치하는 회원 정보 조회
            let json = null;

            try {
                json = await MemberService.getLoginUser({
                    userid: id,
                    password: pw
                });
            } catch (err) {
                return next(err);
            }

            req.session.userid = id;
            req.session.userpw = pw;

            res.sendResult({ item: json });
        })
        .delete(url, async (req, res, next) => {
            try {
                await req.session.destroy();
            } catch (e) {
                return next(e);
            }

            res.sendResult();
        })
        // HTML 페이지 로드시 로그인 여부 검사
        .get(url, (req, res, next) => {
            // 세션에 저장된 아이디, 비밀번호 가져오기
            const id = req.session.userid;
            const pw = req.session.userpw;

            // 아이디가 undefined거나 비밀번호가 undefined라면?
            if (id === undefined || pw === undefined) {
                const error = new BadRequestException('현재 로그인 중이 아닙니다.');
                return next(error);
            } 

            res.sendResult();
        });

    return router;
};

export default LoginController;