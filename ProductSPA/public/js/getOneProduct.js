'use strict';

(function(){
    let resultarea;
    let messagearea;
    let productId;

    document.addEventListener('DOMContentLoaded',init);

    function init(){
        resultarea=document.getElementById('resultarea');
        productId=document.getElementById('productid');
        messagearea=document.getElementById('messagearea');
        document.getElementById('submit')
            .addEventListener('click', send);
    }

    async function send(){
        clearMessage();
        resultarea.innerHTML='';
        try{
            if (productId.value.trim().length>0){
                const data =
                    await fetch(`http://localhost:4000/api/products/${productId.value}`,
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
        catch(error){
            updateMessage(`Not found. ${error.message}`,'error')
        }
    };

    function updateMessage(message,type){
        messagearea.textContent=message;
        messagearea.setAttribute('class',type);
    }

    function clearMessage(){
        messagearea.textContent = '';
        messagearea.removeAttribute('class');
    }

    function updateProduct(result){
        if(result.length===0) return;
        const product=result[0];
        resultarea.innerHTML=`
        <p><span class="legend">Id</span> ${product.productId}</p>
        <p><span class="legend">Name</span> ${product.name}</p>
        <p><span class="legend">Model</span> ${product.model}</p>
        <p><span class="legend">Amount</span> ${product.amount}</p>
        <p><span class="legend">Price</span> ${product.price}</p>
        `
    }


})();