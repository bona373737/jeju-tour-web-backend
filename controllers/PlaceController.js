import express from 'express';
import { Cookie } from 'express-session';
import regexHelper from '../helper/RegexHelper.js';
import {pagenation} from '../helper/UtilHelper.js';
import placeService from '../services/PlaceService.js';

const PlaceController =()=>{
    const url = "/place";
    const router = express.Router();

    router.get(url, async(req,res,next)=>{
                console.log(req.sessionID)
               const query = req.get('query');
               const page = req.get('page', 1);
               const rows = req.get('rows', 10);
       
               const params = {};
               if (query) {
            
               }
       
               let json = null;
               let pageInfo = null;
       
               try {
                   const totalCount = await placeService.selectCountAll(params);
                   pageInfo = pagenation(totalCount, page, rows);
                   
                   params.offset = pageInfo.offset;
                   params.listCount = pageInfo.listCount;
                   json = await placeService.selectList(params);
               } catch (err) {
                   return next(err);
               }
       
               res.sendResult({pagenation: pageInfo, item: json});
    });
    
    router.get(`${url}/:placeno`, async(req,res,next)=>{
        
        console.log('컨트롤러 ')
        const placeno = req.get('placeno');
        console.log(placeno)

        try{
            regexHelper.value(placeno, '관광지번호가 없습니다.');
            regexHelper.num(placeno, '관광지 번호는 숫자입니다.');
        }catch(err){
            return next(err);
        }

        let json = null;

        try{
            json = await placeService.selectItem({
                placeno: placeno
            })
        }catch(err){
            return next(err);
        }
        res.sendResult({item:json});
    });

    return router;

};

export default PlaceController;