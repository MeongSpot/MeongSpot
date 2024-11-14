package com.ottogi.be.spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpotDto {
    private BigDecimal lat;
    private BigDecimal lng;
    private int radius;

}
