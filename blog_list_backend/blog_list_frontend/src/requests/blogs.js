import axios from "axios"
const URL = "/api/blog_list"

const getAll = () => {
    const request = axios.get(URL)
    return request.then(response => response.data)
}

const postNew = (newPerson) => {
    const request = axios.post(URL, newPerson)
    return request.then(response => response.data)
}

const deleteBlog = (id) => {
    const request = axios.delete(`${URL}/${id}`)
    return request.then(response => response.data) 
}

const updateLikes = (id, blog) => {
    const request = axios.post(`${URL}/${id}/like`, blog)
    return request.then(response => response.data)
}

const updateBlog = (id, blog) => {
    const request = axios.put(`${URL}/${id}`, blog)
    return request.then(response => response.data)
}

export default { getAll, postNew, deleteBlog, updateLikes, updateBlog }