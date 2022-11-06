const apiKey="live_gVbQrZiQSrWD3NynLQiQxMExPvoS5TxiJ8Cvu5yK2kU5W1jxFJ60T1XQfCupsMSI"
const baseUrl=`https://api.thedogapi.com/v1/images/search?limit=8&api_key=${apiKey}`
const favouritesUrl=`https://api.thedogapi.com/v1/favourites?&api_key=${apiKey}`
const DeleteFavUrl=(id)=>`https://api.thedogapi.com/v1/favourites/${id}?&api_key=${apiKey}`
const error=document.getElementById('error')
const image=document.getElementById('imgGatito')
const image2=document.getElementById('imgGatito2')
const image3=document.getElementById('imgGatito3')
const btnSaveFvt=document.querySelector('#btnSaveFvt')
const favoritesSection=document.getElementById('favorites')
const modalBody=document.querySelector('.modal-body')
btnSaveFvt.addEventListener('click',saveFavourites)
const randomInitPhotos=document.querySelector('.photos')
const carouselInner=document.querySelector('.carousel-inner')

const button=document.querySelector('button')

async function consultarPerritos(){
    const res=await fetch(baseUrl)
    const resJson=await res.json()
    const data=resJson
    console.log(data)
   if(res.status !=200){ 
       error.innerText="Hubo un error "+ res.status;
    }
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
    const res=await fetch(favouritesUrl);
    if(res.status !=200){ 
        error.innerText="Hubo un error "+ res.status;
     }
    const data=await res.json();
    console.log(data)   
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
    const response=await fetch(favouritesUrl,{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            image_id:imageId
        })

    });
    console.log("guardar")
    consultarFavoritos()
}

async function showMore(idPerrito){
    const perritoUrl=`https://api.thedogapi.com/v1/images/${idPerrito}`
    const response=await fetch(perritoUrl)
    const data=await response.json()
    console.log(data);
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
        </div>
            `
    }
    else{
        perritoInfo=`
        <img alt="Foto perrito aleatoria" src="${data.url}" width="280" class="mx-auto d-block">
        <h6>breed:<span>undefined</span></h6>            `
    }
    
    
    modalBody.innerHTML=perritoInfo
    

}

async function deleteFavourite(id){
    const response=await fetch(DeleteFavUrl(id),{method:"DELETE"})
    const responsJson=await response.json()
    if (response.status!=200){
        console.error("Hubo un error "+ response.status+responsJson);
    }
    else{
        console.warn("Doguie was removed from favorites")
        consultarFavoritos()
    }
}


button.addEventListener('click',consultarPerritos)
consultarPerritos()
consultarFavoritos()



