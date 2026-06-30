import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";

export async function makeAnswerComment(override: Partial<AnswerCommentProps> = {},
    id?: UniqueEntityId
) {
    const { faker } = await import('@faker-js/faker')

    const answer = AnswerComment.create({
        authorId: new UniqueEntityId(),
        answerId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override
    },
        id,)
    return answer
}
