function validate() {
  var username = document.getElementById("name")
  var email = document.getElementById("email")
  var phone = document.getElementById("phone")
  var password = document.getElementById("password")
  var confirmPassword=document.getElementById("confirmPassword")
  if (username.value == "") {
    document.getElementById("error-message").innerHTML = "username is required"
    return false;
  }
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailPattern.test(email.value)) {
    document.getElementById("error-message").innerHTML = "Please enter a valid email address"

    return false;
  }
  if (phone.value == "") {
    document.getElementById("error-message").innerHTML = "phone number is required"
    return false;
  }
  if (!phone.value.length == 10) {
    document.getElementById("error-message").innerHTML = "number should contain 10 digits"
    return false;
  }
  if (password.value == "") {
    document.getElementById("error-message").innerHTML = "password should be required"
    return false;
  }
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!passwordPattern.test(password.value)) {
    document.getElementById("error-message").innerHTML = "Please provide a strong password"
    return false;
  }

  
  if (password.value !== confirmPassword.value) {
    document.getElementById("error-message").innerHTML = "Passwords do not match";
    return false;
  } else {
    document.getElementById("error-message").innerHTML = "";
    return true;
  }

}

