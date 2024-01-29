

const Blog = ({ author, title, likes, onClick, text }) => {
    return (
        <li>{author} - {title} - {likes} likes <Button onClick={onClick} text={text}/></li>
    )
}

const Button = ({ onClick, text }) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}


export { Blog, Button }