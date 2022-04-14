
if (window.location.pathname === '/favorites'){
  
    getDataSplit();

  async function fetchData(url){
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    return data;
  }

  async function getDataSplit(){   
    let url="/api/favsInfo";
    let data = await fetchData(url);
    //console.log(data)
    //console.log(data[0].favorites);
    let arrData=data[0].favorites;
    var datastring = arrData.split(',');
    //console.log(datastring);

    for(let i = 1; i < datastring.length; i++ ){
      let url1=`/api/coinInfo?coin_Id=${datastring[i]}`;
      let data1 = await fetchData(url1);
      //console.log(data1);
      //console.log(data1[0].coinName);
      $("#name").append(`<tr><td><img src="${data1[0].img}" width="20"><span>${data1[0].coinName}</span></td></td>`);
      
      let url2= `https://coinlib.io/api/v1/coin?key=04f262b872b302cf&pref=USD&symbol=${data1[0].symbol}`
      let data2 =await fetchData(url2);
      //console.log(data1);
      let price = data2.price;
      let highPrice=data2.high_24h;
      let lowPrice =data2.low_24h;
      let volume =data2.total_volume_24h;
      $("#price").append(`<tr><td>${price}</td></tr>`);
      $("#highPrice").append(`<tr><td>${highPrice}</td></tr>`);
      $("#lowPrice").append(`<tr><td>${lowPrice}</td></tr>`);
      $("#volume").append(`<tr><td>${volume}</td></tr>`);
    }
  }
  
}


