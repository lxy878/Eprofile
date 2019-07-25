function getInfor(){
  var x = "Your Browser: " + navigator.appCodeName;
  document.getElementById("browser").innerHTML = x;
  x = "Your Screen Width: " + screen.width + " & Height: " +screen.height
  document.getElementById("screen").innerHTML = x;
  x = "Your Window Width: "+ window.innerWidth + " & Height: "+window.innerHeight;
  document.getElementById("window").innerHTML =x;
}

function dropdown(){
  document.getElementById("link").classList.toggle("show");
}

window.onclick = function(e) {
  if (!e.target.matches('.ddbutton')) {
    var myDropdown = document.getElementById("link");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
  }
}
