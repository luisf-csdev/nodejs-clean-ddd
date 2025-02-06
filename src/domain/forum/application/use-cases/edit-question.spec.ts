import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const authorId = 'author-1'
    const questionId = 'question-1'
    const questionTitle = 'Edited title'
    const questionContent = 'Edited content'

    const questionToEdit = makeQuestion(
      {
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToEdit)

    await sut.execute({
      questionId,
      authorId,
      title: questionTitle,
      content: questionContent,
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: questionTitle,
      content: questionContent,
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const questionId = 'question-1'

    const questionToEdit = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID(questionId),
    )

    await questionsRepository.create(questionToEdit)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId,
      title: 'Some title',
      content: 'Some content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
