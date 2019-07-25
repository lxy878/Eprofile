
var urls = [];
var responses =[];
function a(){
  document.getElementById("show").disabled=false;
  document.getElementById("files").disabled=true;
  document.getElementById("current").disabled=true;
  urls =[];
  var current = window.location.href;
  urls.push(new URL(current));
  for(let i=0; i<urls.length; i++){
    ipAddr(urls[i]);
  }
}
// reader file
function fileUpload(event){
  urls =[];
  document.getElementById("show").disabled=false;
  document.getElementById("files").disabled=true;
  document.getElementById("current").disabled=true;
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    //display by lines
    //get strings of urls
    var urlsString = reader.result.split("\n");
    //set strings to urls
    for(let i=0; i<urlsString.length; i++){
      var url = new URL(urlsString[i]);
      urls.push(url);
    }
    //set responses of urls
    for(let i=0; i<urls.length; i++){
      ipAddr(urls[i]);
    }
  }
  reader.readAsText(input.files[0]);
}
// get elements from a url
function urlElements(url){
  var elements = [];
  elements.push(url.href);
  elements.push(url.protocol);
  elements.push(url.username);
  elements.push(url.hostname);
  elements.push(url.port);
  elements.push(url.pathname);
  elements.push(url.search);
  elements.push(url.hash);
  // get ip
  for(let i=0; i<responses.length; i++){
    // response.Question.name+'.'
    if(responses[i].Question[0].name === url.hostname+"."){
      var answer= responses[i].Answer;
      var ip = answer[answer.length-1].data;
      elements.push(ip);
      break;
    }
  }
  return elements;
}

function ipAddr(url){
  var xhttp = new XMLHttpRequest();
  var requestURL = new URL("https://dns.google.com/resolve?name="+url.hostname);
  xhttp.onreadystatechange=function(){
    if(this.readyState == 4&& this.status == 200){
      var response = JSON.parse(this.responseText);
      //document.getElementById("test").innerHTML= ip;
      responses.push(response);
    }
  };
  xhttp.open("GET", requestURL, true);
  xhttp.send();
}

var headers = ["URL Name", "Scheme","UseInfo","Host","Port","Path","Query","Fragment","IP"];
// create a table of urls' details
function createTable(){
  document.getElementById("show").disabled=true;
  var table = document.createElement("table");
  //create a header
  var tableHead = document.createElement("thead");
  var rowH = document.createElement("tr");
  for(let i=0; i<headers.length; i++){
    var head = document.createElement("th");
    head.appendChild(document.createTextNode(headers[i]));
    rowH.appendChild(head);
  }
  tableHead.appendChild(rowH);
  table.appendChild(tableHead);
  //create a body
  var tableBody = document.createElement("tbody");
  for(let i=0; i<urls.length; i++){
    var terms =urlElements(urls[i]);
    var rowsB = document.createElement("tr");
    // fill in the detils of the url
    for(let j=0; j<headers.length; j++){
      var e = document.createElement("td");
      e.appendChild(document.createTextNode(terms[j]));
      rowsB.appendChild(e);
    }
    tableBody.appendChild(rowsB)
  }

  table.appendChild(tableBody);

  document.getElementById("table").appendChild(table);
  count("scheme");
  count("tld");
  chart("Scheme Type", schemeType);
  chart("TLD Type", topLevelDomain);
}

var schemeType ={http:{count:0}, https:{count:0}, ftp:{count:0}, mailto:{count:0}, data:{count:0}, irc:{count:0}, other:{count:0}};
var topLevelDomain={com:{count:0}, gov:{count:0}, net:{count:0}, org:{count:0}, int:{count:0}, edu:{count:0}, other:{count:0}};
function count(targer){
  if(targer==="scheme"){
    var data = schemeType;
    for(let i=0; i<urls.length; i++){
      var str = urls[i].protocol.replace(":","");
      if(str in data){
        data[str].count++;
      }else{
        data.other.count++;
      }
    }
  }else{
    var data = topLevelDomain;
    for(let i=0; i<urls.length; i++){
      var str = urls[i].hostname;
      // find first index of '.'
      var index = str.lastIndexOf(".");
      // find second index of '.'
      str = str.substr(index+1);
      if(str in data){
        data[str].count++;
      }else{
        data.other.count++;
      }
    }
  }
}

// create chart
function chart(targerName, targer) {
  var name = targerName;
  var array =[['Type','Count']];
  for(var str in targer){
    array.push([str, targer[str].count]);
  }
  //console.log(array);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

// Draw the chart and set the chart values
  function drawChart() {
    var data = google.visualization.arrayToDataTable(array);

  // Optional; add a title and set the width and height of the chart
  var options = {'title':targerName, 'width':550, 'height':400, 'backgroundColor':'#e6f7ff'};
  // Display the chart inside the <div> element with id="piechart"
  if(targer === schemeType){
    var chart = new google.visualization.PieChart(document.getElementById("schemeChart"));
  }else{
    var chart = new google.visualization.PieChart(document.getElementById("tldChart"));
  }
  chart.draw(data, options);
}
}
