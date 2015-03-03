app.Router = Backbone.Router.extend({
  routes : {
    "" : "home",
    "users": "users",
    "users/:name(/:page)": "showUser",
    "contributions/:name/:repo": "showContributions",
    "search": "searchUser",
    "notifications": "showNotifications"
  }
});
