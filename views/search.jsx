var SearchForm = React.createClass({
  handleSearch: function() {
    this.props.onSearch(this.refs.username.getDOMNode().value);
  },
  render: function() {
    return (
      <div className = "row">
        <div className = "col-xs-12 form-horizontal">
          <div className = "col-xs-8 col-sm-9">
            <input type="text" ref="username" className="form-control"/>
          </div>
          <div className = "col-xs-4 col-sm-3">
            <button type="button" className="btn btn-primary" onClick = {this.handleSearch}> Search </button>
          </div>
        </div>
      </div>
    );
  }
})

var SearchData = React.createClass({
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
            Add
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

  render: function() {
    var errorComp = '',
        searchData = this.state.data.map(function(data) {
          return <SearchData user = {data} />
        });

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
            <SearchForm onSearch = { this.searchUser } />
          </div>
          <div className = "row">
           { searchData }
          </div>
        </div>
      </div>
    );
  }
})
