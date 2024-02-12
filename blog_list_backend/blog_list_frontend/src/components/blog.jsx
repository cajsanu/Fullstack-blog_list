import { Button, Togglable } from ".";

const Blog = (props) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle} className="Blog">
      <div>
        <>
          {props.title} by {props.author}
        </>
      </div>
      <div>
        <Togglable showContent="View" hideContent="Hide">
          <p>
            {props.url} - {props.likes} likes{" "}
            <Button onClick={props.onLikeClick} text="Like" />
          </p>
          <p>{props.user}</p>
          {props.children}
        </Togglable>
      </div>
    </div>
  );
};

export default Blog;
