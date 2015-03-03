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

  routes.on("route:users", function() {
    React.render(
      <Users users = { users } />,
      document.querySelector(".tabbed-content")
    );
  });
  
  routes.on("route:showUser", function(name, page) {
    var user = users.where({ username: name })[0];
    user = user.toJSON();
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

  routes.on("route:searchUser", function() {
    React.render(
      <Search />,
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
