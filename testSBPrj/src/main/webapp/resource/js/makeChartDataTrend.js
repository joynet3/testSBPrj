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

var anchorBgColor1 = "#4f81bd";
var anchorBgColor2 = "#f79646";
var anchorBgColor3 = "#00b050";

var anchorBgColorDetect = "#ff0000";

var minmaxaddval = 10; // y 축 최소최대 설정시 간격

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
    
    startValueUp = element.sigmaUpBound;
    startValueDown = element.sigmaLowBound;
    viewSigmalv = element.sigmaLevel;
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


/* Service 전압 */
function makeTrendChartG012C001(data) {
	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압(mV)';
	
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);
			
			categoryArr.push(category);
			
			var data = new Object();   
			data.value = obj.connectedServiceVol;
			data.tooltext = '전압:' + obj.connectedServiceVol;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;

	
	dataset.push({
	    seriesname : '전압(A)',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}
//Service 전류(*Service 전류가 없는 경우 System 전류)
function makeTrendChartG012C002(data) {

  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDt.substring(5, 19);
      categoryArr.push(category);
      
      var yval =  obj.sysSystemCurrent;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
        
      }
      
      
      var data = new Object();      
      data.value = yval;
      
      if(obj.detectYn == "Y") {
        data.anchorBgColor = anchorBgColorDetect;
      } else {
        data.anchorBgColor = anchorBgColor1;  
      }
      data.tooltext = "전류:"+yval;
      dataArr.push(data);

      
      
    });
  }

  

  
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전류(A)';

  // y 축 최소 최대 설정
  
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
  dataset.push({
    seriesname : '전류',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* Service SOC (평균,최대,최소) */
function makeTrendChartG012C003(data) {
	
	var returnObj = new Object();
	  
	var categoryArr = new Array();      /* 카테고리 배열 */
	
	var strMinArr = new Array();        /* min rack soc 배열*/
	var strAvgArr = new Array();        /* mvg rack soc 배열*/
	var strMaxArr = new Array();        /* max rack soc 배열*/
  
	var dataset = new Array();          /* 최종 데이터 셋 */
  
	var minvalY, maxvalY;             	/* min, max 값*/
  
  	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = 'SOC';
  
  	/* 차트 데이터 세팅 */
  	if ( data.list != null && data.list.length > 0) {
  		
  		$.each(data.list, function(idx, obj){
      
    		var category = new Object();
      		category.label = obj.colecDt.substring(5, 19);
      		categoryArr.push(category);
      
	     	var strMinVal = new Object();
	     	strMinVal.value = fnNullToZero(obj.minRacksoc);
	      
	     	var strAvgVal = new Object();
	     	strAvgVal.value = fnNullToZero(obj.avgRacksoc);
	      
	     	var strMaxVal = new Object();
	     	strMaxVal.value = fnNullToZero(obj.maxRacksoc);
      
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
  	returnObj.chartset = chartset;
  
  	return returnObj;
}

//Service SOC
function makeTrendChartG012C004(data) {

  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDt.substring(5, 19);
      categoryArr.push(category);
      
      var yval =  obj.sysServiceSoc;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
        
      }
      
      
      var data = new Object();      
      data.value = yval;
      
      if(obj.detectYn == "Y") {
        data.anchorBgColor = anchorBgColorDetect;
      } else {
        data.anchorBgColor = anchorBgColor1;  
      }
      data.tooltext = "SOC:" +yval;
      dataArr.push(data);

      
      
    });
  }

  
  
  chartset.xAxisName = '시간';
  chartset.yAxisName = 'SOC';

  // y 축 최소 최대 설정
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;

  
  
  dataset.push({
    seriesname : 'SOC',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* Service SOH */
function makeTrendChartG012C005(data) {
	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = 'SOH';
	
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);;
			categoryArr.push(category);
			
			var data = new Object();   
			data.value = obj.systemSoh;
			data.tooltext = 'SOH:' + obj.systemSoh;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;

	dataset.push({
	    seriesname : 'SOH',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

//랙 別 랙 전압(MIN)
function makeTrendChartG012C006(data) {

  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDt.substring(5, 19);
      categoryArr.push(category);
      
      var yval =  obj.minCellvol1Value;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
      }
      
      var data = new Object();      
      data.value = yval;
      
      if(obj.detectYn == "Y") {
        data.anchorBgColor = anchorBgColorDetect;
      } else {
        data.anchorBgColor = anchorBgColor1;  
      }
      data.tooltext = "전압:"+yval;
      dataArr.push(data);

      
      
    });
  }

  
 
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전압(mV)';

  // y 축 최소 최대 설정
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
  returnObj.chartset = chartset;
  
  return returnObj;
}

//랙 別 랙 전압(MAX)
function makeTrendChartG012C007(data) {

  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDt.substring(5, 19);
      categoryArr.push(category);
      
      var yval =  obj.maxCellvol1Value;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
        
      }
      
      
      var data = new Object();      
      data.value = yval;
      
      if(obj.detectYn == "Y") {
        data.anchorBgColor = anchorBgColorDetect;
      } else {
        data.anchorBgColor = anchorBgColor1;  
      }
      data.tooltext = "전압:"+yval;
      dataArr.push(data);
      
    });
  }

  
  
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전압(mV)';

  // y 축 최소 최대 설정
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
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* 랙 別 랙 전압(전압값) */
function makeTrendChartG012C008(data) {

	var returnObj = new Object(); 
  
	var categoryArr = new Array();  /* 카테고리 배열 */
	var dataArr = new Array();    	/* 데이터 배열 */
	var dataset = new Array();    	/* 최종 데이터 셋 */
	var minvalY, maxvalY;
  
	if ( data.list != null && data.list.length > 0) {
    
		$.each(data.list, function(idx, obj){
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);
			categoryArr.push(category);
      
			var data = new Object();   
			data.value = obj.rackVoltage;
			data.tooltext = '전압:' + obj.rackVoltage;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전압(mV)';

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
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 랙 전류 */
function makeTrendChartG012C009(data) {

	var returnObj = new Object(); 
  
	var categoryArr = new Array();  /* 카테고리 배열 */
	var dataArr = new Array();    	/* 데이터 배열 */
	var dataset = new Array();    	/* 최종 데이터 셋 */
	var minvalY, maxvalY;
  
	if ( data.list != null && data.list.length > 0) {
    
		$.each(data.list, function(idx, obj){
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);
			categoryArr.push(category);
      
			var data = new Object();   
			data.value = obj.realRackCurrent;
			data.tooltext = '전류:' + obj.realRackCurrent;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전류';

  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
	dataset.push({
	    seriesname : '전류',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 랙 SOC */
function makeTrendChartG012C010(data) {

	var returnObj = new Object(); 
  
	var categoryArr = new Array();  /* 카테고리 배열 */
	var dataArr = new Array();    	/* 데이터 배열 */
	var dataset = new Array();    	/* 최종 데이터 셋 */
	var minvalY, maxvalY;
  
	if ( data.list != null && data.list.length > 0) {
    
		$.each(data.list, function(idx, obj){
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);
			categoryArr.push(category);
      
			var data = new Object();   
			data.value = obj.racksoc;
			data.tooltext = 'SOC:' + obj.racksoc;
			dataArr.push(data);
		});
	}
	
  chartset.xAxisName = '시간';
  chartset.yAxisName = 'SOC';
  
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
	dataset.push({
	    seriesname : 'SOC',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 랙 SOH */
function makeTrendChartG012C011(data) {

	var returnObj = new Object(); 
  
	var categoryArr = new Array();  /* 카테고리 배열 */
	var dataArr = new Array();    	/* 데이터 배열 */
	var dataset = new Array();    	/* 최종 데이터 셋 */
	var minvalY, maxvalY;
  
	if ( data.list != null && data.list.length > 0) {
    
		$.each(data.list, function(idx, obj){
			var category = new Object();
			category.label = obj.colecDt.substring(5, 19);
			categoryArr.push(category);
      
			var data = new Object();   
			data.value = obj.rackSoh;
			data.tooltext = 'SOH:' + obj.rackSoh;
			dataArr.push(data);
		});
	}
	
  chartset.xAxisName = '시간';
  chartset.yAxisName = 'SOH';
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
	dataset.push({
	    seriesname : 'SOH',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 랙 別 1st/2nd Max Cell 전압 + 포지션 */
function makeTrendChartG012C012(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataArrSec = new Array();         /* 두번째 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.maxCellvol1Value);
    		data.tooltext = "ModuleId:"+obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid + ' | 1st 전압:' + obj.maxCellvol1Value;
    		
    		var dataSec = new Object();
    		dataSec.value = fnNullToZero(obj.maxCellvol2Value);
    		dataSec.tooltext =  "ModuleId:"+obj.maxCellvol2Moduleid + ' | CellId:' + obj.maxCellvol2Cellid + ' | 2nd 전압:' + obj.maxCellvol2Value;
        
    		dataArr.push(data);
    		dataArrSec.push(dataSec);
	    });
	}
	
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
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
    dataset.push({
    	seriesname : '2nd Max 전압',
    	anchorBgColor : anchorBgColor2,
    	data : dataArrSec
    });
	  
    returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

/* 랙 別 1st/2nd Min Cell 전압 + 포지션 */
function makeTrendChartG012C013(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataArrSec = new Array();         /* 두번째 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '전압';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.minCellvol1Value);
    		data.tooltext = "ModuleId:" + obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid + ' | 1st 전압:' + obj.minCellvol1Value;
    		
    		var dataSec = new Object();
    		dataSec.value = fnNullToZero(obj.minCellvol2Value);
    		dataSec.tooltext = "ModuleId:" + obj.minCellvol2Moduleid + '| CellId:' + obj.minCellvol2Cellid + ' |  2nd 전압:' + obj.minCellvol2Value;
        
    		dataArr.push(data);
    		dataArrSec.push(dataSec);
	    });
	}
	
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
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
    dataset.push({
    	seriesname : '2nd Min 전압',
    	anchorBgColor : anchorBgColor2,
    	data : dataArrSec
    });
	  
    returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

//랙 別 1st Min Max Cell 전압 + 포지션
function makeTrendChartG012C014(data) {

  var returnObj = new Object(); 
  
  var categoryArr = new Array();          /* 카테고리 배열 */
  var dataArr = new Array();            /* 데이터 배열 */
  var dataArrSec = new Array();         /* 두번째 데이터 배열 */
  var dataset = new Array();            /* 최종 데이터 셋 */
  var minvalY, maxvalY;             /* min, max 값*/
    
  /* 차트 옵션 */
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전압';
      
  /* 차트 데이터 세팅 */
  if ( data.list != null && data.list.length > 0) {
    
    $.each(data.list, function(idx, obj){
        startValue = obj.detectSetVal;
        
        var category = new Object();
        category.label = obj.colecDt.substring(5, 19);
        categoryArr.push(category);
          
        var data = new Object();
        data.value = fnNullToZero(obj.minCellvol1Value);
        data.tooltext = "ModuleId:" + obj.minCellvol1Moduleid + ' | CellId:' + obj.minCellvol1Cellid + ' | 1st min:' + obj.minCellvol1Value;
        
        var dataSec = new Object();
        dataSec.value = fnNullToZero(obj.maxCellvol1Value);
        dataSec.tooltext =  "ModuleId:" + obj.maxCellvol1Moduleid + ' | CellId:' + obj.maxCellvol1Cellid + ' | 1st max:' + obj.maxCellvol1Value;
        
        dataArr.push(data);
        dataArrSec.push(dataSec);
      });
  }
  
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
      anchorBgColor : anchorBgColor1,
      data : dataArr
    });
    
    dataset.push({
      seriesname : 'Max 전압',
      anchorBgColor : anchorBgColor2,
      data : dataArrSec
    });
    
    returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.chartset = chartset;
    
  return returnObj;
}

//랙 別 1st Min-Max 전압 Imbalance
function makeTrendChartG012C015(data) {
  var returnObj = new Object(); 
  
  var categoryArr = new Array();  /* 카테고리 배열 */
  var dataArr = new Array();    /* 데이터 배열 */
  var dataset = new Array();    /* 최종 데이터 셋 */
  
  if ( data.list != null && data.list.length > 0) {
    
    var minvalY = 0, maxvalY = 0;
    
    
    $.each(data.list, function(idx, obj){
      var category = new Object();
      category.label = obj.colecDt.substring(5, 19);
      categoryArr.push(category);
      
      var yval =  obj.imblncCellvolValue;
      if(idx==0) {
        minvalY = yval;
        maxvalY = yval;
      } else {
        minvalY = (parseInt(yval) < minvalY) ? parseInt(yval) : minvalY;
        maxvalY = (parseInt(yval) > maxvalY) ? parseInt(yval) : maxvalY;
        
      }
      
      
      var data = new Object();      
      data.value = yval;
      
      if(obj.detectYn == "Y") {
        data.anchorBgColor = anchorBgColorDetect;
      } else {
        data.anchorBgColor = anchorBgColor1;  
      }
      data.tooltext = "Min ModuleId:" + obj.minCellvol1Moduleid + ' | Min CellId:' + obj.minCellvol1Cellid + ' | Min 전압:' + obj.minCellvol1Value + " | Max ModuleId:" + obj.maxCellvol1Moduleid + ' | Max CellId:' + obj.maxCellvol1Cellid + ' | Max 전압:' + obj.maxCellvol1Value + ' | 전압 Imbalance:' + obj.imblncCellvolValue;
      dataArr.push(data);
      
    });
  }

  
  
  chartset.xAxisName = '시간';
  chartset.yAxisName = '전압 Imbalance';
  
  // y 축 최소 최대 설정
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
  
  
  
  dataset.push({
    seriesname : '전압 Imbalance',
    anchorBgColor : anchorBgColor1,
    data : dataArr
  });
  

  
  returnObj.category = categoryArr;
  returnObj.dataset = dataset;
  returnObj.chartset = chartset;
  
  return returnObj;
}

/* 랙 別 1st Max- 2nd Max 전압 Imbalance */
function makeTrendChartG012C016(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();      /* 카테고리 배열 */
	var dataArr = new Array();          /* 데이터 배열 */
	var dataset = new Array();          /* 최종 데이터 셋 */
	var minvalY, maxvalY;             	/* min, max 값*/
	  
	  /* 차트 옵션 */
	  chartset.xAxisName = '시간';
	  chartset.yAxisName = '전압 Imbalance';
	  
	  /* 차트 데이터 세팅 */
	  if ( data.list != null && data.list.length > 0) {
		  
		  $.each(data.list, function(idx, obj){
			  
			  var category = new Object();
			  category.label = obj.colecDt.substring(5, 19);
			  categoryArr.push(category);
		    	
		      var data = new Object();
		      data.value = fnNullToZero(obj.imblncCellvolValue);
		      data.tooltext = "1st ModuleId:" + obj.maxCellvol1Moduleid + ' | 1st CellId:' + obj.maxCellvol1Cellid + ' | 1st 전압:' + obj.maxCellvol1Value + " | 2nd ModuleId:" + obj.maxCellvol2Moduleid + ' | 2nd CellId:' + obj.maxCellvol2Cellid + ' | 2nd 전압:' + obj.maxCellvol2Value + ' | 전압 Imbalance:' + obj.imblncCellvolValue;
		      dataArr.push(data);
		  });
	  }
	  
	  minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	    
	  var obj = minMaxValSet(minvalY,maxvalY);

	  chartset.yAxisMinValue = obj.minval;
	  chartset.yAxisMaxValue = obj.maxval;
	    
	  dataset.push({
	      seriesname : '전압 Imbalance',
	      anchorBgColor : anchorBgColor1,
	      data : dataArr
	  });
	  
	  returnObj.category = categoryArr;
	  returnObj.dataset = dataset;
	  returnObj.chartset = chartset;
	  
	  return returnObj;
}

/* 랙 別 1st Min- 2nd Min 전압 Imbalance */
function makeTrendChartG012C017(data) {
  var returnObj = new Object(); 
  
  var categoryArr = new Array();      /* 카테고리 배열 */
  var dataArr = new Array();          /* 데이터 배열 */
  var dataset = new Array();          /* 최종 데이터 셋 */
  var minvalY, maxvalY;               /* min, max 값*/
    
    /* 차트 옵션 */
    chartset.xAxisName = '시간';
    chartset.yAxisName = '전압 Imbalance';
    
    /* 차트 데이터 세팅 */
    if ( data.list != null && data.list.length > 0) {
      
      $.each(data.list, function(idx, obj){
        
        var category = new Object();
        category.label = obj.colecDt.substring(5, 19);
        categoryArr.push(category);
          
          var data = new Object();
          data.value = fnNullToZero(obj.imblncCellvolValue);
          data.tooltext = "1st ModuleId:" + obj.minCellvol1Moduleid + ' | 1st CellId:' + obj.minCellvol1Cellid + ' | 1st 전압:' + obj.minCellvol1Value + " | 2nd ModuleId:" + obj.minCellvol2Moduleid + ' | 2nd CellId:' + obj.minCellvol2Cellid + ' | 2nd 전압:' + obj.minCellvol2Value + ' | 전압 Imbalance:' + obj.imblncCellvolValue;
          dataArr.push(data);
      });
    }
    
    minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
    maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
      
    var obj = minMaxValSet(minvalY,maxvalY);

    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
      
    dataset.push({
        seriesname : '전압 Imbalance',
        anchorBgColor : anchorBgColor1,
        data : dataArr
    });
    
    returnObj.category = categoryArr;
    returnObj.dataset = dataset;
    returnObj.chartset = chartset;
    
    return returnObj;
}

/* 랙 別 1st/2nd Max Cell 온도 + 포지션 */
function makeTrendChartG012C018(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataArrSec = new Array();         /* 두번째 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '일자';
	chartset.yAxisName = '온도';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.maxCelltemp1Value);
    		data.tooltext = "1st ModuleId:"+obj.maxCelltemp1Moduleid + ' | 1st 온도:' + obj.maxCelltemp1Value;
    		
    		var dataSec = new Object();
    		dataSec.value = fnNullToZero(obj.maxCelltemp2Value);
    		dataSec.tooltext = "2nd ModuleId:" + obj.maxCelltemp2Moduleid + ' | 2nd 온도:' + obj.maxCelltemp2Value;
        
    		dataArr.push(data);
    		dataArrSec.push(dataSec);
	    });
	}
	
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
    	seriesname : '1st Cell 온도',
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
    dataset.push({
    	seriesname : '2nd Cell 온도',
    	anchorBgColor : anchorBgColor2,
    	data : dataArrSec
    });
	  
    returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

/* 랙 別 1st/2nd Min Cell 온도 + 포지션 */
function makeTrendChartG012C019(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataArrSec = new Array();         /* 두번째 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '일자';
	chartset.yAxisName = '온도';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.minCelltemp1Value);
    		data.tooltext = "1st ModuleId:"+obj.minCelltemp1Moduleid + ' | 1st 온도:' + obj.minCelltemp1Value;
    		
    		var dataSec = new Object();
    		dataSec.value = fnNullToZero(obj.minCelltemp2Value);
    		dataSec.tooltext = "2nd ModuleId:"+obj.minCelltemp2Moduleid + ' | 2nd 온도:' + obj.minCelltemp2Value;
        
    		dataArr.push(data);
    		dataArrSec.push(dataSec);
	    });
	}
	
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
    	seriesname : '1st Cell 온도',
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
    dataset.push({
    	seriesname : '2nd Cell 온도',
    	anchorBgColor : anchorBgColor2,
    	data : dataArrSec
    });
	  
    returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

/* 랙 別 1st Min Max Cell 온도 + 포지션 */
function makeTrendChartG012C020(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataArrSec = new Array();         /* 두번째 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '온도';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.maxCelltemp1Value);
    		data.tooltext = "Max ModuleId:"+obj.maxCelltemp1Moduleid + ' | Max 온도:' + obj.maxCelltemp1Value;
    		
    		var dataSec = new Object();
    		dataSec.value = fnNullToZero(obj.minCelltemp1Value);
    		dataSec.tooltext = "Min ModuleId:"+obj.minCelltemp1Moduleid + ' | Min 온도:' + obj.minCelltemp1Value;
        
    		dataArr.push(data);
    		dataArrSec.push(dataSec);
	    });
	}
	
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
    	seriesname : 'Max Cell 온도',
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
    dataset.push({
    	seriesname : 'Min Cell 온도',
    	anchorBgColor : anchorBgColor2,
    	data : dataArrSec
    });
	  
    returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

/* 랙 別 1st Min-Max 온도 Imbalance */
function makeTrendChartG012C021(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '온도 Imbalance';
		  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
	    	startValue = obj.detectSetVal;
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	        
    		var data = new Object();
    		data.value = fnNullToZero(obj.imblncCelltempValue);
    		data.tooltext = "Max ModuleId:"+obj.maxCelltemp1Moduleid + ' | Max 온도:' + obj.maxCelltemp1Value + ' | Min ModuleId:' + obj.minCelltemp1Moduleid + ' | Min 온도:' + obj.minCelltemp1Value + ' | 온도 Imbalance:' + obj.imblncCelltempValue;
    		
    		dataArr.push(data);
	    });
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
  maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	    
    var obj = minMaxValSet(minvalY,maxvalY);

    chartset.yAxisMinValue = obj.minval;
    chartset.yAxisMaxValue = obj.maxval;
	    
    dataset.push({
    	seriesname : '온도 Imbalance',
    	anchorBgColor : anchorBgColor1,
    	data : dataArr
    });
    
  returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}



/* 충전 Rest 시점, 셀 별 전압 */
function makeTrendChartG012C026(data) {
	
	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '날짜';
	chartset.yAxisName = '전압';
	
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			var data = new Object();   
			data.value = obj.modulecellvolValue;
			data.tooltext = '전압:' + obj.modulecellvolValue;
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
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 방전 Rest 시점, 셀 별 전압 */
function makeTrendChartG012C027(data) {
	return makeTrendChartG012C026(data)
}

/* 시스템 Outlier 충전 Ranking */
function makeTrendChartG012C028(data) {

	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '날짜';
	chartset.yAxisName = 'Ranking';
	
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			var data = new Object();   
			data.value = obj.bmsCellvolRank;
			data.tooltext = 'Ranking:' + obj.bmsCellvolRank;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
	
	dataset.push({
	    seriesname : 'Ranking',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 시스템 Outlier 방전 Ranking */
function makeTrendChartG012C029(data) {
	return makeTrendChartG012C028(data);
}

/* Rack Outlier 충전 Ranking */
function makeTrendChartG012C030(data) {
	
	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	var dataArr = new Array();						/* 데이터 배열 */
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '날짜';
	chartset.yAxisName = 'Ranking';
	
	if ( data.list != null && data.list.length > 0) {
		
		$.each(data.list, function(idx, obj){
			
			var category = new Object();
			category.label = obj.colecDate;
			categoryArr.push(category);
			
			var data = new Object();   
			data.value = obj.rackCellvolRank;
			data.tooltext = 'Ranking : ' + obj.rackCellvolRank;
			dataArr.push(data);
		});
	}
	
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
	
	dataset.push({
	    seriesname : 'Ranking',
	    anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* Rack Outlier 방전 Ranking */
function makeTrendChartG012C031(data) {
	return makeTrendChartG012C030(data);
}

/* 방전 Rest 시점, System/Rack 평균 셀 전압 + Rack Max 셀 전압 */
function makeTrendChartG012C032(data) {
	
	
	var returnObj = new Object();
	
	var categoryArr = new Array();					/* 카테고리 배열 */
	
	var strMaxArr = new Array();					/* 데이터 배열 */
	var strAvgArr = new Array();					/* 데이터 배열 */
	var bmsAvgArr = new Array();					/* 데이터 배열 */
	
	var dataset = new Array();						/* 최종 데이터 셋 */
	var minvalY, maxvalY;							/* min, max 값*/
	
	/* 차트 옵션 */
	chartset.xAxisName = '일자';
	chartset.yAxisName = '전압';
	
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
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
		seriesname : 'max avg cell',
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
	returnObj.chartset = chartset;
	
	return returnObj;
}

/* 방전 Rest 시점, System/Rack 평균 셀 전압 + Rack Min 셀 전압 */
function makeTrendChartG012C033(data) {
	return makeTrendChartG012C032(data);
}

/* 1st/2nd max cell 온도 imbalance + 포지션 */
function makeTrendChartG012C034(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '온도 imbalance';
	  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
	    $.each(data.list, function(idx, obj){
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	      
	    	var data = new Object();
	    	data.value = fnNullToZero(obj.imblncCelltempValue);
	    	data.tooltext = "1st Moduleid:" + obj.maxCelltemp1Moduleid + ' | 1st 온도:' + obj.maxCelltemp1Value + ' | 2nd Moduleid:' + obj.maxCelltemp2Moduleid + ' | 2nd 온도:' + obj.maxCelltemp2Value + ' | 온도 imbalance:' + obj.imblncCelltempValue;
	    
	    	dataArr.push(data);
	    });
	}
	  
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	    
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
	    
	dataset.push({
		seriesname : '온도 imbalance',
		anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}

/* 1st/2nd min cell 온도 imbalance + 포지션 */
function makeTrendChartG012C035(data) {
	
	var returnObj = new Object(); 
	  
	var categoryArr = new Array();          /* 카테고리 배열 */
	var dataArr = new Array();            /* 데이터 배열 */
	var dataset = new Array();            /* 최종 데이터 셋 */
	var minvalY, maxvalY;             /* min, max 값*/
	  
	/* 차트 옵션 */
	chartset.xAxisName = '시간';
	chartset.yAxisName = '온도 imbalance';
	  
	/* 차트 데이터 세팅 */
	if ( data.list != null && data.list.length > 0) {
		
	    $.each(data.list, function(idx, obj){
	      
	    	var category = new Object();
	    	category.label = obj.colecDt.substring(5, 19);
	    	categoryArr.push(category);
	      
	    	var data = new Object();
	    	data.value = fnNullToZero(obj.imblncCelltempValue);
	    	data.tooltext = "1st Moduleid:" + obj.minCelltemp1Moduleid + ' | 1st 온도:' + obj.minCelltemp1Value + ' | 2nd Moduleid:' + obj.minCelltemp2Moduleid + ' | 2nd 온도:' + obj.minCelltemp2Value + ' | 온도 imbalance:' + obj.imblncCelltempValue;
	    
	    	dataArr.push(data);
	    });
	}
	  
	minvalY = Math.min.apply(Math, dataArr.map(function(o) { return o.value; }));
	maxvalY = Math.max.apply(Math, dataArr.map(function(o) { return o.value; }));
	    
  var obj = minMaxValSet(minvalY,maxvalY);

  chartset.yAxisMinValue = obj.minval;
  chartset.yAxisMaxValue = obj.maxval;
	    
	dataset.push({
		seriesname : '온도 imbalance',
		anchorBgColor : anchorBgColor1,
	    data : dataArr
	});
	
	returnObj.category = categoryArr;
	returnObj.dataset = dataset;
	returnObj.chartset = chartset;
	  
	return returnObj;
}