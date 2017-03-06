var baseurl = 'https://api.github.com/users/';
var perPage = 12;

function getJSON(url) {
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

function htmlLinksList(obj, key, text) {
    var html = '<ul class="list-group">';
    obj.forEach(function (item) {
        html += '<li class="list-group-item"><a href="' + item[key] + '">' + item[text] + '</a></li>';
    });
    html += '</ul>';
    return html;
}
// git username submitted
$('.btn.btn-default').click(function(){
    // console.log('Name submitted', $('.name').val());
    $('#error').text(''); // clear any previous errors
    var username = $('.name').val();
    getJSON(baseurl + username).then(function(response) {

        $('#git_login').show();
        $('#username').hide();
        $('#git_login a').text(response.login);
        $('#git_login a').attr('href', response.html_url);
        $('#git_avatar_url').attr('src', response.avatar_url);
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
        $('#overview .panel-body').html(html);
        return response;

    }, function(error) {
        $('#error').text('Name not found!');
  }).then(function(response) {

      getJSON(response.repos_url + '?per_page=' + perPage).then(function(response) {
          $('#repos .panel-body').html(htmlLinksList(response, 'html_url', 'name'));
      })

      getJSON(response.subscriptions_url + '?per_page=' + perPage).then(function(response) {
          $('#subscriptions .panel-body').html(htmlLinksList(response, 'html_url', 'full_name'));
      })

      getJSON(response.followers_url + '?per_page=' + perPage).then(function(response) {

          $('#followers .panel-body').html(htmlLinksList(response, 'html_url', 'login'));
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
    var nav = $(this).attr('id')

    if (nav == 'nav-overview') {
        $('.nav.nav-sidebar li').removeClass('active');
        $('#'+nav).addClass('active');
        $('#subscriptions').hide();
        $('#followers').hide();
        $('#repos').hide();
        $('#overview').show();
    }

    if (nav == 'nav-repos') {
        $('.nav.nav-sidebar li').removeClass('active');
        $('#'+nav).addClass('active');
        $('#overview').hide();
        $('#subscriptions').hide();
        $('#followers').hide();
        $('#repos').show();
    }

    if (nav == 'nav-subscriptions') {
        $('.nav.nav-sidebar li').removeClass('active');
        $('#'+nav).addClass('active');
        $('#overview').hide();
        $('#repos').hide();
        $('#followers').hide();
        $('#subscriptions').show();
    }

    if (nav == 'nav-followers') {
        $('.nav.nav-sidebar li').removeClass('active');
        $('#'+nav).addClass('active');
        $('#overview').hide();
        $('#subscriptions').hide();
        $('#repos').hide();
        $('#followers').show();
    }

});

// initialize UI
// $('#git_login').hide();
// $('#overview').show();
// $('#subscriptions').hide();
// $('#followers').hide();
// $('#repos').hide();
// $('#details').hide();

// console.log('- tinkering... -');
// getJSON(baseurl + 'kurtishouser').then(function(overview) {
//     return getJSON(overview.repos_url);
// }).then(function(repos) {
//     console.log("Got Repos!", repos);
// })
