import mybatisMapper from 'mybatis-mapper';
import DBPool from '../helper/DBPool.js';
import RuntimeException from '../exceptions/RuntimeException.js';

class FoodService{

    constructor(){
        mybatisMapper.createMapper([
            './mappers/FoodMapper.xml'
        ])
    }

    async selectItem(params){
        let dbcon = null;
        let data = null;

        // console.log(params)

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('FoodMapper','selectItem',params)
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('조회된 데이터가 없습니다.')
            }
            data=result;
        } catch (error) {
            throw error;
        }finally{
            if(dbcon){dbcon.release()};
        }

        return data;
    };

    async selectList(params){
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('FoodMapper','selectList',params)
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('조회된 데이터가 없습니다.')
            }
            data=result;
        } catch (error) {
            throw error;
        } finally {
            if(dbcon){dbcon.release()};
        }

        return data;
    };

    async selectCountAll(params){
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement('FoodMapper', 'selectCountAll', params);
            let [result] = await dbcon.query(sql);

            if (result.length > 0) {
                cnt = result[0].cnt;
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }

        return cnt;
    }

    async insertItem(params){
        let dbcon = null;
        let data =null;

        try {
            dbcon = await DBPool.getConnection();

            //데이터 추가
            let sql = mybatisMapper.getStatement('FoodMapper','insertItem',params)
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if(affectedRows === 0){
                throw new RuntimeException('[여행지 정보추가] 저장된 데이터가 없습니다.')
            }

            //추가된 데이터(신규등록한 회원정보) 조회_비밀번호를 제외한 데이터를 반환한다.
            sql = mybatisMapper.getStatement('FoodMapper','selectItem',{place_no:insertId})
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('[여행지 정보추가] 저장된 데이터를 조회할 수 없습니다.')
            }

            data = result[0];

        } catch (error) {
            throw error;
        }finally{
            if(dbcon){dbcon.release()};
        }

        return data;
    }
}

export default new FoodService;