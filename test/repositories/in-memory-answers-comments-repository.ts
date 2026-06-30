import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository implements AnswerCommentsRepository {
    public items: AnswerComment[] = []

    async create(answerComment: AnswerComment) {
        this.items.push(answerComment)
    }
    async delete(answerComment: AnswerComment) {
        const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)

        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1)
        }
    }
    async findById(id: string) {
        const answer = this.items.find((item) => item.id.toString() === id)
        return answer || null
    }
    async findManyByAnswerId(answerId: string, params: { page: number }) {
        const answerComments = this.items
            .filter(item => item.answerId.toString() === answerId)
            .slice((params.page - 1) * 20, params.page * 20)
        return answerComments
    }
}
