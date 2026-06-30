import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'

let inMemoryQuestionsCommentsRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionsCommentsRepository = new InMemoryQuestionCommentRepository()

        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionsCommentsRepository
        )
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = await makeQuestionComment()

        await inMemoryQuestionsCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString()
        })

        expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question comment', async () => {
        const questionComment = await makeQuestionComment()

        await inMemoryQuestionsCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'wrong-author-id'
        })

        expect(result.isLeft()).toBe(true)

    })
})

