
var ContributionGraph = React.createClass({
  render : function() {
    return (
      <div className = "col-xs-12">
        <div className = "row">
          <div className = "col-xs-3">
            <img src = {this.props.stat.avatar + "&size=50"} className = "col-xs-12"/>
          </div>
          <div className = "col-xs-6">
            { this.props.stat.total }
          </div>
          <div className = "col-xs-3">
            { this.props.stat.username }
          </div>
        </div>
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
      var stats = [];
      if($xhr.status == 202) {
        console.log("retrying..");
        setTimeout(this.fetchContributors, 2000)
      }
      if(!data.length <= 0) {
        for(var i in data) {
          stats[i] = { id: data[i].author.id, username: data[i].author.login, avatar: data[i].author.avatar_url, total: data[i].total }
        }
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
            { contributions }
          </div>
        </div>
      </div>
    );
  }
});
