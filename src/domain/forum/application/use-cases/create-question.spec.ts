import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

describe('Create Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'Question content',
    })

    expect(question.id).toBeTruthy()
    expect(questionsRepository.items[0].id).toEqual(question.id)
  })
})
