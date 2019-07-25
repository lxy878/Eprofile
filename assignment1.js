function getInfor(){
  var x = "Your Browser: " + navigator.appCodeName;
  document.getElementById("browser").innerHTML = x;
  x = "Your Screen Width: " + screen.width + " & Height: " +screen.height
  document.getElementById("screen").innerHTML = x;
  x = "Your Window Width: "+ window.innerWidth + " & Height: "+window.innerHeight;
  document.getElementById("window").innerHTML =x;
}

function dropdown1(){
  document.getElementById("link1").classList.toggle("show");
}
function dropdown2(){
  document.getElementById("link2").classList.toggle("show");
}
// not display list when mouse is clicked on any place
window.onclick = function(e) {
  if (!e.target.matches('.ddbutton')) {
    var myDropdown1 = document.getElementById("link1");
      if (myDropdown1.classList.contains('show')) {
        myDropdown1.classList.remove('show');
      }
      var myDropdown2 = document.getElementById("link2");
      if(myDropdown2.classList.contains('show')) {
        myDropdown2.classList.remove('show');
      }
  }
}
