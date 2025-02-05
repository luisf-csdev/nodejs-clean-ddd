import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from './delete-question'

describe('Delete Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const authorId = 'author-1'
    const questionId = 'question-1'

    const questionToDelete = makeQuestion(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToDelete)

    await sut.execute({
      authorId,
      questionId,
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const questionId = 'question-1'

    const questionToDelete = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToDelete)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
