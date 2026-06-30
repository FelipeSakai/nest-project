import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachement-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachement'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'


interface EditQuestionUseCaseRequest {
    authorId: string
    questionId: string
    title: string
    content: string
    attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ) { }

    async execute({
        authorId,
        questionId,
        title,
        content,
        attachmentsIds
    }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {

        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

        const questionAttachments = attachmentsIds.map(attachmentsIds => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsIds),
                questionId: question.id
            })
        })

        questionAttachmentList.update(questionAttachments)

        question.attachments = questionAttachmentList
        question.title = title
        question.content = content

        await this.questionsRepository.save(question)

        return right(null)

    }
}
