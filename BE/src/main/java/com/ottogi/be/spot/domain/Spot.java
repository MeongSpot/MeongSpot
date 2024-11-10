package com.ottogi.be.spot.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "meeting_spot")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Spot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal lat;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal lng;

    @Column(nullable = false, length = 32)
    private String name;
}
