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

    /** 회원 가입 */
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
    
    /** 회원 전체 데이터 조회 */
    async selectList() {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("MemberMapper", "selectList");
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('[회원조회] 조회된 데이터가 없습니다.');
            }

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 회원 단일 데이터 조회 */
    async selectItem(params) {
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

    /** 회원정보 수정(프로필이미지 등록, 변경) */
    async updateProfile(params){
        let dbcon = null;
        let data =null;

        try {
            dbcon = await DBPool.getConnection();

            //데이터 추가
            let sql = mybatisMapper.getStatement('MemberMapper','updateProfile',params)
            let [{affectedRows}] = await dbcon.query(sql);

            if(affectedRows === 0){
                throw new RuntimeException('[회원정보수정] 저장된 데이터가 없습니다.')
            }

            //수정된 데이터 조회
            sql = mybatisMapper.getStatement('MemberMapper','selectItem',{member_no:params.member_no})
            let [result] = await dbcon.query(sql);

            //수정된 데이터를 세션에 저장

            if(result.length === 0){
                throw new RuntimeException('[회원정보수정] 저장된 데이터를 조회할 수 없습니다.')
            }

            data = result[0];

        } catch (error) {
            throw error;
        }finally{
            if(dbcon){dbcon.release()};
        }

        return data;
    }

    /** 아이디가 일치하는 회원 조회 */
    async selectUserid(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("MemberMapper", "selectUserid", params);
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('아이디가 일치하지 않습니다. 다시 확인해주세요.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data; 
    }

    /**
     * 중복아이디 검사기능
     * @param {string} params : 사용자입력값 userid
     * @returns : 중복아이디있는 경우-> 에러객체반환_data.rtmsg:"사용중인 아이디 입니다."
     *            중복아이디없는 경우-> data.rtmsg:"사용가능한 아이디 입니다"
     */
    async isMember(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("MemberMapper", "selectUserid", params);
            let [result] = await dbcon.query(sql);
            
            //result 값이 존재하는 경우 -> 중복된 아이디가 있음
            if (result.length !== 0) {
                throw new RuntimeException('사용중인 아이디 입니다.');
            }

            //result 값이 존재하지 않는 경우 -> 중복된 아이디가 없음
            if (result.length === 0) {
                return;
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data; 
    }    
}
export default new MemberService;