import { useState, useEffect } from "react";
import * as api from "../../components/directus.api";

export default function Feed() {
  const [feed, setFeed] = useState<any>();

  useEffect(() => {
    if (!feed) {
      api.getFeed().then((data) => setFeed(data));
    }
  }, [feed]);

  return feed?.map((item: any) => {
    console.log(item)
    return (
      <section id="content">
        <section className="social_Feed">
          <div className="user">
            <div className="user_image">
              <img
                src={`https://loop-markets.directus.app/assets/${item.author.avatar}`}
                className="img-circle"
              />
            </div>
            <div className="user_detail">
              <div className="h4">{item.author.first_name}</div>
              <small className="text-muted m-b">{item.author.title}</small>
            </div>
          </div>
          <div>
            <div className="content_image">
              <img src={`https://loop-markets.directus.app/assets/${item.image.id}`} />
            </div>
            <p className="content">
              <b>{item.author.first_name}:</b> {item.content}
            </p>
          </div>
        </section>
      </section>
    );
  });
}
