export default function Profile() {
  return (
    <section id="content">
      <section className="panel panel-default">
        <div className="panel-body">
          <div className="clearfix m-t">
            <div className="inline">
              <div className="easypiechart">
                <div className="thumb-lg">
                  <img src="images/a5.png" className="img-circle" />
                </div>
              </div>
              <div className="h4 m-t m-b-xs">John Doe</div>
              <small className="text-muted m-b">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget nibh rutrum, porta sapien a, maximus arcu.</small>
            </div>
          </div>
        </div>
        <footer className="panel-footer bg-info text-center">
          <div className="row pull-out">
            <div className="col-xs-4">
              <div className="padder-v">
                <span className="m-b-xs h3 block text-white">245</span>
                <small className="text-muted">Followers</small>
              </div>
            </div>
            <div className="col-xs-4 dk">
              <div className="padder-v">
                <span className="m-b-xs h3 block text-white">55</span>
                <small className="text-muted">Following</small>
              </div>
            </div>
            <div className="col-xs-4">
              <div className="padder-v">
                <span className="m-b-xs h3 block text-white">2,035</span>
                <small className="text-muted">Tweets</small>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </section>
  );
}
