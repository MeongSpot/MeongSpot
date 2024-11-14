package com.ottogi.be.dog.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPersonality is a Querydsl query type for Personality
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPersonality extends EntityPathBase<Personality> {

    private static final long serialVersionUID = -722678782L;

    public static final QPersonality personality = new QPersonality("personality");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public QPersonality(String variable) {
        super(Personality.class, forVariable(variable));
    }

    public QPersonality(Path<? extends Personality> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPersonality(PathMetadata metadata) {
        super(Personality.class, metadata);
    }

}

