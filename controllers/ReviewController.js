/**
 * @FileName : MyReviewController.js
 * @description : 내리뷰 
 *                리뷰작성한 여행지,숙소,음식점 정보를 ref_id,red_type값으로 변환하여 DB에 저장
 *                리뷰글에 업로드된 사진파일이 있는경우 서버에 저장 후 파일경로 DB에 저장 
 */
import express from 'express';
import { initMulter, checkUploadError, createThumbnail, createThumbnailMultiple } from '../helper/FileHelper.js';
import MultipartException from "../exceptions/MultipartException.js";
import dayjs from 'dayjs';

import regexHelper from '../helper/RegexHelper.js';
import {pagenation} from '../helper/UtilHelper.js';
import ReviewService from '../services/ReviewService.js';

const ReviewController = () => {
    const url = "/reviews";
    const router = express.Router();
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    /**특정 여행지정보에 작성된 리뷰글 전체 목록 조회 */
    router.get(`${url}/:ref_type/:ref_id`, async (req, res, next) => {

        //path파라미터값 변수저장
        let ref_type = req.get("ref_type");
        const ref_id = req.get("ref_id");

        switch (ref_type) {
            case "place":
                ref_type = 'P';
            break;
            case "accom":
                ref_type = 'A';
            break;
            case "food":
                ref_type = 'F'; 
            break;
            default:
                break;
        }

        // 페이지 번호 파라미터 (기본값은 1)
        const page = req.get('page', 1);
        // 한 페이지에 보여질 목록 수 받기 (기본값은 10)
        const rows = req.get('rows', 10);

        const params = {};
        params.ref_type = ref_type;
        params.ref_id = ref_id;

        // 데이터 조회
        let json = null;
        let pageInfo = null;

        try {
            // 특정여행지(ref_id, ref_type)의 전체 데이터 수 얻기
            const totalCount = await ReviewService.selectCountRef(params);
            pageInfo = pagenation(totalCount, page, rows);
            
            params.offset = pageInfo.offset;
            params.listCount = pageInfo.listCount;
            json = await ReviewService.selectListRef(params);
        } catch (err) {
            return next(err);
        }

        res.sendResult({pagenation: pageInfo, item: json});
    });

    /** 특정사용자(memberno)가 작성한 리뷰글 전체 목록 조회 */
    router.get(url, async (req, res, next) => {

        //세션에 저장된 member_no값 가져오기
        const member_no = req.session.user.member_no; 
        // const member_no = req.get('member_no'); 
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
            const totalCount = await ReviewService.selectCount(params);
            pageInfo = pagenation(totalCount, page, rows);
            
            params.offset = pageInfo.offset;
            params.listCount = pageInfo.listCount;
            json = await ReviewService.selectList(params);
        } catch (err) {
            return next(err);
        }

        res.sendResult({pagenation: pageInfo, item: json});
    });

    /** 리뷰글 추가 --> Create(INSERT) */
    router.post(url, async (req, res, next) => {
        /**파일업로드 폴더이름 */
        const dirName={
            upload_dir : "reviews_img",
            thumb_dir: "reviews_thumb"
        }

        const upload = initMulter(dirName).fields([{name:'text',maxCount:1},{name:'image',maxCount:1}]);
        upload(req, res, async(err) => {
            // 파라미터 받기
            //const member_no = req.session.member_no;
            const member_no = req.post('member_no'); 
            const place_no = req.post('place_no');
            const accom_no = req.post('accom_no');
            const food_no = req.post('food_no');
            const title = req.post('title');
            const content = req.post('content');
            let ref_id = null;
            let ref_type = null;
            let image = null;
            let thumbnail = null;

            //프론트로부터 place_no, accom_no, food_no값을 전달받은뒤 
            //ref_id와 ref_type값으로 할당하는 처리 필요함
            if(place_no){
                ref_id = place_no;
                ref_type = "P";
            }else if(accom_no){
                ref_id = accom_no;
                ref_type = "A";
            }else if(food_no){
                ref_id = food_no;
                ref_type = "F";
            }

            // 유효성 검사
            try {
                regexHelper.value(member_no, '회원번호가  없습니다.');
                regexHelper.value(ref_id, '관광지번호가  없습니다.');
                regexHelper.value(ref_type, '관광지종류가  없습니다.');
                
            } catch (err) {
                return next(err);
            }

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

            image = req.file.path;
            thumbnail = req.file.thumbnail["480w"];


        
            // 데이터 저장
            let json = null;

            try {
                json = await ReviewService.insertItem({
                    member_no: member_no,
                    ref_id: ref_id,
                    ref_type: ref_type,
                    title:title,
                    content: content,
                    image:image,
                    thumbnail: thumbnail,
                    reg_date : now,
                    edit_date : now
                })
            } catch (err) {
                return next(err);
            }

            res.sendResult({item: json});
        });

    });


    /** 리뷰글 삭제 --> Delete(DELETE) */
    router.delete(`${url}/:review_no`, async (req, res, next) => {
        // 파라미터 받기
        const review_no = req.get('review_no');
        
        //유효성 검사
        try {
            regexHelper.value(review_no, '리뷰글 번호가 없습니다.');
            regexHelper.num(review_no, '리뷰글 번호가 잘못되었습니다_번호는 숫자만 가능');
        } catch (err) {
            return next(err);
        }

        try {
            await ReviewService.deleteItem({
                review_no: review_no
            });
        } catch (err) {
            return next(err);
        }

        res.sendResult();
    });

    return router;
};
export default ReviewController;