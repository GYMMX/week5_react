import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
  // 유저 정보가 있는 지, 토큰이 있는 지를 체크합니다!
  const is_login = useSelector((state) => state.user.is_login);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_session && is_login) {
    //트루일 때 반환
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
};

export default Permit;
