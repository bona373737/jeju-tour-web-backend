import mybatisMapper from 'mybatis-mapper';
import DBPool from '../helper/DBPool.js';
import RuntimeException from '../exceptions/RuntimeException.js';

class ReviewService{

    constructor(){
        mybatisMapper.createMapper([
            './mappers/ReviewMapper.xml',
            './mappers/PlaceMapper.xml',
            './mappers/AccomMapper.xml',
            './mappers/FoodMapper.xml'
        ])
    }

    async selectList(params){
        let dbcon = null;
        let data = [];

        try {
            //특정 memberno의 like데이터 조회
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('ReviewMapper','selectList',params)
            let [result] = await dbcon.query(sql);

            //특정 memberno의 내저장한 데이터가 없는 경우
            if(result.length === 0){
                throw new RuntimeException('조회된 데이터가 없습니다.')
            }

            // 조회된 like데이터를 활용하여 places,accoms,foods 데이터 조회하기
            // for(const v of result){
            //     let mapperName = null;
            //     let type = null;

            //     switch (v.ref_type) {
            //         case "P":
            //             mapperName = "PlaceMapper";
            //             type = 'place_no';

            //             break;
            //         case "A":
            //             mapperName = "AccomMapper";
            //             type = 'accom_no';
            //         break;
            //         case "F":
            //             mapperName = "FoodMapper";
            //             type = 'food_no';
            //             break;
            //         default:
            //             break;
            //         }
            //                                                                 //객체의 key를 동적할당할때 표기법
            //     let tourSql = mybatisMapper.getStatement(mapperName,'selectItem',{ [type] : Number(v.ref_id)});
            //     let [tourResult] = await dbcon.query(tourSql);
            //     data.push(tourResult[0])
            // }
            data=result;
        } catch (error) {
            throw error;
        } finally {
            if(dbcon){dbcon.release()};
        }
        return data;
    };


    async selectCount(params){
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('ReviewMapper','selectCount',params)
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('조회된 데이터가 없습니다.')
            }
            cnt=result[0].cnt;
        } catch (error) {
            throw error;
        } finally {
            if(dbcon){dbcon.release()};
        }

        return cnt;
    };

    async insertItem(params){
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            //Likes 테이블에 데이터 추가
            let sql = mybatisMapper.getStatement('ReviewMapper','insertItem',params)
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if(affectedRows === 0){
                throw new RuntimeException('저장된 데이터가 없습니다.')
            }

            //Likes 테이블에 추가된 데이터 조회
            sql = mybatisMapper.getStatement('ReviewMapper','selectItem',{review_no:insertId})
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('저장된 데이터를 조회할 수 없습니다.')
            }

            data = result;
        } catch (error) {
            throw error;
        }finally{
            if(dbcon){dbcon.release()};
        }

        return data;
    }

    async deleteItem(params){
        let dbcon = null;
        //likes데이터와 참조관계인 memberno에 대한 처리는???
        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('ReviewMapper','deleteItem',params)
            let [{affectedRows}] = await dbcon.query(sql);
            console.log('삭제된 likes데이터 개수 :'+ affectedRows);

            // sql = mybatisMapper.getStatement('ProfessorMapper', 'deleteItem',params);
            // [{affectedRows}] = await dbcon.query(sql);
            // console.log('삭제된 professor데이터 개수 :'+ affectedRows);

            if(affectedRows === 0){
                throw new RuntimeException('삭제된 데이터가 없습니다.')
            }
        
        } catch (error) {
            return error;
        } finally{
            if(dbcon){dbcon.release};
        }

    }//

    
}

export default new ReviewService;