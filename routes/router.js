GitApp.Router = Backbone.Router.extend({
  routes : {
    "" : "index",
    "users": "listUsers",
    "users/new": "newUser",
    "user/:id(/repos/:page)": "showUser",
    "contributions/:owner/:repo" : "repoContributions"
  }
});
