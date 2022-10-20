export default function Home() {
  return (
    <section id="content">
      <section className="vbox">
        <section className="scrollable">
          <section className="hbox stretch">
            <aside className="col-lg-4">
              <section className="vbox">
                <section className="scrollable">
                  <div className="wrapper">
                    <section className="panel panel-default">
                      <form>
                        <textarea
                          className="form-control no-border"
                          placeholder="What are you doing..."
                        ></textarea>
                      </form>
                      <footer className="panel-footer bg-light lter">
                        <button className="btn btn-info pull-right btn-sm">
                          POST
                        </button>
                        <ul className="nav nav-pills nav-sm">
                          <li>
                            <a href="#">
                              <i className="fa fa-camera text-muted"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-video-camera text-muted"></i>
                            </a>
                          </li>
                        </ul>
                      </footer>
                    </section>
                    <section className="panel panel-default">
                      <h4 className="padder">Latest Tweets</h4>
                      <ul className="list-group">
                        <li className="list-group-item">
                          <p>
                            Wellcome{" "}
                            <a href="#" className="text-info">
                              @Drew Wllon
                            </a>{" "}
                            and play this web application template, have fun1{" "}
                          </p>
                          <small className="block text-muted">
                            <i className="fa fa-clock-o"></i> 2 minuts ago
                          </small>
                        </li>
                        <li className="list-group-item">
                          <p>
                            Morbi nec{" "}
                            <a href="#" className="text-info">
                              @Jonathan George
                            </a>{" "}
                            nunc condimentum ipsum dolor sit amet, consectetur
                          </p>
                          <small className="block text-muted">
                            <i className="fa fa-clock-o"></i> 1 hour ago
                          </small>
                        </li>
                        <li className="list-group-item">
                          <p>
                            <a href="#" className="text-info">
                              @Josh Long
                            </a>{" "}
                            Vestibulum ullamcorper sodales nisi nec adipiscing
                            elit.{" "}
                          </p>
                          <small className="block text-muted">
                            <i className="fa fa-clock-o"></i> 2 hours ago
                          </small>
                        </li>
                      </ul>
                    </section>
                  </div>
                </section>
              </section>
            </aside>
          </section>
        </section>
      </section>
      <a
        href="#"
        className="hide nav-off-screen-block"
        data-toggle="className:nav-off-screen,open"
        data-target="#nav,html"
      ></a>
    </section>
  );
}
