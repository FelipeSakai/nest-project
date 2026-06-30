import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";

export async function makeQuestionComment(override: Partial<QuestionCommentProps> = {},
    id?: UniqueEntityId
) {
    const { faker } = await import('@faker-js/faker')

    const question = QuestionComment.create({
        authorId: new UniqueEntityId(),
        questionId: new UniqueEntityId(),
        content: faker.lorem.text(),
        ...override
    },
        id,)
    return question
}
