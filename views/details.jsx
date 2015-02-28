var Paginate = React.createClass({
  handleFetch: function() {
    this.props.onFetch();
  },
  render: function() {
    return (
      <div className = "col-xs-3">
        <a href={"#users/" + this.props.username + "/" + this.props.page} className = "btn btn-primary btn-xs" onClick = { this.handleFetch } role="button">
          { this.props.nate }
        </a>
      </div>
    );
  }
});

var Repo = React.createClass({
  render: function() {
    var repo = this.props.repository;
    return (
      <div className = "row">
        <div className = "col-xs-6">
          <a href={repo.html_url}>{repo.name}</a>
        </div>
        <div className = "col-xs-6">
          <a href={"#contributions/" + repo.owner + "/" + repo.name} className="tab">Contributions</a>
        </div>
      </div>
    );
  }
});

var Details = React.createClass({
  getInitialState : function() {
    return {
      img_url: '',
      repos: [],
      pages: []
    }
  },

  fetchUserDetails : function() {
    var regex = /(?:page=)(\d+)[^\w]+(?:rel=)"([^"]+)"/g,
    page = this.props.page,
    pages = {};
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + this.props.user.username + '/repos',
      data: { page: page || 1 },
      dataType: 'json'
    }).
    done(function(data, sC, $xhr) {
      if(this.isMounted()) {
        if(link = $xhr.getResponseHeader('Link')) {
          while(m = regex.exec(link)) {
            if(m) pages[m[2]] = m[1];
          }
        }
        this.setState({
          img_url: data[0].owner.avatar_url + "&size=" + Math.ceil(window.innerHeight/2),
          repos: data.map(function(el) { return { id: el.id, html_url: el.html_url, name: el.name, owner: data[0].owner.login } }),
          pages: pages
        });
      }
    }.bind(this))
  },


  componentDidMount: function() {
    this.fetchUserDetails();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.page !== this.props.page)
      this.fetchUserDetails();
  },

  render: function() {
    var username = this.props.user.username,
    pages = '',
    self = this,
    repos = this.state.repos.map(function(data) {
      return <Repo key = { data.id } repository = {data} />;
    });

    pages = _.map(this.state.pages, function(data, i) {
      return <Paginate page = { data } nate = { i } username = { username } onFetch = { self.fetchUserDetails } />
    });

    return (
      <div className = "top-container">
        <Header />
        <div className = "container">
          <div className = "col-xs-12 cover">
            <div className = "row">
              <div className = "col-xs-6">
                <a href = "#" className =  "thumbnail"> <UserImage src = { this.state.img_url }/> </a>
              </div>
              <div className = "col-xs-6">
                <div className = "page-header">
                  <h4> { username } </h4>
                </div>
              </div>
            </div>
          </div>

          <div className = "col-xs-12 navigation">
            <div className = "row">
              { pages }
            </div>
          </div>

          <div className = "col-xs-12">
            { repos }
          </div>
        </div>
      </div>
    );
  }
});
