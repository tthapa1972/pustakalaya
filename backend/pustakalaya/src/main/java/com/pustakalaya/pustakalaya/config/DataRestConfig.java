package com.pustakalaya.pustakalaya.config;

import com.pustakalaya.pustakalaya.entity.Book;
import com.pustakalaya.pustakalaya.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private String theAllowedOrigins = "http://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod [] theUnsupportedActions = {
          HttpMethod.POST,
          HttpMethod.PATCH,
          HttpMethod.DELETE,
          HttpMethod.PUT
        };

        config.exposeIdsFor(Book.class);
        config.exposeIdsFor(Review.class);
        disableHttpMethods(Book.class, config, theUnsupportedActions);
        disableHttpMethods(Review.class, config, theUnsupportedActions);
        /*Configure CORS mapping*/
        cors.addMapping(config.getBasePath()+"/**")
                .allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metData, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metData, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}
