---
authors: alamiao
slug: SpringBoot-配置前端-browser-history-路由
tags: [技术]
title: SpringBoot 配置前端 browser history 路由
---
Spring Boot 项目 resources/static 中放了 React 或 Vue 等前端框架编译的页面，前端使用了 browser history 路由，后端需要把非接口请求定向到 index.html
<!-- truncate -->
```java
@Configuration
public class FrontendConfiguration implements WebMvcConfigurer {
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resource = super.getResource(resourcePath, location);
                        if (resource == null) {
                            resource = super.getResource("index.html", location);
                        }
                        return resource;
                    }
                });
    }
}
```