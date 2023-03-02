'use strict';

(function(){
    let method='GET';
    let urifield;
    let jsonarea;
    let messagearea;

    document.addEventListener('DOMContentLoaded', init);

    function init(){
        urifield = document.getElementById('urifield');
        jsonarea = document.getElementById('jsonarea');
        messagearea = document.getElementById('messagearea');

        document.getElementById('submit').addEventListener('click', send);
        document.getElementById('methods').addEventListener('change', choose);

        clearSelections();
        urifield.value='http://localhost:4000/api/';
    }

    function clearSelections(){
        messagearea.textContent='';
        method='GET';
        document.getElementById('get').checked=true;
    }

    function choose(e){
        messagearea.textContent='';
        method=e.target.value;
    }

    async function send(){
        const options={
            method:method,
            mode:'cors'   
        };

        if(method==='PUT' || method==='POST'){
            options.body = jsonarea.value;
            options.headers={ 'Content-Type': 'application/json' }
        }

        try{
            const result = await fetch(urifield.value,options);
            const data = await result.json();

            showMessage(data);
        }
        catch(error){
            showMessage({type:'error',message:error.message});
        }
    }

    function showMessage(data){
        messagearea.textContent=JSON.stringify(data,null,4);
    }


})()