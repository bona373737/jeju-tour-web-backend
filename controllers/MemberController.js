import express from 'express';
import regexHelper from '../helper/RegexHelper.js';
import {pagenation} from '../helper/UtilHelper.js';
import MemberService from '../services/MemberService.js';

const MemberController =()=>{
    const url = "/member";
    const router = express.Router();

    router.post(url, async(req,res,next)=>{
                const userid = req.post('userid');
                const password = req.post('password');
                const passwordCheck = req.post('passwordCheck');
                const username = req.post('username');
                const birthday = req.post('birthday');
                const email = req.post('email');
        
                try {
                    regexHelper.value(userid, '[회원등록]사용자 아이디가 없습니다.');
                    regexHelper.engNum(userid, '[회원등록]사용자 아이디는 영문,숫자 조합만 가능합니다.');
                    regexHelper.value(password, '[회원등록]비밀번호가 없습니다.');
                    regexHelper.value(passwordCheck, '[회원등록]비밀번호 확인이 없습니다.');
                    regexHelper.value(username, '[회원등록]사용자이름이 없습니다.');
                    regexHelper.value(email, '[회원등록]이메일이 없습니다.');
                    regexHelper.email(email, '[회원등록]이메일형식이 올바르지 않습니다. ')

                } catch (err) {
                    return next(err);
                }
        
                let json = null;
        
                try {
                    json = await MemberService.insertItem({
                        userid: userid,
                        password: password,
                        username: username,
                        birthday: birthday? birthday : null,
                        email : email
                    });
                } catch (err) {
                    return next(err);
                }
        
                res.sendResult({item: json});
    });
    
    


    return router;
};
export default MemberController;