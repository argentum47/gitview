app.Router = Backbone.Router.extend({
  routes : {
    "" : "listUsers",
    "users/:name(/:page)": "showUser",
    "contributions/:name/:repo": "showContributions",
    "search": "searchUser"
  }
});
