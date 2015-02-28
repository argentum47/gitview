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
      <div className = "row">
        <div className = "col-xs-12 form-horizontal">
          <div className = "col-xs-8 col-sm-9">
            <input type="text" ref="username" className="form-control"/>
          </div>
          <div className = "col-xs-4 col-sm-3">
            <button type="button" className="btn btn-primary" onClick = {this.handleAdd}> Add User</button>
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
      <li className="list-group-item">
          <a href={ "#users/" + this.props.user.get('username') }> { this.props.user.get('username') } </a>
          <button type="button" className="close" data-id = { this.props.user.get('id')  } onClick = { this.handleDelete }><span aria-hidden="true">&times;</span></button>
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
      <div className = "top-container">
        <Header />
        <div className = "container">
          <NewUser onAddUser = { this.addUser } onError = {this.errorHandle}/>
          <div className = "row">
            <div className = "col-xs-12">
              { errorComp }
            </div>
            <div className = "col-xs-12">
              <h2>Listing Users</h2>
            </div>
            <div className = "col-xs-12">
              <ul className = "list-group">
                { users }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
