export default function Feed() {
  return (
    <section id="content">
      <section className="social_Feed">
        <div className="user">
          <div className="user_image">
            <img
              src="https://via.placeholder.com/50"
              className="img-circle"
            />
          </div>
          <div className="user_detail">
            <div className="h4">John Doe</div>
            <small className="text-muted m-b">SubTitle</small>
          </div>
        </div>
        <div>
          <div className="content_image">
            <img src="https://via.placeholder.com/500" />
          </div>
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            placerat eros vitae nibh lacinia, quis rutrum ipsum vulputate. . . .
            . .
          </p>
        </div>
      </section>
      <section className="social_Feed">
        <div className="user">
          <div className="user_image">
            <img
              src="https://via.placeholder.com/50"
              className="img-circle"
            />
          </div>
          <div className="user_detail">
            <div className="h4">John Doe</div>
            <small className="text-muted m-b">SubTitle</small>
          </div>
        </div>
        <div>
          <img src="https://via.placeholder.com/500" />
          <p className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            placerat eros vitae nibh lacinia, quis rutrum ipsum vulputate. . . .
            . .
          </p>
        </div>
      </section>
    </section>
  );
}
