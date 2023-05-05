
// #Todo: make code better
javascript: (function() {
    const pop = document.createElement("div");
    const arrow = document.createElement("div");
    const img = document.createElement("img");

    // Pop Element
    pop.id = "pop";
    pop.style = `font-family: "Gotham Circular", sans-serif; 
    position:absolute; 
    font-size:36px; 
    color: #fff; 
    background-color: rgb(32, 32, 32); 
    filter: drop-shadow(0 0 0.75rem crimson);
    border-radius: 1em;
    padding: 14PX; 
    align-items: center;
    flex-direction: column;
    opacity: 0; 
    transition: opacity .2s, transform 0.2s, width 1.2s ease-in-out, left .2s ease-in-out; 
    display: none ;
    transform: scale(0.5);`;

    // Arrow Element
    arrow.style = `position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
    filter: drop-shadow(0 0 0.75rem crimson);
    transform: scale(1.2);
    `;
    arrow.style.backdropFilter = "none";
    arrow.style.borderTop = "10px solid rgb(32, 32, 32)";
    arrow.style.borderRight = "10px solid transparent";
    arrow.style.borderLeft = "10px solid transparent";

    // Image Element
    img.src = "https://a91b-35-243-154-162.ngrok-free.app/static/aria.jpg";
    img.style = `border-radius: 1em;
    background-color: #242424;
    --webkit-box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    width: 64px;
    height: 64px;
    filter: hue-rotate(180deg);
    transition: opacity .2s, transform 0.2s;
    `;

    const imgHeight = 64;
    const imgWidth = 64;

    // Text Element
    const cont = document.createElement("div");
    const txt = document.createElement("span");

    cont.id="a"
    txt.id="b"

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.innerHTML = `
    #a::-webkit-scrollbar {
      width: 1px;
    }
    #a::-webkit-scrollbar-track {
      background-color: transparent;
    }
    #a::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.1);
    }
    `;
    document.head.appendChild(scrollbarStyle);

    txt.id = "txt";
    cont.style = `position: fixed; background-color: transparent; bottom: 0px; right: 0px; width:400px; height:22px; overflow: auto;`
    txt.style = `color:black; opacity:0.14; font-family: 'Courier New', Courier, monospace;`

    document.body.appendChild(pop);

    document.body.appendChild(cont);
    cont.appendChild(txt)

    pop.appendChild(arrow);
    pop.appendChild(img);

    var highlightedText = "";

    let hidden = false;

    // Handles highlight
    document.addEventListener("keyup", (event) => {
        // Check if the "]" key was pressed
        if (event.key === "]" && window.getSelection().toString()) {
            txt.textContent = ""

            // Get the text that was highlighted
            highlightedText = window.getSelection().toString();

            // Remove previous arrow and image
            if (pop.querySelector(".arrow")) {
                pop.removeChild(arrow);
            }
            if (pop.querySelector(".img")) {
                pop.removeChild(img);
            }

            pop.style.display = "block";
            pop.style.overflow = "inherit";

            // Get the position of the highlighted text
            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Get the position of the top of the document
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Set the position of the popup box relative to the position of the highlighted text
            pop.style.top = (rect.top - imgHeight - 10 + scrollTop) + "px";
            pop.style.left = (rect.left + (rect.width / 2) - (imgWidth / 2)) - 15 + "px";

            pop.style.opacity = 1;

            console.log(highlightedText);
        }
        
        // Hides everything
        if (event.key === "[") {
            if (!hidden) {
                console.log("hidden");
                hidden = true;
                pop.style.display = "none";
                cont.style.display = "none";
            } else if (hidden) {
                console.log("not hidden");
                hidden = false;
                pop.style.display = "block";
                cont.style.display = "block";
            }
        }

        // Destroy
        if (event.key === '\\') {
            pop.remove()
            cont.remove()
        }
    })

    // Actual clck method
    pop.addEventListener("click", () => {
        // Change the image size to make it small
        img.style.transform = "scale(0.9)";
        // Set a timeout to change it back to normal size after a short delay
        setTimeout(() => {
            img.style.transform = "scale(1)";
        }, 200);

        pop.style.width = "64px";
        setTimeout(() => {

            txt.textContent = "..."

            // TODO: Make this somehow auto-update to the ngrok url

            //Fake data:
            // data = {"response":"A cat is a small carnivorous mammal of the Felidae family, typically having soft fur, retractable claws, and a short snout. Domestic cats are commonly kept as pets and are known for their playful and affectionate behavior towards humans. They are also known for their hunting abilities, agility, and cleanliness. There are many different breeds of cats, each with their own unique physical and behavioral characteristics. Cats are also popular subjects in art, literature, and popular culture."}

            
            fetch('http://a91b-35-243-154-162.ngrok-free.app/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    param: highlightedText
                }),
                mode: 'cors'
            })


            .then(response => response.json())
            .then(data => {
                console.log(data)
                txt.textContent = data.response
            })
            .catch(error => {
                console.error(error)
                txt.textContent = "❌"
            })
        }, 500);
    });

    // Hover
    pop.addEventListener("mouseenter", () => {
        pop.style.transform = "scale(0.55)";
        img.style.filter = "hue-rotate(180deg) brightness(110%)"
    })
    pop.addEventListener("mouseleave", () => {
        pop.style.transform = "scale(0.5)";
        img.style.filter = "hue-rotate(180deg) brightness(100%)"
    })

    // Hide
    pop.addEventListener("transitionend", () => {
        if (pop.style.opacity === "0") {
            pop.style.display = "none";
        }
    });

    document.addEventListener("mouseup", (event) => {
        if (!window.getSelection().toString()) {
            pop.style.opacity = 0;
        }
    });

})();
