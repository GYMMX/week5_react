import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "../components/post";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
  //initialState에서 불러오기
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  console.log(post_list);

  //불러오기
  const dispatch = useDispatch();
  //처음에 컴포넌트가 생겼을 때 한번만 파이어베이스에 요청하면 됨
  React.useEffect(() => {
    dispatch(postActions.getPostFB());
  }, []);
  return (
    <React.Fragment>
      {post_list.map((p, idx) => {
        if (user_info && p.user_info.user_id === user_info.uid) {
          return <Post key={p.id} {...p} is_me />;
        } //p는 게시글의 모든 정보_post에 게시글 정보 남겨주기!
        return <Post key={p.id} {...p} />;
      })}
    </React.Fragment>
  );
};

export default PostList;
