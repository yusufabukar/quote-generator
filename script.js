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

	const api = 'https://type.fit/api/quotes';

	try {
		// Limit API call retries and display error message
		if (queryLimit > 19) {
			quoteText.innerText = 'Error Retrieving Quote. Please refresh or try again later.';
			authorText.innerText = 'System';
			newQuoteButton.innerText = 'Refresh';
		} else {
			const response = await fetch(api);
			const quotes = await response.json();
			const quote = quotes[Math.ceil(Math.random() * Math.floor(quotes.length))];

			// Reduce font size for long quotes
			if (quote.text.length > 120) {
				quoteText.classList.add('quote-long');
			} else {
				quoteText.classList.remove('quote-long');
			};
			quoteText.innerText = quote.text;

			if (quote.author === '') {
				authorText.innerText = 'Unknown';
			} else if (quote.author === 'Ralph Emerson') {
				quote.author = 'Ralph Waldo Emerson';
			} else {
				authorText.innerText = quote.author;
			};
		};
		
		removeLoader();
	} catch (error) {
		queryLimit++;
		console.log(error);
		getQuote();
	};
};

function tweetQuote() {
	const quote = quoteText.innerText;
	const author = authorText.innerText;
	const twitter = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;

	window.open(twitter, '_blank');
};

// Event Listeners
twitterButton.addEventListener('click', tweetQuote);
newQuoteButton.addEventListener('click', function() {
	if (queryLimit <= 19) {
		getQuote();
	} else {
		newQuoteButton.innerText = 'Refresh';
		window.location.reload();
	};
});

// Grab quote on load
getQuote();