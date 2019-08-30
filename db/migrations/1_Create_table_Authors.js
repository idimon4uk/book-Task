const connection = require('../index');
module.exports = {
    up:()=>{
        connection.beginTransaction((err)=>{
            if(err){throw(err);}
            connection.query(`CREATE TABLE IF NOT EXISTS Authors (
                id INT AUTO_INCREMENT,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )  ENGINE=INNODB;`, (error, results, fields)=>{
                if(error){
                    return connection.rollback(()=>{
                        throw(error);
                    })
                }
            })
        connection.query(`INSERT INTO Migrations (name) VALUES ('1_Create_table_Authors')`,(error, results, fields)=>{
            if(error){
                return connection.rollback(()=>{
                    throw(error);
                })
            }
        })

        connection.commit(function(err) {
            if (err) {
              return connection.rollback(function() {
                throw err;
              });
            }
            console.log('success!');
          });
        connection.end();
        })
        
    },
    down:()=>{
        connection.beginTransaction((err)=>{
            if(err){throw(err);}
            connection.query(`DROP TABLE Authors`, (error, results, fields)=>{
                if(error){
                    return connection.rollback(()=>{
                        throw(error);
                    })
                }
            })
        connection.query(`DELETE FROM Migrations WHERE name='1_Create_table_Authors'`,(error, results, fields)=>{
            if(error){
                return connection.rollback(()=>{
                    throw(error);
                })
            }
        })
        connection.commit(function(err) {
            if (err) {
              return connection.rollback(function() {
                throw err;
              });
            }
            console.log('success!');
          });
        connection.end();
        })
    }
}
