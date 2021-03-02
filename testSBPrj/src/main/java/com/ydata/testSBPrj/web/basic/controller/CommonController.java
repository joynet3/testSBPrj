package com.ydata.testSBPrj.web.basic.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * <pre>
 * 설명
 * 
 * <<개정이력>>
 * 수정일                 수정자               수정내용
 * ----------     ----------    ---------------------
 * 2020.04.08.    scshin      최초 생성
 * </pre>
 *
 * @author scshin <scshin@ydata.co.kr>
 * @since 2020.04.08.
 * @version 1.0
 */
@Controller
public class CommonController {

    private static final Logger logger = LoggerFactory.getLogger(CommonController.class);
    protected String viewPrefix = "/main";

    @GetMapping(path = { "/", "/index.do" })
    public String dashboard(HttpServletRequest request, HttpServletResponse response, Model model) {
        return viewPrefix + "/index";
    }

}
