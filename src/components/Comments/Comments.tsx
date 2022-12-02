import React, { FC, useState } from "react";
import { Comment } from "../../types";
import "./Comments.scss";

export const Comments: FC<{ comments: Comment[] }> = ({ comments }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="comments">
      <div>
        <span>Comments:{comments.length} </span>
        <span onClick={() => setShow((s) => !s)} className="comments__show">
          {comments.length ? "show" : null}
        </span>
      </div>
      {show &&
        comments.map((comment) => (
          <>
            <div className="comments__text">{comment.text}</div>
            {comment.comments.length ? (
              <Comments comments={comment.comments} />
            ) : null}
          </>
        ))}
    </div>
  );
};
