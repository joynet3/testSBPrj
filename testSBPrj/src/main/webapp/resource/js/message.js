var arrmsg = new CMMHSMAP();
$(document).ready(function(){
  
  
  arrmsg.put("1001", "{addmsg}이/가 이미존재 합니다.");
  arrmsg.put("1002", "{addmsg}이/가 존재하지 않습니다.");
  arrmsg.put("0003", "가 이미존재 합니다.");
  arrmsg.put("0004", "api 서버와 통신간에 에러가 발생하였습니다.");
  arrmsg.put("9998", "로그인이 필요합니다.");
  arrmsg.put("9999", "서버에러가 발생하였습니다.");
});


function gerErrMsg(_ecode,addmsg) {
	
	
  _ecode = _ecode.replace(/\"/gi, "");
  var errStr = arrmsg.get(_ecode);

  if(errStr.indexOf('{addmsg}')>-1) {
    errStr = errStr.replace("{addmsg}",addmsg);
  }
  return errStr;  
}
