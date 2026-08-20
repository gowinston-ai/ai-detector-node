import { GlobalEndpointErrorResponse } from "./type";
import { WinstonAIError, WinstonConnectionError } from "./WinstonAIError";

export interface HttpsClientOptions {
    /** Number of times a transient failure is retried before throwing. Default: 2. */
    maxRetries?: number;
    /** Base delay in ms for exponential backoff between retries. Default: 500. */
    retryBaseDelayMs?: number;
}

/** Statuses that are safe to retry: request timeout, conflict, rate limit, and server errors. */
const RETRYABLE_STATUS_CODES = new Set([408, 409, 429, 500, 502, 503, 504]);
const DEFAULT_MAX_RETRIES = 1;
const DEFAULT_RETRY_BASE_DELAY_MS = 500;

export class HttpsClient {
    private readonly baseUrl: string;
    private readonly apiKey: string;
    private readonly maxRetries: number;
    private readonly retryBaseDelayMs: number;

    constructor(baseUrl: string, apiKey: string, options: HttpsClientOptions = {}) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
        this.retryBaseDelayMs = options.retryBaseDelayMs ?? DEFAULT_RETRY_BASE_DELAY_MS;
    }

    public async post<T>(path: string, body: unknown): Promise<T> {
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            const response = await this.tryFetch(path, body, attempt);

            // A null response means a network failure was thrown and retried.
            if (response === null) {
                continue;
            }

            if (response.ok) {
                return this.parseJson<T>(response);
            }

            if (this.shouldRetry(response.status, attempt)) {
                await this.backoff(attempt);
                continue;
            }

            throw WinstonAIError.from(await this.readError(response));
        }

        // If we've retried the maximum number of times and still haven't received a response, throw an error.
        throw new WinstonAIError({
            status: 500,
            error: "MAXIMUM_RETRIES_EXCEEDED",
            description: "The API returned a non-JSON response",
        });
    }

    private async tryFetch(path: string, body: unknown, attempt: number): Promise<Response | null> {
        try {
            return await fetch(`${this.baseUrl}${path}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
        } catch (error) {
            if (attempt < this.maxRetries) {
                await this.backoff(attempt);
                return null;
            }

            throw new WinstonConnectionError({
                status: 0,
                error: "NETWORK_ERROR",
                description: error instanceof Error ? error.message : "A network error occurred",
            });
        }
    }

    private async parseJson<T>(response: Response): Promise<T> {
        try {
            return (await response.json()) as T;
        } catch {
            throw new WinstonAIError({
                status: response.status,
                error: "INVALID_RESPONSE",
                description: "The API returned a non-JSON response",
            });
        }
    }

    private async readError(response: Response): Promise<GlobalEndpointErrorResponse> {
        let body: Partial<GlobalEndpointErrorResponse> = {};
        try {
            body = (await response.json()) as Partial<GlobalEndpointErrorResponse>;
        } catch {
            // Keep the empty body and fall back to the HTTP status text.
        }

        return {
            status: response.status,
            error: body.error ?? "UNKNOWN_ERROR",
            description: body.description ?? response.statusText,
        };
    }

    private shouldRetry(status: number, attempt: number): boolean {
        return attempt < this.maxRetries && RETRYABLE_STATUS_CODES.has(status);
    }

    private backoff(attempt: number): Promise<void> {
        const exponential = this.retryBaseDelayMs * 2 ** attempt;
        const jitter = Math.random() * this.retryBaseDelayMs;
        return new Promise((resolve) => setTimeout(resolve, exponential + jitter));
    }
}
