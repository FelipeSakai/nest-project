import { QuestionsRepository } from '../../src/domain/forum/application/repositories/questions-repository'
import { Question } from '../../src/domain/forum/enterprise/entities/question'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = []

    constructor(
        private questionAttachmentsRepository?: InMemoryQuestionAttachmentRepository
    ) { }

    async findById(id: string) {
        const question = this.items.find(item => item.id.toString() === id)
        return question || null
    }

    async findManyRecent(options: { page: number }) {
        const questions = this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((options.page - 1) * 20, options.page * 20)
        return questions
    }

    async create(question: Question) {
        this.items.push(question)
        this.questionAttachmentsRepository?.items.push(...question.attachments.getItems())
    }

    async findBySlug(slug: string) {
        const question = this.items.find(item => item.slug.value === slug)
        return question || null
    }

    async delete(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1)
        }

        await this.questionAttachmentsRepository?.deleteManyByQuestionId(question.id.toString())
    }

    async save(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        if (itemIndex !== -1) {
            this.items[itemIndex] = question
            await this.questionAttachmentsRepository?.deleteManyByQuestionId(question.id.toString())
            this.questionAttachmentsRepository?.items.push(...question.attachments.getItems())
            DomainEvents.dispatchEventsForAggregate(question.id)
        }
    }

}
