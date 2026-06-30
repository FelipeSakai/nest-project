import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment, QuestionAttachmentProps } from "@/domain/forum/enterprise/entities/question-attachement";

export async function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityId
) {

    const question = QuestionAttachment.create({
        questionId: new UniqueEntityId(),
        attachmentId: new UniqueEntityId(),
        ...override
    },
        id,)
    return question
}
