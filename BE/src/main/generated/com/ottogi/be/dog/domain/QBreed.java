package com.ottogi.be.dog.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBreed is a Querydsl query type for Breed
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBreed extends EntityPathBase<Breed> {

    private static final long serialVersionUID = -75359736L;

    public static final QBreed breed = new QBreed("breed");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public QBreed(String variable) {
        super(Breed.class, forVariable(variable));
    }

    public QBreed(Path<? extends Breed> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBreed(PathMetadata metadata) {
        super(Breed.class, metadata);
    }

}

