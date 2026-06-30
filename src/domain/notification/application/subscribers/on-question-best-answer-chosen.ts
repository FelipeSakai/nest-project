import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notifications";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private answerRepository: AnswersRepository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            (event: QuestionBestAnswerChosenEvent) => this.sendQuestionBestAnswerChosenNotification(event),
            QuestionBestAnswerChosenEvent.name
        )
    }

    private async sendQuestionBestAnswerChosenNotification({ question, bestAnswerId }: QuestionBestAnswerChosenEvent) {
        const answer = await this.answerRepository.findById(bestAnswerId.toString())

        if (answer) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString()!,
                title: `New answer to ${question.title.substring(0, 40).concat('...')}`,
                content: answer.excerpt
            })
        }

    }

}
