//날짜를 담당하는 객체
//let date = new Date();
//date.toUTCString => 문자로 나타낼 때
//date.getTime(); => 날짜 시간을 숫자로만 나타낼 때
//date.setTime(date.getTime()+10000); => 객체의 일시를 지정해줄 때 (밀리초 후)
//밀리초 계산 법 : 1일 = 1000밀리초 * 60초 * 60분 * 24시간

//쿠키가져오기
const getCookie = (name) => {
  let value = "; " + document.cookie;

  let parts = value.split(`; ${name}=`); //; [aa=xx / aaa; abbb=sssss];

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
    //pop : parts(원본배열)에서 맨 뒤가 사라지고 반환됨
    //shift : 앞에 있는 애를 잘라내서 반환됨
  }
};

//쿠키추가하기
//exp=5하면 exp를 받아오지 않아도 기본 값을 지정해줘서 사용할 수 있음
const setCookie = (name, value, exp = 5) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
};

const deleteCookie = (name) => {
  let date = new Date("2020-01-01").toUTCString();
  console.log(date);

  document.cookie = name + "=; expires=" + date;
};

export { getCookie, setCookie, deleteCookie };
