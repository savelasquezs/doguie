const baseUrl="https://api.thedogapi.com/v1/images/search"
const apiKey="live_gVbQrZiQSrWD3NynLQiQxMExPvoS5TxiJ8Cvu5yK2kU5W1jxFJ60T1XQfCupsMSI"
const image=document.getElementById('imgGatito')
const button=document.querySelector('button')

const consultar=async()=>{
    const response=await fetch(baseUrl)
    const responseJson=await response.json()
    const data=responseJson[0]
    console.log(data.url)
    image.src=data.url

}
button.addEventListener('click',consultar)
consultar()
