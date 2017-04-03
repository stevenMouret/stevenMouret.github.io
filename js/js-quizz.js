// Fonction de lecture d'un fichier JSON
// Attention il faut un serveur pour pouvoir lire le fichier JSON
function readJson(file, callback) {
    var xhr = new XMLHttpRequest()
    xhr.overrideMimeType("application/json")
    xhr.open("GET", file, true)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == "200") {
            callback(xhr.responseText)
        }
    }
    xhr.send(null)
}

readJson("./js-quizz.json", function (text) {
    var questions = JSON.parse(text),
        questionCounter = 0,
        selections = [],
        container = document.getElementById("js-quizz"),
        nextButton = document.getElementById("next")

    // Affiche la première question
    validateQuestion()

    // Enregistre la réponse utilisateur
    function choose() {
        if (isNaN(document.querySelector('input[name="answer"]:checked'))) {
            selections[questionCounter] = document.querySelector('input[name="answer"]:checked').value
        }
    }

    // Affiche la question suivante
    nextButton.addEventListener("click", function() {
        choose()

        // Si aucun choix de l'utilisateur
        if (isNaN(selections[questionCounter])) {
            alert('Veuillez faire un choix !');
        } else {
            questionCounter++;
            validateQuestion();
        }
    })

    // Création des réponses sous forme de radio
    function createAnswers(index) {
        var rListItems = document.createElement("ul")

        // On boucle sur le nombre de réponses de la question en cours
        for (var i = 0; i < questions.questions[index].choices.length; i++) {
            var rItem = document.createElement('li'),
                rInput = '<input type="radio" name="answer" id="answer' + i + '" value="' + i + '">';
                rLabel = '<label for="answer' + i + '">' + questions.questions[index].choices[i] + '</label>'

            rItem.innerHTML = rInput + rLabel
            rListItems.appendChild(rItem)
        }
        return rListItems
    }

    // Création d'une question
    function createQuestion(index) {
        var qElement = document.createElement('div')

        qElement.setAttribute("id", "question")

        var qQuestionNumber = "<h2>Question " + (index + 1) + ":</h2>",
            qQuestion = "<h3>" + questions.questions[index].question + "</h3>",
            qRadio = createAnswers(index)

        qElement.innerHTML = qQuestionNumber + qQuestion
        container.appendChild(qElement)
        qElement.appendChild(qRadio)
    }

    // Affiche le score
    function displayScore() {
        var numCorrect = 0

        for (var i = 0; i < selections.length; i++) {
            if (selections[i] == questions.questions[i].answer) {
                numCorrect++
            }
        }

        var scoreElement = document.createElement('p')

        scoreElement.setAttribute("id", "score")
        scoreElement.innerHTML = 'Votre score est de ' + numCorrect + ' sur ' + questions.questions.length
        return scoreElement
    }

    // Affiche la prochaine question
    function validateQuestion() {
        // Supprime la question précédente et cache le texte de présentation
        if (document.body.contains(document.getElementById('question'))) {
            document.getElementById('question').remove()
            document.getElementById('teaser').style.display = 'none'
        }

        // Si on est pas à la dernière question
        if( questionCounter < questions.questions.length ){
            // crée la question
            createQuestion(questionCounter)
        }
        // Si on est à la dernière question
        else {
            // On affiche le score
            var scoreElem = displayScore()

            container.appendChild(scoreElem)
            nextButton.style.display = 'none'
        }
    }
})