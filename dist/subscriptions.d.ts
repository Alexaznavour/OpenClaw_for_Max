export interface MaxSubscription {
    url?: string;
    update_types?: string[];
    [key: string]: unknown;
}
export interface MaxSubscriptionResult {
    success?: boolean;
    message?: string;
    subscriptions?: MaxSubscription[];
    [key: string]: unknown;
}
export interface MaxSubscriptionClientOptions {
    token: string;
    baseUrl?: string;
}
export interface CreateSubscriptionOptions extends MaxSubscriptionClientOptions {
    url: string;
    updateTypes?: string[];
    secret?: string;
}
export interface DeleteSubscriptionOptions extends MaxSubscriptionClientOptions {
    url: string;
}
export declare function getMaxSubscriptions(opts: MaxSubscriptionClientOptions): Promise<MaxSubscription[]>;
export declare function createMaxSubscription(opts: CreateSubscriptionOptions): Promise<MaxSubscriptionResult>;
export declare function deleteMaxSubscription(opts: DeleteSubscriptionOptions): Promise<MaxSubscriptionResult>;
