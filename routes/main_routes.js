var AppRouter = Backbone.Router.extend({
  routes : {
    "contributions/:url", "getCommits"
  },

  getCommits : function(url) {
    console.log(url);
  }
})
