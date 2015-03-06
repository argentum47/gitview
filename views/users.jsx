var User = React.createClass({
  getInitialState: function(){
    return {
      details: {}
    }
  },
  handleDelete: function(e) {
    this.props.onDelete($(e.target).data('id'))
  },

  fetchUserDetails: function() {
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + this.props.user.get("username") ,
      dataType: 'json'
    }).done(function(data, sc,$xhr) {
      this.setState({
        details: {username: data.login,
                  avatar: data.avatar_url,
                  html_url: data.html_url,
                  email: data.email}
      });
    }.bind(this))
  },

  componentDidMount: function() {
    this.fetchUserDetails();
  },
  render: function() {
    var avatar = this.state.details.avatar;
    return (
      <div className="col-xs-6 col-sm-4 col-md-3">
        <div className="card-container-xs">
          <div className="card">
            <div className="cover">
              <img className="avatar" width={avatar ? "100": ""} height={avatar ? "100": ""}  src={avatar ? (avatar + "&size=100") : "public/css/loader.GIF"}/>
              <div className="info">
                <div className="user-name">
                  <a href={"#users/" + this.props.user.get("username")}>{this.props.user.get("username")}</a>
                </div>
                <div>
                  <small><a href={this.state.details.html_url}>Profile</a></small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Users = React.createClass({
  getInitialState : function() {
    return {
      users: this.props.users,
      errors: ''
    }
  },

  addUser: function(m) {
    var userCollection = this.props.users,
        id = userCollection.isEmpty() ? 1 : +(_.max(userCollection.pluck('id')) + 1);
        m = m.replace(/\s/g, '');

    userCollection.create({id: id, username: m});
    this.setState({
      users: userCollection
    });
    this.props.handleChange(this.state.users);
  },

  deleteUser: function(id) {
    var userCollection = this.state.users;
    userCollection.get(id).destroy()
    this.setState({
      users: userCollection
    });
    this.props.handleChange(this.state.users);
  },

  errorHandle: function(msg) {
    this.setState({
      errors: msg
    });
  },

  render: function() {
    var errorComp = '',
    users = this.state.users.map(function(user) {
      return <User key = { user.id } user = {user} onDelete = {this.deleteUser} handleChange = { this.props.handleChange }/>
    }.bind(this));

    if(this.state.errors) {
      errorComp = <Error message = { this.state.errors }/>
    }

    return (
      <div id = "users" className = "col-xs-12 tab-pane">
        <div className = "row">
         <div className ="col-xs-12">
           { errorComp }
         </div>
         <div className = "col-xs-12">
      <div className="row row-centered">
        { users }
      </div>
         </div>
       </div>
     </div>
    );
  },
});

var Home = React.createClass({
  getInitialState: function() {
    return {
      users: this.props.users
      }
  },
  updateUsers: function(users) {
    this.setState({
      users: users
    });
  },
  render: function() {
    var TabbedArea = ReactBootstrap.TabbedArea,
        TabPane = ReactBootstrap.TabPane;
    return (
      <div className = "top-container">
        <Header />
        <div className = "container">
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab="Users"><Users users = { this.state.users } handleChange = {this.updateUsers}/></TabPane>
            <TabPane eventKey={2} tab="Notifications"><Notifications users = { this.state.users }/></TabPane>
          </TabbedArea>
        </div>
      </div>
    );
  }
});
