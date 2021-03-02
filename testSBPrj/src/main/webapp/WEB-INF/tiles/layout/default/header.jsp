<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>


<script type="text/javascript">
        $(document).ready(function() {
            // menu 클래스 바로 하위에 있는 a 태그를 클릭했을때
            
            $(".menu>a").click(function(){
                $(".submenu").hide();
                var submenu = $(this).next("div");
                // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
                if( submenu.is(":visible") ){
                    submenu.slideUp();
                }else{
                    submenu.slideDown();
                }
            });
            
        });
</script>


<header id="header">
    <div class="header_area">
    <c:set var="url" value="/"/>
    <c:choose>
    	<c:when test="${USER_INFO.autId eq RoleGen }">
    		<c:set var="url" value="/installState/installStatusList.do"/>
    	</c:when>
    	<c:otherwise>
    		<c:set var="url" value="/dashboard/dashboard.do"/>
    	</c:otherwise>
    </c:choose>
    
    <h1 class="logo"><a href="${url}">E-BMS<img src="/resource/images/img_logo.png" alt="SAMSUNG 삼성SDI"></a></h1>
    
    <div class="gnbWrap">
        <c:choose>
            <c:when test="${USER_INFO.autId eq RoleAdmin }">
                <ul>
                    <li><a href="#none">사이트현황</a></li>
                    <li><a href="/abnDetect/G006C001/abnDetect.do">이상검출</a></li>
                    <li><a href="/trendView/G012C001/trendView.do">트랜드분석</a></li>
                    <li><a href="#none">기준정보관리</a></li>
                    <li><a href="#none">설치관리</a></li>
                    <li><a href="#none">포탈관리</a></li>
                </ul>
                <div class="subGnb">
                    <div class="inner">
                        <dl class="firstMenu">
                          <dt><a href="/siteState/siteList.do">사이트현황</a></dt>
                          <dd><a href='/siteState/siteList.do'>전국 사이트리스트</a></dd>
                          <dd><a href='/siteState/totAlmProtectListRt.do'>전국 실시간 알람/프로텍션 현황</a></dd>
                          <dd><a href='/siteState/totAlmProtectListHist.do'>전국 알람/프로텍션 발생이력</a></dd>
                          <dd><a href='/siteState/totAlmProtectListHistRack.do'>렉별전국 알람/프로텍션 발생이력</a></dd>
                          <dd><a href='/siteState/totcommOffListRt.do'>전국 실시간 통신불가 발생 현황</a></dd>
                          <dd><a href='/siteState/totcommOffListHist.do'>전국 통신불가 발생이력</a></dd>
                        </dl>
                        <dl class="thirdMenu">
                            <dt><a href="/equipMng/equipList.do">기준정보관리</a></dt>
                            <dd><a href='/equipMng/equipList.do'>장비마스터 기본</a></dd>
                        </dl>
                        <dl class="fourthMenu">
                          <dt><a href="/bmsDetectSet/bmsDetectParamSet.do">설치관리</a></dt>
                          <dd><a href='/bmsDetectSet/bmsDetectParamSet.do'>BMS검출 설정값 이력</a></dd>
                          <dd><a href='/siteMng/siteList.do'>사이트정보</a></dd>
                          <dd><a href='/installState/installStatusList.do'>설치현황</a></dd>
                          <dd><a href='/edgeMng/edgeList.do'>엣지 구성기본</a></dd>
                        </dl>
                        <dl class="fifthMenu">
                          <dt><a href="/userMng/userList.do">포탈관리</a></dt>
                          <dd><a href='/userMng/userList.do'>사용자관리</a></dd>
                          <dd><a href='/cmmCodelMng/commCodeMng.do'>공통코드 관리</a></dd>
                        </dl>
                    </div>
                </div>            
            </c:when>
            <c:when test="${USER_INFO.autId eq RoleSdi }">
                <ul>
                    <li><a class="gnb01" href="/abnDetect/G006C001/abnDetect.do">사이트현황</a></li>
                    <li><a href="/abnDetect/G006C001/abnDetect.do">이상검출</a></li>
                    <li><a href="/trendView/G012C001/trendView.do">트랜드분석</a></li>
                </ul>
                <div class="subGnb">
                    <div class="inner">
                        <dl class="firstMenu">
                          <dt><a href="/siteState/siteList.do">사이트현황</a></dt>
                          <dd><a href='/siteState/siteList.do'>전국 사이트리스트</a></dd>
                          <dd><a href='/siteState/totAlmProtectListRt.do'>전국 실시간 알람/프로텍션 현황</a></dd>
                          <dd><a href='/siteState/totAlmProtectListHistRack.do'>렉별전국 알람/프로텍션 발생이력</a></dd>
                          <dd><a href='/siteState/totAlmProtectListHist.do'>전국 알람/프로텍션 발생이력</a></dd>
                          <dd><a href='/siteState/totcommOffListRt.do'>전국 실시간 통신불가 발생 현황</a></dd>
                          <dd><a href='/siteState/totcommOffListHist.do'>전국 통신불가 발생이력</a></dd>
                        </dl>
                    </div>
                </div>    
            </c:when>            
            <c:when test="${USER_INFO.autId eq RoleGen }">
                <ul>
                    <li><a href="#none">설치관리</a></li>
                </ul>
                <div class="subGnb">
                    <div class="inner">
                        <dl class="firstMenu">
                          <dt><a href="/bmsDetectSet/bmsDetectParamSet.do">설치관리</a></dt>
                          <dd><a href='/siteMng/siteList.do'>사이트정보</a></dd>
                          <dd><a href='/installState/installStatusList.do'>설치현황</a></dd>
                        </dl>
                    </div>
                </div>              
            </c:when>            
        </c:choose>
    </div>
    <div class="userArea"> 
        <div class="userName"><em>${USER_INFO.userNm}</em> 님, 반갑습니다.</div>
        <a href="/login/logout.do" class="userState">로그아웃</a>
    </div>
  </div>
</header>