var app = app || {};
app.start = function() {
  var users = new app.collections.Users(new Backbone.LocalStorage('github-users').findAll()),
  routes = new app.Router();

  routes.on("route:home", function() {
    React.render(
        <Home users={users} />,
      document.body
    );
  });

  routes.on("route:showUser", function(name, page) {
    var user = users.where({ username: name })[0];
    if(user)
      user = user.toJSON();
    else
      user = {username: name};

    React.render(
      <Details user = { user } page = { page || 1}/>,
      document.body
    )
  });

  routes.on("route:showContributions", function(name, repo) {
    React.render(
      <Contributions repository = { repo } username = { name } />,
      document.body
    );
  });

  routes.on("route:searchUser", function(q) {
    React.render(
      <Search users = { users } q = {q}/>,
      document.body
    );
  });

  routes.on("route:showNotifications", function() {
    React.render(
      <Notifications users = {users}/>,
      document.querySelector(".tabbed-content")
    );
  });

  Backbone.history.start();
};

app.start();
