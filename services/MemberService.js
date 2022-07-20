import mybatisMapper from 'mybatis-mapper';
import DBPool from '../helper/DBPool.js';
import RuntimeException from '../exceptions/RuntimeException.js';

class MemberService{

    constructor(){
        mybatisMapper.createMapper([
            './mappers/MemberMapper.xml'
        ]);
    }



    //회원가입
    async insertItem(params){
        let dbcon = null;
        let data =null;

        try {
            dbcon = await DBPool.getConnection();

            //데이터 추가
            let sql = mybatisMapper.getStatement('MemberMapper','insertItem',params)
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if(affectedRows === 0){
                throw new RuntimeException('[회원등록]저장된 데이터가 없습니다.')
            }

            //추가된 데이터 조회
            sql = mybatisMapper.getStatement('MemberMapper','selectItem',{member_no:insertId})
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('[회원등록]저장된 데이터를 조회할 수 없습니다.')
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
export default new MemberService;