$(document).ready(function(){
    $("#searchDt" ).datepicker();
    
    if($("#searchRack").length > 0) {
      $("#searchRack").on('change', function() {
        searchStringLst();
      });
      
      if($("#searchBMS").val().length >3 ) {
        searchRackLst();
      }
      
    }
    
    
    $("#searchBMS").on('blur', function() {
      if($("#searchRack").length > 0) {
        searchRackLst();
      }
    });
    
    
    if($("#searchString").length > 0) {
      $("#searchString").on('change', function() {
        searchModuleLst();
      });
    }
    
    
    $(document).on('mouseover', '.tooltipWrap a', function(){
      
      var obj =$(this).next();
        $(obj).show();
    });
    
    $(document).on('mouseout', '.tooltipWrap a', function(){
      var obj =$(this).next();
        $(obj).hide();
    });
    
    
    
    $(document).ajaxSend(function (event, xhr, options) {
      var _url = options.url;
      
      if(options.url.indexOf('abnSearchList') >0) {
        showLoadingFull();
        
      } 
    }).ajaxComplete(function (event, xhr, options) {
      
      if(options.url.indexOf('abnSearchList') >0) {
        removeLoadingFull();
      }  
    });
    
    
    // bms 번호 autocomplete
    $("#searchBMS").autocomplete({
          source : function( request, response ) {
            
            $.ajax({
                  type    : 'POST',
                  url     : '/bmsMng/ajaxBmsMngList.do',
                  data    : {'limit': 999,'startRow': 0,'siteId': $('#searchBMS').val()},
                  
                   success: function(data) {
                     var _res = data.list;
                     response(
                         $.map(_res, function(item) {
                             return {
                               label:item.bmsNo,
                               value:item.bmsNo
                             }
                         })
                     );
                   }
              });
           },
       minLength: 3,
       autoFocus:true,   //첫번째 값을 자동 focus한다.
       matchContains:true,
       delay:100,   //milliseconds
       select: function( event, ui ) {
           // 만약 검색리스트에서 선택하였을때 선택한 데이터에 의한 이벤트발생
         
            selectedItem = ui.item;
            $("#searchBMS").val(selectedItem.value);
            
       }
   });
    
});
  
function searchRackLst(){
  if($("#searchBMS").val().length<3 || $("#searchSite").val().length<3) {
    
    return;
  }
  var param = {
      'bmsNo' : $("#searchBMS").val()
  };
  
  
  $.ajax({
    type  : "post",
    url   : "/common/ajaxRACKList.do",
    dataType: "json",
    data  : param,
    success : function(data) {
      $('#searchRack').empty();      
        if(data.list.length >0 && $("#searchRack").length > 0) {
          var option = $("<option value=''>선택</option>");
          $('#searchRack').append(option);
          
            data.list.forEach(function (item, index, array) {
              if(item.useYn == 'Y') {
                var option = $("<option value='"+item.rackNo+"'>"+item.rackNo+"</option>");
                $('#searchRack').append(option);                
              }
            });
        } 
      
      
      },
      error : function(xhr, status, error) {
        alert(error + '\n잠시 후 다시 시도해 주세요.');
      }
    }); 
  
}  

function searchStringLst(){
  
  if($("#searchRack").legnth<1) {
    return;
  }
  
  if($("#searchBMS").val().length<3 || $("#searchSite").val().length<3 || $("#searchRack").val() =="") {
    $('#searchString').empty();
    return;
  }
  
  var param = {
      'bmsNo' : $("#searchBMS").val(),
      'rackNo' : $("#searchRack").val()
  };
  
  
  $.ajax({
    type  : "post",
    url   : "/common/ajaxSTRINGList.do",
    dataType: "json",
    data  : param,
    success : function(data) {
      $('#searchString').empty();      
        if(data.list.length >0 && $("#searchString").length > 0) {
          var option = $("<option value=''>선택</option>");
          $('#searchString').append(option);
            data.list.forEach(function (item, index, array) {
              if(item.useYn == 'Y') {
                var option = $("<option value='"+item.stringNo+"'>"+item.stringNo+"</option>");
                $('#searchString').append(option);                
              }
            });
        } 
      
      },
      error : function(xhr, status, error) {
        alert(error + '\n잠시 후 다시 시도해 주세요.');
      }
    }); 
}


function searchModuleLst(){
  
  if($("#searchRack").legnth<1 && $("#searchString").legnth<1) {
    return;
  }
  
  if($("#searchBMS").val().length<3 || $("#searchSite").val().length<3 || $("#searchRack").val() =="" || $("#searchString").val() =="") {
    return;
  }
  
  
  var param = {
      'bmsNo' : $("#searchBMS").val(),
      'rackNo' : $("#searchRack").val(),
      'stringNo' : $("#searchString").val()
  };
  
  $.ajax({
    type  : "post",
    url   : "/common/ajaxMODULEList.do",
    dataType: "json",
    data  : param,
    success : function(data) {
      
        if(data.list.length >0 && $("#searchModule").length > 0) {
          
          $('#searchModule').empty();
          var option = $("<option value=''>선택</option>");
          $('#searchModule').append(option);
          
            data.list.forEach(function (item, index, array) {
              if(item.useYn == 'Y') {
                var option = $("<option value='"+item.stringNo+"'>"+item.stringNo+"</option>");
                $('#searchModule').append(option);                
              }
            });
        }
      
      
      },
      error : function(xhr, status, error) {
        alert(error + '\n잠시 후 다시 시도해 주세요.');
      }
    }); 
}



function setSiteId(_siteId,_siteNm){
  $("#searchSite").val(_siteId);
  $("#siteNm").val(_siteNm);
}

function searchFormInit(){
  
  $("#searchSite").val("");
  $("#siteNm").val("");
  $("#searchBMS").val("");
  
  var toDay = getToday("-");
  var setDay = fnCommDateAdd(toDay, -1,"d");  
  $('#searchDt').datepicker('setDate',setDay);
  
  var option = $("<option value=''>선택</option>");
  if($('#searchRack').length>0) {
    $('#searchRack').empty();
    $('#searchRack').append(option);
  }
  
  var option2 = $("<option value=''>선택</option>");
  
  if($('#searchString').length>0) {
    $('#searchString').empty();
    $('#searchString').append(option2);
  }
  
  $("#detailSearch1").val("");
  $("#detailSearch2").val("");
  $("#detailSearch3").val("");
  
 
  
}


function searchFormInitTrend(){
  
  $("#searchSite").val("");
  $("#siteNm").val("");
  $("#searchBMS").val("");
  
  var toDay = getToday("-");
  var setDay = fnCommDateAdd(toDay, -1,"d");  
  $('#searchStDt').datepicker('setDate',setDay);
  $('#searchEdDt').datepicker('setDate',setDay);
  
  var option = $("<option value=''>선택</option>");
  if($('#searchRack').length>0) {
    $('#searchRack').empty();
    $('#searchRack').append(option);
  }
  
  var option2 = $("<option value=''>선택</option>");
  
  if($('#searchString').length>0) {
    $('#searchString').empty();
    $('#searchString').append(option2);
  }
 
  
}

// 조회 리스트로 paging 및 paging 리스트 만들기
function structPagingHtmlinfo(){  
  var pageSize = 10;
  var rangeSize = 10;
  var curPage = 1;
  var curRange = 1;
  var listCnt;
  var pageCnt;
  var rangeCnt;
  var startPage = 1;
  var endPage = 1;
  var startIndex = 0;
  var prevPage;
  var nextPage;
}

function structPagingData() {
  var pageinfo;
  var listData;
}

function fnMakePage(data,pageSize,curPage){
  
  var rangeSize = 10;
  var listCnt = data.length;
  var pageCnt = Math.ceil(listCnt / parseInt(pageSize));
  var rangeCnt = Math.ceil(pageCnt /  parseInt(rangeSize));
  
  var curRange = parseInt(((parseInt(curPage) - 1) / rangeSize)) + 1;
  var startPage = (curRange - 1) * rangeSize + 1;
  var endPage = startPage + rangeSize - 1;
  
  var startIndex = (parseInt(curPage) - 1) * pageSize;
  var endIdx = startIndex + pageSize;
  
  
  if (endPage > pageCnt) {
    endPage = pageCnt;
  }
  
  var prevPage = parseInt(curPage) - 1;
  var nextPage = parseInt(curPage) + 1;
  
  var pagedata = new structPagingHtmlinfo();
  pagedata.curPage = curPage;
  pagedata.pageSize = pageSize;
  pagedata.rangeSize = rangeSize;
  pagedata.curRange = curRange;
  pagedata.listCnt =listCnt;
  pagedata.pageCnt =pageCnt;
  pagedata.rangeCnt = rangeCnt;
  pagedata.startPage =  startPage;
  pagedata.endPage = endPage;
  pagedata.startIndex = startIndex;
  pagedata.prevPage = prevPage;
  pagedata.nextPage = nextPage;
  
  
  var displstdata = new Array(pageSize);
  var listidx = 0;
  
  for(i=startIndex; i<endIdx;i++){
    displstdata[listidx] = data[i];
    listidx = listidx + 1;
  }
  
  var retData =  new structPagingData();
  retData.pageinfo = pagedata;
  retData.listData = displstdata;
  return retData;
}
//================== 조회 리스트로 paging 및 paging 리스트 만들기

function popChartAbn(viewSp,chartSp,obj) {

	var forObj = $(obj).parent().parent().parent().find('td');
	var param = {};
	
	$.each(forObj, function(idx, paramObj){
		
		if ( $(this).attr('param') != undefined ) {
			
			if ( $(this).attr('param') == 'colecDate' ) {
				param[$(this).attr('param')] = $(this).text().substring(0,10);
			} else {
				param[$(this).attr('param')] = $(this).text();
			}
		}
	});
	
	var url = "/abnDetect/"+viewSp+"/popGraph.do?chartSp="+chartSp+"&"+$.param(param);
	var popupNm = "abnchartPop";
	var popupWidth = "1150";
	var popupHeight = "600";
	commonPopup(url,popupWidth,popupHeight,popupNm);
}


//======================== 그래프 데이터 만들기 ================
// 산포그래프 데이터 만들기
function structGraphDataDist() {
  var minvalX;
  var maxvalX;
  var minvalY;
  var maxvalY;
  var chartArr;
  var lowCnt;
  var upCnt;
}



function makeChartDataDist(data) {
  
	var lowCnt = 0, upCnt = 0;
	
  var lowSt = data.lowSt;
  var upSt = data.upSt;
  
  var listData = data.listData;
  
  var minvalY = listData[0].cnt, maxvalY = listData[0].cnt;
  var minvalX = listData[0].vol, maxvalX = listData[0].vol;
  
  
  var datamap = new CMMHSMAP();

  listData.forEach(function(element,index){
    var yval =  element.cnt;
    var xval =  element.vol;
    
    minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
    maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
    minvalX = (parseInt(xval) < minvalX) ? parseInt(xval) : minvalX;
    maxvalX = (parseInt(xval) > maxvalX) ? parseInt(xval) : maxvalX;
    
    datamap.put(xval, yval);
  });
  
  minvalY = minvalY <5 ? 0 : parseInt(minvalY) -5;
  maxvalY = parseInt(maxvalY) + 5;
  
  minvalX = minvalX > lowSt ? lowSt : minvalX;
  
  maxvalX = maxvalX > upSt ? maxvalX : upSt;
  
  minvalX = minvalX < 5 ? 0 : parseInt(minvalX) -5;
  maxvalX = parseInt(maxvalX)  + 5;

  
  var chartArr = new Array();
  
  for(i=minvalX;i<=maxvalX;i++) {
    var cData = new Object();
    cData.label = i;
    if(datamap.get(i) == undefined) {
      cData.value= 0;
    } else {
      cData.value= datamap.get(i);
    }
    
    
    if(parseInt(lowSt) >=parseInt(i) && parseInt(cData.value) > 0) {
    	cData.color="#ff0000";
        lowCnt++;
    }
    
    if(parseInt(upSt) <=parseInt(i) && parseInt(cData.value) > 0) {
      cData.color="#ff0000"; 
      upCnt++;
    }
    
    cData.tooltext="전압:"+cData.label+ " | 건수:" + cData.value;
    
    if(parseInt(lowSt) ==parseInt(i)) {
      var vlineData = new Object();
      vlineData.vline="true";
      vlineData.showOnTop="1";
      vlineData.linePosition="0.7";
      vlineData.label= data.viewSigmalv + "sigma low";
      vlineData.color="#ff0000"; 
      chartArr.push(vlineData);
      
    }
    
    if(parseInt(upSt) ==parseInt(i)) {
      var vlineData = new Object();
      vlineData.vline="true";
      vlineData.showOnTop="1";
      vlineData.linePosition="0.7";
      vlineData.label=data.viewSigmalv + "sigma up";
      vlineData.color="#ff0000"; 
      chartArr.push(vlineData);
    }
    

    
    chartArr.push(cData);
   
  }
  
  var minvalX;
  var maxvalX;
  var minvalY;
  var maxvalY;
  
  
  var retData = new structGraphDataDist();
  retData.minvalX = minvalX;
  retData.maxvalX = maxvalX;
  retData.minvalY = minvalY; 
  retData.maxvalY = maxvalY;
  retData.chartArr = chartArr;
  retData.lowCnt = lowCnt;
  retData.upCnt = upCnt;
  
  return retData;
  
}

