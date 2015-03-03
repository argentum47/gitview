var ContributionGraph = React.createClass({

  render : function() {
    var progress = this.props.stat.progress - 5.3,
        colors = ["red", "blue", "green"];
    progress = progress < 6 ? this.props.stat.progress : progress
    var progressStyle = {
      maxWidth: progress + "%"
    },
    progressClass = progress < 20 ? colors[0] : (progress < 60 ?  colors[1] : colors[2] );

    return (
      <div className = "col-xs-12 progress-status">
        <div className = "progress-percent"> {this.props.stat.progress + "%"} </div>
        <span style={ progressStyle } className = { progressClass + " progress-width" }></span>
        <img src = {this.props.stat.avatar + "&size=90"} className = "avatar"/>
      </div>
    );
  }
});

var Contributions = React.createClass({
  getInitialState : function() {
    return {
      stats: []
    }
  },

  fetchContributors: function() {
    $.ajax({
      type: 'GET',
      url: "https://api.github.com/repos/" + this.props.username + "/" + this.props.repository + "/stats/contributors",
      dataType: 'json'
    }).
    done(function(data, stC, $xhr) {
      var stats = [],
          maxScore;
      if($xhr.status == 202) {
        console.log("retrying..");
        setTimeout(this.fetchContributors, 2000)
      }
      if(!data.length <= 0) {
        maxScore = _.max(data, function(commit) { return commit.total }).total;

        _.each(data, function(commit, i) {
          stats[i] = { id: commit.author.id, username: commit.author.login, avatar: commit.author.avatar_url, total: commit.total, progress: Math.round10(commit.total * 100 / maxScore, -2) }
        });

        stats = stats.sort(function(prev, nxt) { return nxt.total - prev.total })

        this.setState({
          stats: stats
        });
      }
    }.bind(this)).
    fail(function() {
      console.log("Failed with indignity!!")
    });
  },

  componentDidMount: function() {
    this.fetchContributors();
  },

  render: function() {
    var contributions = this.state.stats.map(function(data) {
      return <ContributionGraph key = {data.id} stat = {data} />
    });

    return (
      <div className = "top-container">
        <Header />
        <div className = "container">
          <div className = "row">
            <div className = "text-center">
              <small><em> % with respect to max number of commits </em></small>
            </div>
           </div>
          <div className = "row">
            { contributions }
          </div>
        </div>
      </div>
    );
  }
});
