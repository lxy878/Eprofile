var classOption, ipType, classType, zeroComp;
var mask, binPrefix, binSuffix, ones;
var prefix, suffix, suffixD, suffixB;
var currentClass;
$(document).ready(function(){
  var current = $("#iptype");
  var d = $("#classtype"), e = $("#n");
  current.change(function(){
    if(current.val()==="v4"){
      $("#compress").prop("disabled",true);
      $("#classes").prop("disabled", false);
      $("#classtype").prop("disabled", false);
      $("#n").prop("disabled", false);
    }else if(current.val() ==="v6"){
      $("#classes").prop("disabled", true);
      $("#classtype").prop("disabled", true);
      $("#compress").prop("disabled",false);
      $("#n").prop("disabled", false);
    }
  });
  d.change(function(){
    if(d.val()==="d" ||d.val()==="e"){
      $("#n").prop("disabled", true);
    }else {
      $("#n").prop("disabled", false);
    }
  });
  e.change(function() {
    if(e.val()<=0){
      alert("Input Value is too Small.");
    }
  });
});

var classes ={
  a:{pre:1, suf:3, start:0, num:128},
  b:{pre:2, suf:2, start:128, num:63},
  c:{pre:3, suf:1, start:192, num:31},
  d:{pre:4, suf:0, start:224, num:15},
  e:{pre:4, suf:0, start:240, num:15}
};
function main(){
  init();
  classOption = document.getElementById("classes").value;
  ipType = document.getElementById("iptype").value;
  classType = document.getElementById("classtype").value;
  numberAddress = document.getElementById("n").value;
  zeroComp = document.getElementById("compress").value;
  if(ipType == "v4"){
    if(classType == 0){
      alert("Missing Class Type");
    }else if(classType == "d" || classType == "e"){
      v4Prefix();
    }else{
      var maxAddress = Math.pow(256,classes[classType].suf)-2;
      if(numberAddress <=0){
        alert("Missing the Number of Addresses");
      }else if(classOption == 0){
        alert("Missing Class Method.");
      }else if(numberAddress>maxAddress){
        alert("Number of Addresses is too large for this class");
      }else{
        v4Prefix();
      }
    }
  }else if(ipType == "v6"){
    classOption = 0;
    if(zeroComp == 0){
      alert("Missing Zero Compression Option");
    }else if(numberAddress <=0){
      alert("Missing the Number of Addresses");
    }else {
      v6Prefix();
    }
  }else{
    alert("Missing IP Type");
  }
  toTable();
}

function toTable(){
  var finalIp="", finalIpB="", e="", eb="", mb=mask;
  if(classOption == "classless"&&classType != "e"&&classType!="d"){
    var count = currentClass.pre*8;
    e = prefix, eb=binPrefix;
    for(var i=0; i<currentClass.suf; i++){
      e += ".0";
      eb += "."+addZeros("0",8);
    }
    e += "/"+ count;
    mb = mask.replace(/255/g,"11111111");
    var s = mask.substring(mask.lastIndexOf(".")+1);
    var n = toDecimal(s,10);
    var b = toBinHex(n, 2);
    mb = mb.replace(n,b);
  }else if(classType == "d"){
    e += prefix;
    eb += binPrefix;
  }else if(classType == "e"){
    e += "Reserved";
    eb += e;
  }else{
    e +=prefix+suffixD[0];
    eb += binPrefix+suffixB[0];
  }
  for(var i=0; i<suffixD.length; i++){
    finalIp += "<li>"+prefix+suffixD[i]+"</li>";
    finalIpB += "<li>"+binPrefix+suffixB[i]+"</li>";
  }
  document.getElementById("public").innerHTML=e;
  document.getElementById("binP").innerHTML = eb;
  document.getElementById("mask1").innerHTML= mask;
  document.getElementById("mask2").innerHTML=mb;
  document.getElementById("hostList").innerHTML=finalIp;
  document.getElementById("hostBinaryList").innerHTML=finalIpB;
}
//create v6 prefix
function v6Prefix(){
  var n = Math.pow(2,16)-1;
  var key= ipType+"-";
  do{
    binPrefix="", prefix="";
    for(var i=0; i<4; i++){
      var num = randomGenerator(n-1, 1);
      binPrefix += addZeros(toBinHex(num,2), 16)+":";
      prefix += toBinHex(num, 16)+":";
    }
    key +=prefix;
  }while (!checkIp(key));
  setIp(key);
  v6Suffix(16);
}

function v6Suffix(increment){
  binSuffix="";
  var p1=1, p2=0, p3=0, p4=0;
  var maxValue = Math.pow(2,16)-1;
  for(var i=0; i<numberAddress; i++){
    if(p1>maxValue){
      p2++;
      p1 -=maxValue;
      if(p2>maxValue){
        p3++;
        p2 -= maxValue;
        if(p3>maxValue){
          p4++;
          p3-= maxValue;
        }
      }
    }
    suffix = toBinHex(p4,16)+":"+toBinHex(p3,16)+":"+toBinHex(p2,16)+":"+toBinHex(p1,16);
    binSuffix = addZeros(toBinHex(p4,2),16)+":"+addZeros(toBinHex(p3,2),16)+":"+addZeros(toBinHex(p2,2),16)+":"+addZeros(toBinHex(p1,2),16);
    if(zeroComp=="yes"){
      suffix = suffix.replace(/(0:)+/,":");
      binSuffix = binSuffix.replace(/(0000000000000000:)+/,":");
    }
    suffixD.push(suffix);
    suffixB.push(binSuffix);
    p1 +=increment;
  }
}
// create v4 prefix
function v4Prefix(){
  currentClass = classes[classType];
  var key = ipType+"-";
  do{
    binPrefix ="";
    prefix=randomGenerator(currentClass.num, currentClass.start);
    binPrefix += addZeros(toBinHex(prefix,2),8);
    for(var i=currentClass.pre-1; i>0; i--){
      var num = randomGenerator(256,0);
      binPrefix += "."+addZeros(toBinHex(num,2),8);
      prefix+="."+num;
    }
    key += prefix;
  }while (!checkIp(key));
  if(classType != "e"){
    setIp(key);
  }
  var increment = 1;
  var subnet = 0;
  if(currentClass.suf == 0){
    return;
  }
  if(classOption == "classless"){
    v4FixedLast(8);
  }
  v4Suffix(increment,subnet);

}
//create a mask and find subnet
var checkList;
function v4FixedLast(bit){
  checkList =[];
  var n=2;
  for(var i=1; i<bit; i++){
    checkList.push(256-n);
    n *=2;
  }
  checkList.push(0);
  mask = "";
  ones=0;
  for(var i=0; i<currentClass.pre; i++){
    ones +=8;
    mask += "255.";
  }
  var remainBit = 8*currentClass.suf;
  var hostBit = Math.ceil(Math.log2(numberAddress));
  var subnetBit = remainBit - hostBit;
  ones += subnetBit;
  var count=1;
  while (subnetBit>=8) {
    subnetBit -=8;
    mask+="255.";
    count++;
  }
  var subnet = checkList[7-subnetBit];
  mask +=subnet;
  for(var i=currentClass.suf-count; i>0; i--){
    mask += ".0";
  }
  return 0;
}
//create a array of hosts
function v4Suffix(increment, sufPart1){
  var parts=[];
  parts.push(sufPart1);
  for(var i=0; i<currentClass.suf-1; i++){
    parts.push(0);
  }
  parts[0]+=1;
  for(var i=numberAddress; i>0; i--){
    suffix ="", binSuffix="";
    if(parts.length>=2 && parts[0]>255){
      parts[0]-=255;
      parts[1] ++;
      if(parts.length==3 && parts[1]>255){
        parts[1] -=255;
        parts[2]++;
      }
    }
    for(var j=0; j<parts.length; j++){
      binSuffix = "."+addZeros(toBinHex(parts[j],2),8)+binSuffix;
      suffix = "."+parts[j]+suffix;
    }
    suffix += "/"+ones;
    suffixB.push(binSuffix);
    suffixD.push(suffix);
    parts[0] += increment;
  }
}
function addZeros(binary,bits){
  var s = binary;
  var bits = bits - s.length;
  for(var i=0; i<bits; i++){
    s ="0"+s;
  }
  return s;
}

function init(){
  classOption=0, ipType=0, classType=0, zeroComp=0, mask=0, binPrefix=0, binSuffix=0, ones=0, prefix=0, suffix=[], suffixD=[], suffixB=[],currentClass=0;
}
function toBinHex(number, bit){
  return (number).toString(bit);
}
function toDecimal(numberString, bit){
  return parseInt(numberString, bit);
}
function randomGenerator(number, start){
  return Math.floor(Math.random() * number) + start;
}
//
function checkIp(key){
  if(sessionStorage.getItem(key) == null){
    return true;
  }
  return false;
}
function setIp(key){
  sessionStorage.setItem(key, numberAddress);
}
function clearData(){
  sessionStorage.clear();
}
