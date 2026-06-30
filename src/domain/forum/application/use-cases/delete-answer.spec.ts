import { makeAnswer } from '../../../../../test/factories/make-answer'
import { makeAnswerAttachment } from '../../../../../test/factories/make-answer-attachement'
import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositories/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: DeleteAnswerUseCase


describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentsRepository)
    })
    it('should be able to delete a answer', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswersAttachmentsRepository.items.push(
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('1')
            }),
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('2')
            }),
        )

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1'
        })

        expect(inMemoryAnswersRepository.items).toHaveLength(0)
        expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another author', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('answer-1'))
        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)

        expect(inMemoryAnswersRepository.items).toHaveLength(1)
    })
})
