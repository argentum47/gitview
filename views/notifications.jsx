var Events = {};
/* Events.RepositoryComponent = React.createClass({
render: function() {
return (
<li className = "list-group-item">
{ this.props.data.repository.owner.login } { this.props.data.action } { this.props.repository.full_name }
</li>
);
}
});

Events.ForkComponent = React.createClass({
render: function() {
return (
<li className = "list-group-item">
<a href = { this.props.data.forkee.sender.html_url }> { this.props.data.forkee.sender.login } </a>
forked
<a href = { this.props.data.repository.html_url }> { this.props.data.repository.full_name } </a>
</li>
);
}
});

*/

Events.PublicComponent = React.createClass({
  render: function() {
    var repository = this.props.data.repository;
    return (
      <li className = "list-group-item">
        { repository.owner.login } open sourced <a href = {repository.html_url} title="repo url"> {repository.name} </a>
    </li>
  );
}
});

Events.MemberComponent = React.createClass({
  render: function() {
    return (
      <li className = "list-group-item">
        <a href={this.props.data.repository.owner.html_url}> {this.props.data.repository.owner.login} </a>
        { this.props.data.action } <a href = {this.props.data.member.html_url}> { this.props.data.member.login } </a> to <a href = { this.props.data.repository.html_url}> { this.props.repository.full_name} </a>
    </li>
  );
}
});

Events.DeleteComponent = React.createClass({
  render: function() {
    return (
      <li className = "list-group-item">
        <a href = { "#users/" + this.props.data.actor.login}>{ this.props.data.actor.login } </a>
        deleted {this.props.data.payload.ref_type} { this.props.data.payload.ref } in
        <a href = { this.props.data.repo.url }> { this.props.data.repo.name }</a>
      </li>
    );
  }
});

Events.CreateComponent = React.createClass({
  render: function() {
    return (
      <li className = "list-group-item">
        <a href = { "#users/" + this.props.data.actor.login}>{ this.props.data.actor.login } </a>
        created { this.props.data.payload.ref_type} { this.props.data.payload.ref } in
        <a href = { this.props.data.repo.url }> { this.props.data.repo.name }</a>
      </li>
    );
  }
});

/* toBeAdded : ["PushEvent", "PullRequestReviewCommentEvent", "PullRequestEvent", "IssueEvent", "IssueCommentEvent"]
neverFired : ["RepositoryEvent", "ForkEvent"] */
var Notification = React.createClass({
  getInitialState: function() {
    return {
      toWatch: ["PublicEvent", "MemberEvent", "DeleteEvent", "CreateEvent"],
      components: [Events.PublicComponent,
      Events.MemberComponent,
      Events.DeleteComponent, Events.CreateComponent],
      notifiers: []
    }
  },
  fetchEvents: function() {
    var notifiers = [];
    $.ajax({
      type: "GET",
      url: "https://api.github.com/users/" + this.props.username + "/events",
      dataType: "json"
    }).done(function(data, sC, $xhr) {
      if(data.length > 0) {
        _.each(data, function(head) {
          if(this.state.toWatch.indexOf(head.type) > -1) {
            notifiers.push(head)
          }
          console.log($xhr.response)
        }.bind(this));

        this.setState({
          notifiers: notifiers
        });
      }
    }.bind(this))
  },
  componentDidMount: function() {
    this.fetchEvents();
    setInterval(this.fetchEvents, this.props.pollInterval || 600000)
  },
  render: function() {
    var notifications = this.state.notifiers.map(function(data) {
      var idx = this.state.toWatch.indexOf(data.type),
      Event = this.state.components[idx];
      return <Event data = { data } />
    }.bind(this));

    return (
      <ul className = "list-group">
        { notifications }
      </ul>
    );
  }
});

var Notifications = React.createClass({
  render: function() {
    var allNotifications = this.props.users.map(function(user) {
      return <Notification username = { user.get('username') }/>
    }.bind(this));

    return (
      <div id = "updates" className = "col-xs-12 tab-pane active">
        { allNotifications }
      </div>
    );
  }
});
