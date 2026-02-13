/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Board";
import RecieveMessage from "./components/modals/RecieveMessage";
import SendMessage from "./components/modals/SendMessage";
import { Routes, Route } from "react-router";
import DashBoard from "./pages/DashBoard";
import Board from "./pages/Board";
import Album from "./pages/Album";
import Theme from "./pages/Theme";
import Loading from "./components/Loading";
import { DisplayOnAuth } from "./contexts/display_on_Auth";
import { ShowMessage } from "./contexts/show_message";
import { PublicUsers } from "./contexts/show_message";
import { Reply } from "./contexts/show_message";
import { TripList } from "./contexts/tripList";
import "./App.css";
import socket from "./socket";

function App() {
  const { user, isChecking, checkAuth } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState({
    visible: false,
    location: null,
    tripId: null,
  });
  const [reply, setReply] = useState(false);
  const [updateList, updateTripList] = useState(false);
  const [members, setMember] = useState([]);
  useEffect(() => {
    if (socket.id) return;
    socket.connect();
    socket.on("connect", () => {
      console.log("새로고침 후 재연결 성공:", socket.id);
    });
  }, []);
  useEffect(() => {
    // 새로고침 하자마자 서버에 세션 유효성 확인
    checkAuth();
  }, []);
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          opcity: 0.2,
        }}
      >
        {/* <p>로그인 상태를 확인하고 있습니다...</p> */}
        <Loading />
      </div>
    );
  }
  return (
    <div className="App">
      <DisplayOnAuth.Provider value={{ posts, setPosts }}>
        <ShowMessage.Provider value={{ show, setShow }}>
          <Reply.Provider value={{ reply, setReply }}>
            <PublicUsers.Provider value={{ members, setMember }}>
              <TripList.Provider value={{ updateList, updateTripList }}>
                <Header />
                <div
                  className="spacer"
                  style={{
                    paddingTop: "200px",
                    position: "relative",
                    background: "blue",
                  }}
                >
                  <RecieveMessage />
                  <SendMessage />
                </div>
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dash" element={<DashBoard />} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/album" element={<Album />} />
                    <Route path="/theme" element={<Theme />} />
                  </Routes>
                </main>
              </TripList.Provider>
            </PublicUsers.Provider>
          </Reply.Provider>
        </ShowMessage.Provider>
      </DisplayOnAuth.Provider>
      <Footer />
    </div>
  );
}

export default App;
