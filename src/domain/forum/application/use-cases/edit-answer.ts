import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachement'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'


interface EditAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentRepository: AnswerAttachmentsRepository
    ) { }

    async execute({
        authorId,
        answerId,
        content,
        attachmentsIds
    }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {

        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }
        const currentAnswerAttachment = await this.answerAttachmentRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachment)

        const answerAttachment = attachmentsIds.map(attachmentsIds => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsIds),
                answerId: answer.id
            })
        })

        answerAttachmentList.update(answerAttachment)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answersRepository.save(answer)

        return right(null)

    }
}
