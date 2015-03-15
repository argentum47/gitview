app.Router = Backbone.Router.extend({
  routes : {
    "" : "home",
    "users/:name(/:page)": "showUser",
    "contributions/:name/:repo": "showContributions",
    "search(/:q)": "searchUser",
    "search_repos(/:q/:page)": "searchRepos"
  }
});
