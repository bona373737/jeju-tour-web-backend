/**
 * @Filename: MemberController.js
 * @Description: 회원가입, 로그인/아웃, 프로필수정기능 Controller
 *               회원가입 시 입력된 내용을 DB에 저장하고 조회함
 */
/** 설치 모듈 */
import express from 'express';
import dayjs from 'dayjs';
import cryptojs from 'crypto-js';
import bcrypt from 'bcrypt';
import multer from 'multer';
// import formidable from 'formidable';
// import { json } from 'body-parser';

/** 직접 구현한 모듈  */
import logger from '../helper/LogHelper.js';
import regexHelper from '../helper/RegexHelper.js';
import { initMulter, checkUploadError, createThumbnail, createThumbnailMultiple } from '../helper/FileHelper.js';

/** 예외처리 관련 클래스 */
import BadRequestException from "../exceptions/BadRequestException.js";
import MultipartException from "../exceptions/MultipartException.js";

/** 회원 비즈니스로직 */
import MemberService from '../services/MemberService.js';

const MemberController = () => {
    const url = "/members";
    const urlLog = "/session/login";
    const router = express.Router();
    const now = dayjs();

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
        const secretKey = process.env.CRYPTO_KEY;
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
            json = await MemberService.selectList();
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
            json = await MemberService.selectItem({
                member_no: member_no
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({ item: json });
    });

    /** 회원 로그인 여부 검사 */
    router.get(urlLog, (req, res, next) => {
        // 회원정보 저장할 변수
        let json = null;

        if (req.session.user  === undefined) { // 로그아웃 상태
            const err = new BadRequestException('로그인을 해주세요.');
            return next(err);
        } else { // 로그인 상태
            json = req.session.user;
        }

        res.sendResult({item: json});
    });

    /** 회원 로그인 */
    router.post(urlLog, async (req, res, next) => {
        // 사용자가 입력한 아이디, 비밀번호
        const id = req.post('userid');
        const pw = req.post('password');

        // 아이디, 비밀번호 유효성 검사
        try { 
            regexHelper.value(id, '아이디를 입력해주세요.');
            regexHelper.value(pw, '비밀번호를 입력해주세요.');
        } catch(err) {
            return next(err);
        }

        // AES알고리즘 사용 --> 프론트에서 전달받은 암호값 복호화 ( 복구 키 필요 )
        const secretKey = process.env.CRYPTO_KEY;
        const bytes = cryptojs.AES.decrypt(pw, secretKey);
        // 인코딩, 문자열로 변환, JSON 변환 --> 사용자 입력값 도출
        const decrypted = bytes.toString(cryptojs.enc.Utf8);

        // 아이디가 일치하는 회원정보 저장할 변수
        let json = null;

        try {
            // 아이디가 일치하는 회원정보 DB에서 가져오기
            json = await MemberService.selectUserid({
                userid: id,
            });
        } catch (err) {
            return next(err);
        }

        // 가져온 회원정보에서 필요한 값만 추출
        const { member_no, userid, password, username, profile_img, profile_thumb } = json;
        // 비밀번호 비교 (복호화된 원본 비밀번호와 DB에 있는 해시 비밀번호와 비교)
        const checkPassword = await bcrypt.compare(decrypted, password);

        if (checkPassword) { // password 일치 --> 로그인 성공
            req.session.user = {
                member_no: member_no,
                userid: userid,
                username: username,
                profile_img: profile_img,
                profile_thumb: profile_thumb,
            };
        } else { // password 불일치 --> 로그인 실패
            const err = new BadRequestException('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return next(err);
        }

        res.sendResult({item: req.session.user});
    });

    /** 회원 로그아웃 */
    router.delete(urlLog, async (req, res, next) => {
        // 회원정보 초기화할 변수
        let json = null;

        try {
            await req.session.destroy();
            json = {
                member_no: null,
                userid: null,
                username: null,
                profile_img: null,
                profile_thumb: null,
            }
        } catch (err) {
            return next(err);
        }
        
        res.sendResult({item: json});
    });
    
    /** 회원정보 수정 */
    //회원 정보 중 생년월일, 이메일, 프로필사진만 변경
    router.patch(url, async(req,res,next)=>{

        //업로드된 프로필사진 저장 폴더명
        const dirName={
            upload_dir : "profile_img",
            thumb_dir: "profile_img"
        }

        const upload = initMulter(dirName).fields([{name:'profile_img',maxCount:1}]);
        upload(req, res, async(err) => {
            // 파일업로드 과정 중 에러가 존재한다면 예외처리 수행
            if (err) {
                return next(new MultipartException(err));
            }

            // 업로드 결과가 성공이라면 썸네일 생성 함수를 호출한다.
            try {
                createThumbnail(req.file, dirName);
            } catch (error) {
                return next(error);
            }

            //로그인된 회원번호_세션에 저장된 데이터 가져오기
            const member_no = req.session.user.member_no;
            // const member_no = 45;
            const edit_date = now.format("YYYY-MM-DD HH:mm:ss");
            //사용자입력값 받기
            const birthday = req.post('birthday');
            const email = req.post('email');
            //업로드된 파일 경로 
            const profile_img = req.file.path;
            const profile_thumb = req.file.thumbnail["480w"];
            
            //사용자입력값 유효성 검사
            try {
                
            } catch (error) {
                
            }
            
            //변경된 회원정보 DB에 적용 
            let json = null;
            try {
                json = await MemberService.updateProfile({
                    member_no : member_no,
                    birthday : birthday,
                    email : email,
                    edit_date : edit_date,
                    profile_img : profile_img,
                    profile_thumb : profile_thumb
                });
            } catch (error) {
                return next(err);
            }
            
            console.log(json)
            res.sendResult({item:json});
        });
    });

    return router;
};

export default MemberController;