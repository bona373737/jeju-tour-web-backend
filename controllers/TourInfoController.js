/**
 * @FileName : TourInfoController.js
 * @description : 관리자페이지의 여행지 정보 추가
 */

import express from 'express';
import formidable from 'formidable'
import regexHelper from '../helper/RegexHelper.js';
import { initMulter, checkUploadError, createThumbnail, createThumbnailMultiple } from '../helper/FileHelper.js';
import MultipartException from "../exceptions/MultipartException.js";
import dayjs from 'dayjs';
import multer from 'multer';

import placeService from '../services/PlaceService.js';
// import AccomService from '../services/AccomService.js'
// import FoodService from '../services/FoodService.js'

const TourInfoController =()=>{
    const url = "/tourinfo";
    const router = express.Router();
    const now = dayjs();

    /**관리자페이지_여행지정보 추가 */
    router.post(url,async(req, res, next) => {
        
        /*파일업로드(formidable모듈 사용)***************************/
        // try {
            
        //     const form = formidable({ multiples: false });
        //     console.dir(form.fields);        
        //     form.parse(req, (err, fields, files) => {
        //         if(err){
        //         next(err);
        //         return;
        //     }
        //     console.log('fields: ', fields);
        //     console.log('files: ', files);
        //     res.send({ success: true });
        //     });
        
        // } catch (error) {    
        // }


        /** 파일업로드(multer모듈 사용)********************************/
        //업로드 폴더 세분화
        const dirName={
            upload_dir : "tourinfo",
            thumb_dir: "tourinfo"
        }

        const upload = initMulter(dirName).fields([{name:'text',maxCount:1},{name:'image',maxCount:1}]);
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

            console.log(req.body);
            // 업로드된 파일의 경로, 생성된 썸네일 파일의 경로를 DB에 저장
            let json = null;
            const tourinfo = req.post("tourinfo")
            const title = req.post('title');
            const introduction = req.post("introduction");
            const sbst = req.post('sbst');
            const postcode = req.post("postcode");
            const address = req.post("address");
            const roadaddress = req.post("roadaddress");
            const phoneno = req.post("phoneno");
            const alltag = req.post("alltag");
            const tag = req.post("tag");
            const longitude = req.post("longitude");
            const latitude = req.post("latitude");
            const image = req.file.path;
            const thumbnail = req.file.thumbnail["480w"];

            try {
                json = await placeService.insertItem({
                    title: title,
                    introduction: introduction,
                    sbst : sbst,
                    postcode :postcode,
                    address : address,
                    roadaddress : roadaddress,
                    phoneno : phoneno,
                    alltag : alltag,
                    tag : tag,
                    longitude : longitude,
                    latitude :latitude,
                    reg_date : now.format("YYYY-MM-DD HH:mm:ss"),
                    edit_date : now.format("YYYY-MM-DD HH:mm:ss"),
                    image: image,
                    thumbnail : thumbnail
                });
            } catch (err) {
                return next(err);
            }
    
            console.log(json);
            // res.sendResult({item: json});

        });


    });//post요청 end

    return router;
};

export default TourInfoController;