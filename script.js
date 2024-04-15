// Global variables
let canFlip = true;
let cardsFlipped = 0;
const flipsAvailable = 2;
let flippedCards = [];
let pairs = 8;
let attempts = 3;

// Function to handle flipping a card
function flipCard() 
{
    // Check if the card can be flipped
    if (!canFlip || this.classList.contains('matched') || flippedCards.length === flipsAvailable || !this.classList.contains('flipped')) 
    {
        // Alert the user to select a different card
        alert("Please select a different card.");
        return;
    }
    
    // Toggle the 'flipped' class
    this.classList.toggle('flipped');
    
    // Increment the number of flipped cards
    cardsFlipped++;
    
    // Add flipped card to array
    flippedCards.push(this);

    // If it's the second card flipped, compare with the first card
    if (cardsFlipped === flipsAvailable) 
    {
        canFlip = false; // Prevent flipping more cards until comparison is done
        setTimeout(compareCards, 200); // Delay the comparison
    }
}

// Function to compare the flipped cards
function compareCards() 
{
    console.log("Comparing cards..."); 
    
    // Ensure there are two flipped cards
    if (flippedCards.length !== flipsAvailable) 
    {
        console.error("Error: Expected " + flipsAvailable + " flipped cards, found " + flippedCards.length);
        // Clear flipped cards array and reset flipped card count
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        cardsFlipped = 0;
        canFlip = true;
        return;
    }
    
    // Get the background image URLs of the flipped cards
    const backgroundImageUrl1 = flippedCards[0].querySelector('.front').style.backgroundImage;//.slice(4, -1).replace(/["']/g, "");
    const backgroundImageUrl2 = flippedCards[1].querySelector('.front').style.backgroundImage;//.slice(4, -1).replace(/["']/g, "");
    
    if (backgroundImageUrl1 === backgroundImageUrl2) 
    {
        console.log("match");
        setTimeout(() => 
        {
            flippedCards.forEach(card => 
            {
                card.classList.add('matched');
                card.removeEventListener('click', flipCard);
            });
            flippedCards = [];
            cardsFlipped = 0;
            canFlip = true;
            pairs --;

            if (pairs === 0) 
            {
                //Game Won Code.
                const gameOverMessage = document.getElementById('game-over-message');
                gameOverMessage.classList.add('visible');

                const curtain = document.querySelector('.curtain');
                curtain.style.animation = 'closeCurtain 6s forwards';
            }
            
        }, 400);
    
    }
    else 
    {
        setTimeout(function () 
        {
            console.log("Flipping cards back");
            flippedCards.forEach(card => 
            {
                card.classList.toggle('flipped');
            });
            flippedCards = [];
            cardsFlipped = 0;
            canFlip = true;
            attempts--
            console.log(attempts)
            if (attempts === 0) 
            {
                //Game Lost Code.
                let gameOverMessage = document.getElementById('game-over-message');
                gameOverMessage.textContent = `You lose`
                gameOverMessage.classList.add('visible');

                const curtain = document.querySelector('.curtain');
                curtain.style.animation = 'closeCurtain 6s forwards';

                const tryAgainButton = document.getElementById('try-again-button');
                tryAgainButton.classList.remove('hidden');
            }
        }, 400); 
    }
}

// Function to add event listeners to cards
function addClickListenerToCards(card) 
{
    card.addEventListener('click', flipCard);
}

// Function to remove event listeners from cards
function removeClickListenerFromCards(card) 
{
    card.removeEventListener('click', flipCard);
}

// Function that flips all cards 
function flipAllCards() 
{
    cards.forEach(function(card) 
    {
        card.classList.add('flipped');
    });
}

// Function to add delay before flipping cards
function flipCardsAfterDelay() 
{
    cards.forEach(removeClickListenerFromCards);

    setTimeout(function() 
    {
        flipAllCards();
        cards.forEach(addClickListenerToCards);
    }, 4200);
}

// Shuffles the cards by index
function shuffle(array) 
{
    for (let i = array.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Image loading and setup
let imageArray = [];
let imageSources = ['./images/husky.jpg', './images/cat.png', './images/otter.jpg', './images/kitten.jpg', './images/pug.jpg', './images/squirel.jpg', './images/koala.jpg', './images/fox.jpg'];

imageSources.forEach(function (imageSrc) 
{
    for (let i = 0; i < 2; i++) 
    {
        let newImage = new Image(); 
        newImage.src = imageSrc;
        newImage.onload = function () 
        {
            imageArray.push(newImage); 
            if (imageArray.length === imageSources.length * 2) 
            {
                shuffle(imageArray);

                let frontElements = document.querySelectorAll(".Card .front");
                for (let i = 0; i < imageArray.length; i++) 
                {
                    let frontElement = frontElements[i];
                    frontElement.style.backgroundImage = "url(" + imageArray[i].src + ")";
                    frontElement.style.backgroundSize = 'cover';
                    frontElement.style.backgroundPosition = 'center';
                    frontElement.style.width = '100px';
                    frontElement.style.height = '150px';
                }
                
                // Call the function to flip cards after delay
                flipCardsAfterDelay();
            }
        };
    }
});

// Select all cards
const cards = document.querySelectorAll('.Card');

// Add event listeners to cards
cards.forEach(addClickListenerToCards);

// Add event listener to the try again button
const tryAgainButton = document.getElementById('try-again-button');
tryAgainButton.addEventListener('click', function() 
{
    location.reload(); 
});
