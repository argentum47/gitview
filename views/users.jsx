var NewUser = React.createClass({
  findThenAdd : function(e) {
    var username = this.refs.username.getDOMNode().value;
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + username,
      dataType: 'json'
    }).done(function(data, sC, $xhr) {
      if($xhr.status == 202) {
        console.log("retrying..")
      }
      this.props.onAddUser(username);
    }.bind(this)).fail(function() {
      this.props.onError("Username doesn't exists");
    }.bind(this));

    this.refs.username.getDOMNode().value = "";
  },

  handleAdd: function(e) {
    this.findThenAdd()
  },

  render: function() {
    return (
      <div className = "form-horizontal">
        <div className = "form-group">
          <div className = "col-xs-8 col-sm-8">
            <input type="text" ref="username" className="form-control"/>
          </div>
          <div className = "col-sm-offset-2 col-sm-2 col-xs-4">
            <button type="submit" className="btn btn-primary" onClick = {this.handleAdd}> Add User</button>
          </div>
        </div>
      </div>
    );
  }
});

var User = React.createClass({
  handleDelete: function(e) {
    this.props.onDelete($(e.target).data('id'))
  },
  render: function() {
    return (
      <li className="list-group-item clearfix">
        <a href={ "#users/" + this.props.user.get('username') }> { this.props.user.get('username') } </a>
        <button type="button" className="close" data-id = { this.props.user.get('id')  }  data-dismiss="alert" aria-label="Close" onClick = { this.handleDelete }>
          &times;
        </button>
      </li>
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
          <div className = "col-xs-12">
            <NewUser onAddUser = { this.addUser } onError = {this.errorHandle}/>
          </div>
         <div className ="col-xs-12">
           { errorComp }
         </div>
         <div className = "col-xs-12">
           <ul className = "list-group">
             { users }
           </ul>
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

// <div className = "tabbable">
//   <ul className = "nav nav-pills nav-justified">
//     <li><a href="#notifications">Notifications</a></li>
//     <li><a href="#users">Users</a></li>
//   </ul>
//   <div className = "tab-content">
//     <Notifications users = { this.props.users } />
//     <Users users = { this.props.users } />
//   </div>
// </div>
