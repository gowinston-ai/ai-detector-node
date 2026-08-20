import { GlobalEndpointErrorResponse } from "./type";

/**
 * Base error thrown for every Winston AI API failure.
 *
 * Catch this to handle any SDK error, or narrow to a subclass
 * (e.g. `WinstonRateLimitError`) to react to a specific status.
 */
export class WinstonAIError extends Error {
    readonly status: number;
    readonly error: string;
    readonly description: string;

    constructor(response: GlobalEndpointErrorResponse) {
        super(response.description);
        this.name = "WinstonAIError";
        this.status = response.status;
        this.error = response.error;
        this.description = response.description;

        // Restore the prototype chain so `instanceof` works when compiling to ES5/ES6.
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Build the most specific error subclass for a given API response.
     */
    static from(response: GlobalEndpointErrorResponse): WinstonAIError {
        switch (response.status) {
            case 400:
                return new WinstonBadRequestError(response);
            case 401:
                return new WinstonAuthenticationError(response);
            case 402:
                return new WinstonPaymentRequiredError(response);
            case 403:
                return new WinstonPermissionDeniedError(response);
            case 415:
                return new WinstonUnsupportedMediaTypeError(response);
            case 429:
                return new WinstonRateLimitError(response);
            default:
                if (response.status >= 500) {
                    return new WinstonInternalServerError(response);
                }
                return new WinstonAIError(response);
        }
    }
}

/** The SDK could not reach the API (network failure, DNS, timeout). */
export class WinstonConnectionError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonConnectionError";
    }
}

/** 400 — the request was invalid or malformed. */
export class WinstonBadRequestError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonBadRequestError";
    }
}

/** 401 — the API key is missing or invalid. */
export class WinstonAuthenticationError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonAuthenticationError";
    }
}

/** 402 — the account has insufficient credits. */
export class WinstonPaymentRequiredError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonPaymentRequiredError";
    }
}

/** 403 — the request was forbidden (e.g. an inaccessible URL or file). */
export class WinstonPermissionDeniedError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonPermissionDeniedError";
    }
}

/** 415 — the request content type is not supported. */
export class WinstonUnsupportedMediaTypeError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonUnsupportedMediaTypeError";
    }
}

/** 429 — the rate limit has been exceeded. */
export class WinstonRateLimitError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonRateLimitError";
    }
}

/** >= 500 — an error occurred on the Winston AI side. */
export class WinstonInternalServerError extends WinstonAIError {
    constructor(response: GlobalEndpointErrorResponse) {
        super(response);
        this.name = "WinstonInternalServerError";
    }
}
