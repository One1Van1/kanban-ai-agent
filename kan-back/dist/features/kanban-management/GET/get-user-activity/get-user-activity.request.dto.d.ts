export declare enum ActivityType {
    ALL = "all",
    CREATED = "created",
    UPDATED = "updated",
    ASSIGNED = "assigned",
    COMMENTED = "commented",
    STATUS_CHANGED = "status_changed"
}
export declare class GetUserActivityRequestDto {
    page?: number;
    limit?: number;
    type?: ActivityType;
}
