/**
 * @Filename: FAQService.js
 * @Author: 구나래 (nrggrnngg@gmail.com)
 * @Description: FAQ 비즈니스 로직에 대한 구현체
 */
import mybatisMapper from "mybatis-mapper";
import DBPool from "../helper/DBPool.js";
import RuntimeException from "../exceptions/RuntimeException.js";

class FAQService {
    /** 생성자 - Mapper파일을 로드 */
    constructor() {
        mybatisMapper.createMapper([
            "./mappers/FAQMapper.xml",
        ]);
    }

    /** 목록 데이터를 조회 */
    async getList(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "selectList", params);
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException('조회된 데이터가 없습니다.');
            }

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 단일 데이터를 조회 */
    async getItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "selectItem", params);
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('조회된 데이터가 없습니다.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 데이터 생성 및 결과 조회 */
    async addItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "insertItem", params);
            let [{insertId, affectedRows}] = await dbcon.query(sql);
            
            if (affectedRows === 0) {
                throw new RuntimeException('저장된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement("FAQMapper", "selectItem", {faq_no: insertId});
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('저장된 데이터를 조회할 수 없습니다.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 데이터 수정 및 결과 조회 */
    async editItem(params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "updateItem", params);
            let [{affectedRows}] = await dbcon.query(sql);
            
            if (affectedRows === 0) {
                throw new RuntimeException('저장된 데이터가 없습니다.');
            }

            // 수정된 데이터의 PK값을 활용하여 다시 조회
            sql = mybatisMapper.getStatement("FAQMapper", "selectItem", {faq_no: params.faq_no});
            let [result] = await dbcon.query(sql);
            
            if (result.length === 0) {
                throw new RuntimeException('저장된 데이터를 조회할 수 없습니다.');
            }

            data = result[0];
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
        return data;
    }

    /** 데이터 삭제 */
    async deleteItem(params) {
        let dbcon = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "deleteItem", params);
            let [{affectedRows}] = await dbcon.query(sql);
            
            if (affectedRows === 0) {
                throw new RuntimeException('삭제된 데이터가 없습니다.');
            }

        } catch (err) {
            throw err;
        } finally {
            if (dbcon) { dbcon.release(); }
        }
    }

    /** 전체 데이터 개수 조회 */
    async getCount(params) {
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("FAQMapper", "selectCountAll", params);
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
export default new FAQService();