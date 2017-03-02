var user = 'kurtishouser';
// var user = 'pravipati';

var baseurl = 'https://api.github.com/users/';


function apicall(url) {
    var $xhr = $.getJSON(url);

    console.log('endpoint:', url);

    $xhr.done(function(data) {
        if ($xhr.status !== 200) {
            return;
        }

        // console.log("JSON Data", data);
        $('#git_login a').text(data.login);
        $('#git_login a').attr('href', data.html_url);
        $('#git_avatar_url').attr('src', data.avatar_url);
        $('#git_type').text(data.type);
        $('#git_name').text(data.name);
        $('#git_company').text(data.company);
        $('#git_location').text(data.location);
        $('#git_email').text(data.email);
        $('#git_bio').text(data.bio);
        $('#git_public_repos').text(data.public_repos);
        $('#git_public_gists').text(data.public_gists);
        $('#git_followers').text(data.followers);
        $('#git_following').text(data.following);
        $('#git_created_at').text(data.created_at);
        $('#git_updated_at').text(data.updated_at);

        var $repos = $.getJSON(url + '/repos');
        $repos.done(function(data) {
            // console.log(data, data.length);
            html = '<ul class="list-group">';
            for (var i = 1; i < data.length; i++) {
                html += '<li class="list-group-item"><a href="' + data[i].html_url + '">' + data[i].name + '</a></li>';
            }
            html += '</ul>';
            $('#repos .panel-body').html(html);        });
        $repos.fail(function(err) {
            console.log('Error!', err);
        });

        var $subscriptions = $.getJSON(url + '/subscriptions')
        .done(function(data) {
            // console.log(data, data.length);
            html = '<ul class="list-group">';
            for (var i = 1; i < data.length; i++) {
                html += '<li class="list-group-item"><a href="' + data[i].html_url + '">' + data[i].full_name + '</a></li>';
            }
            html += '</ul>';
            $('#subscriptions .panel-body').html(html);
        });
        $repos.fail(function(err) {
            console.log('Error!', err);
        });

        var $followers = $.getJSON(url + '/followers');
        $followers.done(function(data) {
            // console.log(data, data.length);
            html = '<ul class="list-group">';
            for (var i = 1; i < data.length; i++) {
                html += '<li class="list-group-item"><a href="' + data[i].html_url + '">' + data[i].login + '</a></li>';
            }
            html += '</ul>';
            $('#followers .panel-body').html(html);
        });
        $repos.fail(function(err) {
            console.log('Error!', err);
        });

    });

    $xhr.fail(function(err) {
        console.log('Error!', err);
    });
}

$('.btn.btn-default').click(function(){
    console.log('Name submitted', $('.name').val());
    var username = $('.name').val();
    $('#git_login').show();
    $('#username').hide();
    apicall(baseurl + username);
});

$('#git_login .glyphicon.glyphicon-edit').click(function() {
    $('#git_login').hide();
    $('#username').show();
});

$('.nav.nav-sidebar li').click(function() {
    // console.log('Navigation clicked', $(this));
    var nav = $(this).attr('id')
    // console.log(nav);

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

// $('#git-username').hide();
$('#git_login').hide();
$('#overview').show();
$('#subscriptions').hide();
$('#followers').hide();
$('#repos').hide();

// apicall(url);
