'use strict';

//insert into product (id, name, model, amount, price)
const toInsertArray=product=>[
    +product.productId, product.name, +product.model, 
    +product.amount, +product.price
];

//update product set name=?, model=?, amount=?, price=?",
// "where id=?"

const toUpdateArray = product => [
    product.name, +product.model, +product.amount,
    +product.price, +product.productId
];

module.exports={toInsertArray, toUpdateArray}