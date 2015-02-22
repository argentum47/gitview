window.GitApp = {
  Models: {},
  Collections: {},
  Views: {},

  start: function(data) {
    var users = new GitApp.Collections.Users(new Backbone.LocalStorage('github-users').findAll()),
        router = new GitApp.Router();

    router.on("route:index", function(){
      router.navigate('users', {
        trigger: true,
        replace: true
      });
    });

    router.on('route:listUsers', function() {
      var usersView = new GitApp.Views.Users({
        collection: users
      });

      $('.container').html(usersView.render().$el);
    });

    router.on("route:newUser", function() {
      var newUserForm = new GitApp.Views.NewUserForm({
        model: new GitApp.Models.User()
      });

      newUserForm.on('form:submitted', function(attrs) {
        attrs['id'] = users.isEmpty() ? 1 : +(_.max(users.pluck('id')) + 1)
        attrs.username = attrs.username.replace(/\s/g,'')
        users.create({id: attrs.id, username: attrs.username});
        router.navigate('users', true)
      });

      $('.container').html(newUserForm.render().$el);
    });

    router.on('route:showUser', function(id, page) {
      var userView = new GitApp.Views.User({ model: users.where({username: id})[0] });

      $(".container").html(userView.fetchUserStats(page).$el);
    });

    router.on('route:repoContributions', function(owner, repo) {
      var repoView = new GitApp.Views.Repo({
        username: owner,
        reponame: repo
      });
      $('.container').html(repoView.render().$el);
    });

    Backbone.history.start();
  }
}
