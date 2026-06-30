import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comment'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answers-comments-repository'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase


describe('Fetch Answer Comments', () => {
    beforeEach(() => {
        inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
    })
    it('should be able to fetch answer comments', async () => {
        await inMemoryAnswerCommentRepository.create(await makeAnswerComment({
            answerId: new UniqueEntityId('answer-1')
        }))
        await inMemoryAnswerCommentRepository.create(await makeAnswerComment({
            answerId: new UniqueEntityId('answer-1')
        }))
        await inMemoryAnswerCommentRepository.create(await makeAnswerComment({
            answerId: new UniqueEntityId('answer-1')
        }))

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 1
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(result.value.answerComments).toHaveLength(3)
        }
    })

    it('should be able to fetch paginated answer comments', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentRepository.create(await makeAnswerComment({
                answerId: new UniqueEntityId('answer-1')
            }))
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(result.value.answerComments).toHaveLength(2)
        }
    })
})
