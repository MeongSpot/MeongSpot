package com.ottogi.gps.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    String code;
    String message;
    T data;
}
