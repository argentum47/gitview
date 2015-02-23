GitApp.Views.User = Backbone.View.extend({
  template: _.template($("#user-template").html()),
  stats_template: _.template($("#user-stats").html()),

  render: function() {
    this.$el.append(this.template({user: this.model.toJSON()}));
    return this
  },

  fetchUserStats: function(page) {
    var username = this.model.toJSON().username,
        m,
        pages = {},
        stats = [],
        regex = /(?:page=)(\d+)[^\w]+(?:rel=)"([^"]+)"/g;
    console.log(username);

    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + username + '/repos',
      data: { page: page || 1 },
      dataType: 'json'
    }).
      done(function(data, statusCode, $xhr) {
        if(!_.isEmpty(data)) {
          if(link = $xhr.getResponseHeader('Link')) {
            console.log(link)
            while(m = regex.exec(link)) {
              if(m) pages[m[2]] = m[1];
            }
          }
          console.log(this.$el);
          this.$el.append(this.stats_template({owner: data[0].owner, userdata: data, pages: pages }));
        } else {
          this.$el.append(this.stats_template({errors: "User has no commits" }));
        }
      }.bind(this)).fail(function() {
        this.$el.append(this.stats_template({errors: "Couldn't find the user with that name" }));
      }.bind(this));

    return this;
  }
});
