/**
 * @Filename: MemberController.js
 * @Description: 회원가입, 로그인, 프로필수정기능 Controller
 *               회원가입 시 입력된 내용을 DB에 저장하고 조회함
 */
import express from 'express';
import regexHelper from '../helper/RegexHelper.js';
import MemberService from '../services/MemberService.js';
// import bcrypt from 'bcrypt';

const MemberController =()=>{
    const url = "/members";
    const router = express.Router();

    /** 회원 가입 */
    router.post(url, async(req,res,next)=>{
        //클라이언트 입력값 가져오기
        const userid = req.post('userid');
        const password = req.post('password');
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

        // 비밀번호 암호화(프론트에서 암호화한 값 전달받기_백엔드에서 암호화X)
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        let json = null;

        try {
            json = await MemberService.insertItem({
                userid: userid,
                password: password,
                username: username,
                birthday: birthday,
                email : email,
                profile_img : profile_img,
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult({item: json});
    });
    
    // 로그인 시 password 확인할 때_bcrypt는 단방향 암호화이기때문에 암호화된 값끼리 비교
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if (!validPassword) {
    // return res.status(400).send('이메일이나 비밀번호가 올바르지 않습니다.');
    // }

    /** 회원 전체 데이터 조회 */
    router.get(url, async (req, res, next) => {
        // 페이지 번호 파라미터 (기본값은 1)
        const page = req.get('page', 1);
        // 한 페이지에 보여질 목록 수 받기 (기본값은 10)
        const rows = req.get('rows', 10);

        let json = null;
        let pageInfo = null;

        try {
            // 전체 데이터 수 얻기
            const totalCount = await MemberService.getCount(params);
            pageInfo = pagenation(totalCount, page, rows);

            params.offset = pageInfo.offset;
            params.listCount = pageInfo.listCount;

            json = await MemberService.getList(params);
        } catch (err) {
            return next(err);
        }

        res.sendResult({ pagenation: pageInfo, item: json });
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