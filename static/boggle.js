let score = 0;
let words = new Set();

$(".add-word").on("submit", async function handleSubmit (evt) {
    evt.preventDefault();
  
    let word = $(".word").val();
    
    if (!word) return

    if (words.has(word)) {
        $(".msg").text("Already found ${word}");
        return;
      }

    // check server for validity
    const resp = axios.get("/check-word", { params: { word: word }})
      if (resp.data.result === "not-word") {

        $(".msg").text(`${word} is not a valid English word`);
    
            } else if (resp.data.result === "not-on-board") {
    
        $(".msg").text(`${word} is not a valid word on this board`); 
    
        } else {
        $(".words").append($("<li>", { text: word }));
        score += word.length;
        $(".score").text(score);
        words.add(word);
        $(".msg").text(`Added: ${word}`);
        }
    
        $word.val("").focus()

    });
    
   

