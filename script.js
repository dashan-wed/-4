function evaluate() {
    const answerInput = document.getElementById("answerInput").value.trim();
    const studentFile = document.getElementById("studentFile").files[0];
    const resultDiv = document.getElementById("result");

    if (!answerInput) {
        resultDiv.innerHTML = "请先输入标准答案！";
        return;
    }

    if (!studentFile) {
        resultDiv.innerHTML = "请先上传学生答案文件！";
        return;
    }

    // 解析标准答案
    const correctAnswers = parseAnswers(answerInput);
    if (!correctAnswers) {
        resultDiv.innerHTML = "标准答案格式错误！请检查格式（如：1:A,2:B,...）。";
        return;
    }

    // 读取学生答案文件
    const reader = new FileReader();
    reader.onload = function () {
        const studentAnswersText = reader.result.trim();
        const studentAnswers = parseAnswers(studentAnswersText);

        if (!studentAnswers) {
            resultDiv.innerHTML = "学生答案格式错误！请检查文件内容（如：1:A,2:B,...）。";
            return;
        }

        // 判分
        let score = 0;
        let totalQuestions = Object.keys(correctAnswers).length;

        for (let question in correctAnswers) {
            if (studentAnswers[question] === correctAnswers[question]) {
                score++;
            }
        }

        // 显示结果
        resultDiv.innerHTML = `判分完成！学生答对了 ${score} / ${totalQuestions} 道题。`;
    };

    reader.onerror = function () {
        resultDiv.innerHTML = "读取学生答案文件失败！";
    };

    reader.readAsText(studentFile);
}

function parseAnswers(text) {
    const answers = {};
    const pairs = text.split(',');
    for (let pair of pairs) {
        const [question, answer] = pair.split(':').map(item => item.trim());
        if (!question || !answer || !/^[A-D]$/i.test(answer)) {
            return null; // 格式错误
        }
        answers[question] = answer.toUpperCase();
    }
    return answers;
}