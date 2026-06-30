import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";

export async function makeAnswer(override: Partial<AnswerProps> = {},
    id?: UniqueEntityId
) {
    const { faker } = await import('@faker-js/faker')

    const answer = Answer.create({
        questionId: new UniqueEntityId(),
        authorId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override
    },
        id,)
    return answer
}
