GitApp.Views.Users = Backbone.View.extend({
  template: _.template($("#users-template").html()),

  renderOne: function(user) {
    var userView = new GitApp.Views.User({ model: user }),
        h = "<li>" + userView.render().$el.html() + "</li>";

    this.$(".users-container").append(h);
  },

  render: function() {
    this.$el.html(this.template());
    this.collection.each(this.renderOne, this)
    return this;
  }
})
