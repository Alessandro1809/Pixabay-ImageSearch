const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina= 50;
let totalPaginas;
let iterador;
let paginaActual=1;
window.onload =()=>{
    formulario.addEventListener('submit', validarFormulario);


    function validarFormulario(e){

        e.preventDefault();
        
        const terminoBusqueda = document.querySelector('#termino').value;

        if (terminoBusqueda==='') {
            MuestraAlerta('Agrega un termino de busqueda');

        }

        buscarImagenes();



    }




};


function buscarImagenes(){
    const terminoBusqueda = document.querySelector('#termino').value;
    const key ='33823194-40ac783f7882db36641e3f7ca';
    const url =`https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    
    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado=>{
        totalPaginas =calcularPaginas(resultado.totalHits);
        MuestraImagenes(resultado.hits);
         
        
    });

}

//Generador que va a registrar la cantidad de elementos segun el numero de paginas
function *crearPaginador(total){
    
    for (let i = 1; i <= total; i++) {
            yield i;
    }
   
}


function calcularPaginas(total){
return parseInt(Math.ceil(total/registrosPorPagina));
}
function MuestraImagenes(imagenes){
    limpiarHTML();
    //para evitar problemas de seguridad a la hora de usar target blank en links se usa rel="noopener noreferrer" para evitar problemas
//iterar sobre el arreglo de imagenes y construir el html 
imagenes.forEach(imagen => {
    const {previewURL,likes,views,largeImageURL}=imagen

    resultado.innerHTML+=`
    <div class="w=1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white">
            <img class="w-full" src="${previewURL}"/>

            <div class="p-4">
                <p class="font-bold"><span class="font-light">Me gusta:</span>${likes}</p>
                <p class="font-bold"><span class="font-light">Vistas:</span>${views}</p>  
                <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white upercase font-bold rounded text-center mt-5 p-1" 
                href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                Ver imagen</a>
            </div>
        </div>
    </div>
    `;

    //limpiar el paginador previo
    limpiarPaginacion();
    //imprimir html 
    imprimirPaginador();

});

}
function limpiarPaginacion(){
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
}

function imprimirPaginador(){
    iterador= crearPaginador(totalPaginas);

    while(true){
        const {value, done}= iterador.next();
        if(done) return;
        
            //genera un boton por cada elemento en el generador 

        const boton= document.createElement('A');
        boton.href='#';
        boton.dataset.pagina=value;
        boton.textContent=value;
        boton.classList.add('siguiente','align-center','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-2','rounded');

        boton.onclick=()=>{
            paginaActual= value;
            buscarImagenes();

        }

        paginacionDiv.appendChild(boton);
        
        
        
    }

}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function MuestraAlerta(mensaje){

    const siExisteAlerta =document.querySelector('.bg-red-100');
     if (!siExisteAlerta) {
        const alerta =document.createElement('P');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
        alerta.innerHTML= `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
   
    formulario.appendChild(alerta);
setTimeout(() => {
    alerta.remove();
}, 3000);
     }

        
    
}