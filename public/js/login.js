function log() {
  let x = $('.email').val().trim();
  let y = $('.pass').val().trim();
  let send = {
    username: x,
    password: y,
  };
  $.ajax({
    type: 'GET',
    url: 'https://rafsanamin.adaptable.app/auth/login',
    data: send,
    xhrFields: {
      withCredentials: true,
    },
    success: function (res) {
      if (res.done == true) {
        window.location.href = './todo/todo.html';
      } else {
        $('h2').hide(1).text(res.massage).show(500);
      }
    },
  });
}

$('body').keypress(function (e) {
  if (e.which == 13) {
    event.preventDefault();
    log();
  }
});
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
