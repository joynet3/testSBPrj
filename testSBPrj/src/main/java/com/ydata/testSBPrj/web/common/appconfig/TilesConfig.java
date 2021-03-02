package com.ydata.testSBPrj.web.common.appconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;
import org.springframework.web.servlet.view.tiles3.TilesViewResolver;

/**
 * <pre>
 * TILES CONFIG
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

@Configuration
public class TilesConfig {

    @Bean(name = "tilesConfigure")
    public TilesConfigurer tilesConfigurer() {
        final TilesConfigurer configurer = new TilesConfigurer();
        // 해당 경로에 tiles.xml 파일을 넣음
        configurer.setDefinitions(new String[] { "/WEB-INF/tiles/tiles.xml" });
        configurer.setCheckRefresh(true);
        return configurer;
    }

    @Bean(name = "viewResolver")
    public TilesViewResolver tilesViewResolver() {
        final TilesViewResolver tilesViewResolver = new TilesViewResolver();
        tilesViewResolver.setViewClass(TilesView.class);
        tilesViewResolver.setOrder(0); // 뷰 우선순위

        return tilesViewResolver;
    }

}