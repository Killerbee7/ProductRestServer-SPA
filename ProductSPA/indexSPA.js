'use strict';

const path = require('path');

const express=require('express');
const app=express();

const {port,host}=require('./config.json');

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'menu.html')));

app.listen(port,host,()=>console.log(`${host}:${port} serving...`));