app.models.User = Backbone.Model.extend({
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

app.collections.Users = Backbone.Collection.extend({
  model: app.models.User,
  localStorage: new Backbone.LocalStorage('github-users')
});
