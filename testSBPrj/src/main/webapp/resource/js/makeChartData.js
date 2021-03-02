/* 차트 옵션 공통 */
var chartset = new Object();
chartset.theme = 'fusion';
chartset.scrollheight = 10;
chartset.numVisiblePlot = 900;
chartset.anchorRadius = 3;
chartset.anchorBorderThickness = 1;
chartset.baseFont = 'Helvetica Neue,Arial';
chartset.formatNumberScale = 0;
chartset.forceDecimals = 0;
chartset.lineThickness = 1;
chartset.useCrossLine = 0;
chartset.btnResetChartTooltext = "초기화";
chartset.btnZoomOutTooltext = "이전단계";
chartset.btnSwitchToZoomModeTooltext = "Yes";
chartset.btnSwitchToPinModeTooltext = "Pin Mode";
chartset.toolTipColor="#000000";
chartset.toolTipBorderColor="#4f81bd";
chartset.chartBottomMargin = 5;
chartset.captionPadding = 5;
var anchorBgColor1 = "#4f81bd";
var anchorBgColor2 = "#f79646";
var anchorBgColor3 = "#00b050";

var anchorBgColorDetect = "#ff0000";


/* null 데이터를 0으로 치환 */
function fnNullToZero(data) {
	
	var returnValue = 0;
	
	if ( data != null )
		returnValue = data;
	
	return returnValue;
}

function makeInitDistChartData(data) {
  
  var retData = new Object();
  var listData = new Array();

  var startValueUp = 0;       /* 트렌드 라인 값 up  */
  var startValueDown = 0;       /* 트렌드 라인 값 down */
  var viewSigmalv = "";       /* 트렌드 기준 sigma */
  
  
  data.list.forEach(function(element,idx){
    var itmData = new Object();
    if(idx==0) {
      startValueUp = element.sigmaUpBound;
      startValueDown = element.sigmaLowBound;
      viewSigmalv = element.sigmaLevel;
    }
    itmData.vol = element.modulecellvolValue;
    itmData.cnt = element.moduleCellvolCnt;
    listData.push(itmData);
  });
  
  retData.lowSt =startValueDown;
  retData.upSt = startValueUp;
  retData.listData = listData;
  retData.viewSigmalv =viewSigmalv;
  
  return retData; 
}


function minMaxValSet(minval,maxval){
  var obj =  new Object();
  
  if(minval <= 10) {
    obj.minval = parseInt(minval) -2;
  } else if(minval >= 1000) {
    obj.minval = parseInt(minval) -parseInt(parseInt(minval)*0.05);
  } else {
    obj.minval = parseInt(minval) -parseInt(parseInt(minval)*0.1);
  }
  
  if(maxval <= 10) {
    obj.maxval = parseInt(maxval) +2;
  } else if(maxval >= 1000) {
    obj.maxval = parseInt(maxval) + parseInt(parseInt(maxval)*0.05);
  } else {
    obj.maxval = parseInt(maxval) + parseInt(parseInt(maxval)*0.1);
  }
  
  return obj;
}

//충전 rest 시점 셀 별 전압 그래프
function makeTrendChartG006C001(data) {
  
  var returnObj = new Object();
  
  var startValueUp = 0;       /* 트렌드 라인 값 up  */
  var startValueDown = 0;       /* 트렌드 라인 값 down */
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  var trendlines = new Array(); /* 트렌드 라인 셋 */
  var viewSigmaLv = "0";
  
  
  
  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
  
  
  if ( data.list != null && data.list.length > 0) {
    
    
    if( data.list.length > 50) chartset.labelStep = data.list.length/10;
    
    var minvalY = 0, maxvalY = 0;
    var _len = data.list.length - 1;
    /* 기준값 찾기(마지막 데이터 기준) */
    if(pdetailSearch1=="") {
    	startValueUp = data.list[_len].detectSigmaUpBound;
    	startValueDown = data.list[_len].detectSigmaLowBound;
    	viewSigmaLv = data.list[_len].detectSetVal;
    } else {
    	startValueUp = data.list[_len].sigmaUpBound;
    	startValueDown = data.list[_len].sigmaLowBound;
    	viewSigmaLv = data.list[_len].sigmaLevel;
    }
    
    $.each(data.list, function(idx, obj){
      
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var yval =  obj.modulecellvolValue;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
        
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
      }
      
      var data = new Object();      
      data.value = yval;      
      if(parseInt(yval) >= parseInt(startValueUp) || parseInt(yval) <= parseInt(startValueDown)) {
        data.anchorBgColor = anchorBgColorDetect;
      }
      data.tooltext = "전압:" + yval + "mV";
      dataArr.push(data);      
      
    });
  }

  
  // y 축 최소 최대 설정
  var yAxisMinValue = 0;
  var yAxisMaxValue = 0;
  if(parseInt(startValueUp) > parseInt(maxvalY))   {
    yAxisMaxValue = parseInt(startValueUp);
  } else {
    yAxisMaxValue = parseInt(maxvalY);
  }
  
  if(parseInt(startValueDown) > parseInt(minvalY))   {
    yAxisMinValue = parseInt(minvalY);
  } else {
    yAxisMinValue = parseInt(startValueDown);
  }
  
  
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '전압(mV)';
  
  var obj = minMaxValSet(yAxisMinValue,yAxisMaxValue);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
  dataset.push({
    seriesname : '전압',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  
  var trendLine = new Array();

  var line = new Object();
  line.startValue = startValueUp;
  line.valueOnRight = "1";
  line.color = "#ff0000";
  line.showOnTop = 1;
  line.displayvalue = viewSigmaLv +"sigma upper";
  trendLine.push(line);
  
  line = new Object();
  line.startValue = startValueDown;
  line.valueOnRight = "1";
  line.color = "#ff0000";
  line.showOnTop = 1;  
  line.displayvalue = viewSigmaLv +"sigma lower";
  trendLine.push(line);
  
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//방전 Rest 시점, 셀 별 전압 그래프
function makeTrendChartG006C002(data) {
  return makeTrendChartG006C001(data);
}

//방전 Rest 시점, 셀 별 전압 그래프
function makeTrendChartG006C003(data) {
  return makeTrendChartG006C001(data);
}
//방전 Rest 시점, 셀 별 전압 그래프
function makeTrendChartG006C004(data) {
  return makeTrendChartG006C001(data);
}

//방전 Rest 시점, 셀 별 전압 그래프
function makeTrendChartG006C005(data) {

  var returnObj = new Object();
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  var trendlines = new Array(); /* 트렌드 라인 셋 */
  
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    if( data.list.length > 50) chartset.labelStep = data.list.length/10;
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var yval =  obj.bmsCellvolRank;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
      }
      
      
      var data = new Object();      
      data.value = yval;
      if(pdetailSearch1=="") {
        if(obj.detectYn == "Y") {
          data.anchorBgColor = anchorBgColorDetect;
        } else {
          data.anchorBgColor = anchorBgColor1;  
        }  
      } else {
        if(obj.bmsCellvolRankRate != null && parseInt(pdetailSearch1) <= parseInt(obj.bmsCellvolRankRate) ) {
          data.anchorBgColor = anchorBgColorDetect;
        } else {
          data.anchorBgColor = anchorBgColor1;  
        }  
      }
      
      data.tooltext = "전압Ranking :" + yval;
      dataArr.push(data);
      
    });
  }

  chartset.xAxisName = '날짜';
  chartset.yAxisName = '전압Ranking';



  // y 축 최소 최대 설정
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
  dataset.push({
    seriesname : '전압 Ranking',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendlines;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//시스템 Outlier 방전 Ranking 그래프
function makeTrendChartG006C006(data) {
  
  return makeTrendChartG006C005(data);
}

//시스템 Outlier 방전 Ranking 그래프
function makeTrendChartG006C007(data) {
  
  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  var trendlines = new Array(); /* 트렌드 라인 셋 */
  
  if ( data.list != null && data.list.length > 0) {
  
    if( data.list.length > 50) chartset.labelStep = data.list.length/10;
    var minvalY = 0, maxvalY = 0;
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var yval =  obj.rackCellvolRank;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
        
      }
      
      
      var data = new Object();      
      data.value = yval;
      
      if(pdetailSearch1=="") {
        if(obj.detectYn == "Y") {
          data.anchorBgColor = anchorBgColorDetect;
        } else {
          data.anchorBgColor = anchorBgColor1;  
        }  
      } else {
        
        if(obj.rackCellvolRankRate != null && parseInt(pdetailSearch1) <= parseInt(obj.rackCellvolRankRate) ) {
          data.anchorBgColor = anchorBgColorDetect;
        } else {
          data.anchorBgColor = anchorBgColor1;  
        }  
      }
      
      data.tooltext = "전압Ranking:"+yval;
      dataArr.push(data);

      
      
    });
  }

  
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '전압Ranking';

  // y 축 최소 최대 설정
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
  
  dataset.push({
    seriesname : '전압Ranking',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendlines;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//시스템 Outlier 방전 Ranking 그래프 
function makeTrendChartG006C008(data) {  
  return makeTrendChartG006C007(data);
}

// ==========================================================

//Rack 1st Min Cell 전압 + 포지션
function makeTrendChartG006C009(data) {
	
	var returnObj = new Object();	
	
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압(mV)';

	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
		$.each(data.list, function(idx, obj){
		  
		  if(pdetailSearch1=="") {
		    startValue = obj.detectSetVal;  
		  } else {
		    startValue = pdetailSearch1
		  }
		  
			var category = new Object();
			category.label = obj.colecDt.substring(11, 19);
			categoryArr.push(category);
			
			var data = new Object();
			data.value = obj.minCellvol1Value;
			data.tooltext = "ModuleId"+obj.minCellvol1Moduleid + ' | CellId' + obj.minCellvol1Cellid;
			
      /* 트렌드 라인 초과시 색상 변경 */
      if ( startValue >= obj.minCellvol1Value ) {
        data.anchorBgColor = "#ff0000";
      }
      
      
			dataArr.push(data);
			
			
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	dataset.push({
		seriesname : '전압',
		anchorBgColor : anchorBgColor1,
		data : dataArr
	});
	
	var line = new Object();
	line.startValue = startValue;
	line.valueOnRight = "1";
	line.color = "#ff0000";
	line.showOnTop = 1;
  line.displayvalue ="기준전압:" + startValue + "mV";	
	trendLine.push(line);
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}

//Rack 1st Min Cell 전압 + 포지션
function makeTrendChartG006C010(data) {
	
	var returnObj = new Object();	
	
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압(mV)';
	
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
		$.each(data.list, function(idx, obj){
			
	     if(pdetailSearch1=="") {
	        startValue = obj.detectSetVal;  
	      } else {
	        startValue = pdetailSearch1
	      }
	      
			
			var category = new Object();
			category.label = obj.colecDt.substring(11, 19);
			categoryArr.push(category);
			
			var data = new Object();
			data.value = obj.maxCellvol1Value;
			data.tooltext = "ModuleId:" + obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid + ' | 전압:' + obj.maxCellvol1Value;
			
			/* 트렌드 라인 초과시 색상 변경 */
			if ( startValue <= obj.maxCellvol1Value ) {
				data.anchorBgColor = "#ff0000";
			}
			
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
	
	dataset.push({
		seriesname : '전압',
		anchorBgColor : anchorBgColor1,
		data : dataArr
	});
	
	var line = new Object();
	line.startValue = startValue;
	line.valueOnRight = "1";
	line.color = "#ff0000";
	line.displayvalue ="기준전압:" + startValue + "mV";
	line.showOnTop = 1;
	trendLine.push(line);
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}

//Rack 1st Min Cell 전압 + 포지션
function makeTrendChartG006C011(data) {

  var returnObj = new Object(); 
  
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '전압(mV)';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    $.each(data.list, function(idx, obj){
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.minCellvol1Value;
      data.tooltext = "ModuleId:" + obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid + ' | 전압:' + obj.minCellvol1Value;
      
      /* 트렌드 라인 초과시 색상 변경 */
      if (obj.detectYn =="Y" ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '전압',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//Rack 1st Max Cell 전압 + 포지션
function makeTrendChartG006C012(data) {
  
  var returnObj = new Object(); 
  
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '전압(mV)';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);  
    $.each(data.list, function(idx, obj){
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.maxCellvol1Value;
      data.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid + ' | 전압:' + obj.maxCellvol1Value;
      
      /* 트렌드 라인 초과시 색상 변경 */
      if (obj.detectYn =="Y" ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '전압',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}



//Rack 1st Min Cell 온도 + 포지션
function makeTrendChartG006C013(data) {

  
  var returnObj = new Object(); 
  
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  chartset.yAxisName = '온도(℃)';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.minCelltemp1Value;
      data.tooltext = "ModuleId:" + obj.minCelltemp1Moduleid + " | 온도:"+obj.minCelltemp1Value ;
      
      /* 트렌드 라인 초과시 색상 변경 */
      if (startValue >= obj.minCelltemp1Value ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '온도',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  
  var line = new Object();
  line.startValue = startValue;
  line.valueOnRight = "1";
  line.color = "#ff0000";
  line.showOnTop = 1;
  line.displayvalue ="기준온도:" + startValue + "℃";
  trendLine.push(line);
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//Rack 1st Max Cell 온도 + 포지션
function makeTrendChartG006C014(data) {

  
  var returnObj = new Object(); 
  
  var startValue = 0;              /* 트렌드 라인 값 */
  var categoryArr = new Array();   /* 카테고리 배열 */
  var dataArr = new Array();       /* 데이터 배열 */
  var dataset = new Array();       /* 최종 데이터 셋 */
  var trendLine = new Array();     /* 트렌드 라인 셋 */
  var minvalY, maxvalY;            /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  chartset.yAxisName = '온도(℃)';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.maxCelltemp1Value;
      data.tooltext = "ModuleId:"+obj.maxCelltemp1Moduleid + " | 온도:"+obj.maxCelltemp1Value ;
      
      /* 트렌드 라인 초과시 색상 변경 */
      if ( startValue <= obj.maxCelltemp1Value ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '온도',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  
  var line = new Object();
  line.startValue = startValue;
  line.valueOnRight = "1";
  line.color = "#ff0000";
  line.showOnTop = 1;
  line.displayvalue ="기준온도:" + startValue + "℃";
  trendLine.push(line);
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

//Rack 1st Min Cell 온도 + 포지션
function makeTrendChartG006C015(data) {

  var returnObj = new Object(); 
  
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '온도(℃)';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    $.each(data.list, function(idx, obj){
      
      startValue = obj.detectSetVal;
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.minCelltemp1Value;
      data.tooltext = "ModuleId:" +obj.minCelltemp1Moduleid + " | 온도:"+obj.minCelltemp1Value ;
      
      /* 트렌드 라인 미만시 색상 변경 */
      if (obj.detectYn =="Y" ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '온도',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}


//Rack 1st Max Cell 온도 + 포지션
function makeTrendChartG006C016(data) {

  var returnObj = new Object(); 
  
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '날짜';
  chartset.yAxisName = '온도';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    $.each(data.list, function(idx, obj){
      
      startValue = obj.detectSetVal;
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var data = new Object();
      data.value = obj.maxCelltemp1Value;
      data.tooltext = "ModuleId:"+obj.maxCelltemp1Moduleid;
      
      /* 트렌드 라인 초과시 색상 변경 */
      if (obj.detectYn =="Y" ) {
        data.anchorBgColor = "#ff0000";
      }
      
      dataArr.push(data);
    });
  }
  
  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : '온도',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* 1st Min-Max 전압 Imbalance */
function makeTrendChartG006C017(data) {
	
  
	var returnObj = new Object();	
	
	var chartSp = data.chartSp;						/* 차트 데이터 구분 */
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataArrSec = new Array();					/* 두번째 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	
	
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
	  
		$.each(data.list, function(idx, obj){
			
			
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
			
			var category = new Object();
			category.label = obj.colecDt.substring(11, 19);
			categoryArr.push(category);
			
			if ( chartSp == 'T1' ) {
				
				var data = new Object();
				data.value = obj.imblncCellvolValue;
				data.tooltext = "Max ModuleId:"+obj.maxCellvol1Moduleid + ' | Max CellId:' + obj.maxCellvol1Cellid + ' | Min ModuleId:' + obj.minCellvol1Moduleid + ' | Min CellId:' + obj.minCellvol1Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
				
				/* 트렌드 라인 초과시 색상 변경 */
				if ( startValue <= obj.imblncCellvolValue ) {
					data.anchorBgColor = "#ff0000";
				}
				
				dataArr.push(data);
			} else if ( chartSp == 'T2' ) {
				
				var data = new Object();
				data.value = obj.minCellvol1Value;
				data.tooltext = "ModuleId:"+obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid+ ' | Imbalance:' + obj.imblncCellvolValue;
				
				var dataSec = new Object();
				dataSec.value = obj.maxCellvol1Value;
				dataSec.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid+ ' | Imbalance:' + obj.imblncCellvolValue;
				
				if(pdetailSearch1=="") {
				  if ( obj.detectYn == 'Y' ) {
	          data.anchorBgColor = anchorBgColorDetect;
	          dataSec.anchorBgColor = anchorBgColorDetect;
	        }  
				} else {
				  if(obj.imblncCellvolValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCellvolValue) ) {
	          data.anchorBgColor = anchorBgColorDetect;
	          dataSec.anchorBgColor = anchorBgColorDetect;
	        }
				}
				
				
				dataArr.push(data);
				dataArrSec.push(dataSec);
			}
		});
	}
	
	if ( chartSp == 'T1' ) {
	  chartset.yAxisName = '전압 Imbalance';
		minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
		maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
		
	  var obj = minMaxValSet(minvalY,maxvalY);
	  chartset.yAxisMinValue = obj.minval;
	  chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : '전압',
			anchorBgColor : anchorBgColor1,
			data : dataArr
		});
		
		var line = new Object();
		line.startValue = startValue;
		line.valueOnRight = "1";
		line.color = "#ff0000";
		line.showOnTop = 1;
		line.displayvalue ="기준Imbalance:" + startValue;
		trendLine.push(line);
		
	} else if ( chartSp == 'T2' ) {
	  chartset.yAxisName = '전압(mV)';
		var temp = new Array();
		temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		
		minvalY = Math.min.apply(null, temp);
		maxvalY = Math.max.apply(null, temp);
		
	  var obj = minMaxValSet(minvalY,maxvalY);
	  chartset.yAxisMinValue = obj.minval;
	  chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : 'Min 전압',
			data : dataArr
		});
		
		dataset.push({
			seriesname : 'Max 전압',
			data : dataArrSec
		});
	}
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 충전 Rest 시점 1st Min-Max 전압 Imbalance */
function makeTrendChartG006C018(data) {
	
	var returnObj = new Object();	
	
	var chartSp = data.chartSp;						/* 차트 데이터 구분 */
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataArrSec = new Array();					/* 두번째 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압 Imbalance';

	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
		$.each(data.list, function(idx, obj){
			
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			if ( chartSp == 'T1' ) {
				
				var data = new Object();
				data.value = fnNullToZero(obj.imblncCellvolValue);
				data.tooltext = "Max ModuleId:"+obj.maxCellvol1Moduleid + ' | Max CellId:' + obj.maxCellvol1Cellid + ' | Min ModuleId:' + obj.minCellvol1Moduleid + ' | Min CellId:' + obj.minCellvol1Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
				/* 트렌드 라인 초과시 색상 변경 */
				if ( startValue <= obj.imblncCellvolValue ) {
					data.anchorBgColor = "#ff0000";
				}
				
				dataArr.push(data);
			} else if ( chartSp == 'T2' ) {
				
				var data = new Object();
				data.value = fnNullToZero(obj.minCellvol1Value);
				data.tooltext = "Moduleid:"+obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
				
				var dataSec = new Object();
				dataSec.value = fnNullToZero(obj.maxCellvol1Value);
				dataSec.tooltext = "Moduleid:"+obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
				
        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCellvolValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCellvolValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
				
				dataArr.push(data);
				dataArrSec.push(dataSec);
			}
		});
	}
	
	if ( chartSp == 'T1' ) {
		
		minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
		maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : '전압 Imbalance',
			data : dataArr
		});
		
		var line = new Object();
		line.startValue = startValue;
		line.valueOnRight = "1";
		line.color = "#ff0000";
		line.showOnTop = 1;
		line.displayvalue ="기준Imbalance:" + startValue;      
		trendLine.push(line);
		
	} else if ( chartSp == 'T2' ) {
		
		var temp = new Array();
		temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		
		minvalY = Math.min.apply(null, temp);
		maxvalY = Math.max.apply(null, temp);
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : 'Min 전압 Imbalance',
			data : dataArr
		});
		
		dataset.push({
			seriesname : 'Max 전압 Imbalance',
			data : dataArrSec
		});
	}
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 방전 Rest 시점 1st Min-Max 전압 Imbalance */
function makeTrendChartG006C019(data) {
  
	var returnObj = new Object();	
	
	var chartSp = data.chartSp;						/* 차트 데이터 구분 */
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataArrSec = new Array();					/* 두번째 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
		if ( chartSp == 'T1' ) {
			minvalY = data.list[0].imblncCellvolValue;
			maxvalY = data.list[0].imblncCellvolValue;
		} else if ( chartSp == 'T2' ) {
			minvalY = data.list[0].minCellvol1Value;
			maxvalY = data.list[0].minCellvol1Value;
			minvalYSec = data.list[0].maxCellvol1Value;
			maxvalYSec = data.list[0].maxCellvol1Value;
		}
		
		var pdetailSearch1 = $("#detailSearch1", opener.document).val();
		
		$.each(data.list, function(idx, obj){
			
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
			
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			if ( chartSp == 'T1' ) {
			  chartset.yAxisName = '전압 Imbalance';
				var data = new Object();
				data.value = fnNullToZero(obj.imblncCellvolValue);
				data.tooltext = "Max ModuleId:"+obj.maxCellvol1Moduleid + ' | Max CellId:' + obj.maxCellvol1Cellid + ' | Min ModuleId:' + obj.minCellvol1Moduleid + ' | Min CellId:' + obj.minCellvol1Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
				/* 트렌드 라인 초과시 색상 변경 */
				if ( startValue <= obj.imblncCellvolValue ) {
					data.anchorBgColor = "#ff0000";
				}
				
				dataArr.push(data);
			} else if ( chartSp == 'T2' ) {
			  chartset.yAxisName = '전압(mV)';
				var data = new Object();
				data.value = fnNullToZero(obj.minCellvol1Value);
				data.tooltext = "ModuleId:" +obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid+ ' | Imbalance:' + obj.imblncCellvolValue;
				
				var dataSec = new Object();
				dataSec.value = fnNullToZero(obj.maxCellvol1Value);
				dataSec.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid + ' | CellId' + obj.maxCellvol1Cellid+ ' | Imbalance:' + obj.imblncCellvolValue;
				
        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCellvolValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCellvolValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
				dataArr.push(data);
				dataArrSec.push(dataSec);
			}
		});
	}
	
	if ( chartSp == 'T1' ) {
		
		minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
		maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : '전압 Imbalance',
			data : dataArr
		});
		
		var line = new Object();
		line.startValue = startValue;
		line.valueOnRight = "1";
		line.color = "#ff0000";
		line.showOnTop = 1;
		line.displayvalue ="기준Imbalance:" + startValue;    
		trendLine.push(line);
		
	} else if ( chartSp == 'T2' ) {
		
		var temp = new Array();
		temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
		temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
		
		minvalY = Math.min.apply(null, temp);
		maxvalY = Math.max.apply(null, temp);
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : 'Min 전압',
			data : dataArr
		});
		
		dataset.push({
			seriesname : 'Max 전압',
			data : dataArrSec
		});
	}
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}


/* 1st Min-Max 온도 Imbalance */
function makeTrendChartG006C020(data) {
  
  var returnObj = new Object(); 
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataArrSec = new Array();         /* 두번째 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    if ( chartSp == 'T1' ) {
      minvalY = data.list[0].imblncCelltempValue;
      maxvalY = data.list[0].imblncCelltempValue;
    } else if ( chartSp == 'T2' ) {
      minvalY = data.list[0].minCelltemp1Value;
      maxvalY = data.list[0].minCelltemp1Value;
      minvalYSec = data.list[0].maxCelltemp1Value;
      maxvalYSec = data.list[0].maxCelltemp1Value;
    }
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      if ( chartSp == 'T1' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.imblncCelltempValue);
        data.tooltext = "Max ModuleId:"+obj.maxCelltemp1Moduleid + ' | 온도 Max:' + obj.maxCelltemp1Value + " | Min ModuleId:"+obj.minCelltemp1Moduleid + ' | 온도 Min:' + obj.minCelltemp1Value + ' | Imbalance:' + obj.imblncCelltempValue;
        
        /* 트렌드 라인 초과시 색상 변경 */
        if ( startValue <= obj.imblncCelltempValue ) {
          data.anchorBgColor = "#ff0000";
        }
        
        dataArr.push(data);
      } else if ( chartSp == 'T2' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.minCelltemp1Value);
        data.tooltext = "Min ModuleId:"+obj.minCelltemp1Moduleid + ' | 온도:' + obj.minCelltemp1Value + ' | Imbalance:' + obj.imblncCelltempValue;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.maxCelltemp1Value);
        dataSec.tooltext = "Min ModuleId:"+obj.maxCelltemp1Moduleid + ' | 온도:' + obj.maxCelltemp1Value + ' | Imbalance:' + obj.imblncCelltempValue;
        
        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCelltempValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCelltempValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      }
    });
  }
  
  if ( chartSp == 'T1' ) {
    chartset.yAxisName = '온도 Imbalance';
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '온도',
      data : dataArr
    });
    
    var line = new Object();
    line.startValue = startValue;
    line.valueOnRight = "1";
    line.color = "#ff0000";
    line.showOnTop = 1;
    line.displayvalue ="기준 Imbalance:" + startValue;    
    trendLine.push(line);
    
  } else if ( chartSp == 'T2' ) {
    chartset.yAxisName = '온도(℃)';
    var temp = new Array();
    temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    
    minvalY = Math.min.apply(null, temp);
    maxvalY = Math.max.apply(null, temp);
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : 'Min Cell 온도',
      data : dataArr
    });
    
    dataset.push({
      seriesname : 'Max Cell 온도',
      data : dataArrSec
    });
  }
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* 1st Max- 2nd Max 전압 Imbalance */
function makeTrendChartG006C021(data) {
  
  var returnObj = new Object(); 
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataArrSec = new Array();         /* 두번째 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);  
    if ( chartSp == 'T1' ) {
      minvalY = data.list[0].imblncCellvolValue;
      maxvalY = data.list[0].imblncCellvolValue;
    } else if ( chartSp == 'T2' ) {
      minvalY = data.list[0].maxCellvol1Value;
      maxvalY = data.list[0].maxCellvol1Value;
      minvalYSec = data.list[0].maxCellvol2Value;
      maxvalYSec = data.list[0].maxCellvol2Value;
    }
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      
      if ( chartSp == 'T1' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.imblncCellvolValue);
        data.tooltext = "1st ModuleId:"+obj.maxCellvol1Moduleid + ' | 1st CellId:' + obj.maxCellvol1Cellid + ' | 2nd ModuleId:' + obj.maxCellvol2Moduleid + ' | 2nd CellId:' + obj.maxCellvol2Cellid + ' | Imbalance:' + obj.imblncCellvolValue;
        
        /* 트렌드 라인 초과시 색상 변경 */
        if ( startValue <= obj.imblncCellvolValue ) {
          data.anchorBgColor = "#ff0000";
        }
        
        dataArr.push(data);
      } else if ( chartSp == 'T2' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.maxCellvol1Value);
        data.tooltext = "1st ModuleId:"+obj.maxCellvol1Moduleid + ' | 1st CellId:' + obj.maxCellvol1Cellid + ' | 1St 전압:' + obj.maxCellvol1Value + ' | Imbalance:' + obj.imblncCellvolValue;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.maxCellvol2Value);
        dataSec.tooltext = "2nd ModuleId:"+obj.maxCellvol2Moduleid + ' | 2nd CellId:' + obj.maxCellvol2Cellid + ' | 2nd 전압:' + obj.maxCellvol2Value + ' | Imbalance:' + obj.imblncCellvolValue;


        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCellvolValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCellvolValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
        
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      }
    });
  }
  
  if ( chartSp == 'T1' ) {
    chartset.yAxisName = '전압 Imbalance';
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '전압 Imbalance',
      data : dataArr
    });
    
    var line = new Object();
    line.startValue = startValue;
    line.valueOnRight = "1";
    line.color = "#ff0000";
    line.showOnTop = 1;
    line.displayvalue ="기준 Imbalance:" + startValue;    
    trendLine.push(line);
    
  } else if ( chartSp == 'T2' ) {
    chartset.yAxisName = '전압';
    var temp = new Array();
    temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    
    minvalY = Math.min.apply(null, temp);
    maxvalY = Math.max.apply(null, temp);
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '1st Max 전압',
      data : dataArr
    });
    
    dataset.push({
      seriesname : '2nd Max 전압',
      data : dataArrSec
    });
  }
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* 1st Min- 2nd Min 전압 Imbalance */
function makeTrendChartG006C022(data) {
  
  
  var returnObj = new Object(); 
  
  var chartSp = data.chartSp;         /* 차트 데이터 구분  */
  var startValue = 0;                 /* 트렌드 라인 값  */
  var categoryArr = new Array();      /* 카테고리 배열  */
  var dataArr = new Array();          /* 데이터 배열  */
  var dataArrSec = new Array();       /* 두번째 데이터 배열 */
  var dataset = new Array();          /* 최종 데이터 셋 */
  var trendLine = new Array();        /* 트렌드 라인 셋 */
  var minvalY, maxvalY;               /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);    
    if ( chartSp == 'T1' ) {
      minvalY = data.list[0].imblncCellvolValue;
      maxvalY = data.list[0].imblncCellvolValue;
    } else if ( chartSp == 'T2' ) {
      minvalY = data.list[0].minCellvol1Value;
      maxvalY = data.list[0].minCellvol1Value;
      minvalYSec = data.list[0].minCellvol2Value;
      maxvalYSec = data.list[0].minCellvol2Value;
    }
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      if ( chartSp == 'T1' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.imblncCellvolValue);
        data.tooltext = "1st ModuleId:"+obj.minCellvol1Moduleid + ' | 1st CellId:' + obj.minCellvol1Cellid + ' | 1st 전압:' + obj.minCellvol1Value + ' | 2nd ModuleId:' + obj.minCellvol2Moduleid + ' | 2nd CellId:' + obj.minCellvol2Cellid + ' | 2nd 전압:' + obj.minCellvol1Value + ' | Imbalance:' + obj.imblncCellvolValue;
        
        /* 트렌드 라인 초과시 색상 변경 */
        if ( startValue <= obj.imblncCellvolValue ) {
          data.anchorBgColor = "#ff0000";
        }
        
        dataArr.push(data);
      } else if ( chartSp == 'T2' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.minCellvol1Value);
        data.tooltext = "1st ModuleId:"+obj.minCellvol1Moduleid + ' | 1st CellId:' + obj.minCellvol1Cellid + ' | 1st 전압:' + obj.minCellvol1Value + ' | Imbalance:' + obj.imblncCellvolValue;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.minCellvol2Value);
        dataSec.tooltext = "2nd ModuleId:"+obj.minCellvol2Moduleid + ' | 2nd CellId:' + obj.minCellvol2Cellid + ' | 2nd 전압:' + obj.minCellvol2Value + ' | Imbalance:' + obj.imblncCellvolValue;

        
        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCellvolValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCellvolValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      }
    });
  }
  
  if ( chartSp == 'T1' ) {
    chartset.yAxisName = '전압 Imbalance';
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '전압 Imbalance',
      data : dataArr
    });
    
    var line = new Object();
    line.startValue = startValue;
    line.valueOnRight = "1";
    line.color = "#ff0000";
    line.showOnTop = 1;
    line.displayvalue ="기준 Imbalance:" + startValue;    
    trendLine.push(line);
    
  } else if ( chartSp == 'T2' ) {
    chartset.yAxisName = '전압(mV)';
    var temp = new Array();
    temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    
    minvalY = Math.min.apply(null, temp);
    maxvalY = Math.max.apply(null, temp);
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '1st Min 전압',
      data : dataArr
    });
    
    dataset.push({
      seriesname : '2nd Min 전압',
      data : dataArrSec
    });
  }
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}


/* 방전 Rest 시점, System/Rack 평균 셀 전압 + Rack Max 셀 전압 */
function makeTrendChartG006C023(data) {

  
	var returnObj = new Object();
	
	var chartSp = data.chartSp;						/* 차트 데이터 구분 */
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */
	
	var strMaxArr = new Array();					/* StrImblncMax 데이터 배열*/
	var strAvgArr = new Array();					/* StrImblncAvg 데이터 배열*/
	var bmsAvgArr = new Array();					/* BmsImblncAvg 데이터 배열*/
	
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */
	
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '일자';
	chartset.yAxisName = '전압';
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val();
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			var strMaxVal = new Object();
			strMaxVal.value = fnNullToZero(obj.stringImblncMaxCellvolValue);
			var strAvgVal = new Object();
			strAvgVal.value = fnNullToZero(obj.stringImblncAvgCellvolValue);
			var bmsAvgVal = new Object();
			bmsAvgVal.value = fnNullToZero(obj.bmsImblncAvgCellvolValue);

      strMaxVal.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid+" | CellId:"+obj.maxCellvol1Cellid +" | stringImblncMaxCellvolValue:"+obj.stringImblncMaxCellvolValue;
      strAvgVal.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid+" | CellId:"+obj.maxCellvol1Cellid +" | stringImblncAvgCellvolValue:"+obj.stringImblncAvgCellvolValue;
      bmsAvgVal.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid+" | CellId:"+obj.maxCellvol1Cellid +" | bmsImblncAvgCellvolValue:"+obj.bmsImblncAvgCellvolValue;

			
      if(pdetailSearch1=="") {
        if ( obj.stringDetectYn == 'Y' || obj.bmsDetectYn == 'Y' ) {
          strMaxVal.anchorBgColor = anchorBgColorDetect;
          strAvgVal.anchorBgColor = anchorBgColorDetect;
          bmsAvgVal.anchorBgColor = anchorBgColorDetect;
        }  
      } else {
        if(
           (obj.stringRate != null && parseInt(pdetailSearch1) <=parseInt(obj.stringRate)) || 
           (obj.bmsRate != null && parseInt(pdetailSearch1) <=parseInt(obj.bmsRate))
          ) {
          strMaxVal.anchorBgColor = anchorBgColorDetect;
          strAvgVal.anchorBgColor = anchorBgColorDetect;
          bmsAvgVal.anchorBgColor = anchorBgColorDetect;
        }
      }
      
			strMaxArr.push(strMaxVal);
			strAvgArr.push(strAvgVal);
			bmsAvgArr.push(bmsAvgVal);
		});
	}
	
	var temp = new Array();
	temp.push( Math.min.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
	temp.push( Math.max.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
	temp.push( Math.min.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
	temp.push( Math.max.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
	temp.push( Math.min.apply(Math, bmsAvgArr.map(function(o) { return o.value; })) );
	temp.push( Math.max.apply(Math, bmsAvgArr.map(function(o) { return o.value; })) );
	
	minvalY = Math.min.apply(null, temp);
	maxvalY = Math.max.apply(null, temp);
	
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
	
	dataset.push({
		seriesname : 'system max',
		anchorBgColor : anchorBgColor1,
		data : strMaxArr
	});
	
	dataset.push({
		seriesname : 'system avg',
		anchorBgColor : anchorBgColor2,
		data : strAvgArr
	});
	
	dataset.push({
		seriesname : 'rack avg',
		anchorBgColor : anchorBgColor3,
		data : bmsAvgArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}


/* 방전 Rest 시점, System/Rack 평균 셀 전압 + Rack Min 셀 전압 */
function makeTrendChartG006C024(data) {
  
  
  var returnObj = new Object();
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  
  var strMaxArr = new Array();          /* StrImblncMax 데이터 배열*/
  var strAvgArr = new Array();          /* StrImblncAvg 데이터 배열*/
  var bmsAvgArr = new Array();          /* BmsImblncAvg 데이터 배열*/
  
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '일자';
  chartset.yAxisName = '전압';
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var strMinVal = new Object();
      strMinVal.value = fnNullToZero(obj.stringImblncMinCellvolValue);
      
      var strAvgVal = new Object();
      strAvgVal.value = fnNullToZero(obj.stringImblncAvgCellvolValue);
      
      var bmsAvgVal = new Object();
      bmsAvgVal.value = fnNullToZero(obj.bmsImblncAvgCellvolValue);
      
      strMinVal.tooltext = "ModuleId:"+obj.minCellvol1Moduleid+" | CellId:"+obj.minCellvol1Cellid +" | Imbalance:"+obj.stringImblncMinCellvolValue;
      strAvgVal.tooltext = "ModuleId:"+obj.minCellvol1Moduleid+" | CellId:"+obj.minCellvol1Cellid +" | Imbalance:"+obj.stringImblncAvgCellvolValue;
      bmsAvgVal.tooltext = "ModuleId:"+obj.minCellvol1Moduleid+" | CellId:"+obj.minCellvol1Cellid +" | Imbalance:"+obj.bmsImblncAvgCellvolValue;
      
      
      if(pdetailSearch1=="") {
        if ( obj.stringDetectYn == 'Y' || obj.bmsDetectYn == 'Y' ) {
          strMinVal.anchorBgColor = anchorBgColorDetect;
          strAvgVal.anchorBgColor = anchorBgColorDetect;
          bmsAvgVal.anchorBgColor = anchorBgColorDetect;
        }  
      } else {
        if(
           (obj.stringRate != null && parseInt(pdetailSearch1) <=parseInt(obj.stringRate)) || 
           (obj.bmsRate != null && parseInt(pdetailSearch1) <=parseInt(obj.bmsRate))
          ) {
          strMinVal.anchorBgColor = anchorBgColorDetect;
          strAvgVal.anchorBgColor = anchorBgColorDetect;
          bmsAvgVal.anchorBgColor = anchorBgColorDetect;
        }
      }
      
      
      strMaxArr.push(strMinVal);
      strAvgArr.push(strAvgVal);
      bmsAvgArr.push(bmsAvgVal);
    });
  }
  
  var temp = new Array();
  temp.push( Math.min.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
  temp.push( Math.min.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
  temp.push( Math.min.apply(Math, bmsAvgArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, bmsAvgArr.map(function(o) { return o.value; })) );
  
  minvalY = Math.min.apply(null, temp);
  maxvalY = Math.max.apply(null, temp);
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : 'system min',
    anchorBgColor : anchorBgColor1,
    data : strMaxArr
  });
  
  dataset.push({
    seriesname : 'system avg',
    anchorBgColor : anchorBgColor2,
    data : strAvgArr
  });
  
  dataset.push({
    seriesname : 'rack avg',
    anchorBgColor : anchorBgColor3,
    data : bmsAvgArr
  });
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}


/*  1st/2nd max cell 온도 imbalance + 포지션  */
function makeTrendChartG006C025(data) {
  
  var returnObj = new Object(); 
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataArrSec = new Array();         /* 두번째 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    
    if ( chartSp == 'T1' ) {
      minvalY = data.list[0].imblncCellvolValue;
      maxvalY = data.list[0].imblncCellvolValue;
    } else if ( chartSp == 'T2' ) {
      minvalY = data.list[0].maxCelltemp1Value;
      maxvalY = data.list[0].maxCelltemp1Value;
      minvalYSec = data.list[0].maxCelltemp2Value;
      maxvalYSec = data.list[0].maxCelltemp2Value;
    }
    
    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      if ( chartSp == 'T1' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.imblncCelltempValue);
        data.tooltext = "1st ModuleId:"+obj.maxCelltemp1Moduleid + ' | 1st 온도:' + obj.maxCelltemp1Value + ' | 2nd ModuleId:' + obj.maxCelltemp2Moduleid + ' | 2nd 온도:' + obj.maxCelltemp2Value + ' | imbalance:' + obj.imblncCelltempValue;
        
        /* 트렌드 라인 초과시 색상 변경 */
        if ( startValue <= obj.imblncCelltempValue ) {
          data.anchorBgColor = "#ff0000";
        }
        
        dataArr.push(data);
      } else if ( chartSp == 'T2' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.maxCelltemp1Value);
        data.tooltext = "1st ModuleId:"+obj.maxCelltemp1Moduleid + ' | 1st 온도:' + obj.maxCelltemp1Value + ' | imbalance:' + obj.imblncCelltempValue;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.maxCelltemp2Value);
        dataSec.tooltext = "2nd ModuleId:"+obj.maxCelltemp2Moduleid + ' | 2nd 온도:' + obj.maxCelltemp2Value + ' | imbalance:' + obj.imblncCelltempValue;

        
        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCelltempValue != null && parseInt(pdetailSearch1) <=parseInt(obj.imblncCelltempValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      }
    });
  }
  
  if ( chartSp == 'T1' ) {
    chartset.yAxisName = '온도 imbalance';
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '온도 imbalance',
      data : dataArr
    });
    
    var line = new Object();
    line.startValue = startValue;
    line.valueOnRight = "1";
    line.color = "#ff0000";
    line.showOnTop = 1;
    line.displayvalue ="기준 imbalance:" + startValue;    
    trendLine.push(line);
    
  } else if ( chartSp == 'T2' ) {
    chartset.yAxisName = '온도';
    var temp = new Array();
    temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    
    minvalY = Math.min.apply(null, temp);
    maxvalY = Math.max.apply(null, temp);
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '1st 온도',
      data : dataArr
    });
    
    dataset.push({
      seriesname : '2nd 온도',
      data : dataArrSec
    });
  }
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/*  1st/2nd min cell 온도 imbalance + 포지션 */
function makeTrendChartG006C026(data) {

  var returnObj = new Object(); 
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataArrSec = new Array();         /* 두번째 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    if ( chartSp == 'T1' ) {
      minvalY = data.list[0].imblncCelltempValue;
      maxvalY = data.list[0].imblncCelltempValue;
    } else if ( chartSp == 'T2' ) {
      minvalY = data.list[0].minCelltemp1Value;
      maxvalY = data.list[0].minCelltemp1Value;
      minvalYSec = data.list[0].minCelltemp2Value;
      maxvalYSec = data.list[0].minCelltemp2Value;
    }

    var pdetailSearch1 = $("#detailSearch1", opener.document).val();
    $.each(data.list, function(idx, obj){
      
      if(pdetailSearch1=="") {
        startValue = obj.detectSetVal;  
      } else {
        startValue = pdetailSearch1
      }
      
      var category = new Object();
      category.label = obj.colecDt.substring(11, 19);
      categoryArr.push(category);
      
      if ( chartSp == 'T1' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.imblncCelltempValue);
        data.tooltext = "1st ModuleId:"+obj.minCelltemp1Moduleid + ' | 1st 온도:' + obj.minCelltemp1Value + ' | 2nd ModuleId:' + obj.minCelltemp2Moduleid + ' | 2nd 온도:' + obj.minCelltemp2Value + ' | imbalance:' + obj.imblncCelltempValue;
        
        /* 트렌드 라인 초과시 색상 변경 */
        if ( startValue <= obj.imblncCelltempValue ) {
          data.anchorBgColor = "#ff0000";
        }
        
        dataArr.push(data);
      } else if ( chartSp == 'T2' ) {
        
        var data = new Object();
        data.value = fnNullToZero(obj.minCelltemp1Value);
        data.tooltext =  "1st ModuleId:"+obj.minCelltemp1Moduleid + ' | 1st 온도:' + obj.minCelltemp1Value + ' | imbalance:' + obj.imblncCelltempValue;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.minCelltemp2Value);
        dataSec.tooltext =  "2nd ModuleId:"+obj.minCelltemp1Moduleid + ' | 2nd 온도:' + obj.minCelltemp2Value + ' | imbalance:' + obj.imblncCelltempValue;

        if(pdetailSearch1=="") {
          if ( obj.detectYn == 'Y' ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }  
        } else {
          if(obj.imblncCelltempValue != null && parseInt(pdetailSearch1) <= parseInt(obj.imblncCelltempValue) ) {
            data.anchorBgColor = anchorBgColorDetect;
            dataSec.anchorBgColor = anchorBgColorDetect;
          }
        }
        
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      }
    });
  }
  
  if ( chartSp == 'T1' ) {
    chartset.yAxisName = '온도 imbalance';
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '온도',
      data : dataArr
    });
    
    var line = new Object();
    line.startValue = startValue;
    line.valueOnRight = "1";
    line.color = "#ff0000";
    line.showOnTop = 1;
    line.displayvalue ="기준 imbalance:" + startValue;    
    trendLine.push(line);
    
  } else if ( chartSp == 'T2' ) {
    chartset.yAxisName = '온도';
    var temp = new Array();
    temp.push( Math.min.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArr.map(function(o) { return o.value; })) );
    temp.push( Math.min.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    temp.push( Math.max.apply(Math, dataArrSec.map(function(o) { return o.value; })) );
    
    minvalY = Math.min.apply(null, temp);
    maxvalY = Math.max.apply(null, temp);
    
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
    
    dataset.push({
      seriesname : '1st Min 온도',
      data : dataArr
    });
    
    dataset.push({
      seriesname : '2nd Min 온도',
      data : dataArrSec
    });
  }
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}


/* Service Soc(Avg,Max,Min) */
function makeTrendChartG006C027(data) {

  var returnObj = new Object();
  
  var chartSp = data.chartSp;           /* 차트 데이터 구분 */
  var startValue = 0;               /* 트렌드 라인 값 */
  var categoryArr = new Array();          /* 카테고리 배열 */
  
  var strMinArr = new Array();          /* min rack soc 배열*/
  var strAvgArr = new Array();          /* mvg rack soc 배열*/
  var strMaxArr = new Array();          /* max rack soc 배열*/
  
  var dataset = new Array();            /* 최종 데이터 셋 */
  var trendLine = new Array();          /* 트렌드 라인 셋 */
  
  var minvalY, maxvalY;             /* min, max 값*/
  
  /* 차트 옵션 */
  chartset.xAxisName = '일자';
  chartset.yAxisName = 'SOC';
  
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
    $.each(data.list, function(idx, obj){
      
      var category = new Object();
      category.label = obj.colecDate;
      categoryArr.push(category);
      
      var strMinVal = new Object();
      strMinVal.value = fnNullToZero(obj.minRacksoc);
      
      var strAvgVal = new Object();
      strAvgVal.value = fnNullToZero(obj.avgRacksoc);
      
      var strMaxVal = new Object();
      strMaxVal.value = fnNullToZero(obj.maxRacksoc);
      
      if ( obj.stringDetectYn == 'Y' || obj.bmsDetectYn == 'Y' ) {
        strMinVal.anchorBgColor = anchorBgColorDetect;
        strAvgVal.anchorBgColor = anchorBgColorDetect;
        strMaxVal.anchorBgColor = anchorBgColorDetect;
      }
      
      
      strMinVal.tooltext =  "rack min soc:"+obj.minRacksoc;
      strAvgVal.tooltext =  "rack avg soc:"+obj.avgRacksoc;
      strMaxVal.tooltext =  "rack max soc:"+obj.maxRacksoc;
      
      strMinArr.push(strMinVal);
      strAvgArr.push(strAvgVal);
      strMaxArr.push(strMaxVal);
    });
  }
  
  var temp = new Array();
  temp.push( Math.min.apply(Math, strMinArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, strMinArr.map(function(o) { return o.value; })) );
  temp.push( Math.min.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, strAvgArr.map(function(o) { return o.value; })) );
  temp.push( Math.min.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
  temp.push( Math.max.apply(Math, strMaxArr.map(function(o) { return o.value; })) );
  
  minvalY = Math.min.apply(null, temp);
  maxvalY = Math.max.apply(null, temp);
  
  var obj = minMaxValSet(minvalY,maxvalY);
  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  dataset.push({
    seriesname : 'rack min soc',
    anchorBgColor : anchorBgColor1,
    data : strMinArr
  });
  
  dataset.push({
    seriesname : 'rack avg soc',
    anchorBgColor : anchorBgColor2,
    data : strAvgArr
  });
  
  dataset.push({
    seriesname : 'rack max soc',
    anchorBgColor : anchorBgColor3,
    data : strMaxArr
  });
  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.trendLine = trendLine;
  returnObj.chartset = chartset;
  
  return returnObj;
}



/* SOC X~Y% Outbound 충/방전 이력 검출 */
function makeTrendChartG006C031(data) {
	
	var returnObj = new Object();
	
	var chartSp = data.chartSp;						/* 차트 데이터 구분 */
	var startValue = 0;								/* 트렌드 라인 값 */
	var categoryArr = new Array();					/* 카테고리 배열 */	
	var dataArr = new Array();						/* 데이터 배열 */	
	var dataset = new Array();						/* 최종 데이터 셋 */
	var trendLine = new Array();					/* 트렌드 라인 셋 */	
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
	  
	  if( data.list.length > 50) chartset.labelStep = parseInt(data.list.length/10);
	  
	  var pdetailSearch1 = $("#detailSearch1", opener.document).val(); // SOC 최소 기준값 
	  var pdetailSearch2 = $("#detailSearch2", opener.document).val(); // SOC 최대 기준값
	  var pdetailSearch3 = $("#detailSearch3", opener.document).val(); // Masking 전류
	  
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDt.substring(11, 19);
			categoryArr.push(category);
			
			var data = new Object();
			
			if ( chartSp == 'T1' ) {
				data.value = fnNullToZero(obj.sysServiceSoc);
			} else if ( chartSp == 'T2' ) {
				
				data.value = fnNullToZero(obj.sysSystemCurrent);
			}
			
/*			if ( obj.detectYn == 'Y') {
        data.anchorBgColor = anchorBgColorDetect;
      }*/
			

      

			 
			
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	if ( chartSp == 'T1' ) {
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : 'SYS_SERVICE_SOC',
			anchorBgColor : anchorBgColor1,
			data : dataArr
		});
		
	} else if ( chartSp == 'T2' ) {
		
    var obj = minMaxValSet(minvalY,maxvalY);
    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
		
		dataset.push({
			seriesname : 'SYS_SYSTEM_CURRENT',
			anchorBgColor : anchorBgColor1,
			data : dataArr
		});
	}
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.trendLine = trendLine;
	returnObj.chartset = chartset;
	
	return returnObj;
}