import type { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'


interface FetchRecentQuestionUseCaseRequest {
    page: number
}

type FetchRecentQuestionUseCaseResponse = Either<
    null,
    {
        questions: Question[]
    }
>

export class FetchRecentQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository) { }

    async execute({
        page
    }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
        const questions = await this.questionsRepository.findManyRecent({ page })

        return right({
            questions: questions
        })
    }
}
