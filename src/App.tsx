import React, { useCallback, useEffect, useState } from "react";
import style from "./App.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PauseIcon from "@mui/icons-material/Pause";
import TextBlock from "./components/textBlock/TextBlock";

import ApiService from "./utils/api-service";
import { useReactMediaRecorder } from "react-media-recorder";
import { Alert, CircularProgress } from "@mui/material";

function App() {
  const { status, startRecording, stopRecording, clearBlobUrl, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
    });

  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const [startTimer, setStartTimer] = React.useState(false);
  const [startDate, setStartDate] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [timerId, setTimerId] = React.useState<any>(null);

  const [loading, setLoading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendQuestion();
    }
  };

  const handleStartRecording = () => {
    setStartTimer(true);
    setStartDate(new Date().getTime());

    startRecording();
  };

  const handleStopRecording = () => {
    setQuestion("");
    setAnswer("");
    stopRecording();
    setMinutes(0);
    setSeconds(0);
    clearInterval(timerId);
    setTimerId(null);
  };

  const handleSend = async (data: FormData) => {
    try {
      setLoading(true);

      const response = await ApiService.sendQuestion(data);

      if (response.data?.status) {
        setQuestion(response.data?.question || "Вопрос отсутствует");
        setAnswer(response.data?.answer || "Ответ отсутствует");
      } else {
        setError(
          response.data?.error ||
            "При выполнении запроса произошла неизвестная ошибка!"
        );
      }

      setLoading(false);
    } catch (e) {
      setError("При выполнении запроса произошла неизвестная ошибка!");
      setLoading(false);
    }
  };

  const handleSendVoice = useCallback(async () => {
    if (!mediaBlobUrl) return;

    var formData = new FormData();
    let blob = await fetch(mediaBlobUrl).then((r) => r.blob());

    formData.append("file", blob, "audio.wav");
    formData.append("mime_type", "audio/wav");

    handleSend(formData);

    clearBlobUrl();
  }, [mediaBlobUrl]);

  const handleSendQuestion = useCallback(async () => {
    if (!text) return;

    setText("");
    setQuestion(text);

    if (answer) {
      setAnswer("");
    }

    var formData = new FormData();

    formData.append("question", text);

    handleSend(formData);
  }, [text, answer]);

  const getTime = (startDate: number) => {
    const time = Date.now() - startDate;

    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    if (!startTimer) return;

    let id = setInterval(() => getTime(startDate), 1000);
    setTimerId(id);

    return () => clearInterval(timerId);
  }, [startTimer, startDate]);

  useEffect(() => {
    handleSendVoice();
  }, [mediaBlobUrl, handleSendVoice]);

  useEffect(() => {
    if (!error) return;

    const id = setTimeout(() => {
      setError("");
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, [error]);

  return (
    <>
      <div className={style.contentWrapper}>
        <div className={style.content}>
          <div className={style.chat}>
            <TextBlock
              type="gigachat"
              text="Здравствуйте! Напишите ваш вопрос"
            />
            {question && <TextBlock type="user" text={question} />}
            {answer && <TextBlock type="gigachat" text={answer} />}
            {loading && (
              <div className={style.loaderWrap}>
                <CircularProgress color="success" />
              </div>
            )}
            {!!error && (
              <div className={style.alertWrap}>
                <Alert className={style.alert} severity="error">
                  {error}
                </Alert>
              </div>
            )}
          </div>
          <div className={style.delimiter} />
          <div className={style.formWrapper}>
            <div className={style.form}>
              <div className={style.textField}>
                <input
                  type="text"
                  className={style.input}
                  placeholder="Задайте вопрос"
                  value={text}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
                <span
                  className={style.sendIconWrap}
                  onClick={handleSendQuestion}
                >
                  <ArrowUpwardIcon className={style.sendIcon} />
                </span>
              </div>
              {status === "recording" ? (
                <span
                  className={style.voiceIconWrap}
                  onClick={handleStopRecording}
                >
                  <PauseIcon className={style.voiceIcon} />
                  <span className={style.timer}>{`${
                    minutes < 10 ? "0" + minutes : minutes
                  }:${seconds < 10 ? "0" + seconds : seconds}`}</span>
                </span>
              ) : (
                <span
                  className={style.voiceIconWrap}
                  onClick={handleStartRecording}
                >
                  <KeyboardVoiceIcon className={style.voiceIcon} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
