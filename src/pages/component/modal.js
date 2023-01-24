import React from "react";
import "../../assets/modal.scss";

const modal = (props) => {
  if (props.open) {
    return (
      <div className={"modal-bg"}>
        <div className={"modal-wrap"}>
          <div className={"modal"}>
            <h1>{props.title}</h1>
            <div className={"modal-content"}>
              <p>{props.msg}</p>

              <button onClick={props.close}> 확인</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default modal;
