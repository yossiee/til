// random number create
let randomNumber = Math.floor(Math.random() * 101);

const guesses = document.querySelector('.guesses');
const lastResult = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');

const guessSubmit = document.querySelector('.guessSubmit');
const guessField = document.querySelector('.guessField');

let guessCount = 1;
let resetButton;

guessField.focus();

function checkGuess() {
    let userGuess = Number(guessField.value);

    if (guessCount === 1) {
        guesses.textContent = '前回の予想: ';
    }
    guesses.textContent += userGuess + ' ';

    if (userGuess === randomNumber) {
        lastResult.textContent = 'おめでとう！正解です！';
        lastResult.style.backgroundColor = 'green';
        lowOrHi.textContent = '';
        setGameOver();
    } else if (guessCount === 10) {
        lastResult.textContent = '！！！ゲームオーバー！！！';
        setGameOver();
    } else {
        lastResult.textContent = '間違い！';
        lastResult.style.backgroundColor = 'red';
        if (userGuess > randomNumber) {
            lowOrHi.textContent = '大きすぎます。それより小さいよ';
        } else if (userGuess < randomNumber) {
            lowOrHi.textContent = '小さすぎます。それより大きいよ';
        }
    }
    guessCount++;
    guessField.value = '';
    guessField.focus();
}

guessSubmit.addEventListener('click', checkGuess);

// ボタンの出現
// ボタン上に文字列表示
// ボタンを押したら resetButton 発火
function setGameOver() {
    guessField.disabled = true;
    guessSubmit.disabled = true;
    resetButton = document.createElement('button');
    resetButton.textContent = '新しくゲーム始める';
    document.body.appendChild(resetButton);
    resetButton.addEventListener('click', resetGame);
}

// diseble を外す
// アラートだしてるテキストを消す
// 入力回数を 1 に戻す
// ランダムの数字を再度生成
function resetGame() {
    guessCount = 1;

    var resetParas = document.querySelectorAll('.resultParas p');
    for (var i=0; i<resetParas.length; i++) {
        resetParas[i].textContent = '';
    }
    resetButton.parentNode.removeChild(resetButton);
    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = '';
    guessField.focus();

    lastResult.style.backgroundColor = 'white';

    randomNumber = Math.floor(Math.random() * 101);
}
