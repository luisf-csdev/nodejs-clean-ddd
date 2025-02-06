import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Answer', () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit an answer', async () => {
    const authorId = 'author-1'
    const answerId = 'answer-1'
    const answerContent = 'Edited content'

    const answerToEdit = makeAnswer(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToEdit)

    await sut.execute({
      answerId,
      authorId,
      content: answerContent,
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: answerContent,
    })
  })

  it('should not be able to edit an answer from another user', async () => {
    const answerId = 'answer-1'

    const answerToEdit = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToEdit)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId,
      content: 'Some content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
