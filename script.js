console.log("JavaScriptを読み込みました");

// ===============================
// 入力欄
// ===============================
const workTimeInput = document.getElementById("workTime");
const breakTimeInput = document.getElementById("breakTime");
const repeatCountInput = document.getElementById("repeatCount");
const workSoundSelect = document.getElementById("workSound");

// ===============================
// 表示
// ===============================
const timerDisplay = document.getElementById("timerDisplay");
const status = document.getElementById("status");
const message = document.getElementById("message");

// ===============================
// ボタン
// ===============================
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

// ===============================
// 音
// ===============================
const bellSound = new Audio("sounds/bell.mp3");
let workSound = null;

// ===============================
// 状態定義
// ===============================
const STATE = {
    READY: "ready",
    WORK: "work",
    BREAK: "break",
    PAUSED: "paused",
    FINISHED: "finished"
};

// ===============================
// 変数
// ===============================
let timer = null;
let remainingSeconds = 0;
let remainingRounds = 0;
let messageTimer = null;

// 一時停止前の状態を保持
let previousState = STATE.READY;

// 現在の状態
let currentState = STATE.READY;

// ===============================
// イベント登録
// ===============================
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
stopButton.addEventListener("click", stopTimer);

// ===============================
// データ読み込み
// ===============================
loadData();

// ===============================
// 開始・再開
// ===============================
function startTimer() {

    // 一時停止から再開
    if (currentState === STATE.PAUSED) {

        currentState = previousState;
        workSound.play();

    } else {

       remainingRounds =
    Number(repeatCountInput.value);

saveData();
loadWorkSound();

startWork();
    }

    updateDisplay();

    clearInterval(timer);
    timer = setInterval(countDown, 1000);

}

// ===============================
// カウントダウン
// ===============================
function countDown(){

    remainingSeconds--;

    updateDisplay();

    if(remainingSeconds > 0){
        return;
    }

    handleTimerComplete();

}

//各状態管理関数の呼び出し
function handleTimerComplete(){

    if(currentState === STATE.WORK){

        startBreak();

    }

    else if(currentState === STATE.BREAK){

        remainingRounds--;

        if(remainingRounds <= 0){

            finishTimer();

        }else{

            startWork();

        }

    }

   

}

//作業開始処理
function startWork(){
    
    workSound.play();
    currentState = STATE.WORK;

    remainingSeconds =
        Number(workTimeInput.value) * 60;

    showMessage("作業開始！");
    
}

//休憩開始処理
function startBreak(){
    bellSound.currentTime = 0;
    bellSound.play();
    workSound.currentTime = 0;
    workSound.pause();


    currentState = STATE.BREAK;

    remainingSeconds =
        Number(breakTimeInput.value) * 60;

    showMessage("休憩開始！");

}

//タイマー終了処理
function finishTimer(){
    if(workSound){

    workSound.pause();

    workSound.currentTime = 0;

}
    clearInterval(timer);

    currentState = STATE.FINISHED;

    updateDisplay();

    showMessage("お疲れさまでした！");


}


// ===============================
// 表示更新
// ===============================
function updateDisplay() {

    const minutes =
        Math.floor(remainingSeconds / 60);

    const seconds =
        remainingSeconds % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0");

    switch (currentState) {

        case STATE.READY:
            status.textContent = "現在：待機中";
            break;

        case STATE.WORK:
            status.textContent = "現在：作業中";
            break;

        case STATE.BREAK:
            status.textContent = "現在：休憩中";
            break;

        case STATE.PAUSED:
            status.textContent = "現在：一時停止中";
            break;

        case STATE.FINISHED:
            status.textContent = "終了";
            break;
    }

}

//メッセージ更新
function showMessage(text){

    message.textContent = text;

     //メッセージ削除処理
messageTimer = setTimeout(function(){

    message.textContent = "";

},3000);

}

// ===============================
// 一時停止
// ===============================
function pauseTimer() {

    if (currentState === STATE.PAUSED) {
        return;
    }

    previousState = currentState;
    workSound.pause();
    currentState = STATE.PAUSED;

    clearInterval(timer);

    updateDisplay();

}

// ===============================
// 終了
// ===============================
function stopTimer() {

    clearInterval(timer);

    remainingSeconds = 0;
    remainingRounds = 0;
    if(workSound){

    workSound.pause();

}
    previousState = STATE.READY;
    currentState = STATE.READY;
    message.textContent = "";
    updateDisplay();

}

// ===============================
// 音声取得
// ===============================

function loadWorkSound() {

    if (workSound) {

        workSound.pause();

        workSound.currentTime = 0;

    }

    workSound = new Audio(
        "sounds/" + workSoundSelect.value
    );

    workSound.loop = true;

}

 function saveData(){
    localStorage.setItem("workTime", workTimeInput.value);
    localStorage.setItem("breakTime", breakTimeInput.value);
    localStorage.setItem("repeatCount", repeatCountInput.value);
    localStorage.setItem("workSound", workSoundSelect.value);
 }

 function loadData(){
    workTimeInput.value = localStorage.getItem("workTime") || "25";
    breakTimeInput.value = localStorage.getItem("breakTime") || "5";
    repeatCountInput.value = localStorage.getItem("repeatCount") || "4";
    workSoundSelect.value = localStorage.getItem("workSound") ||  "rain.mp3";
 }

if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js")
    .then(function(registration){
        console.log("Service Worker登録成功:", registration.scope);
    })
    .catch(function(error){
        console.log("Service Worker登録失敗:", error);
    });
}
