$(function(){
    var salt = $("#salt").val();
    var dhPrime = $("#dhPrime").val();
    // save to localStorage
    $('#login-form').submit(function() {
        var $pw = $("#password");
        localStorage.setItem('pw', $pw.val());
        localStorage.setItem('salt', salt);
        localStorage.setItem('dhPrime', dhPrime);
        return true;
    });
});