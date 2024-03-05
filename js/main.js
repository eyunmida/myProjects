
const result = document.getElementById("results"); 


window.onload = function(){
  $("#load").hide();
  $.ajax({
   url:"city_coordinates.csv",
   dataType:"text",
   success:function(data)
   {
    var city_coordinates = data.split(/\r?\n|\r/);
    var option_data = '<option disabled selected value> -- select a city -- </option>';
    for(var count = 0; count<city_coordinates.length; count++)
    {
     var cell_data = city_coordinates[count].split(",");
    
     for(var cell_count=0; cell_count<cell_data.length; cell_count++)
     {
      if(count > 0)
      {
        //<option value='{"lat":"52.367","lon":"4.904"}'>Amsterdam, Netherlands</option>
        if(cell_count==0)
          option_data += '<option value="lat:'+cell_data[cell_count];
        if(cell_count==1)
          option_data += ',lon:'+cell_data[cell_count]+'">';
        if(cell_count==2)
          option_data += cell_data[cell_count]+', ';
        if(cell_count==3)
          option_data += cell_data[cell_count]+'</option>';
      }
     }
    }
    $('#citySelected').html(option_data);
   }
  });
}

citySelected.onchange = function(){

  $("#load").show();
  result.innerHTML='';
  var temp, tempLat, tempLong;
  temp = citySelected.value.split(',');
  tempLat = temp[0].split(':');
  tempLong = temp[1].split(':');
  const latitude = tempLat[1];
  const longitude = tempLong[1];

  getWeather(latitude, longitude);
}

 
const getWeather = (lat, lon) => {
  fetch(
    `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`,{
      method: 'GET', headers: {'Content-type':'text/plain'}
    })
  .then((response) => response.json())
  .then((json) => {
      let realtimeResults = '<p> This is 7 Days Weather!</p><table name="weeklyDatya" id="weeklyData"><tr>';
      json.dataseries.forEach(element => { //foreach 배열의 개수만큼 반복문을 돌려라
        console.log(element)//element에는 하나 하나의 배열이 담아져 있음
        realtimeResults+=`<td><table name="dailyData" id="dailyData"><tr><th>${getDayOfWeek(element.date)}</th></tr>
          <tr><td><img src="./images/${element.weather}.png" /></td></tr>
          <tr><td>H : ${element.temp2m.max}ºF / ${Math.round((element.temp2m.max-32)*5/9)}ºC</td></tr>
          <tr><td>L : ${element.temp2m.min}ºF / ${Math.round((element.temp2m.min-32)*5/9)}ºC</td></tr></table></td>`
        });
      $("#load").hide();
      result.innerHTML = realtimeResults+'</tr></table>'; //화면에 출력   
    }).catch((error) => {
      alert(error.data);
      alert("jason안돌아감");
    });
    
}

function getDayOfWeek(yyyyMMdd){
  //alert(yyyyMMdd.toString().substr(0,4));
  var strdate = yyyyMMdd.toString().substr(0,4)+'-'+yyyyMMdd.toString().substr(4,2)+'-'+yyyyMMdd.toString().substr(6,2)
  const dayOfWeek = new Date(strdate).toLocaleString(undefined, {month: "short", day: "numeric"}); 
  return dayOfWeek;
}


/*
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
      document.querySelector('body').style.visibility = "hidden";
      document.querySelector('#loader').style.visibility = "visible";
  } else {
      document.querySelector('#loader').style.display = "none";
      document.querySelector('body').style.visibility = "visible";
  }
};*/
