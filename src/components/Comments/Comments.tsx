import React, { FC, useState } from "react";
import { Comment } from "../../types";
import "./Comments.scss";
import { v4 } from "uuid";
import { commentChild } from "../../services/todoService";

export const Comments: FC<{
  comments: Comment[];
  setComments: Function;
  itemId: number;
}> = ({ comments, setComments, itemId }) => {
  const [show, setShow] = useState(false);
  const [inputShow, setInputShow] = useState("");
  const [commentValue, setCommentValue] = useState("");

  const submit = (e: any, commentId: string) => {
    e.preventDefault();
    if (!commentValue) return;
    const newComment: Comment = {
      id: v4(),
      text: commentValue,
      comments: [],
    };
    setComments(commentChild(commentId, itemId, newComment));
    setCommentValue("");
    setInputShow("");
  };

  return (
    <div className="comments">
      <div>
        <span onClick={() => setShow((s) => !s)} className="comments__show">
          {comments.length ? (
            <span className="comments__arrow">{show ? "-" : "+"}</span>
          ) : null}
        </span>
        <span>{comments.length ? comments.length : null}</span>
      </div>
      {show &&
        comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <div className="comments__text">{comment.text}</div>

            {inputShow === comment.id ? (
              <form onSubmit={(e) => submit(e, comment.id)}>
                <input
                  autoFocus
                  type="text"
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  placeholder="Comment"
                  width={150}
                />
                <button className="comments__button">Comment</button>
                <button
                  onClick={() => setInputShow("")}
                  className="comments__button cancel"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setInputShow(comment.id)}
                className="comments__button"
              >
                Comment
              </button>
            )}

            {comment.comments.length ? (
              <Comments
                comments={comment.comments}
                setComments={setComments}
                itemId={itemId}
              />
            ) : null}
          </React.Fragment>
        ))}
      {/* {show && <ul>
        {comments.map(comment => <li className="comment__text">{comment.text}</li>)}
        {comment.comments.length ? (
              <Comments comments={comment.comments} />
            ) : null}
        </ul>} */}
    </div>
  );
};
