import { createAction, handleActions } from "redux-actions";
//리듀서 만들 때 불변성을 위해 immer를 사용함
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
//날짜 시간을 조금 더 편하게 수정할 수 있는 자바스크립트 패키지
import "moment";
import moment from "moment";
import { actionCreators as imageActions } from "./Image";

//<엑션타입생성>
//목록 가져온 것을 넣어주는애
const SET_POST = "SET_POST";
//목록 가져온 것을 추가해주는애
const ADD_POST = "ADD_POST";

const EDIT_POST = "EDIT_POST";

//액션생성자만들어주기
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));

//리듀서가 사용할 initialState만들기 (게시글 리스트)
const initialState = {
  list: [],
};

//게시글 하나 안에 기본적으로 뭐뭐가 있어야 해 하는 것
//component.post의 defaultProps에서 가져오기
const initialPost = {
  //   id: 0,
  //   user_info: {
  //     user_name: "BINGBONG1004",
  //     user_profile:
  //       "https://media.vlpt.us/images/gagyeong/post/022af66a-3f1e-4132-a290-65820600972a/KakaoTalk_Image_2022-04-01-21-31-17.jpeg",
  //   },
  image_url:
    "https://media.vlpt.us/images/gagyeong/post/022af66a-3f1e-4132-a290-65820600972a/KakaoTalk_Image_2022-04-01-21-31-17.jpeg",
  contents: "",
  //지금 쓰는 이 날짜가 moment(자바스크립트 라이브러리) 객체로 나옴
  //format은 날짜를 문자열로 바꿔줌
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  //insert_dt: "2021-02-27 10:00:00",
  comment_cnt: 0,
};

//파이어스토어에 추가하려면 모양새를 똑같이 넣어줘야함!!
const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    //파이어에서 콜렉션 선택
    const postDB = firestore.collection("post");
    //유저데이터는 리덕스에 이미 있으니까 그거 그대로 쓰면 됨
    //스토어에 있는 정보 가져올 때 getState
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              //모양새 맞춰주기
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

//미듈웨어청크
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    //파이어베이스에 접근하기 콜렌션이름은 post
    const postDB = firestore.collection("post");
    //콜렉션에 있는거 전부 다 가져오기 (firebase 공식문서 _데이터읽기,데이터가져오기 참조)
    //독스로 받아온 데이터 값들을 forEach를 돌려줌
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        //파이어스토어에서 가져온 값 👇🏻
        let _post = doc.data();
        let post = {
          id: doc.id,
          user_info: {
            user_name: _post.user_name,
            user_profile: _post.user_profile,
            user_id: _post.user_id,
          },
          contents: _post.contents,
          image_url: _post.image_url,
          comment_cnt: _post.comment_cnt,
          insert_dt: _post.insert_dt,
        };
        // ['commenct_cnt', 'contents', ..]
        // let post = Object.keys(_post).reduce(
        //   (acc, cur) => {
        //     if (cur.indexOf("user_") !== -1) {
        //       return {
        //         ...acc,
        //         user_info: { ...acc.user_info, [cur]: _post[cur] },
        //       };
        //     }
        //     return { ...acc, [cur]: _post[cur] };
        //   },
        //   { id: doc.id, user_info: {} }
        // );

        post_list.push(post);
      });

      console.log(post_list);

      dispatch(setPost(post_list));
    });
  };
};

//리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      //(state, __ )  __엔 우리가 ~~을 할거야 를 정해주는 것 **draft가 뭐지
      produce(state, (draft) => {
        //draft에 액션으로 넘어온 payload에 post_list로 넘어온 것을 list를 갈아끼울 것
        draft.list = action.payload.post_list;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
  },
  initialState
);

//변수로 묶어서 export해주기
const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
};

export { actionCreators };
