import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase



describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Conteúdo da nova resposta',
      attachmentsIds: ['1', '2']
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answer.id).toBeTruthy()
      expect(inMemoryAnswersRepository.items[0]?.id).toEqual(result.value.answer.id)
      expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') })
      ])
    }
  })
})
