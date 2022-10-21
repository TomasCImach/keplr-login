import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment';
import * as api from "../../components/directus.api";
import timeAgo from "../../helpers/timeago";
const heart = "../../assets/icons/heart.svg";
const comment = "../../assets/icons/comment.svg";

export default function Feed() {
  const [feed, setFeed] = useState<any>();
  const [events, setEvents] = useState<any>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !feed) {
      api.getFeedItem(id).then((data) => setFeed(data));
      //api.getEventFeed(id).then((data) => setFeed(data));
    }
  }, [feed]);

  return feed?.map((item: any) => {
    return (
      <section id="content" key={item.date_created}>
          <div
            className="back_button"
            onClick={() => navigate(`/`)}
          >
            Back Button
          </div>
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
              <p className="m-b">{item.content}</p>
            </div>
          </div>
          <div>
            <section className="social_Feed">
              <div>
                <p className="content">
                  {item.events?.map((event: any) => {
                    return (
                      <div className="user">
                      <div className="user_image">
                        <img
                          src={`#`}
                          className="img-circle"
                        />
                      </div>
                      <div className="user_detail">
                        <div className="h4">John Doe <small className="date_created">{moment(event.date_created).fromNow()}</small></div>
                        <p className="m-b">{event.event_value}</p>
                      </div>
                    </div>
                    );
                  })}
                </p>
              </div>
            </section>
          </div>
        </section>
      </section>
    );
  });
}
