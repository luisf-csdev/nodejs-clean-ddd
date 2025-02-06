import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'

describe('Get Question By Slug', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const questionSlug = 'example-question'

    const newQuestion = makeQuestion({ slug: Slug.create(questionSlug) })

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: questionSlug,
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
  })
})
