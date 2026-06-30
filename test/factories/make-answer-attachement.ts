import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachement";

export async function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {},
    id?: UniqueEntityId
) {

    const answer = AnswerAttachment.create({
        answerId: new UniqueEntityId(),
        attachmentId: new UniqueEntityId(),
        ...override
    },
        id,)
    return answer
}
