import { QuestionAttachment } from "../../enterprise/entities/question-attachement";

export interface QuestionAttachmentsRepository {
    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
    deleteManyByQuestionId(questionId: string): Promise<void>
}
