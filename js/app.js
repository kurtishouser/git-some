var baseurl = 'https://api.github.com/';
var perPage = 12;

function getJSON(url) {
    console.log('GET', url);
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = "json";

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function accountDetails(response) {
    var html = '';
    html += '<div><strong>Account Type: </strong>' + response.type + '</div>';
    html += '<div><strong>Name: </strong>' + response.name + '</div>';
    html += '<div><strong>Company: </strong>' + response.company + '</div>';
    html += '<div><strong>Location: </strong>' + response.location + '</div>';
    html += '<div><strong>Email: </strong>' + response.email + '</div>';
    html += '<div><strong>Bio: </strong>' + response.bio + '</div>';
    html += '<div><strong>Public Repos: </strong>' + response.public_repos + '</div>';
    html += '<div><strong>Public Gists: </strong>' + response.public_gists + '</div>';
    html += '<div><strong>Followers: </strong>' + response.followers + '</div>';
    html += '<div><strong>Following: </strong>' + response.following + '</div>';
    html += '<div><strong>Created: </strong>' + response.created_at + '</div>';
    html += '<div><strong>Updated: </strong>' + response.updated_at + '</div>';
    return html;
}

// not used anymore but may be useful later
function htmlLinksList(obj, key, text) {
    var html = '<ul class="list-group">';
    obj.forEach(function (item) {
        html += '<li class="list-group-item"><a href="' + item[key] + '">' + item[text] + '</a></li>';
    });
    html += '</ul>';
    return html;
}

function objItemsGrid(obj, key) {
    var html = '<div class="row">';
    obj.forEach(function (item) {
        html += '<div class="col-md-4 item">' + item[key] + '</div>';
    });
    html += '</div>';
    return html;
}

// GitHub username submitted
$('.btn.btn-default').click(function(){
    $('#error').text(''); // clear any previous errors
    $('.panel.panel-info').hide(); // hide any Details panel if visible
    var username = $('.name').val();

    getJSON(baseurl + 'users/' + username).then(function(response) {

        $('#git_login').show();
        $('#username').hide();
        $('#git_login a').text(response.login);
        $('#git_login a').attr('href', response.html_url);
        $('#git_avatar_url').attr('src', response.avatar_url);
        $('#overview .panel-body').html(accountDetails(response));
        return response;

    }, function(error) {
        $('#error').text('Name not found!');
  }).then(function(response) {

      getJSON(response.repos_url + '?per_page=' + perPage).then(function(response) {
          $('#repos .panel.panel-primary .panel-body').html(objItemsGrid(response, 'name'));
          $('#repos .panel-body .item').click(function() {
              var item = $(this).text();
              getJSON(baseurl + 'repos/' + username + '/' + item).then(function(response) {
                  $('#repos .panel.panel-info').show();
                  $('#repos .panel.panel-info .panel-title').text('Details for ' + response.name);
                  $('#repos .panel.panel-info .panel-body').text(response.description);
              })
          })
      })

      getJSON(response.subscriptions_url + '?per_page=' + perPage).then(function(response) {
          $('#subscriptions .panel.panel-primary .panel-body').html(objItemsGrid(response, 'full_name'));
          $('#subscriptions .panel-body .item').click(function() {
              var item = $(this).text();
              getJSON(baseurl + 'repos/' + item).then(function(response) {
                  $('#subscriptions .panel.panel-info').show();
                  $('#subscriptions .panel.panel-info .panel-title').text('Details for ' + response.full_name);
                  $('#subscriptions .panel.panel-info .panel-body').text(response.description);
              })
          })
      })

      getJSON(response.following_url.slice(0, -13) + '?per_page=' + perPage).then(function(response) {
          $('#following .panel.panel-primary .panel-body').html(objItemsGrid(response, 'login'));
          $('#following .panel-body .item').click(function() {
              var item = $(this).text();
              getJSON(baseurl + 'users/' + item).then(function(response) {
                  $('#following .panel.panel-info').show();
                  $('#following .panel.panel-info .panel-title').text('Details for ' + response.login);
                  $('#following .panel.panel-info .panel-body').html(accountDetails(response));
              })
          })
      })

      getJSON(response.followers_url + '?per_page=' + perPage).then(function(response) {
          $('#followers .panel.panel-primary .panel-body').html(objItemsGrid(response, 'login'));
          $('#followers .panel-body .item').click(function() {
              var item = $(this).text();
              getJSON(baseurl + 'users/' + item).then(function(response) {
                  $('#followers .panel.panel-info').show();
                  $('#followers .panel.panel-info .panel-title').text('Details for ' + response.login);
                  $('#followers .panel.panel-info .panel-body').html(accountDetails(response));
              })
          })
      })

    })
});

// username edit icon clicked
$('#git_login .glyphicon.glyphicon-edit').click(function() {
    $('#git_login').hide();
    $('#username').show();
});

// navigation link clicked
$('.nav.nav-sidebar li').click(function() {
    var navSelection = $(this).attr('id');
    $('.nav.nav-sidebar li').removeClass('active');
    $('#' + navSelection).addClass('active');
    $('.page').hide();
    $('#' + navSelection.slice(4)).show(); // remove 'nav-'
});
