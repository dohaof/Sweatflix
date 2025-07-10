package com.dohaof.sweatflix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class SweatflixApplication {

    public static void main(String[] args) {
        SpringApplication.run(SweatflixApplication.class, args);
    }

}
