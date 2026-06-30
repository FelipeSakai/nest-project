import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answers-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentRepository()

        sut = new DeleteAnswerCommentUseCase(
            inMemoryAnswersCommentsRepository
        )
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = await makeAnswerComment()

        await inMemoryAnswersCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString()
        })

        expect(inMemoryAnswersCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer comment', async () => {
        const answerComment = await makeAnswerComment()

        await inMemoryAnswersCommentsRepository.create(answerComment)


        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'wrong-author-id'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(Error)
    })
})

