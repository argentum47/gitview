GitApp.Views.NewUserForm = Backbone.View.extend({
  template: _.template($("#new-user-template").html()),

  events: {
    "submit .user-form": 'onFormSubmit'
  },

  render: function() {
    var h = this.template(_.extend(this.model.toJSON(), {
      new_user: true
    }));
    this.$el.append(h);
    return this;
  },

  onFormSubmit: function(e) {
    e.preventDefault();

    this.trigger('form:submitted', {
      username: this.$('#username').val()
    });
  }
})
