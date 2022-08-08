/**
 * @Filename: MemberController.js
 * @Description: 회원가입, 로그인, 프로필수정기능 Controller
 *               회원가입 시 입력된 내용을 DB에 저장하고 조회함
 */
import express from 'express';
import logger from '../helper/LogHelper.js';
// import { initMulter, checkUploadError, createThumbnail, createThumbnailMultiple } from '../helper/FileHelper.js';
import MultipartException from "../exceptions/MultipartException.js";
import dayjs from 'dayjs';
// import formidable from 'formidable'

import regexHelper from '../helper/RegexHelper.js';
import MemberService from '../services/MemberService.js';
import multer from 'multer';

import cryptojs from 'crypto-js';
import bcrypt from 'bcrypt';



const MemberController =()=>{
    const url = "/members";
    const router = express.Router();
    const now = dayjs()

    /** 회원 가입 */
    router.post(url, async(req,res,next)=>{
        // console.log(req.sessionID);

        //클라이언트 입력값 가져오기
        const userid = req.post('userid');
        let password = req.post('password');
        const passwordCheck = req.post('passwordCheck');
        const username = req.post('username');
        const birthday = req.post('birthday');
        const email = req.post('email');
        const profile_img = req.post('profile_img');
        
        //유효성 검사
        try {
            regexHelper.value(userid, '[회원등록] 사용자 아이디가 없습니다.');
            regexHelper.engNum(userid, '[회원등록] 사용자 아이디는 영문,숫자 조합만 가능합니다.');
            regexHelper.value(password, '[회원등록] 비밀번호가 없습니다.');
            regexHelper.value(passwordCheck, '[회원등록] 비밀번호 확인이 없습니다.');
            regexHelper.value(username, '[회원등록] 사용자이름이 없습니다.');
            regexHelper.value(email, '[회원등록] 이메일이 없습니다.');
            regexHelper.email(email, '[회원등록] 이메일형식이 올바르지 않습니다. ')

        } catch (err) {
            return next(err);
        }

        // AES알고리즘 사용 복호화 ( 복구 키 필요 )
        const secretKey =  'secret key';
        const bytes = cryptojs.AES.decrypt(password, secretKey);
        // 인코딩, 문자열로 변환, JSON 변환
        const decrypted = bytes.toString(cryptojs.enc.Utf8);

        // 비밀번호 암호화(프론트에서 암호화한 값 전달받아 복호화 한뒤 단방향암호화 하여 DB에 저장)
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(decrypted, salt);


        let json = null;

        try {
            json = await MemberService.insertItem({
                userid: userid,
                password: password,
                username: username,
                birthday: birthday,
                email : email,
                profile_img : profile_img,
                reg_date : now.format("YYYY-MM-DD HH:mm:ss"),
                edit_date : now.format("YYYY-MM-DD HH:mm:ss")
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({item: json});
    });

    /** 회원 전체 데이터 조회 */
    router.get(url, async (req, res, next) => {
        let json = null;

        try {
            json = await MemberService.getList();
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 회원 단일 데이터 조회 */
    router.get(`${url}/:member_no`, async (req, res, next) => {
        // 회원 일련번호 받기
        const member_no = req.get('member_no');

        // 회원 일련번호 유효성 검사
        try {
            regexHelper.value(member_no, '회원 일련번호를 입력하세요.');
            regexHelper.num(member_no, '회원 일련번호는 숫자만 입력 가능합니다.');
        } catch (err) {
            return next(err);
        }

        // 회원 단일 데이터 조회
        let json = null;
        
        try {
            json = await MemberService.getItem({
                member_no: member_no
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    return router;
};
export default MemberController;