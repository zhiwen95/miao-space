---
authors: alamiao
slug: spring-rest-template-disable-ssl-validation
tags: [技术]
title: Spring RestTemplate 关闭 SSL 验证
---
<!-- truncate -->
## 适用于 Apache HttpClient

```java
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * @author zhiwen95
 * @date 2022/06/16
 */
@Configuration
public class RestTemplateConfiguration {
    @Autowired
    private List<RestTemplateCustomizer> customizers;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder(customizers.toArray(new RestTemplateCustomizer[0]))
                .requestFactory(() -> {
                    HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
                    try {
                        disableSslVerification(requestFactory);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return requestFactory;
                })
                .build();
    }

    private void disableSslVerification(HttpComponentsClientHttpRequestFactory requestFactory) throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
        TrustStrategy acceptingTrustStrategy = (x509Certificates, s) -> true;
        SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());
        CloseableHttpClient httpClient = HttpClients.custom().setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE).setSSLSocketFactory(csf).build();
        requestFactory.setHttpClient(httpClient);
    }
}
```

## 适用于 OkHttp3

```java
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * @author zhiwen95
 * @date 2022/06/16
 */
@Configuration
public class RestTemplateConfiguration {

    static final TrustManager[] TRUST_MANAGERS = new TrustManager[]{
            new X509TrustManager() {
                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {
                }

                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {
                }

                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return new java.security.cert.X509Certificate[]{};
                }
            }
    };

    @Autowired
    private List<RestTemplateCustomizer> customizers;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder(customizers.toArray(new RestTemplateCustomizer[0]))
                .requestFactory(() -> {
                    final OkHttpClient.Builder builder = new OkHttpClient.Builder();
                    try {
                        disableSslVerification(builder);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return new OkHttp3ClientHttpRequestFactory(builder
                            .build());
                })
                .build();
    }

    private void disableSslVerification(OkHttpClient.Builder builder) throws NoSuchAlgorithmException, KeyManagementException {
        final SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(null, TRUST_MANAGERS, new java.security.SecureRandom());
        final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

        builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) TRUST_MANAGERS[0]);
        builder.hostnameVerifier((hostname, session) -> true);
    }
}
```