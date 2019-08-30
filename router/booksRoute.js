const convert = require('koa-convert');
const Router = require('koa-router')
const KoaBody = require('koa-body');
const Books = require('../db/models/Books');
const Authors = require('../db/models/Authors')
const fs = require('fs');
let temp_dir = process.cwd() + '/uploads/';
const router = new Router(),
    koaBody = convert(KoaBody);

if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir);
}

var insertBook = (data, authorId, callback) => {

    let { image, title, description } = data;
    var parts = image.split('data:image/')[1].split(';base64,');
    var format = parts[0];
    var base64Picture = parts[1];
    var name = new Date().getTime() + '.' + format;
    fs.writeFile(temp_dir + name, base64Picture, 'base64', async (err) => {
        if (err) {
            callback(err, null)
        }
        else {
            Books.insert({
                authorId,
                imagePath: temp_dir + name,
                title,
                description
            }, (error, result, fields) => {
                callback(error, result)
            })
        }
    });


}

router
    .get('/', async (ctx) => {
        return new Promise((resolve,reject)=>{
            let {limit,sort,attributes,sortDESC} = ctx.query;
            let query = {};
            if(limit){
                query['limit']=limit.split(',');
            }
            if(attributes){
                query.attributes = attributes.split(',');
            }
            if(sort){
                query.sort=sort;
            }
            if(sortDESC){
                query.sortDESC=sortDESC;
            }
            Books.find({
                ...query,
                include: [{
                    model: 'Authors',
                    key: 'id',
                    field: 'authorId'
                }]
            }, (err, result, field) => {
              ctx.body=result;
              resolve();
            })
        })
        
    }).get('/:id', async (ctx, next) => {
        return new Promise((resolve,reject)=>{
            let { id } = ctx.params;
            Books.find({
                where: { id }, 
                include: [{
                    model: 'Authors',
                    key: 'id',
                    field: 'authorId'
                }]
            }, (err, result, field) => {
                ctx.body = result;
                resolve();
            })
        })
        
    }).post('/add', async (ctx, next) => {
        return new Promise((resolve,reject)=>{
            let { author: { firstName, lastName }, title, description, image } = ctx.request.body;
            Authors.find({ where: { firstName, lastName } }, (err, authors, fields) => {
                if (err) {
                    ctx.body={...err};
                    resolve();
                }
                else if (authors.length) {
                    insertBook(ctx.request.body, authors[0].id, (error, result) => {
                        if (error) {
                            ctx.body={...error};
                            resolve();
                        }
                        else {
                            ctx.body={...result};
                            resolve();
                        }
                    })
                }
                else {
                    Authors.insert({
                        firstName,
                        lastName
                    }, (error, result, fields) => {
                        insertBook(ctx.request.body, result.insertId, (err, result) => {
                            if (err) {
                                ctx.body={...err};
                                resolve();
                            }
                            else {
                                ctx.body={...result};
                                resolve();
                            }
                        })
                    })
                }
            })
        })
    }).delete('/:id',async(ctx)=>{
        return new Promise((resolve,reject)=>{
            let {id} = ctx.params;
            Books.delete({where:{id}},(err,result)=>{
                ctx.body=result;
                resolve();
            })
        })
    })

module.exports = router;