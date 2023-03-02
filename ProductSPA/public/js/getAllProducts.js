'use strict';

(function(){

    document.addEventListener('DOMContentLoaded',init);

    async function init(){
        try{
            const data = 
                await fetch('http://localhost:4000/api/products',{mode:'cors'});
            const products=await data.json();

            const resultset=document.getElementById('resultset');
            for(const product of products){
                const tr=document.createElement('tr');
                tr.appendChild(createCell(product.productId));
                tr.appendChild(createCell(product.name));
                tr.appendChild(createCell(product.model));
                tr.appendChild(createCell(product.amount));
                tr.appendChild(createCell(product.price));
                resultset.appendChild(tr);
            }
        }
        catch(error){
            document.getElementById('messagearea').innerHTML=`
            <p class="error">${error.message}</p>`;
        }
    } //end of init

    function createCell(data){
        const td=document.createElement('td');
        td.textContent=data;
        return td;
    }

})();