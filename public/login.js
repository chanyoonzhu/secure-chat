$(function(){
    var salt = $("#salt").val();
    // save to localStorage
    $('#login-form').submit(function() {
        var $pw = $("#password");
        localStorage.setItem('pw', $pw.val());
        localStorage.setItem('salt', salt);
        return true;
    });
});