import { useEffect, useState } from "react";
import instance from "../../api/instance";
const Share = () => {
  const [open, setOpen] = useState(false);

  const getPub = async () => {
    const res = await instance.get("/users/publicToggle");
    console.log(res.data.status);
    setOpen(!res.data.status);
  };
  const onPub = async () => {
    setOpen(!open);
    await instance.post("/users/publicToggle", { open });
  
  };
  useEffect(() => {
    async function fetchData() {
      await getPub();
    }
    fetchData();
  }, []);
  return (
    <div>
      {open ? (
        <span>
          <span
            style={{
              textAlign: "right",
              paddingRight: "10px",
              width: "180px",
              display: "inline-block",
            }}
          >
            이메일 공개: 공개
          </span>
          <img src="/assets/img/toggle_on.png" onClick={onPub} />
        </span>
      ) : (
        <span>
          <span
            style={{
              textAlign: "right",
              paddingRight: "10px",
              width: "180px",
              display: "inline-block",
            }}
          >
            이메일 공개: 비 공개
          </span>
          <img src="/assets/img/toggle_off.png" onClick={onPub} />
        </span>
      )}
    </div>
  );
};

export default Share;
