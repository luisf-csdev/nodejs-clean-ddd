import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

describe('Comment on Answer', () => {
  let answersRepository: InMemoryAnswersRepository
  let answerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: CommentOnAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const answerCommentContent = 'Test comment'

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answerCommentContent,
    })

    expect(answerCommentsRepository.items[0].content).toEqual(
      answerCommentContent,
    )
  })
})
