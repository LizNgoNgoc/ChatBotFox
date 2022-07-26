const inputField = document.getElementById("input");
const buttonSend = document.getElementById("button");

const FoxBookAnswersYes = ["Ура! На какой день недели запишемся?", 
"Рада слышать! Какой день недели интересует?", "Отлично! В какой день недели ждать в гости?"];

const FoxBookAnswersNo = ["Хм... Ну, значит, пока не хочешь ко мне в гости. Заходи все же завтра, я всегда готова пообщаться с интересными людьми!"];

const FoxTimeAnswers = ["Ок! Для подтверждения намерений введи номер телефона. Мой менеджер свяжется с тобой!", "Прекрасно! Чтобы запись была подтверждена, введи свой номер телефона.", "Супер! Оставь телефончик, мой менеджер свяжется с тобой!"]

const dontUnderstand = ["Извини, я тебя не понимаю. Попробуй задать вопрос еще раз!", "Переформулируй, пожалуйста, вопрос. Я тебя не понимаю."]

const selectedFoxAnswer = (userTexts, foxTexts, text) => {
		let item;
		for (x = 0; x < userTexts.length; x++){
			for (y = 0; y < foxTexts.length; y++){
				if (userTexts [x] [y] === text){
					items = foxTexts[x];
					item = items[Math.floor(Math.random() * items.length)];
				}
			}
		}
		return item;
}

const chatDiv = document.getElementById("dialog");

	const showFoxAnswer = (text) => {
		const foxDiv = document.createElement("div");
		foxDiv.className = "foxAnswer";
		foxDiv.innerHTML = `Печатает...`;
		chatDiv.appendChild(foxDiv);
		setTimeout (function(){
			foxDiv.innerHTML = `Лиса:${text}`;
			//speak(text);
		}, 1000)
	}


	const validatePhone = (phone) => {
		const phoneValidator = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
		return phoneValidator.test(phone);
	}


	const speak = (text) => {
		const speaker = new SpeechSynthesisUtterance();
		const allVoices = speechSynthesis.getVoices();
		speaker.voice = allVoices[0];
		speaker.text = text;
		speaker.lang = "ru-RU";
		speaker.volume = 1; //0-1 диапазон
		speaker.rate = 1;
		speaker.pitch = 1; //0-2 диапазон

		speechSynthesis.speak(speaker);
}

	showFoxAnswer("Привет! Забронировать столик в ресторане?");

	buttonSend.addEventListener('click' , function output(){ 
	const input = inputField.value;
	console.log(input);
	inputField.value = "";

	const text = input.toLowerCase()
	.replace(/[^\а-яёА-ЯЁ\s\d\:\.\,]/g, "")
	.replace(".", ":")
	.replace(",", ":")

	let answerFox = "";
	let foxAnswers =[];
	let userAnswers =[];


	fetch("/user_answers.json")
	.then(userAnswersBackend => userAnswersBackend.json())
	.then(userAnswersBackend2 => userAnswers = userAnswersBackend2)
	.then(
		fetch("/fox_answers.json")
		.then(foxAnswersBackend => foxAnswersBackend.json())
		.then(foxAnswersBackend2 => foxAnswers = foxAnswersBackend2)
		.then(() => {
			if (selectedFoxAnswer(userAnswers, foxAnswers, text)) {
			answerFox = selectedFoxAnswer(userAnswers, foxAnswers, text);
			} else if (/:/.test(text)) {
				answerFox = FoxTimeAnswers[Math.floor(Math.random() * 3)];
			} else if (text === "нет") {
				answerFox = FoxBookAnswersNo;
			} else if (/^[0-9]+$/g.test(text)) {
				if (validatePhone(text)) {
					answerFox = `Итак, твой номер - ${text} . Напиши «подтверждаю», если все верно.`;
				} else {
					answerFox = "Сорри, но введенный номер некорректный =(";
				}
			} else if (text === "подтверждаю"){
				console.log(foxStop);
				clearInterval(foxStop);
				answerFox = "Записала! Уверена, вам у нас понравится. Жду)";
			} else {
				answerFox = dontUnderstand[Math.floor(Math.random() * 2)];
			}

			const userDiv = document.createElement("div");
			userDiv.className = "userAnswer";
			userDiv.innerHTML = `Пользователь:${input}`;
			chatDiv.appendChild(userDiv);

			const randomFoxAnswer = FoxBookAnswersYes[Math.floor(Math.random() * 3)];
			
			showFoxAnswer(answerFox);
			
			chatDiv.scrollTop = chatDiv.scrollHeight - chatDiv.clientHeight; 
		}))

	})

	let foxImages =[];
	
	fetch("foxImages.json")
	.then(foxImagesBackend => foxImagesBackend.json())
	.then(foxImagesBackend2 => foxImages = foxImagesBackend2)
	.then(() => {
		const foxImage = document.getElementById("fox");
		const foxStop =
		setInterval (function notification (){
			foxImage.src = foxImages[Math.floor(Math.random() * 3)];
		}, 5000)
})