import mybatisMapper from 'mybatis-mapper';
import DBPool from '../helper/DBPool.js';
import RuntimeException from '../exceptions/RuntimeException.js';

class PlaceService{

    constructor(){
        mybatisMapper.createMapper([
            './mappers/PlaceMapper.xml'
        ])
    }

    async selectItem(params){
        let dbcon = null;
        let data = null;

        // console.log(params)

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement('PlaceMapper','selectItem',params)
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
            let sql = mybatisMapper.getStatement('PlaceMapper','selectList',params)
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

            let sql = mybatisMapper.getStatement('PlaceMapper', 'selectCountAll', params);
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
}

export default new PlaceService;