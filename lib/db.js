mysql =require('mysql');
connnection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '', 
database: 'material'
});

connnection.connect(function(error) {
if(!!error) {
console.log(error);
} else {
console.log('Database Connected Successfully..!!');
}
});

module.exports = connnection;
