document.write("<script src='/resource/js/message.js'></script>");

$(document).ready(function(){
	
	/* 한글 입력 제한 */
	$('.alphanumeric').on("blur keyup", function() {
		$(this).val( $(this).val().replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ) );
	});
	
	$.validator.addMethod("noSpace", function(value, element) { 
		return value == '' || value.trim().length != 0;  
    });
	
	$.validator.addMethod("nowhitespace", function(value, element) {
  	  var res = /^\S+$/.test(value);
  		return res;
    });
})

// Modal Anchor Click
function layerPopupOpen(layId,popTit){
    var $layerMask = $('.layerMask');
    var $target = $("#"+layId);
    $("#"+layId + " .popupHeader").html("<h1>"+popTit+"</h1>");
    
    
    var layerM =$('<div class="layerMask" id="layerMask" style="display:block" />');
    $target.before(layerM);
    
    $(document).scrollTop()
    
    var pageHeight = window.innerHeight/2;
    $target.css({
        'display':'block',
        'position':'fixed',
        'top':'50%',
        'left':'50%',
        'marginTop': - $target.height()/2,
        'marginLeft': - $target.width()/2
    });
    
    $target.draggable();
    
    return false;
}

function popupClose(layId) {
  $('#'+layId).fadeOut(100);
  $('#layerMask').fadeOut(100).remove();
}

function searchEmpty(colspan) {
	
	var html = '';
	
	html += '<tr>';
	html += '	<td colspan="' + colspan + '">';
	html +=	'		검색 결과가 없습니다.';
	html += '	</td>';
	html += '</tr>';
	
	return html;
}
    
function paging(page) {

	var pageHtml 	= '';
	
	if ( page.listCnt > 0 ) {
		if ( page.curPage != 1 ) {
			pageHtml += ' <a href="#none" class="pagingPrev on paging-btn" pageIdx="' + page.prevPage + '">Prev</a>\n';
		} else {
			pageHtml += ' <a href="#none" class="pagingPrev" pageIdx="' + page.prevPage + '">Prev</a>\n';
		}
		
		pageHtml += '<span class="list">\n';
		
		for ( var idx = page.startPage; idx <= page.endPage; idx++ ) {
			
			if ( idx == page.curPage ) 
				pageHtml += '<strong>' + idx + '</strong>\n';
			else
				pageHtml += '<a href="#none" class="paging-btn" pageIdx="' + idx + '">' + idx + '</a>\n';
		}
		
		pageHtml += '</span>\n';
		
		if ( page.curPage == page.pageCnt ) {
			pageHtml += '<a href="#none" class="pagingNext off" pageIdx="' + page.nextPage + '">Next</a>\n';
		} else {
			pageHtml += '<a href="#none" class="pagingNext paging-btn" pageIdx="' + page.nextPage + '">Next</a>\n';
		} 
	}
	
	return pageHtml;
}

function commonPopup(_url,popupWidth,popupHeight,popupNm){
  
  var popupX = (window.screen.width / 2) - (popupWidth / 2);
  // 만들 팝업창 width 크기의 1/2 만큼 보정값으로 빼주었음
  var popupY= (window.screen.height / 2) - (popupHeight / 2);
  
  window.open(_url, popupNm, 'status=no, height=' + popupHeight  + ', width=' + popupWidth  + ', left='+ popupX + ', top='+ popupY);
  
  
}


function searchZipCode() {
  var url = "/commonPop/zipcode.do";
  var popupNm = "zipcodePop";
  var popupWidth = "500";
  var popupHeight = "740";
  commonPopup(url,popupWidth,popupHeight,popupNm);
  
}


function getAreaSpCode(areaCode) {
  var ret = "";
  var sidoCode = areaCode.substring(0,2)
/*
G014C001  서울특별시(11)
G014C002  인천광역시(28)
G014C003  경기도(41)
G014C004  강원도(42)
G014C005  충청북도(43)
G014C006  충청남도(44)
G014C007  세종특별자치시(36)
G014C008  대전광역시(30)
G014C009  전라북도(45)
G014C010  전라남도(46)
G014C011  광주광역시(29)
G014C012  경상북도(47)
G014C013  대구광역시(27)
G014C014  울산광역시(31)
G014C015  경상남도(48)
G014C016  부산광역시(26)
G014C017  제주특별자치도(50)
*/
  
    switch (sidoCode) {
      case "11":
        ret = "G014C001";
        break;
      case "28":
        ret = "G014C002";
        break;
      case "41":
        ret = "G014C003";
        break;
      case "42":
        ret = "G014C004";
        break;
      case "43":
        ret = "G014C005";
        break;
      case "44":
        ret = "G014C006";
        break;        
      case "36":
        ret = "G014C007";
        break;
      case "30":
        ret = "G014C008";
        break;
      case "45":
        ret = "G014C009";
        break;      
      case "46":
        ret = "G014C010";
        break;        
      case "29":
        ret = "G014C011";
        break;      
      case "47":
        ret = "G014C012";
        break;
      case "27":
        ret = "G014C013";
        break;
      case "31":
        ret = "G014C014";
        break;      
      case "48":
        ret = "G014C015";
        break;        
      case "26":        
        ret = "G014C016";
        break;      
      case "50":
        ret = "G014C017";
        break;            
      default:
        ret="G014C001";
  }
  
  
  return ret;
  
}



function searchSitePop() {
    
  $("#ifrmSiteSearch").attr("src","/commonPop/siteSearch.do");
  layerPopupOpen("siteSearchPopLayer",'사이트 조회');
}

function regSitePop() {
  parent.popupClose('siteSearchPopLayer');
  parent.layerPopupOpen("siteRegPopLayer",'사이트 신규등록');
}



function getCodeNmNm(codeList,code) {
  var ret = "";
  for(var i=0;i<codeList.length;i++) {
    var tmpMap = codeList[i];
    if(tmpMap.comnCd == code) {
      ret =tmpMap.comnCdNm;
      break;
    }
  }
  return ret;
}

/* 코드 별 색상 변경 */
function getCodeNmSpan(codeList,code) {
	var ret = "";
	
	$.each(codeList, function(idx, obj){
		
		if ( code == obj.comnCd ) {
			
			/* 엣지 */
			if ( obj.groupComnCd == 'G009' ) {	
				
				if ( code == 'G009C006' || code == 'G009C007' || code == 'G009C009' ) { /* 빨간색 */
					ret = '<span class="icoBad">';
				} else if ( code == 'G009C003' ) { 										/* 파란색 */
					ret = '<span class="icoIng">';
				} else {																/* 노란색 */
					ret = '<span class="icoGood">';
				}
				
				ret += obj.comnCdNm;
				ret += '</span>';
				return false;
			}
			
			/* 허브 */
			if ( obj.groupComnCd == 'G010' ) {
				
				if ( code == 'G010C001' ) {			/* 파란색 */
					ret = '<span class="icoIng">';
				} else if ( code == 'G010C002' ) {	/* 빨간색 */
					ret = '<span class="icoBad">';
				}
				
				ret += obj.comnCdNm;
				ret += '</span>';
				return false;
			}
		}
		
	});
	
	return ret;
}

function fnAlrmFontColor(str,apSp) {
	
	var returnStr = '';
	
	if (apSp =="G011C001") {
		returnStr = '<span style="color:red;">' + str + '</span>';
	} else if ( apSp =="G011C002") {
		returnStr = '<span style="color:blue;">' + str + '</span>';
	} else {
		returnStr = str;
	}
	
	return returnStr;
}


/* 날짜 9999-12-31 공백 return */
function fnExpDateStr(dateStr) {
	
	var str = '';
	
	if ( dateStr != undefined && dateStr.indexOf('9999-12-31') < 0 )
		str = dateStr;
	
	return str;
}

/* 세자리 콤마 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getToday(_sep){

  var today = new Date();   

  var year = today.getFullYear(); // 년도
  var month = today.getMonth() + 1;  // 월
  var date = today.getDate();  // 날짜
  var day = today.getDay();  // 요일

  if(parseInt(month) < 10) {
    month = "0" + month;
  }
  
  if(parseInt(date) < 10) {
    date = "0" + date;
  }
  
  return year + _sep + month + _sep + date;
  
}


function ondateChk(_date){
  var today = getToday("-");
  var datediff = dateDiff(today, _date);
  if(datediff == 0) {
    return true;
  } else {
    return false;
  }
}


function dateDiff(_date1, _date2) {
  var diffDate_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
  var diffDate_2 = _date2 instanceof Date ? _date2 :new Date(_date2);

  diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
  diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

  var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}

// 날짜 더하기
function fnCommDateAdd(sDate, nNum, type) {
  var yy = parseInt(sDate.substr(0, 4), 10);
  var mm = parseInt(sDate.substr(5, 2), 10);
  var dd = parseInt(sDate.substr(8), 10);
  
  if (type == "d") {
      d = new Date(yy, mm - 1, dd + nNum);
  }
  else if (type == "m") {
      d = new Date(yy, mm - 1, dd + (nNum * 31));
  }
  else if (type == "y") {
      d = new Date(yy + nNum, mm - 1, dd);
  }

  yy = d.getFullYear();
  mm = d.getMonth() + 1; mm = (mm < 10) ? '0' + mm : mm;
  dd = d.getDate(); dd = (dd < 10) ? '0' + dd : dd;

  return '' + yy + '-' +  mm  + '-' + dd;
}


//===== 해시맵
CMMHSMAP = function(){  
  this.map = new Array();
};  
CMMHSMAP.prototype = {  
  put : function(key, value){  
      this.map[key] = value;
  },  
  get : function(key){  
      return this.map[key];
  },  
  getAll : function(){  
      return this.map;
  },  
  clear : function(){  
      this.map = new Array();
  },  
  isEmpty : function(){    
       return (this.map.size() == 0);
  },
  remove : function(key){    
       delete this.map[key];
  },
  toString : function(){
      var temp = '';
      for(i in this.map){  
          temp = temp + ',' + i + ':' +  this.map[i];
      }
      temp = temp.replace(',','');
        return temp;
  },
  keySet : function(){  
      var keys = new Array();  
      for(i in this.map){  
          keys.push(i);
      }  
      return keys;
  }
};




function showLoading(_tgDiv){
  
  var element = $("#"+_tgDiv);
  var tgH = element.height();
  var tgW = element.width();
  
  
  source = "<div class='loadingDivPart' id='cmmLoadingDv'><div id='loadingImg' class='loadingImg'/></div>";
  $('#'+_tgDiv).prepend(source);
  
  $('#loadingImg').css("margin-top",parseInt((tgH-25)/2)+"px");
  $('#loadingImg').css("margin-left",parseInt((tgW-25)/2)+"px");
  
}

function removeLoading(){
  $("#cmmLoadingDv").remove();
}

function showLoadingFull() {
  source = "<div class='loadingWrap' id='cmmLoadingDvFull'><div class='masking'></div></div>";
  $("body").append(source);
}

function removeLoadingFull(){
  $("#cmmLoadingDvFull").remove();
}


//======================================== 퍼블 js =====================

jQuery(function($){
     $('.popupWrap').hide();
    //gnb menu
    var menu_cookie_key = 'admin_btn_gnb';
        $(".tnb_mb_btn").click(function(){
            $(".tnb_mb_area").toggle();
        });
        $("#btn_gnb").click(function(){
            var $this = $(this);
            try {
                if( ! $this.hasClass("btn_gnb_open") ){
                    set_cookie(menu_cookie_key, 1, 60*60*24*365);
                } else {
                    delete_cookie(menu_cookie_key);
                }
            }
            catch(err) {
            }
            $("#container").toggleClass("container_small");
            $("#gnb").toggleClass("gnb_small");
            $this.toggleClass("btn_gnb_open");
        });
    
    //tabMenu 기본서브페이지 탭
    $('ul.tabMenu').each(function() {
        $(this).find('li').each(function(i) {
            $(this).click(function(){
                $(this).addClass('on').siblings().removeClass('on')
                    .parents('.tabContGroup').find('.uiTabs').eq($(this).index()).fadeIn(150).siblings('.uiTabs').hide().removeClass('visual');
            });

        });
    });

    //accordion
    $('.accordion').on('click', '.title', function(e){
        e.preventDefault();
        var $objli = $(this).parent();
        if($objli.hasClass('on')){
            $objli.removeClass('on');
            $(this).siblings(".content").slideUp();
        }else {
            $('.accordion > li').removeClass('on');
            $(this).siblings(".content").slideDown();
            $objli.addClass('on');
        }
    });

    //경쟁사비교List 토글
    var openT = $('.leftMenuWrap .btnToogle, .leftMenuWrap .btnToogle02');
    $(openT).click(function(){
        if ($(this).hasClass('open') == true){
            $(this).parents('.leftMenuWrap').find('.inBox').hide();
            $(this).removeClass('open').attr('title','펼치기');
        }else{
            $(this).parents('.leftMenuWrap').find('.inBox').show();
            $(this).addClass('open').attr('title','접기');
        }
    });


    //datepicker
    (function( factory ) {
        if ( typeof define === "function" && define.amd ) {

            // AMD. Register as an anonymous module.
            define([ "../jquery.ui.datepicker" ], factory );
        } else {

            // Browser globals
            factory( jQuery.datepicker );
        }
    }(function( datepicker ) {
        datepicker.regional['kr'] = {
            closeText: '닫기',
            prevText: '이전 월',
            nextText: '다음 월',
            currentText: '오늘',
            monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
            dayNamesShort: ['일주일','월요일','화요일','수요일','목요일','금요일','토요일'],
            dayNamesMin: ['일','월','화','수','목','금','토'],
            weekHeader: '주',
            dateFormat: 'yy-mm-dd',
            showAnim: "fadeIn",/* slideDown */
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
                showOn:"both", //이미지로 사용 button , both : 엘리먼트와 이미지 동시사용
                buttonText: "달력",
                //changeMonth: true,
                //changeYear: true,
            yearSuffix: '년'};
        datepicker.setDefaults(datepicker.regional['kr']);

        return datepicker.regional['kr'];
    }));
    
    
    
    $("input[type=number]").on('keyup', function() {
      var _minset =  $(this).attr("min");
      var _maxset =  $(this).attr("max");
      var _unit =  $(this).attr("unit");
      var _val =  $(this).val();
      if(_minset != undefined && _maxset != undefined) {
        var msg = "";
        if(parseInt(_minset) > parseInt(_val) || parseInt(_maxset) < parseInt(_val) ) {
          if(_unit != undefined ) {
            msg = _minset + "~" +  _maxset + _unit + "만 입력 가능합니다.";
          } else {
            msg = _minset + "~" +  _maxset + "만 입력 가능합니다.";
          }
          alert(msg);
          $(this).val("");
        }
      }
    })
    
    
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
    }
        
    
});



