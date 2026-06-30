import { makeAnswer } from '../../../../../test/factories/make-answer'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositories/in-memory-answers-attachments-repository'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

        sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryQuestionsRepository,
            inMemoryAnswersRepository
        )
    })

    it('should be able to choose a question best answer', async () => {
        const question = await makeQuestion({
            authorId: new UniqueEntityId('author-1')
        })
        const answer = await makeAnswer({
            questionId: question.id,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-1'
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(result.value.question.bestAnswerId).toEqual(answer.id)
        }

        expect(inMemoryQuestionsRepository.items[0]?.bestAnswerId).toEqual(answer.id)
    })

    it('should not be able to choose an answer from another author', async () => {
        const question = await makeQuestion({
            authorId: new UniqueEntityId('author-1')
        })
        const answer = await makeAnswer({
            questionId: question.id,
        }, new UniqueEntityId('answer-1'))

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)

        expect(inMemoryQuestionsRepository.items[0]?.bestAnswerId).toBeUndefined()
    })
})
