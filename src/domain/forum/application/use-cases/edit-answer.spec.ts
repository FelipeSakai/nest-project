import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositories/in-memory-answers-attachments-repository'
import { makeAnswerAttachment } from '../../../../../test/factories/make-answer-attachement'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase


describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentsRepository)
    })

    it('should be able to edit a answer', async () => {
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
            authorId: 'author-1',
            content: 'Conteúdo editado',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Conteúdo editado'
        })
        expect(inMemoryAnswersAttachmentsRepository.items).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not be able to edit a answer from another author', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('answer-1'))
        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2',
            content: 'Conteúdo editado',
            attachmentsIds: []
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryAnswersRepository.items).toHaveLength(1)

    })
})
