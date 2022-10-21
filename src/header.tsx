
export default function Header() {
  return (
    <header className="bg-white header header-md navbar navbar-fixed-top box-shadow min_width center">
      <div className="navbar-header aside-md dk">
        <a href="/" className="navbar-brand">
          {/*<img src="images/logo.png" className="m-r-sm" alt="scale" />*/}
          <span className="hidden-nav-xs">LOOP</span>
        </a>
        <a
          className="btn btn-link visible-xs"
          data-toggle="dropdown"
          data-target=".user"
        >
          <span className="thumb-sm avatar pull-left">
            <img src="https://via.placeholder.com/50" alt="..." />
          </span>
          <b className="caret"></b>
        </a>
      </div>
      <ul className="nav navbar-nav navbar-right m-n hidden-xs nav-user user">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">
            <span className="thumb-sm avatar pull-left">
              <img src="https://via.placeholder.com/50" alt="..." />
            </span>
            <b className="caret"></b>
          </a>
          <ul className="dropdown-menu animated fadeInRight">
            <li>
              <a href="/login">Register</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="#">
                <span className="badge bg-danger pull-right">3</span>
                Notifications
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="modal.lockme.html" data-toggle="ajaxModal">
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
}
