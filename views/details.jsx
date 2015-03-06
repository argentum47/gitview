var Paginate = React.createClass({
  handleFetch: function() {
    this.props.onFetch();
  },
  render: function() {
    return (
      <div className = {"col-xs-" + 12/this.props.n_links} >
        <a href={"#users/" + this.props.username + "/" + this.props.page} className = "btn btn-primary btn-xs" onClick = { this.handleFetch } role="button">
          { this.props.nate }
        </a>
      </div>
    );
  }
});

var Repo = React.createClass({
  render: function() {
    var repo = this.props.repository,
        alternateBg = {
          background: this.props.idx%2 == 0 ? "transparent" : "#eee"
        };
    if(repo.name)
    return (
      <li className="list-group-item" style={alternateBg}>
      <div className = "row">
        <div className = "col-xs-6 repo-name">
          <a href={repo.html_url}>{repo.name}</a>
        </div>
        <div className = "col-xs-6">
          <a href={"#contributions/" + repo.owner + "/" + repo.name} className="tab">Contributions</a>
        </div>
      </div>
      </li>
    );
    else
      return(
        <li className="list-group-item text-center">{repo}</li>
      );
  }
});

var Details = React.createClass({
  getInitialState : function() {
    return {
      details: {},
      repos: ['Fetching'],
      pages: {}
    }
  },

  fetchUserDetails: function() {
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/users/' + this.props.user.username ,
      dataType: 'json'
    }).done(function(data, sc,$xhr) {
      this.setState({
        details: {username: data.login, avatar: data.avatar_url, html_url: data.html_url, name: data.name, email: data.email, followers: data.followers, following: data.following, repos: data.public_repos, gists: data.public_gists}
      })
    }.bind(this))
  },

  fetchRepoDetails : function() {
    var regex = /(?:page=)(\d+)[^\w]+(?:rel=)"([^"]+)"/g,
    page = this.props.page,
    pages = {};

    this.fetchUserDetails();
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
          repos: data.map(function(el) { return { id: el.id, html_url: el.html_url, name: el.name, owner: this.state.details.username } }.bind(this)),
          pages: pages
        });
      }
    }.bind(this))
  },


  componentDidMount: function() {
    this.fetchRepoDetails();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(prevProps.page !== this.props.page)
      this.fetchRepoDetails();
  },

  render: function() {
    var username = this.props.user.username,
    pages = '',
    avatar = '',
    tot_pages = '',
    repos = this.state.repos.map(function(data, i) {
      return <Repo key = { data.id } idx={i} repository = {data} />;
    }),
    tot_pages = Object.keys(this.state.pages);


    pages = _.map(this.state.pages, function(data, i) {
      return <Paginate key = {i} page = { data } nate = { i } n_links = {tot_pages.length} username = { username } onFetch = { this.fetchRepoDetails } />
    }.bind(this));

    avatar = this.state.details.avatar;
    return (
      <div className = "top-container">
        <Header />
        <div className = "card-container-md">
          <div className="card">
            <div className="cover">
            </div>
            <div className="user">
              <img src={avatar ? (avatar + "&size=100") : "public/css/loader.GIF" } alt="gravatar" width={avatar ? "100" : ""} height={avatar ? "100" : ""}/>
            <div className="details">
                <div><small style={{color: "#5dd"}}> {username} </small></div>
                <div><small> {this.state.details.email} </small></div>
                <div><small><span className="badge">{ this.state.details.followers}</span> Followers</small></div>
                <div><small><span className="badge">{ this.state.details.following}</span> Following </small></div>
              </div>
            </div>
            <div className="user-name"> { this.state.details.name } </div>
          </div>
        </div>
        <div className = "container">
          <div className="row">
            <div className = "col-xs-12 col-sm-6">
              <ul className="list-group">
                { repos.length > 0 ? repos : <li className="list-group-item text-center">None</li> }
             </ul>
            </div>
          </div>
          <div className = "row">
            { pages }
          </div>
         <div className="row row-centered">
           <div className="footer">
             Collaborators argentum47 & agnivChandra
           </div>
         </div>
        </div>
      </div>
    );
  }
});
