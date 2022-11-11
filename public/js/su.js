function su() {
  let un = $('.username').val().trim();
  let em = $('.email').val().trim();
  let pass = $('.pass').val().trim();
  let conf = $('.conf').val().trim();

  if (un == '' || em == '' || pass == '') {
    $('h2').text('Everything is Required');
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(em)) {
    $('h2').text('Not a Valid Mail');
  } else if (pass.length < 8) {
    $('h2').text('Password too Shorter than 8');
  } else {
    if (pass !== conf) {
      $('h2').text("Password and confirm password aren't same.");
    } else {
      let send = {
        username: un,
        email: em,
        password: pass,
        todos: [],
      };
      console.log(send);
      $.ajax({
        type: 'POST',
        url: 'https://rafsanamin.onrender.com/auth/signup',
        contentType: 'application/json',
        data: JSON.stringify(send),
        xhrFields: {
          withCredentials: true,
        },
        success: function (res) {
          if (res.add == true) {
            $('h2').text('SignUp Suceessful. Now Login');
            window.location.href = 'login.html';
          } else {
            $('h2').text(res.massage);
          }
        },
      });
    }
  }
}
$('input').focus(function (e) {
  $(this).parent().find('label').css({
    top: '-20px',
    'font-size': '0.85rem',
    color: '#2990f8',
  });
});
$('input').blur(function (e) {
  $('input').each(function () {
    if ($(this).val() == '') {
      console.log('noice');
      $(this).parent().find('label').css({
        top: '0px',
        'font-size': '1rem',
        color: '#b4d9ff',
      });
    } else {
      $(this).parent().find('label').css({
        top: '-20px',
        'font-size': '0.85rem',
        color: '#2990f8',
      });
    }
  });
});
