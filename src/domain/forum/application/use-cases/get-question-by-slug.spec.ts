import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from '../../../../../test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase


describe('Get Question by Slug', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to get a question by its slug', async () => {
        const newQuestion = await makeQuestion({
            slug: Slug.create('nova-pergunta')
        })
        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'nova-pergunta'
        })

        expect(result.isRight()).toBe(true)

        if (result.isRight()) {
            expect(result.value.question.id).toBeTruthy()
            expect(inMemoryQuestionsRepository.items[0]?.id).toEqual(result.value.question.id)
        }
    })
})
