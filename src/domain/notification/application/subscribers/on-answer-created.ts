import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionRepository } from "@/core/repositories/pagination-params";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notifications";

export class OnAnswerCreated implements EventHandler {
    constructor(
        private questionRepository: QuestionRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            (event: AnswerCreatedEvent) => this.sendNewAnswerNotification(event),
            AnswerCreatedEvent.name
        )
    }

    private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
        const question = await this.questionRepository.findById(answer.questionId.toString())

        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString()!,
                title: `New answer to ${question.title.substring(0, 40).concat('...')}`,
                content: answer.excerpt
            })
        }

    }

}
