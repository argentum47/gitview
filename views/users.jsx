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
    }.bind(this))
  },

  handleAdd: function(e) {
    this.findThenAdd()
  },

  render: function() {
    return (
      <div className = "form-inline">
        <div className = "form-group">
          <label>
            <input type="text" ref="username" className="form-control input-xs"/>
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-xs" onClick = {this.handleAdd}> Add User</button>
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
        <button type="button" className="close" data-id = { this.props.user.get('id')  }  data-dismiss="alert" aria-label="Close" onClick = { this.handleDelete }><span aria-hidden="true">&times;</span></button>
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
  },

  deleteUser: function(id) {
    var userCollection = this.state.users;
    userCollection.get(id).destroy()
    this.setState({
      users: userCollection
    });
  },

  errorHandle: function(msg) {
    this.setState({
      errors: msg
    });
  },

  render: function() {
    var errorComp = '',
    users = this.state.users.map(function(user) {
      return <User key = { user.id } user = {user} onDelete = {this.deleteUser}/>
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
  render: function() {
    var Nav = ReactBootstrap.Nav,
        NavItem = ReactBootstrap.NavItem;
    return (
      <div className = "top-container">
        <Header />
        <div className = "container">
          <div className = "row">
            <Nav bsStyle="pills" justified activeKey={1} >
              <NavItem eventKey={1} href="#users">Users</NavItem>
              <NavItem eventKey={2} href="#notifications">Notifiations</NavItem>
            </Nav>
          </div>
          <div className = "tabbed-content">
          </div>
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
