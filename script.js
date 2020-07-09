const loader = document.getElementById('loader');
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterButton = document.getElementById('twitter');
const newQuoteButton = document.getElementById('quote-new');
let queryLimit = 0;

function showLoader() {
	loader.hidden = false;
	quoteContainer.hidden = true;
};

function removeLoader() {
	if (!loader.hidden) {
		quoteContainer.hidden = false;
		loader.hidden = true;
	};
};

async function getQuote() {
	showLoader();
	const proxy = 'https://cors-anywhere.herokuapp.com/';
	const api = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

	try {
		// Limit API call retries and display error message
		if (queryLimit > 19) {
			quoteText.innerText = 'Error Retrieving Quote. Please refresh or try again later.';
			authorText.innerText = 'System';
		} else {
			const response = await fetch(proxy + api);
			const data = await response.json();

			// Reduce font size for long quotes
			if (data.quoteText.length > 120) {
				quoteText.classList.add('quote-long');
			} else {
				quoteText.classList.remove('quote-long');
			};
			quoteText.innerText = data.quoteText;

			if (data.quoteAuthor === '') {
				authorText.innerText = 'Unknown';
			} else {
				authorText.innerText = data.quoteAuthor;
			};
		};
		
		removeLoader();
	} catch (error) {
		queryLimit++;
		console.log('Error Retrieving Quote', error);
		getQuote();
	};
};

function tweetQuote() {
	const quote = quoteText.innerText;
	const author = authorText.innerText;
	const twitter = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
	window.open(twitter, '_blank');
};

// Event Listeners
twitterButton.addEventListener('click', tweetQuote);
newQuoteButton.addEventListener('click', getQuote);

// Grab quote on load
getQuote();