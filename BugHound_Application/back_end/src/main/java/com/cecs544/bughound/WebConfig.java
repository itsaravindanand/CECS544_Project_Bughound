package com.cecs544.bughound;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS settings to all endpoints
                .allowedOrigins("http://localhost:3000") // Allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Specify allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials, such as cookies and HTTP authentication
    }
}