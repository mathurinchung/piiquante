const dotenv = require('dotenv')

const env = process.env.NODE_ENV || 'development';
const path = ".env." + env;

dotenv.config({ path });
console.log("Node environment:", env);
