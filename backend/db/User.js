const express = require("express");
const app = express();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jobportal",
  password: "harshil",
  port: 5432,
});