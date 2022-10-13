const { getMockReq, getMockRes } = require("@jest-mock/express")
const postsController = require("./postsController")

const { res, next } = getMockRes()

describe("Test fetch all products", () => {
  test("fetch all products", async () => {
    const req = getMockReq()

    await postsController.getAllPosts(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Get all posts",
        data: expect.arrayContaining([]),
        dataCount: expect.any(Number)
      })
    )
  })
})
