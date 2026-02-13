import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import Loading from "./Loading";
import { useAuthStore } from "../store/authStore";
import { DisplayOnAuth } from "../contexts/display_on_Auth";
import { ShowMessage } from "../contexts/show_message";
import { PublicUsers } from "../contexts/show_message";
import { TripList } from "../contexts/tripList";
import instance from "../api/instance";
/**
 * API 기본 경로
 * - 개발(로컬): vite proxy를 통해 /api -> http://localhost:5000
 * - 배포: 같은 도메인에서 서비스하면 기본값(/api)로 동작
 * - 별도 도메인/포트로 백엔드 운영 시: .env에 VITE_API_URL=http://<host>:5000/api 지정
 */
// const API_URL = import.meta.env.VITE_API_URL || "/api";
const IMG_URL = import.meta.env.VITE_IMG_URL || "/img/";
//★ instance 객체를 사용해서 에러를 하나로 모아서 alert창으로 획일적으로 보여준다
// const instance = axios.create({
//   withCredentials: true,
// });

export let fetchPostsFunc = null;

function Board({ title = "자유 게시판" }) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [selectedFile, setSelectedFile] = useState(null)
  // const [result, setResult] = useState(null);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { posts, setPosts } = useContext(DisplayOnAuth);
  const { show, setShow } = useContext(ShowMessage);
  const { setMember } = useContext(PublicUsers);
  const { updateList, updateTripList } = useContext(TripList);
  useEffect(() => {
    fetchPosts();
    fetchPostsFunc = fetchPosts;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateList]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/posts`);
      console.log("res.data", res.data);
      setPosts(res.data);
    } catch (e) {
      // alert("게시글을 불러오지 못했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("제목을 입력하세요.");

    try {
      const res = await instance.post(`/posts`, {
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      console.log("insertId", res.data.insertId);
      const image = await sendImage(res.data.insertId);
      console.log("image", image);
      const newPost = {
        id: res.data.newPost.id,
        title: res.data.newPost.title,
        photo: image,
        tripId: res.data.insertId,
      };
      console.log("newPost", newPost);
      setPosts([newPost, ...posts]);
      setNewTitle("");
      setNewContent("");
    } catch (e) {
      console.error(e);
      // alert("글 작성에 실패했습니다.");
    }
  };

  const handleInvite = async (location, tripId) => {
    // if (!window.confirm("정말 삭제하시겠습니까?")) return;
    if (!show.visible) setShow({ visible: true, location, tripId });
    try {
      const users = await instance.get(`/users/public`);
      console.log("publicUsers", users.data.publicUsers);
      const invitableUser = users.data.publicUsers;
      invitableUser && setMember(invitableUser);
    } catch (e) {
      console.error(e);
      // alert("삭제 실패");
    }
  };
  const handleWithdrow = async (location, tripId) => {
    // if (!window.confirm("정말 삭제하시겠습니까?")) return;
    // if (!show.visible) setShow({ visible: true, location, tripId });
    try {
      const result = await instance.get(`/companion/ungroup/${tripId}`);
      if (result.data.message === "ok") {
        updateTripList(!updateList);
      }
    } catch (e) {
      console.error(e);
      // alert("삭제 실패");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await instance.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      // alert("삭제 실패");
    }
  };
  const sendImage = async (tripId) => {
    if (!selectedFile) {
      alert("사진을 먼저 선택해 주세요");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("tripId", tripId);
    try {
      setLoading(true);
      const res = await instance.post(`/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return res.data.fileName;
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <div className="board container">
      <h2>{title}</h2>

      <form onSubmit={handleAddPost} className="write-form">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="내용 (선택사항)"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows="4"
        />
        <div className="buttons">
          <label className="button">
            사진 선택
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </label>
          <button type="submit">글쓰기</button>
        </div>
      </form>
      {/* {<p className="loadingCircle"></p>} */}

      <ul className="post-list">
        {posts.length === 0 && !loading && (
          <li className="empty">
            아직 게시글이 없습니다. 첫 글을 작성해보세요!
          </li>
        )}
        {posts.map((post) => {
          return (
            <li key={post.id} className="post-item">
              <div className="post-content">
                <strong>
                  {post.id}
                  {post.title}
                  {post.owner}
                </strong>
                {post.content && <p>{post.content}</p>}
                <small>
                  {new Date(post.createdAt).toLocaleString("ko-KR")}
                </small>
              </div>
              {post.photo && (
                <img src={`${IMG_URL}${post.photo}`} width="100px" />
              )}
              {post.owner === user.id ? (
                <>
                  <button
                    onClick={() => handleInvite(post.title, post.id)}
                    className="btn-invite"
                  >
                    초대
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn-delete"
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleWithdrow(post.title, post.id)}
                  className="btn-invite"
                >
                  탈퇴
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Board;
