

const Blog = ({ author, title, likes, onClick, text }) => {
    return (
        <li>{author} - {title} - {likes} likes <Button onClick={onClick} text={text} /></li>
    )
}

const Button = ({ onClick, text }) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className='notification'>
            {message}
        </div>
    )
}

const ErrorMessage = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className='error'>
            {message}
        </div>
    )
}

const LoginForm = ({ onSubmit, type, valueUN, valuePW, nameUN, namePW, onChangeUN, onChangePW }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                username
                <input
                    type={type}
                    value={valueUN}
                    name={nameUN}
                    onChange={onChangeUN}
                />
            </div>
            <div>
                password
                <input
                    type={type}
                    value={valuePW}
                    name={namePW}
                    onChange={onChangePW}
                />
            </div>
            <button type='submit'>
                login
            </button>
        </form>
    )
}

const BlogForm = ({ onSubmit, typeT, title, nameT, onChangeT, typeA, author, nameA, onChangeA, typeU, url, nameU, onChangeU, onClick }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                Add new blog to your list
                <div>
                    title
                    <input
                        type={typeT}
                        title={title}
                        name={nameT}
                        onChange={onChangeT}
                    />
                </div>
                <div>
                    author
                    <input
                        type={typeA}
                        author={author}
                        name={nameA}
                        onChange={onChangeA}
                    />
                </div>
                <div>
                    URL
                    <input
                        type={typeU}
                        url={url}
                        name={nameU}
                        onChange={onChangeU}
                    />
                </div>
            </div>
            <button type='submit'>
                save
            </button>
            <button onClick={onClick}>
                log out
            </button>
        </form>
    )
}


export { Blog, Button, LoginForm, BlogForm, Notification, ErrorMessage }