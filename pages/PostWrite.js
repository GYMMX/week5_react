import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
//is_login불러오기 위해 useSelector 임포트
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/Image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  //50번째 줄 확인 로그인이 안되어있으면 로그인 페이지로 가게끔
  const is_login = useSelector((state) => state.user.is_login);
  //이미지 가져와서 넣어주기!
  const preview = useSelector((state) => state.image.preview);
  //포스트리스트가져오기
  const post_list = useSelector((state) => state.post.list);
  //아래의 아이디를 통해 수정중인지 아닌지 판별할 수 있음
  //그냥 게시글의 경우 경로가 그냥 /write일것이기에!
  const post_id = props.match.params.id;
  //포스트 아이디가 있다면?! 수정할거얌
  const is_edit = post_id ? true : false;

  const { history } = props;
  //수정할 때 리덕스에서 가져오는 포스트리스트
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  //포스특사 있는 경우 포스트를 넣어주기! 아니면 없다!
  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  //수정리스트에서 새로고침했을 경우 리덕스에 정보가 리셋되니까 뒤로가게하기
  React.useEffect(() => {
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }
    //수정모두일 때 가져오기ㅠ
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  };

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
  };

  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐!
        </Text>
        <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
        {/* push는 그냥 가는거고 replace는 갈아끼우는 것. 
        따라서 history후 뒤로가도 현재페이지로 가지 않음 */}
        <Button
          _onClick={() => {
            history.replace("/");
          }}
        >
          로그인 하러가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>

        <Image
          shape="rectangle"
          src={preview ? preview : "http://via.placeholder.com/400x300"}
        />
      </Grid>

      <Grid padding="16px">
        <Input
          //위에 useState에서 가져온 내용
          value={contents}
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button text="게시글 작성" _onClick={addPost}></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
