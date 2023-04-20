/**
 * @FileName : LikeController.js
 * @description : "좋아요" 스크랩기능
 *                 좋아요 추가,삭제,조회 기능구현
 */
import express from 'express';
import dayjs from 'dayjs';
import regexHelper from '../helper/RegexHelper.js';
import {pagenation} from '../helper/UtilHelper.js';
import LikeService from '../services/LikeService.js';

const LikeController = () => {
    const url = "/likes";
    const router = express.Router();
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    /** 특정사용자(memberno)의 전체 목록 조회 */
    router.get(url, async (req, res, next) => {
        // 파라미터
        // const member_no = req.get('member_no');
        const member_no = req.session.user.member_no;
        // 페이지 번호 파라미터 (기본값은 1)
        const page = req.get('page', 1);
        // 한 페이지에 보여질 목록 수 받기 (기본값은 10)
        const rows = req.get('rows', 10);
        
        const params = {};
        if (member_no) {
            params.member_no = Number(member_no);
        }

        // 데이터 조회
        let json = null;
        let pageInfo = null;

        try {
            // 특정사용자(memberno)의 전체 데이터 수 얻기
            const totalCount = await LikeService.selectCount(params);
            pageInfo = pagenation(totalCount, page, rows);
            
            params.offset = pageInfo.offset;
            params.listCount = pageInfo.listCount;
            json = await LikeService.selectList(params);
        } catch (err) {
            return next(err);
        }

        res.sendResult({pagenation: pageInfo, item: json});
    });

    router.get(`${url}/count`, async (req, res, next) => {
        const member_no = req.session.user.member_no;

        let cnt = null;

        try {
            cnt = await LikeService.selectCount({"member_no":member_no});            
        } catch (err) {
            return next(err);
        }
        res.sendResult({item:cnt});
    });


    /** 좋아요여부확인기능_member_no, ref_id, ref_type값으로 데이터 조회 */
    // router.get(`${url}/isliked`, async (req, res, next) => {
    //     // 파라미터
    //     // const member_no = req.get('member_no');
    //     const member_no = req.session.user.member_no;
    //     const ref_id = req.get('ref_id');
    //     let ref_type = req.get('ref_type');

    //     switch (ref_type) {
    //         case 'place':
    //             ref_type='P';
    //             break;
    //         case 'accom':
    //             ref_type='A';
    //             break;
    //         case 'food':
    //             ref_type='F';
    //             break;
    //         default:
    //             break;
    //     }

    //     // 파라미터 유효성검사
    //     try {
            
    //     } catch (error) {
            
    //     }
        
    //     //파라미터 객체에 담기
    //     const params = {};
    //     params.member_no = Number(member_no);
    //     params.ref_id = Number(ref_id);
    //     params.ref_type = ref_type;

    //     //
    //     let json = null;
    //     try {
    //         json = await LikeService.selectItem(params);
    //     } catch (err) {
    //         return next(err);
    //     }
    //     //응답데이터 없음 ->현재 로그인된 사용자가 해당 여행정보를 좋아요 했는지 여부만 확인필요.
    //     res.sendResult({item:{isLiked :true, like_no:json.like_no }});
    // });

    /** 데이터 추가 --> Create(INSERT) */
    router.post(url, async (req, res, next) => {
        // 파라미터 받기
        const member_no = Number(req.session.user.member_no);
        // console.log(member_no);
        let ref_id = req.post('ref_id')
        let ref_type = req.post('ref_type')
        //프론트로부터 placeno, accomno, foodno값을 전달받은뒤 
        //ref_id와 ref_type값으로 할당하는 처리 필요함
        switch (ref_type) {
            case 'place':
                ref_type = 'P';
                break;
            case 'accom':
                ref_type = 'A';
                break;
            case 'food':
                ref_type = 'F';
                break;
            default:
                break;
        }

        // 유효성 검사
        try {
            regexHelper.value(member_no, '회원번호가  없습니다.');
            regexHelper.value(ref_id, '관광지번호가  없습니다.');
            regexHelper.value(ref_type, '관광지종류가  없습니다.');
            
        } catch (err) {
            return next(err);
        }

        // 데이터 저장
        let json = null;

        try {
            json = await LikeService.insertItem({
                member_no: member_no,
                ref_id: ref_id,
                ref_type: ref_type,
                reg_date: now
            })
        } catch (err) {
            return next(err);
        }

        res.sendResult({item: json});
    });


    /** 데이터 삭제 --> Delete(DELETE) */
    router.delete(`${url}/:like_no`, async (req, res, next) => {
        // 파라미터 받기
        const like_no = req.get('like_no');
        
        //유효성 검사
        try {
            regexHelper.value(like_no, '좋아요번호가 없습니다.');
            regexHelper.num(like_no, '좋아요번호가 잘못되었습니다_번호는 숫자만 가능');
        } catch (err) {
            return next(err);
        }

        try {
            await LikeService.deleteItem({
                like_no: like_no
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult();
    });

    return router;
};

export default LikeController;