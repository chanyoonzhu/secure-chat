$(function(){
    // save to localStorage
    $('#login-form').submit(function() {
        $pw = $("#password");
        localStorage.setItem('pw', $pw.val());
        return true;
    });
});