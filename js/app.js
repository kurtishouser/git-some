var baseurl = 'https://api.github.com/users/';

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
        $('#git_type').text(response.type);
        $('#git_name').text(response.name);
        $('#git_company').text(response.company);
        $('#git_location').text(response.location);
        $('#git_email').text(response.email);
        $('#git_bio').text(response.bio);
        $('#git_public_repos').text(response.public_repos);
        $('#git_public_gists').text(response.public_gists);
        $('#git_followers').text(response.followers);
        $('#git_following').text(response.following);
        $('#git_created_at').text(response.created_at);
        $('#git_updated_at').text(response.updated_at);
        return response;
    }, function(error) {
        $('#error').text('Name not found!');
  }).then(function(response) {

      getJSON(response.repos_url).then(function(repos) {
          html = '<ul class="list-group">';
          for (var i = 1; i < repos.length; i++) {
              html += '<li class="list-group-item"><a href="' + repos[i].html_url + '">' + repos[i].name + '</a></li>';
          }
          html += '</ul>';
          $('#repos .panel-body').html(html);
      })

      getJSON(response.followers_url).then(function(followers) {
          html = '<ul class="list-group">';
          for (var i = 1; i < followers.length; i++) {
              html += '<li class="list-group-item"><a href="' + followers[i].html_url + '">' + followers[i].login + '</a></li>';
          }
          html += '</ul>';
          $('#followers .panel-body').html(html);
      })

      getJSON(response.subscriptions_url).then(function(subscriptions) {
          html = '<ul class="list-group">';
          for (var i = 1; i < subscriptions.length; i++) {
              html += '<li class="list-group-item"><a href="' + subscriptions[i].html_url + '">' + subscriptions[i].full_name + '</a></li>';
          }
          html += '</ul>';
          $('#subscriptions .panel-body').html(html);
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
$('#git_login').hide();
$('#overview').show();
$('#subscriptions').hide();
$('#followers').hide();
$('#repos').hide();
