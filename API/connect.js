import mysql from "mysql";

const connectDB = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"mysqlpassword",
    database:"social_app"

})

export default connectDB;