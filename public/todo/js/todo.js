const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let m = 0;
let d = 1;
let mnth = 0;
let limit = 0;
let hr = 1;
let min = 1;
let yr = 2021;
let list_num = 1;
let checked = false;
$.ajax({
  type: 'GET',
  url: 'https://rafsanamin.adaptable.app/auth/authen',
  xhrFields: {
    withCredentials: true,
  },
  success: function (res) {
    if (res.auth == false) {
      window.location.replace('../login.html');
    } else {
      let x = $('h1').text();
      $('body').removeClass('hide');
      $('.uname').text(res.data.username.toUpperCase());
    }
  },
});
function logu() {
  $.ajax({
    type: 'DELETE',
    url: 'https://rafsanamin.adaptable.app/auth/logout',
    xhrFields: {
      withCredentials: true,
    },
    success: function (res) {
      window.location.reload(true);
    },
  });
}

function openForm() {
  $('.add_form').removeClass('hide').animate({ opacity: '1' }, 50);
}
function del(elem) {
  event.stopPropagation();
  let tid = elem.attr('tid');

  let send = {
    _id: tid,
  };
  elem.hide(300);
  $.ajax({
    type: 'DELETE',
    url: 'https://rafsanamin.adaptable.app/todo/del',
    contentType: 'application/json',
    data: JSON.stringify(send),
    xhrFields: {
      withCredentials: true,
    },
    success: function (res) {
      if (res.done !== true) {
        loadAll();
      }
    },
  });
}
function check(elem) {
  let tid = elem.attr('tid');
  let elemX = elem.find('.list_check .tick');
  let elemC = elemX.attr('data-checked');
  if (elemC == 'false') {
    elemX.animate({ opacity: 1 }, 200);
    elemX.attr('data-checked', 'true');
  } else if (elemC == 'true') {
    elemX.animate({ opacity: 0 }, 200);
    elemX.attr('data-checked', 'false');
  }
  function update(send) {
    $.ajax({
      type: 'PUT',
      url: 'https://rafsanamin.adaptable.app/todo/check',
      contentType: 'application/json',
      data: JSON.stringify(send),
      xhrFields: {
        withCredentials: true,
      },
      success: function (res) {
        console.log(res);
        if (res.done !== true) {
          loadAll();
        }
      },
    });
  }
  let send = { tid: tid, checked: elemC };
  update(send);
}
function closeMe() {
  $(this).remove();
}
function validaion() {
  let dy_v = $('.add_day').val();
  $('.add_day option').remove();
  d = 1;
  let month_v = $('.add_month').val();
  let yr_v = $('.add_year').val();
  console.log(month_v);
  if (
    month_v == 'Jan' ||
    month_v == 'Mar' ||
    month_v == 'May' ||
    month_v == 'Jul' ||
    month_v == 'Aug' ||
    month_v == 'Oct' ||
    month_v == 'Dec'
  ) {
    limit = 31;
  } else if (month_v == 'Apr' || month_v == 'Jun' || month_v == 'Sep' || month_v == 'Nov') {
    limit = 30;
  } else if (month_v == 'Feb' && yr_v % 4 == 0) {
    limit = 29;
  } else {
    limit = 28;
  }
  while (d <= limit) {
    $('.add_day').append('<option>' + d + '</option>');
    d++;
  }
  $('.add_day').val(dy_v);
}

loadAll();
function loadAll() {
  $.ajax({
    type: 'GET',
    url: 'https://rafsanamin.adaptable.app/todo/alltd',
    xhrFields: {
      withCredentials: true,
    },
    success: function (res) {
      $('#list').empty();
      res.todoid.forEach(function (data) {
        $('#list').append(
          "<div id='list_s' tid='" +
            data._id +
            "' onclick='check($(this))' class='list_s'>" +
            "<div class='list_check'><div class='tick' style='opacity: 0' data-checked='" +
            data.checked +
            "'></div></div>" +
            "<div class='left'><div class='date'><i class='far fa-calendar-alt pr-2'></i><p>" +
            data.date.day +
            '/</p><p>' +
            data.date.month +
            '/</p><p>' +
            data.date.yr +
            "</p></div><div class='time'><i class='far fa-clock pr-2'></i><p>" +
            data.time.hr +
            ':</p><p>' +
            data.time.min +
            '</p> <p>' +
            data.time.ap +
            '</p></div></div>' +
            "<div class='main'><h2 class='h1'>" +
            data.title +
            '</h2><p>' +
            data.desc +
            '</p>' +
            '</div>' +
            "<div class='del_list_s' onclick='del($(this).parent())'><i class='far fa-trash-alt fa-sm pr-2'></i></div>" +
            '</div></div>'
        );
      });
      let elemX = $('#list').find('.list_check .tick');
      elemX.each(function () {
        let elemC = $(this).attr('data-checked');
        console.log($(this));
        if (elemC == 'true') {
          $(this).css('opacity', 1);
        } else if (elemC == 'false') {
          $(this).css('opacity', 0);
        }
      });
    },
  });
}
fw();
$('.chng').change(validaion);
$('#close').click(function () {
  $('.add_form').animate({ opacity: '0' }, 300, function () {
    $('.add_form').addClass('hide');
  });
});

function fw() {
  while (d < 31) {
    $('.add_day').append('<option>' + d + '</option>');
    d++;
  }
  while (mnth <= 11) {
    $('.add_month').append('<option>' + months[mnth] + '</option>');
    mnth++;
  }

  while (yr > 2020 && yr < 2055) {
    $('.add_year').append('<option>' + yr + '</option>');
    yr++;
  }
  while (hr <= 12) {
    $('.add_hr').append('<option>' + hr + '</option>');
    hr++;
  }
  while (min <= 59) {
    $('.add_min').append('<option>' + min + '</option>');
    min++;
  }
}
// function deleteTodo
function addTodo(e) {
  e.stopPropagation();
  let title = $('.add_title').val();
  let des = $('.add_description').val();
  let month_v = $('.add_month').val();
  let yr_v = $('.add_year').val();
  let dy_v = $('.add_day').val();
  let hr_v = $('.add_hr').val();
  let min_v = $('.add_min').val();
  let ap_v = $('.add_ap').val();

  if (title == '') {
    alert('Please Give Title!');
  } else {
    if (min_v < 9) {
      min_v = '0' + min_v;
    }
    let send = {
      title: title,
      desc: des,
      date: {
        day: dy_v,
        month: month_v,
        yr: yr_v,
      },

      time: {
        hr: hr_v,
        min: min_v,
        ap: ap_v,
      },
      checked: false,
    };
    $('.add_form').animate({ opacity: '0' }, 300, function () {
      $('.add_form').addClass('hide');
    });
    $.ajax({
      type: 'POST',
      url: 'https://rafsanamin.adaptable.app/todo/add',
      contentType: 'application/json',
      data: JSON.stringify(send),
      xhrFields: {
        withCredentials: true,
      },
      success: function (res) {
        loadAll();
      },
    });
  }
}
$('#add').click(addTodo);
