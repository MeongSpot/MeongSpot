package com.ottogi.be.spot.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSpot is a Querydsl query type for Spot
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSpot extends EntityPathBase<Spot> {

    private static final long serialVersionUID = -827526132L;

    public static final QSpot spot = new QSpot("spot");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<java.math.BigDecimal> lat = createNumber("lat", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> lng = createNumber("lng", java.math.BigDecimal.class);

    public final ComparablePath<org.locationtech.jts.geom.Point> location = createComparable("location", org.locationtech.jts.geom.Point.class);

    public final StringPath name = createString("name");

    public QSpot(String variable) {
        super(Spot.class, forVariable(variable));
    }

    public QSpot(Path<? extends Spot> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSpot(PathMetadata metadata) {
        super(Spot.class, metadata);
    }

}

