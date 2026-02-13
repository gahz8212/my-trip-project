import { useEffect, useContext } from "react";
import style from "./RecieveMessage.module.scss";
import "./RecieveMessage.css";
import instance from "../../api/instance";
import { useMessageStore } from "../../store/messageStore";
import { TripList } from "../../contexts/tripList";
import { Reply } from "../../contexts/show_message";

const RecieveMessage = () => {
  const { reply, setReply } = useContext(Reply);
  const { updateTripList } = useContext(TripList);
  const { nextMessage, clearMessage, messages, latestMessage } =
    useMessageStore();

  useEffect(() => {
    console.log("messages", messages);
    if (latestMessage) {
      setReply(true);
    } else {
      setReply(false);
    }
  }, [messages]);

  if (!latestMessage) return null;

  const confirm = async () => {
    try {
      const res = await instance.post("/companion/group", {
        tripId: latestMessage.tripId,
      });
      if (res.data.message === "ok") {
        updateTripList(true);
        nextMessage();
      } else {
        alert(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const abort = () => {
    setReply(false);
    nextMessage();
  };
  return (
    <div>
      <div className={`recieve_message_wrapper ${reply ? "active" : ""}`}>
        <div className={style.header}>
          <b>메세지</b>
        </div>
        <div className={style.body}>
          {messages.map((message, index) => (
            <div key={index} className={style.contents}>
              <div>
                <b>{message.from}</b>님이
              </div>
              <span>
                <b>{message.location}</b>사진을 보냈습니다.
              </span>
            </div>
          ))}
        </div>
        <div className={style.buttons}>
          <button onClick={confirm}>확인</button>
          <button onClick={abort}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default RecieveMessage;
