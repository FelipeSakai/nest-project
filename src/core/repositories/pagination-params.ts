import { Question } from "@/domain/forum/enterprise/entities/question"

export interface PaginationParams {
    page: number
}

export interface QuestionRepository {
    findById(id: string): Promise<Question | null>
    findManyRecent(options: { page: number }): Promise<Question[]>
    findBySlug(slug: string): Promise<Question | null>
    create(question: Question): Promise<void>
    save(question: Question): Promise<void>
    delete(question: Question): Promise<void>
}