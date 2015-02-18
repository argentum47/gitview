var Repo = Backbone.Model.extend({
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
