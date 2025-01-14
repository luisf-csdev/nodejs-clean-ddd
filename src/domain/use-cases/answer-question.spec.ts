import { expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import type { AnswersRepository } from '../repositories/answers-repository'

const fakeAnswersRepository: AnswersRepository = {
  async create() {},
}

it('should create an answer', async () => {
  const answerContent = 'New answer'
  const answerQuestionUseCase = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestionUseCase.execute({
    questionId: '1',
    instructorId: '1',
    content: answerContent,
  })

  expect(answer.content).toEqual(answerContent)
})
