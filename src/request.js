import axios from 'axios';

/**
 * Http Client
 */
export default (url)=>{
    return axios.get(url)
}



// console.log(`=======================================`)
// console.log(`URL=${process.env.BASE_PHP_PATH}`)
// console.log(`=======================================`)


// import axios from 'axios';
// const url = `${process.env.BASE_PHP_PATH}/public/`
// console.log("url----->"+url)

// axios.get(url).then((response)=>{
//     console.log(response.data)
// }).catch((e)=>{
//     console.log(e)
// })