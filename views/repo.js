GitApp.Views.Repo = Backbone.View.extend({
    template: _.template($("#contribution-template").html()),
    owner: "",
    repo: "",

    initialize: function(details) {
        this.owner = details.username;
        this.repo = details.reponame;
    },
    render: function() {
        var stats = [];
        this.fetchContributors().
            done(function(data, stC, $xhr) {
                if($xhr.status == 202) {
                    console.log("retrying..");
                    setTimeout(this.render.bind(this), 2500);
                }
                if(!_.isEmpty(data)) {
                    _.each(data, function(d, i) {
                        stats[i] =  { name: d.author.login, avatar: d.author.avatar_url, total: d.total };
                    });
                    this.$el.append(this.template({stats: stats}));
                }
            }.bind(this)).
            fail(function(error) {
                this.$el.append(this.template({errors: { error: true, message: "Repository was not found"}}));
            }.bind(this));
        return this;
    },

    fetchContributors: function() {
        return $.ajax({
            type: 'GET',
            url: "https://api.github.com/repos/" + this.owner + "/" + this.repo + "/stats/contributors",
            dataType: 'json'
        });
    },

    fetchCommitActivity: function(stats) {
        return $.ajax({
            type: 'GET',
            url: "https://api.github.com/repos/" + this.owner + "/" + this.repo + "/stats/commit_activity",
            dataType: 'json'
        });
    }
});
