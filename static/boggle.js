let score = 0;
let words = new Set();
let timer = setInterval(countTimer, 1000);
let counter = 60;

function countTimer() {

  counter -= 1;
  $(".timer").text(`${counter}`);

  if (counter === 0) {
    clearInterval(timer);
    await scoreGame();
  }
}
console.log(counter)


$(".add-word").on("submit", async function handleSubmit (evt) {
    evt.preventDefault();
  
    let word = $(".word").val();
    
    if (!word) return

    if (words.has(word)) {
      $(".msg").text(`${word} already found`);
      return;
    }

    // check server for validity
    const resp = await axios.get("/check-word", { params: { word: word }});
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
    
      $(".word").val("")

});
    
   
async function scoreGame() {
  $(".add-word").hide();
  const resp = await axios.post("/post-score", { score: score });
  if (resp.data.brokeRecord) {
    $(".msg").text(`New record: ${score}`);
  } else {
    $(".msg").text(`Final score: ${score}`);
  }
}
