import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";

export async function makeQuestion(override: Partial<QuestionProps> = {},
    id?: UniqueEntityId
) {
    const { faker } = await import('@faker-js/faker')

    const question = Question.create({
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        ...override
    },
        id,)
    return question
}
