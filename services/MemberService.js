/**
 * @Filename: MemberService.js
 * @Description: 회원가입,로그인,프로필수정 기능의 비즈니스로직 
 */
import mybatisMapper from 'mybatis-mapper';
import DBPool from '../helper/DBPool.js';
import RuntimeException from '../exceptions/RuntimeException.js';

class MemberService{

    constructor(){
        mybatisMapper.createMapper([
            './mappers/MemberMapper.xml'
        ]);
    }

    /** 회원가입 */
    async insertItem(params){
        let dbcon = null;
        let data =null;

        try {
            dbcon = await DBPool.getConnection();

            // 데이터 추가
            let sql = mybatisMapper.getStatement('MemberMapper','insertItem',params)
            let [{insertId, affectedRows}] = await dbcon.query(sql);

            if(affectedRows === 0){
                throw new RuntimeException('[회원등록] 저장된 데이터가 없습니다.')
            }

            // 추가된 데이터(신규등록한 회원정보)를 조회해서 반환한다.
            sql = mybatisMapper.getStatement('MemberMapper','selectItem',{member_no:insertId})
            let [result] = await dbcon.query(sql);

            if(result.length === 0){
                throw new RuntimeException('[회원등록] 저장된 데이터를 조회할 수 없습니다.')
            }

            data = result[0];

        } catch (error) {
            throw error;
        } finally {
            if(dbcon){dbcon.release()};
        }

        return data;
    }
    
    /** 회원 단일 데이터 조회 */
    async getItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("MemberMapper", "selectItem", params);
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('[회원조회] 조회된 데이터가 없습니다.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 로그인 정보와 일치하는 회원 조회 */
    async getLoginUser(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("MemberMapper", "loginUser", params);
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('[회원조회] 일치하는 회원 데이터가 없습니다.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data; 
    }
}
export default new MemberService;