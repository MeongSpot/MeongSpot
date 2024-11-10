package com.ottogi.be;

import com.google.maps.model.LatLng;
import com.ottogi.be.walking.dto.PointDto;
import com.ottogi.be.walking.util.PolylineUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.List;

@EnableJpaAuditing
@SpringBootApplication
public class BeApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeApplication.class, args);
    }

}
