const error=document.getElementById('error')
const favoritesSection=document.getElementById('favorites')
const modalBody=document.querySelector('.modal-body')
const randomInitPhotos=document.querySelector('.photos')
const showRandom=document.querySelector('.showRandom')
showRandom.addEventListener('click',consultarPerritos)


const api= axios.create({
    baseURL:"https://api.thedogapi.com/v1",
    headers:{
        "X-API-KEY":"live_gVbQrZiQSrWD3NynLQiQxMExPvoS5TxiJ8Cvu5yK2kU5W1jxFJ60T1XQfCupsMSI"
    }
})

async function consultarPerritos(){
    const {data,status}= await api.get("/images/search?limit=8")
    let randomDogguies=`${data.map(doguie=>`
    <div class="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center mb-5">
        <div class="card h-100 w-75 justify-self-center">
            <img class="card-img-top" src="${doguie.url}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${doguie.breeds[0]?.name||"undefined"}</h5>
                <button onclick="saveFavourites('${doguie.id}')" class="heart btn btn-outline-secondary">Add to favorites💖</button>
                <button type="button" class=" info btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="showMore('${doguie.id}')">More info</button>
            </div>
        </div>
    </div>
    `).join("")}` 
    randomInitPhotos.innerHTML=randomDogguies
}


async function consultarFavoritos(){
    const {data,status}=await api.get('/favourites')
    if(status !=200){ 
        error.innerText="Hubo un error "+ status;
     } 
    let perrito=`${data.map(perro=>
        `
        <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <div class="cointainer container-fav ">
                <img src="${perro.image.url}" class="d-block w-100" alt="...">
            </div>
            
            <button class="btnSacarPerrito btn btn-outline-danger w-100" onclick="deleteFavourite('${perro.id}')">Remove from favorites</button>
            
        </div>
        `).slice(6).join("")}`;
      
    favoritesSection.innerHTML=perrito
}


async function saveFavourites(imageId){
    const {data,status}=await api.post('/favourites',
    {
        image_id:imageId
    })
    console.log("favourite saved")
    consultarFavoritos()
}

async function showMore(idPerrito){
    const {data,status}=await api.get(`/images/${idPerrito}`)
    let perritoInfo;
    if (data.breeds){
        perritoInfo=`
        <img alt="Foto perrito aleatoria" src="${data.url}"  class="rounded mx-auto d-block">
        <div class="cointainer">
            <h6>breed:<span>${data.breeds[0]?.name||undefined}</span></h6>
            <h6>height:<span>${`${data.breeds[0]?.height?.metric} cmts`||undefined}</span></h6>
            <h6>weight:<span>${`${data.breeds[0]?.weight?.metric} Pounds`||undefined}</span></h6>
            <h6>likes:<span>${`${data.breeds[0]?.bred_for}`||undefined}</span></h6>
            <h6>Temperament:<span>${`${data.breeds[0]?.temperament}`||undefined}</span></h6>
        </div>`
    }
    else{
        perritoInfo=`
        <img alt="Foto perrito aleatoria" src="${data.url}" width="280" class="mx-auto d-block">
        <h6>breed:<span>undefined</span></h6>            `
    }
    modalBody.innerHTML=perritoInfo
}


async function deleteFavourite(id){
    const {data,status}=await api.delete(`/favourites/${id}`)
    if (status!=200){
        console.error("Hubo un error "+ status);
    }
    else{
        console.warn("Doguie was removed from favorites")
        consultarFavoritos()
    }
}

const uploadDoguie =  async () => {
    const form = document.getElementById('doguieForm');
    //a esta instancia podemos enviarle un formulario
    const formData = new FormData(form)
    console.log(formData.get('file'))
    const {data,status}=await api.post('/images/upload',formData)
    if ( status  !== 201 ){
        spanError.innerText = "Hubo un error: " + status + " "  + data.message
    }else{
        console.log("Michi cargado correctamente");
        console.log({data});
        console.log(data.url);
        saveFavourites(data.id)
        consultarFavoritos()
    }
}

    
consultarPerritos()
consultarFavoritos()



