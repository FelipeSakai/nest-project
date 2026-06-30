import type { MockInstance } from "vitest"

import { makeAnswer } from "../../../../../test/factories/make-answer"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { InMemoryAnswerAttachmentRepository } from "../../../../../test/repositories/in-memory-answers-attachments-repository"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { InMemoryNotificationsRepository } from "../../../../../test/repositories/in-memory-notification-repository"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { SendNotificationUseCase } from "../use-cases/send-notifications"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen"

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<SendNotificationUseCase['execute']>

describe('On Question Best Answer Chosen', () => {
    beforeEach(() => {
        inMemoryQuestionRepository = new InMemoryQuestionsRepository
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository
        sendNotification = new SendNotificationUseCase(inMemoryNotificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification)
    })

    it('should send a notification when an answer is chosen as the best answer', async () => {
        const question = await makeQuestion()
        const answer = await makeAnswer({ questionId: question.id })

        await inMemoryQuestionRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        question.bestAnswerId = answer.id

        await inMemoryQuestionRepository.save(question)

        expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
})
