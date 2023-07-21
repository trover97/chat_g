import React from "react";
import clsx from "clsx";

import AssistantImg from "../../images/assistantSber1.png";

import style from "./TextBlock.module.css";

interface TextBlockProps {
  type: "gigachat" | "user";
  text: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ type, text }) => {
  return (
    <div
      className={
        type === "user"
          ? clsx(style.textBlockWrap, style.userBlock)
          : style.textBlockWrap
      }
    >
      {type === "gigachat" && (
        <div className={style.avatarWrap}>
          <img className={style.avatar} src={AssistantImg} alt="Ассистент." />
        </div>
      )}

      <div className={style.textBlock}>
        <div className={style.title}>{type === "gigachat" ? "Чат" : "Вы"}</div>
        <div className={style.text}>{text}</div>
      </div>

      {type === "user" && (
        <div className={style.avatarWrap}>
          <div className={style.userAvatar} />
        </div>
      )}
    </div>
  );
};

export default TextBlock;
