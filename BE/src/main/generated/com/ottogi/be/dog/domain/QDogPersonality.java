package com.ottogi.be.dog.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDogPersonality is a Querydsl query type for DogPersonality
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDogPersonality extends EntityPathBase<DogPersonality> {

    private static final long serialVersionUID = 357971326L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDogPersonality dogPersonality = new QDogPersonality("dogPersonality");

    public final QDog dog;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QPersonality personality;

    public QDogPersonality(String variable) {
        this(DogPersonality.class, forVariable(variable), INITS);
    }

    public QDogPersonality(Path<? extends DogPersonality> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDogPersonality(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDogPersonality(PathMetadata metadata, PathInits inits) {
        this(DogPersonality.class, metadata, inits);
    }

    public QDogPersonality(Class<? extends DogPersonality> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.dog = inits.isInitialized("dog") ? new QDog(forProperty("dog"), inits.get("dog")) : null;
        this.personality = inits.isInitialized("personality") ? new QPersonality(forProperty("personality")) : null;
    }

}

