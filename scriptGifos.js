
//GIFOS

var gifosTraidos = 0;
var verMas = document.getElementsByClassName("ver-mas")[0];
var contenidoVacio = document.getElementsByClassName("vacio")[0];

function checkearSiHayContenido() {
    if (cargarGifs().length == 0) {
        contenidoVacio.style.display = "flex"
        verMas.style.display = "none";
    } else {
        traerGifos();
    }
}

function traerGifos(urlImg) {

    async function getGifs() {
        var listaIds = cargarGifs();
        listaIds12 = listaIds.slice(gifosTraidos, gifosTraidos+12);
        gifosTraidos += 12;
        if(gifosTraidos >= listaIds.length) {
            verMas.style.display = "none";
        }
        let ids = listaIds12.join();
        let url = `https://api.giphy.com/v1/gifs?api_key=${apiKeyGIPHY}&ids=${ids}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getGifs();
    info.then(response =>{
        console.log("Respuesta imagenes gifos", response);

        var listaIds = [];

        for(idGifo in response.data) {
            let gifo = response.data[idGifo];
            let urlDelElemento = gifo.images.original.url;
            let idDelElemento = gifo.id;
            listaIds.push(idDelElemento);
            let username = gifo.username;
            let title = gifo.title;

            imagenes[idDelElemento] = {
                "username": username,
                "title": title,
                "url": urlDelElemento,
                "download": gifo.images.original.url,
            };

            insertarImagenListaGifos(urlDelElemento, idDelElemento);
        }

        var container = document.getElementsByClassName('container-favoritos')[0];
        var modal = document.getElementsByClassName('modalResultados')[0];
        modal.listaIds = listaIds;
        modal.posicion = 0;

        registrarBotonFav(container);
        registrarBotonFav(modal);
        registrarBotonExpandir(modal, container);

    }).catch(error => {
        console.log(error);
    });
}

function insertarImagenListaGifos(url, id) {
    let nuevoDiv = document.createElement("div");
    let nuevoHover = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);
    nuevoDiv.appendChild(nuevoHover);

    nuevoHover.classList.add("fondoHover");

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementsByClassName("container-favoritos")[0];
    currentDiv.appendChild(nuevoDiv);
    nuevoDiv.classList.add('img-favorito');

    let botonFav = document.createElement("div");
    let botonDesc = document.createElement("a");
    let botonExpan = document.createElement("div");

    nuevoHover.appendChild(botonFav);
    botonFav.classList.add("boton-favorito");
    botonFav.dataset['idImg'] = id;
    if(esFavorito(id)) {
        botonFav.classList.add('favoritos-active');
    }

    nuevoHover.appendChild(botonDesc);
    botonDesc.classList.add("boton-descarga");
    botonDesc.setAttribute("href", imagenes[id].download); 
    botonDesc.setAttribute("download", id + ".jpg");

    nuevoHover.appendChild(botonExpan);
    botonExpan.classList.add("boton-expandir");
    botonExpan.dataset['idImg'] = id;
    botonExpan.dataset['urlImg'] = url;
}

verMas.addEventListener('click', () => {
    traerGifos();
})

checkearSiHayContenido();

// SLIDER
getInfoImgSlider();

// MODAL 
initModal()