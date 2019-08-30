const connection = require('../index');
module.exports = {
    up:()=>{
        connection.beginTransaction((err)=>{
            if(err){throw(err);}
            connection.query(`CREATE TABLE IF NOT EXISTS Books (
                id INT AUTO_INCREMENT,
                authorId INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                imagePath VARCHAR(255),
                PRIMARY KEY (id),
                FOREIGN KEY (authorId) REFERENCES Authors(id)
            )  ENGINE=INNODB;`, (error, results, fields)=>{
                if(error){
                    return connection.rollback(()=>{
                        throw(error);
                    })
                }
            })
        connection.query(`INSERT INTO Migrations (name) VALUES ('2_Create_table_Books')`,(error, results, fields)=>{
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
            connection.query(`DROP TABLE Books`, (error, results, fields)=>{
                if(error){
                    return connection.rollback(()=>{
                        throw(error);
                    })
                }
            })
        connection.query(`DELETE FROM Migrations WHERE name='2_Create_table_Books'`,(error, results, fields)=>{
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
