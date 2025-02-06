import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Delete Answer', () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete an answer', async () => {
    const authorId = 'author-1'
    const answerId = 'answer-1'

    const answerToDelete = makeAnswer(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToDelete)

    await sut.execute({
      authorId,
      answerId,
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const answerId = 'answer-1'

    const answerToDelete = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(answerId),
    )

    await answersRepository.create(answerToDelete)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
