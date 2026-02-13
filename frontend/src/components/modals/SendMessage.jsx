import { useContext, useEffect, useState } from "react";
import { ShowMessage } from "../../contexts/show_message";
import { PublicUsers } from "../../contexts/show_message";
import style from "./SendMessage.module.scss";

import "./SendMessage.css";
import instance from "../../api/instance";
import socket from "../../socket";

const SendMessage = () => {
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState("");
  const { show, setShow } = useContext(ShowMessage);
  const { members, setMember } = useContext(PublicUsers);
  const onChange = (e) => {
    const { value } = e.target;
    console.log(value);
    setEmail(value);
  };
  const selectUser = (email) => {
    console.log(email);
    if (selected.includes(email)) {
      setSelected(selected.filter((user) => user !== email));
    } else {
      setSelected([email, ...selected]);
    }
  };
  const sendInvitation = async () => {
    console.log(selected, "location", show.location, "tripId", show.tripId);
    const requests = selected.map(
      (select) =>
        new Promise((resolve, reject) => {
          socket.emit(
            "send_to_user",
            {
              reciever: select,
              location: show.location,
              tripId: show.tripId,
            },
            (response) => {
              if (response.success) {
                resolve(response);
              } else {
                reject(response.error);
              }
            },
          );
        }),
    );
    Promise.all(requests)
      .then((responses) => {
        responses.forEach((res) => console.log(res));
      })
      .catch((e) => console.error(e));
    // await instance.post("/companion");
  };
  return (
    <div>
      <div className={`send_message_wrapper ${show.visible ? "active" : ""}`}>
        <div className={style.addMember}>
          <input
            type="text"
            placeholder="이메일 입력"
            value={email}
            onChange={onChange}
          />
          <button
            onClick={() => {
              if (email) {
                setMember([{ email }, ...members]);
              }
              setEmail("");
            }}
          >
            추가
          </button>
        </div>

        {members.length > 0 &&
          members.map((member) => {
            return (
              <div key={member.id} className={style.members}>
                <label style={{ width: "100px" }}>
                  <b>{member.email}</b>
                </label>
                <input
                  type="checkbox"
                  checked={selected.includes(member.email)}
                  onChange={() => selectUser(member.email)}
                />
              </div>
            );
          })}

        <div className="buttons">
          <button onClick={sendInvitation}>보내기</button>
          <button
            onClick={() => {
              setShow({ visible: false, location: null });
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
