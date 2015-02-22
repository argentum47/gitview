GitApp.Models.User = Backbone.Model.extend({
  defaults: {
    username: ''
  },

  validate: function(attrs) {
    var errors = {};
    if(!attrs.username) errors.username = "Hey You Need a Username!";
    if(!_.isEmpty(errors)) {
      return errors;
    }
  }
});

GitApp.Collections.Users = Backbone.Collection.extend({
  model: GitApp.Models.User,
  localStorage: new Backbone.LocalStorage('github-users')
});
