package com.ottogi.be.common.constants;

public class RedisExpiredTimeConstants {
    public static final Long PHONE_AUTH_CODE_EXPIRED = 3 * 60 * 1000L;
    public static final Long PHONE_AUTH_VERIFIED_EXPIRED = 15 * 60 * 1000L;

    public static final Long TOKEN_EXPIRED = 14 * 24 * 60 * 60 * 1000L;
}
