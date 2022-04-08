import React from "react";
import { Button } from "../elements";
import { storage } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
// import { actionCreators as imageActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/Image";

const Upload = (props) => {
  const dispatch = useDispatch();
  //업로드 되는동안 버튼 안눌리게 하는 셀렉터
  const is_uploading = useSelector((state) => state.image.uploading);
  //인풋에 접근하기위해서 ref를 사용...
  const fileInput = React.useRef();

  const selectFile = (e) => {
    //파일 객체가 어떻게 생긴 친구인지 확인해주기
    console.log(e);
    //e.target 은 input자체
    console.log(e.target);
    //들어간 파일 확인하기
    console.log(e.target.files[0]);
    //위와 아래가 같은지 확인하기 _ ref로 잘 들어오는지 확인
    console.log(fileInput.current.files[0]);

    const reader = new FileReader();
    const file = e.target.files[0];
    //파일내용을 읽어올 수 있음 file 내장함수
    reader.readAsDataURL(file);
    //읽기가 끝났을 때 이벤트를 받아와야 읽어온 결과 값을 받을 수 있음 따라서 아래의 이벤트 핸들러 사용
    reader.onloadend = () => {
      //result 는 우리가 읽어온 내용물
      console.log(reader.result);
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    // if (!fileInput.current || fileInput.current.files.length === 0) {
    //   window.alert("파일을 선택해주세요!");
    //   return;
    // }
    let image = fileInput.current.files[0];
    dispatch(imageActions.uploadImageFB(image));
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        //업로드하는 동안에는 또 사진을 업로드하지 못하게 막아주는 기능
        disabled={is_uploading}
      />
      <Button _onClick={uploadFB}>업로드</Button>
    </React.Fragment>
  );
};

export default Upload;
