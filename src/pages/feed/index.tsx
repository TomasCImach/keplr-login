import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import timeAgo from "../../helpers/timeago";
import * as api from "../../components/directus.api";
const heart = "../../assets/icons/heart.svg";
const comment = "../../assets/icons/comment.svg";

export default function Feed() {
  const navigate = useNavigate();
  const [feed, setFeed] = useState<any>();

  useEffect(() => {
    if (!feed) {
      api.getFeed().then((data) => setFeed(data));
    }
  }, [feed]);

  return (
  <section id="content">
    {feed?.map((item: any) => {
      return (
          <section className="social_Feed">
            <div className="user">
              <div className="user_image">
                <img
                  src={`https://loop-markets.directus.app/assets/${item.author.avatar}`}
                  className="img-circle"
                />
              </div>
              <div className="user_detail">
                <div className="h4">{item.author.first_name} <small className="date_created">{timeAgo(item.date_created)}</small></div>
                <small className="text-muted m-b">{item.author.title}</small>
              </div>
            </div>
            <div>
              <div className="content_image">
                <img src={`https://loop-markets.directus.app/assets/${item.image.id}`} />
              </div>
              <p className="content">
                <div className="actions">
                  <img src={heart} />
                  <img src={comment} onClick={() => {navigate(`/p/${item.id}`)}} />
                </div>
                <p
                  onClick={() => {navigate(`/p/${item.id}`)}}
                >
                  <b>{item.author.first_name}:</b> {item.content}
                </p>
              </p>
            </div>
          </section>
      );
    })}
  </section>
  );
}
