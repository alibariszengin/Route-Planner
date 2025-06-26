package com.bariszengin.route_planner.core.exception.custom;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationException extends RuntimeException {

    private String reason;

    public ValidationException(String reason) {
        super(reason);
        this.setReason(reason);
    }
}
