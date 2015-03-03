var Link = React.createClass({
    render: function() {
        return (
            <a href={ this.props.href } className = { this.props.className }>
              { this.props.children }
            </a>
        )
    }
});

var Header = React.createClass({
  render: function() {
var Navbar = ReactBootstrap.Navbar,
      NavItem = ReactBootstrap.NavItem,
      Nav = ReactBootstrap.Nav;
      var brand = (
        <Link href="#" className="navbar-brand">
          GitView
        </Link>
    );
    return (
      <Navbar brand={brand} fixedTop toggleNavKey={0}>
        <Nav right eventKey={0}>
          <NavItem eventKey={1} href="#search">Search</NavItem>
          <NavItem eventKey={1} href="#notifications">Notifications</NavItem>
        </Nav>
      </Navbar>
    );
  }
});

var Error = React.createClass({
  getInitialState: function() {
    return {
      alertVisible: true
    };
  },
  render: function() {
    var Alert = ReactBootstrap.Alert,
    Button = ReactBootstrap.Button;

    if (this.state.alertVisible) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
          <span> { this.props.message} </span>
        </Alert>
      );
    }
    return (
      <span></span>
    );
  },
  handleAlertDismiss: function() {
    this.setState({alertVisible: false});
  }
});

var UserImage = React.createClass({
  shouldComponentUpdate: function(nxtProps, nxtState) {
    return nxtProps.src != this.props.src
  },
  render: function() {
    if(this.props.className) {
      return (
        <img src = {this.props.src} className = { this.props.className }/>
      );
    }
    return (
      <img src = {this.props.src} />
    );
  }
});
