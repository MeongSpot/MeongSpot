package com.ottogi.be.spot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class SpotResponse {
    private int meetingCnt;
    private Long spotId;
    private BigDecimal lat;
    private BigDecimal lng;
    private String name;

}
