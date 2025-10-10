export declare enum LabelOperation {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE"
}
export declare class UpdateTaskLabelsRequestDto {
    operation: LabelOperation;
    labels: string[];
    updatedBy?: string;
    updateReason?: string;
}
