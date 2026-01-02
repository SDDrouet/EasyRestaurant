package com.sdrouet.easy_restaurant;

import com.sdrouet.easy_restaurant.config.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(JwtProperties.class)
public class EasyRestaurantApplication {

	public static void main(String[] args) {
		SpringApplication.run(EasyRestaurantApplication.class, args);
	}

}
