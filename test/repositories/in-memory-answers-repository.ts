import { DomainEvents } from '@/core/events/domain-events'
import { AnswersRepository } from '../../src/domain/forum/application/repositories/answers-repository'
import { Answer } from '../../src/domain/forum/enterprise/entities/answer'
import { InMemoryAnswerAttachmentRepository } from './in-memory-answers-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
    public items: Answer[] = []

    constructor(
        private answerAttachmentsRepository?: InMemoryAnswerAttachmentRepository
    ) { }

    async create(answer: Answer) {
        this.items.push(answer)
        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async findById(id: string) {
        const answer = this.items.find((item) => item.id.toString() === id)
        return answer || null
    }

    async findManyByQuestionId(questionId: string, params: { page: number }) {
        const answers = this.items
            .filter(item => item.questionId.toString() === questionId)
            .slice((params.page - 1) * 20, params.page * 20)
        return answers
    }

    async delete(answer: Answer) {
        const itemIndex = this.items.findIndex((item) => item.id === answer.id)

        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1)
        }

        await this.answerAttachmentsRepository?.deleteManyByAnswerId(answer.id.toString())
    }

    async save(answer: Answer) {
        const itemIndex = this.items.findIndex((item) => item.id === answer.id)
        DomainEvents.dispatchEventsForAggregate(answer.id)
        if (itemIndex !== -1) {
            this.items[itemIndex] = answer
            await this.answerAttachmentsRepository?.deleteManyByAnswerId(answer.id.toString())
            this.answerAttachmentsRepository?.items.push(...answer.attachments.getItems())
        }
    }
}
