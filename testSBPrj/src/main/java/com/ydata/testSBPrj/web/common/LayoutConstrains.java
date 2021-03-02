package com.ydata.testSBPrj.web.common;

/**
 * <pre>
 * 전체 레이아웃 정의용 상수 정의
 * 
 * <<개정이력>>
 * 수정일                 수정자               수정내용
 * ----------     ----------    ---------------------
 * 2020.04.15.    조일근      최초 생성
 * </pre>
 *
 * @author ikcho <joynet9478@gmail.com>
 * @since 2020.04.15.
 * @version 1.0
 */

public interface LayoutConstrains {

    public static final String LAYOUT_BASE_DIR = "/WEB-INF/tiles/layout";

    // default layout
    public static final String LAYOUT_DEFAUL_TEMPLET_DIR = LAYOUT_BASE_DIR + "/default";

    public static final String LAYOUT_DEFAUL_TEMPLET_URL = LAYOUT_DEFAUL_TEMPLET_DIR + "/default-layout.jsp";

    public static final String DEFAULT_HEADER_PATH = LAYOUT_DEFAUL_TEMPLET_DIR + "/header.jsp";

    public static final String DEFAULT_LOCATION_PATH = LAYOUT_DEFAUL_TEMPLET_DIR + "/location.jsp";

    public static final String DEFAULT_FOOTER_PATH = LAYOUT_DEFAUL_TEMPLET_DIR + "/footer.jsp";

}
