import { AnswerAttachment } from "../../enterprise/entities/answer-attachement"

export interface AnswerAttachmentsRepository {
    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
    deleteManyByAnswerId(answerId: string): Promise<void>
}
