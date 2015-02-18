var UserStats = Backbone.View.extend({
  el: $('#formEl'),

  events: {
    "click #fetch" : "fetchUserStats",
    "click .commits" : "fetchRepoContributions"
  },

  initialize: function() {
    _.bindAll(this, 'fetchUserStats', 'fetchRepoContributions')
  },

  fetchUserStats: function(e) {
    var username = this.$el.find('#username').val();
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + username + '/repos',
      dataType: 'json',
      statusCode: {
        202: function(response) {
          alert("That was Github, Try Again");
        }
      }
    }).done(function(data) {
      if(!_.isEmpty(data)) {
        var h = _.template($("#user_stats").html(), {owner: data[0].owner, userdata: data });
        $(".users").html(h);
      } else {
        var h = _.template($("#user_stats").html(), {errors: true, messages: ["User has no commits"] });
        $(".users").html(h);
      }
    }).fail(function() {
      var h = _.template($("#user_stats").html(), {errors: true, messages: ["Couldn't find the user with that name"] });
      $(".users").html(h);
    });

    return false;
  }
});
