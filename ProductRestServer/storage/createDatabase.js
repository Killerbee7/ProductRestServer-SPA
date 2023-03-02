'use strict';

const Database = require('./database');

const printMessage = message =>console.log(message);
const printStatement = statement =>printMessage(`${statement};`);
const printError = message => 
    printMessage(`${'#'.repeat(20)} Error ${'#'.repeat(20)}\n`+
    `${message}\n${'#'.repeat(47)}`);

let createStatementFile='./Dahal_Dibya_product_createStatement.json';
let adminPass = '';

if(process.argv.length>2){
    adminPass=process.argv[2];
    if(process.argv.length>3){
        createStatementFile=`./${process.argv[3]}`;
    }
}

console.log(createStatementFile, adminPass);
try{
    createDb(require(createStatementFile),adminPass);
}
catch(error){
    printError(error.message);
}

async function createDb(createStatements, adminPass){
    const options={
        host:createStatements.host,
        port:createStatements.port,
        user:createStatements.admin,
        password:adminPass,
        allowPublicKeyRetrieval: createStatements.allowPublicKeyRetrieval,
    };
    const DEBUG=createStatements.debug;
    const db=new Database(options);

    //'jane'@'localhost'
    const user=`'${createStatements.user}'@'${createStatements.host}'`;
    const dropDatabaseSql=`drop database if exists ${createStatements.database}`;
    const createDatabaseSql = `create database ${createStatements.database}`;
    const dropUserSql=`drop user if exists ${user}`;
    const createUserSql=`create user if not exists ${user} `+
                    `identified by '${createStatements.userpassword}'`;
    const grantPrivilegesSql=
        `grant all privileges on ${createStatements.database}.* to ${user}`;

    try{
        await db.doQuery(dropDatabaseSql);
        if(DEBUG) printStatement(dropDatabaseSql);
        await db.doQuery(createDatabaseSql);
        if(DEBUG) printStatement(createDatabaseSql);
        if(createStatements.dropUser){
            await db.doQuery(dropUserSql);
            if(DEBUG) printStatement(dropUserSql);
        }
        await db.doQuery(createUserSql);
        if(DEBUG) printStatement(createUserSql);
        await db.doQuery(grantPrivilegesSql);
        if(DEBUG) printStatement(grantPrivilegesSql);

        for(let table of createStatements.tables){
            if(table.columns && table.columns.length>0){
                const createTableSql=
                `create table ${createStatements.database}.${table.tableName} (`+
                `\n\t${table.columns.join(',\n\t')}`+
                `\n)`;
                await db.doQuery(createTableSql);
                if(DEBUG) printStatement(createTableSql);

                if(table.data && table.data.length>0){
                    const rows=[];
                    for(const data of table.data){
                      const insertRowSql=
                        `insert into ${createStatements.database}.${table.tableName} `+
                        `values(${Array(data.length).fill('?').join(', ')})`;
                      rows.push(db.doQuery(insertRowSql,data));
                    }
                    await Promise.all(rows);
                    if(DEBUG) printMessage('data added');
                }
                else{
                    if(DEBUG) printMessage('data missing');
                }
            }
            else{
                if(DEBUG) printMessage('Table columns missing. Table was not created.');
            }
        }


    }
    catch(error){
        printError(error);
    }

}