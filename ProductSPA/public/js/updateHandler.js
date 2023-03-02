'use strict';

(function(){
    let idField;
    let nameField;
    let modelField;
    let amountField;
    let priceField;
    let messagearea;
    let searchState=true;

    document.addEventListener('DOMContentLoaded', init);

    function init(){
        idField = document.getElementById('id');
        nameField = document.getElementById('name');
        modelField = document.getElementById('model');
        amountField = document.getElementById('amount');
        priceField = document.getElementById('price');
        messagearea = document.getElementById('messagearea');


        updateFields();

        document.getElementById('submit')
            .addEventListener('click',send);
        
        idField.addEventListener('focus', clearAll);
    }

    function updateMessage(message, type) {
        messagearea.textContent = message;
        messagearea.setAttribute('class', type);
    }

    function clearMessage() {
        messagearea.textContent = '';
        messagearea.removeAttribute('class');
    }

    function clearAll(){
        if(searchState){
            clearFieldValues();
            clearMessage();
        }
    }

    function updateFields(){
        if(searchState){
            idField.removeAttribute('readonly');
            nameField.setAttribute('readonly',true);
            modelField.setAttribute('readonly',true);
            amountField.setAttribute('readonly',true);
            priceField.setAttribute('readonly',true);
        }
        else{
            idField.setAttribute('readonly',true);
            nameField.removeAttribute('readonly');
            modelField.removeAttribute('readonly');
            amountField.removeAttribute('readonly');
            priceField.removeAttribute('readonly');
        }
    } 

    function clearFieldValues(){
        idField.value='';
        nameField.value='';
        modelField.value='';
        amountField.value='';
        priceField.value='';
        searchState=true;
        updateFields();
    } //end of clearFieldValues

    function updateProduct(result){
        if (result.length === 0) return;
        console.log(result)
        const product = result[0];
        idField.value = product.productId;
        nameField.value = product.name;
        modelField.value = product.model;
        amountField.value = product.amount;
        priceField.value = product.price;
        searchState = false;
        updateFields();
    }

    async function send(){
        try{
            if(searchState){ //get product
                if (idField.value.trim().length > 0) {
                    const data =
                        await fetch(`http://localhost:4000/api/products/${idField.value}`,
                            { mode: 'cors' });
                    const result = await data.json();
                    if (result) {
                        if (result.message) {
                            updateMessage(result.message, result.type);
                        }
                        else {
                            updateProduct(result);
                        }
                    }
                }
            }
            else{ //put product
                const product={
                    productId:idField.value,
                    name:nameField.value,
                    model:modelField.value,
                    amount:amountField.value,
                    price:priceField.value
                };
console.log("product",product)
                const options={
                    method:'PUT',
                    body:JSON.stringify(product),
                    headers:{
                        'Content-Type':'application/json'
                    },
                    mode:'cors'
                }

                const data = 
                    await fetch(`http://localhost:4000/api/products/${product.productId}`,
                                options);

                const status=await data.json();

                if (status.message) {
                    updateMessage(status.message, status.type);
                }

                searchState=true;
                updateFields();
            }

        }
        catch(err){
            updateMessage(err.message,'error');
        }
    }

})();