import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentsRepository {
    create(AnswerComment: AnswerComment): Promise<void>
    delete(AnswerComment: AnswerComment): Promise<void>
    findById(id: string): Promise<AnswerComment | null>
    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
}
