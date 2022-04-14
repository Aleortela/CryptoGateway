$(document).ready(function(){
$("#passwordBox").on("click", displaySuggested);
let isValid= true;

//logout modal popup
$("#logout").on("click", displaypopup);
$("#submitButton").on("click", displayReload);

async function displaypopup(){
 
 var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
}

function displayReload(){
  
  if(document.getElementById("yes").checked){  
    location.replace("/logOut");
  }else{
    location.replace("/signedInHome");
  }
}
//logout popup event lisner
$("#favoriteButton").on('click', function (){
  document.getElementById('favoriteButton')
})
//validation for retyping password
$('#passwordBox, #reTypePassword').on('keyup', function () {
    if ($('#passwordBox').val() == $('#reTypePassword').val()) {
        $('#validationOfPassword').html('Matching Passwords').css('color', 'white');     
    } 
    else $('#validationOfPassword').html('Not Matching').css('color', 'red'); 
});


async function displaySuggested(){
    //console.log("hi I am clicked!")
    let pwd = $("#passwordBox").val();
    let pwdUrl = `https://makemeapassword.ligos.net/api/v1/alphanumeric/json?c=100&l=8`;    
    let responsePwd = await fetchData(pwdUrl);
    //console.log(responsePwd.pws);
    $("#suggPwd").html(" Suggested Password:  "+  responsePwd.pws[0]);
    $("#suggPwd").attr("class", "text-info");
  }

  async function fetchData(url){
      let response= await fetch(url);
      let data= await response.json();
      return data;
  }

});
