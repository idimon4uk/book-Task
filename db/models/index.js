const connection = require('../index')

class Model {
    constructor(tableName) {
        this.TABLE_NAME = tableName;
    }
    find(condition, callback) {
        let noCondition = false;
        let conditionString = '';
        let joinString = '';
        let limitString = '';
        let orderByString = '';
        let { where, attributes, include, limit, sort , sortDESC} = condition;

        if (include && include.length) {
            include.forEach((element, index) => {
                joinString += `RIGHT JOIN ${element.model} ON ${this.TABLE_NAME}.${element.field}=${element.model}.${element.key} `
            })
        }

        if (limit && (limit.length >= 2)) {
            limitString += `LIMIT ${limit[0]},${limit[1]}`;
        }

        if (sort) {
            orderByString = `ORDER BY ${sort}`;
        }
        if(sortDESC){
            orderByString = `ORDER BY ${sortDESC} DESC`;
        }

        if (!where) {
            noCondition = true;
        }
        else {

            let keys = Object.keys(where);
            if (!keys.length) {
                noCondition = true;
            }
            else {
                keys.forEach((key, index) => {
                    conditionString += `${this.TABLE_NAME}.${key}='${where[key]}'`
                    if (index < keys.length - 1) {
                        conditionString += ' AND ';
                    }
                })
            }

        }
        connection.query(`SELECT ${(attributes && attributes.length) ? attributes.reduce((a, b) => a + "," + b) : `*`} FROM ${this.TABLE_NAME} ${joinString} ${noCondition ? `` : `WHERE ${conditionString}`} ${orderByString} ${limitString};`, (error, results, fields) => {
            callback(error, results ? results.map(x => { return { ...x } }) : [], fields)
        })

    }
    insert(obj, callback) {
        let fieldsString = '(';
        let valuesString = '(';
        let keys = Object.keys(obj);
        keys.forEach((key, index) => {
            fieldsString += key;
            valuesString += `'${obj[key]}'`;
            if (index < keys.length - 1) {
                fieldsString += ', ';
                valuesString += ', ';
            }
        })
        fieldsString += ')';
        valuesString += ')';
        connection.query(`INSERT INTO ${this.TABLE_NAME} ${fieldsString} VALUES ${valuesString};`, (error, results, fields) => {
            callback(error, results, fields)
        })
    }
    update(condition, obj, callback) {
        let { where } = condition;
        let conditionString = '';
        let keys = Object.keys(where);
        keys.forEach((key, index) => {
            conditionString += `${key}='${where[key]}'`
            if (index < keys.length - 1) {
                conditionString += ' AND ';
            }
        })

        let setString = '';
        keys = Object.keys(obj);
        keys.forEach((key, index) => {
            setString += `${key}='${obj[key]}'`;
            if (index < keys.length - 1) {
                setString += ', ';
            }
        })

        connection.query(`UPDATE ${this.TABLE_NAME} SET ${setString} WHERE ${conditionString};`, (error, results, fields) => {
            callback(error, results, fields)
        })

    }
    delete(condition, callback) {
        let { where } = condition;
        let conditionString = '';
        let keys = Object.keys(where);
        keys.forEach((key, index) => {
            conditionString += `${key}='${where[key]}'`
            if (index < keys.length - 1) {
                conditionString += ' AND ';
            }
        })
        connection.query(`DELETE FROM ${this.TABLE_NAME} WHERE ${conditionString}`, (error, results, fields) => {
            callback(error, results, fields)
        })
    }
}

module.exports = Model;