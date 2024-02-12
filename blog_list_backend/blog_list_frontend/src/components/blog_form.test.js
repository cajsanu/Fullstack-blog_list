import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './blog_form'
import userEvent from '@testing-library/user-event'

test("BlogForm updates the state with input from user and is submitted", async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={createBlog} />)
    const titleInput = screen.getByPlaceholderText("Blog title")
    const authorInput = screen.getByPlaceholderText("Blog author")
    const urlInput = screen.getByPlaceholderText("Blog url")
    const submitButton = screen.getByText("Save")
    await user.type(titleInput, "testing the form")
    await user.type(authorInput, "Babble")
    await user.type(urlInput, "url")
    await user.click(submitButton)
    expect(createBlog.mock.calls[0][0].title).toBe("testing the form")
    expect(createBlog.mock.calls[0][0].author).toBe("Babble")
    expect(createBlog.mock.calls[0][0].url).toBe("url")
    expect(createBlog.mock.calls).toHaveLength(1)
})