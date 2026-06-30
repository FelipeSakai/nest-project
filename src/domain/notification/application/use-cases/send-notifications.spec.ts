import { SendNotificationUseCase } from './send-notifications'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notification-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase


describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to create a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'Nova notificacao',
            content: 'Conteúdo da nova notificacao',
        })


        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items).toHaveLength(1)

        const notificationOnRepository = inMemoryNotificationsRepository.items[0]!

        if (result.isRight()) {
            expect(notificationOnRepository.id).toEqual(result.value.notification.id)
            expect(notificationOnRepository.recipientId.toString()).toBe('1')
            expect(notificationOnRepository.title).toBe('Nova notificacao')
            expect(notificationOnRepository.content).toBe('Conteúdo da nova notificacao')
        }
    })
})
