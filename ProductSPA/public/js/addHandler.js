'use strict';

(function(){

    let idField;
    let nameField;
    let modelField;
    let amountField;
    let priceField;
    let messagearea;

    document.addEventListener('DOMContentLoaded', init);

    function init(){
        idField=document.getElementById('id');
        nameField=document.getElementById('name');
        modelField=document.getElementById('model');
        amountField=document.getElementById('amount');
        priceField=document.getElementById('price');
        messagearea=document.getElementById('messagearea');

        document.getElementById('submit').addEventListener('click', send);
    }

    async function send(){
        clearMessage();
        const product={
            productId: +idField.value,
            name: nameField.value,
            model: +modelField.value,
            amount: +amountField.value,
            price: +priceField.value
        }

        try{
            const options={
                method:'POST',
                body:JSON.stringify(product),
                headers:{
                    'Content-Type':'application/json'
                },
                mode:'cors'
            }

            const data = await fetch('http://localhost:4000/api/products',options);
            const status = await data.json();

            if(status.message){
               updateMessage(status.message, status.type);
            }

        }
        catch(error){
            updateMessage(error.message,'error');
        }
    }

    function updateMessage(message, type) {
        messagearea.textContent = message;
        messagearea.setAttribute('class', type);
    }

    function clearMessage() {
        messagearea.textContent = '';
        messagearea.removeAttribute('class');
    }

})();