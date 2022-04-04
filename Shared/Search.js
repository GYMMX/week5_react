// import React from "react";
// import _ from "lodash";

// const Search = () => {
//   //   const [text, setText] = React.useState("");

//   //로다시 패키지 안에 있는 _디바운스를 써주는 것 () => {할 것을 정해주고} , 밀리세컨
//   //일정시간이 지나면 뜨는 디바운스!
//   const debounce = _.debounce((e) => {
//     console.log("debounce ::: ", e.target.value);
//   }, 1000);
//   //자동완성 같은 기능
//   //   const throttle = _.throttle((e) => {
//   //     console.log("throttle ::: ", e.target.value);
//   //   }, 1000);
//   //useCallback이란?
//   //함수룰 저장 & 컴포넌트가 리렌더링 되더라도 함수를 초기화 하지말고 저장한 친구 계속 쓸거야
//   //[]이 변할 때 함수도 변할거야 (초기화 조건 배열)
//   const keyPress = React.useCallback(debounce, []);

//   const onChange = (e) => {
//     // setText(e.target.value);
//     // debounce(e);
//     // throttle(e);
//     keyPress(e.target.value);

//     return (
//       <div>
//         <input type="text" onChange={onChange} />
//       </div>
//     );
//   };
// };
// export default Search;

import React from "react";
import _ from "lodash"; // lodash 부르기

const Search = () => {
  const throttle = _.throttle((k) => console.log("쓰로틀! :::", k), 1000);
  const keyPress = React.useCallback(throttle, []);

  const onChange = (e) => {
    keyPress(e.target.value);
  };

  return (
    <div>
      <label>Search:</label>
      <input onChange={onChange} />
    </div>
  );
};

export default Search;
