var PaginateRepos = React.createClass({
  handleFetch: function() {
    this.props.onFetch(this.props.language, this.props.page);
  },
  render: function() {
    return (
      <div className = {"col-xs-" + 12/this.props.n_links} >
        <a href={"#search_repos/" + this.props.language + "/" + this.props.page} className = "btn btn-primary btn-xs" onClick = { this.handleFetch } role="button">
          { this.props.nate }
        </a>
      </div>
    );
  }
});

var SearchRepoForm = React.createClass({
  handleSearch: function(e) {
    e.preventDefault();
    this.props.onSearchRepo(this.props.q || this.refs.language.getDOMNode().value)
  },
  render: function() {
    return (
      <div className = "row">
        <div className = "col-xs-12 form-horizontal">
          <div className = "col-xs-8 col-sm-9">
            <input type="text" ref="language" className="form-control"/>
          </div>
          <div className = "col-xs-4 col-sm-3">
            <a href = "#" role="button" className="btn btn-primary" onClick = {this.handleSearch}> Search </a>
          </div>
        </div>
      </div>
    );
  }
});

var SearchRepoData = React.createClass({
  render: function() {
    var repo = this.props.repository;
    return(
      <div className = "col-xs-12">
        <div className = "row">
          <div className = "col-xs-6">
            <div>
              <a href={"#contributions/" + repo.owner + "/" + repo.name}> { repo.name } </a>
            </div>
            <div> { repo.description } </div>
          </div>
          <div className = "col-xs-6">
            <div> By: <a href={"#users/" + repo.owner }> {repo.owner} </a> </div>
            <div>
              <span>source: <a href={ repo.html_url }> github </a></span>
              <span>forks: { repo.forks } </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var SearchRepos = React.createClass({
  getInitialState : function() {
    return {
      language: '',
      repositories: [],
      pages: {}
    }
  },

  searchRepo: function(v, page) {
    this.setState({
      language: v
    });

    var page = page || 1
    var xhr = $.ajax({
      url: 'https://api.github.com/search/repositories',
      type: 'GET',
      data: { q: 'language:' + v, page: (page || 1)}
    });

    xhr.done(function(data, sC, $xhr) {
      var regex = /(?:page=)(\d+)[^\w]+(?:rel=)"([^"]+)"/g,
          pages = {};
      var repos = data.items.map(function(data) {
        return {id: data.id, url: data.html_url,
          description: data.description, forks: data.forks,
          name: data.full_name, owner: data.owner.login}
        });

        if(link = $xhr.getResponseHeader('Link')) {
          while(m = regex.exec(link)) {
            if(m) pages[m[2]] = m[1];
          }
        }

        this.setState({
          repositories: repos,
          pages: pages
        });
      }.bind(this));

      xhr.fail(function(){
        this.setState({
          errors: 'Something went wrong!!'
        });
      }.bind(this));
    },
    render: function() {
      var searchData = this.state.repositories.map(function(repo) {
        return <SearchRepoData key = { repo.id } repository = {repo} />
      });
      var tot_pages = Object.keys(this.state.pages);

      var pages = _.map(this.state.pages, function(page, i) {
        return <PaginateRepos key = {i} page = {page} nate = {i} n_links = {tot_pages.length} language = { this.state.language } onFetch = { this.searchRepo } />
      }.bind(this));

      return(
        <div className = "top-container">
          <Header />
          <div className = "container">
            <div className = "row">
              <SearchRepoForm onSearchRepo = { this.searchRepo } q = {this.state.language}/>
            </div>
            <div className = "row">
              { searchData }
            </div>
            <div className = "row">
              { pages }
            </div>
            <Footer />
          </div>
        </div>
      );
    }
  });
