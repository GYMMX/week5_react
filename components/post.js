import React from "react";
// import Grid from "../elements/grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configurestore";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

const Post = (props) => {
  const dispatch = useDispatch();
  const post_id = props.id;
  console.log(post_id);
  const deletePost = () => {
    dispatch(postActions.deletePostFB(post_id));
  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            {/* 프롭스에 버튼이 있는 경우에만 버튼을 보여줘! */}
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={deletePost}
              >
                삭제
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
          <Text margin="0px" bold>
            좋아요 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

//필요한 프롭스를 미리 넘겨받는 방식 (프롭스를 잘못 받아왓을 때의 방어는 어려움)
Post.defaultProps = {
  user_info: {
    user_name: "BINGBONG1004",
    user_profile:
      "https://media.vlpt.us/images/gagyeong/post/022af66a-3f1e-4132-a290-65820600972a/KakaoTalk_Image_2022-04-01-21-31-17.jpeg",
  },
  image_url:
    "https://media.vlpt.us/images/gagyeong/post/022af66a-3f1e-4132-a290-65820600972a/KakaoTalk_Image_2022-04-01-21-31-17.jpeg",
  contents: "내친구 빙봉!",
  insert_dt: "2021-02-27 10:00:00",
  comment_cnt: "10000",
  is_me: false,
};

export default Post;
