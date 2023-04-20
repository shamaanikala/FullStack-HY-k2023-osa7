import { useState } from "react"

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const createNewBlog = async event => {
        event.preventDefault()
        try {
            await createBlog({
                title,
                author,
                url
            })

            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (error) {
            console.log('lmaolol')
            if (error.message) {
                console.log(error.message)
            }
        }
        
        
        
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={createNewBlog}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        onChange={event => setAuthor(event.target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        type="text"
                        value={url}
                        onChange={event => setUrl(event.target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm