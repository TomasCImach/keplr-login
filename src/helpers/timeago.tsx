import moment from "moment";

export default function TimeAgo({ date }: any) {
  return moment(date).fromNow();
}
