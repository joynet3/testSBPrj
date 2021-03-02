<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>

<c:import url="/WEB-INF/tiles/layout/import.jsp" />
<tiles:insertTemplate template="${defaultLayout }">
<tiles:putAttribute name="script">


<script type="text/javascript">

	$(document).ready(function() {

	});


</script>

</tiles:putAttribute>
<tiles:putAttribute name="contents">
	<!-- content 내용 -->
	<div id="content">
		<h2 class="menuTitle mgb20">Test</h2>
	</div>
</tiles:putAttribute>
</tiles:insertTemplate>