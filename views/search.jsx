var SearchForm = React.createClass({
  handleSearch: function(e) {
    e.preventDefault();
    this.props.onSearch(this.props.q || this.refs.username.getDOMNode().value);
  },
  render: function() {
    return (
      <div className = "row">
        <div className = "col-xs-12 form-horizontal">
          <div className = "col-xs-8 col-sm-9">
            <input type="text" ref="username" className="form-control"/>
          </div>
          <div className = "col-xs-4 col-sm-3">
            <a href = "#" role="button" className="btn btn-primary" onClick = {this.handleSearch}> Search </a>
          </div>
        </div>
      </div>
    );
  }
})

var SearchData = React.createClass({
  handleAdd: function (e) {
    e.preventDefault();
    this.props.onAddUser($(e.target).data('name'))
  },
  render: function() {
    return (
      <div className = "col-xs-12">
        <div className = "row">
          <div className = "col-xs-3">
            <img src = {this.props.user.avatar} className = "col-xs-12"/>
          </div>
          <div className = "col-xs-6">
            <div className = "row">
              <div className = "col-xs-12">
                <a href={ "#users/" + this.props.user.username}>{ this.props.user.username }</a>
              </div>
              <div className = "col-xs-12">
                <a href={this.props.user.link}> Profile on Github</a>
              </div>
            </div>
          </div>
          <div className = "col-xs-3">
            <a href='#' className = "btn btn-primary btn-xs" data-name = {this.props.user.username} onClick = {this.handleAdd}>Add</a>
          </div>
        </div>
      </div>
    );
  }
})

var Search = React.createClass({
  getInitialState: function(){
    return {
      data: [],
      errors: ''
    }
  },

  searchUser: function(search) {
    var xhr = $.ajax({
      type: 'GET',
      url: 'https://api.github.com/search/users',
      data: { q: search }
    });

    xhr.done(function(data, sC, $xhr) {
      var results = data.items.map(function(data) {
        return { id: data.id, username: data.login, avatar: data.avatar_url, link: data.html_url}
      });
      this.setState({
        data: results
      });
    }.bind(this))

    xhr.fail(function() {
      this.setState({
        errors: 'Something went wrong!!'
      }.bind(this));
    });
  },

  addUser: function(m) {
    var userCollection = this.props.users,
        results = this.state.data,
        id = userCollection.isEmpty() ? 1 : +(_.max(userCollection.pluck('id')) + 1);
        m = m.replace(/\s/g, '');

    userCollection.create({id: id, username: m});
    results = results.filter(function(data) {
      return data.username != m;
    });
    this.setState({
      data: results
    });
  },
  render: function() {
    var errorComp = '',
        usernames = this.props.users.pluck('username');
        searchData = this.state.data.map(function(data) {
          if(usernames.indexOf(data.username) == -1) return <SearchData user = {data} onAddUser = {this.addUser}/>
        }.bind(this));

    if(this.state.errors) {
      errorComp = <Error message = { this.state.errors }/>
    }

    return (
      <div className = "top-container">
        <Header />
        <div className = "container">
          <div className = "row">
            { errorComp }
          </div>
          <div className = "row">
            <SearchForm onSearch = { this.searchUser } q = {this.props.q}/>
          </div>
          <div className = "row">
           { searchData }
          </div>
          <Footer />
        </div>
      </div>
    );
  }
})
