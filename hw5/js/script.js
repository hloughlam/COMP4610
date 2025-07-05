// Author: Hajar Loughlam
// Contact: hajar_loughlam@student.uml.edu
// Implements game logic for a 1-line Scrabble game using jQuery and jQuery UI


// Initialize tile bag, values, counts, and bonus score map
const tileBag = [];
const tileValues = {
  A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,K:5,L:1,M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,U:1,V:4,W:4,X:8,Y:4,Z:10
};
const tileCounts = {
  A:9,B:2,C:2,D:4,E:12,F:2,G:3,H:2,I:9,J:1,K:1,L:4,M:2,N:6,O:8,P:2,Q:1,R:6,S:4,T:6,U:4,V:2,W:2,X:1,Y:2,Z:1
};

// Score multipliers for each board cell (15 total)
// Only 2W (double word) and 2L (double letter) are included per spec
const scoreMultipliers = ['', '2W', '', '', '', '2L', '', '', '2L', '', '', '', '2W', '', ''];
let totalScore = 0;


// Re-initialize tile bag using distribution

function initTileBag() {
  tileBag.length = 0;
  for (let l in tileCounts) {
    for (let i = 0; i < tileCounts[l]; i++) {
      tileBag.push(l);
    }
  }
}

function createTileElement(letter) {
  return $('<img class="tile">')
    .attr('src', `graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`)
    .attr('data-letter', letter)
    .css({ width: '60px', height: '60px' })
    .draggable({ revert: 'invalid', helper: 'clone' });
}

function dealRack() {
  $('#rack').empty();
  for (let i = 0; i < 7; i++) {
    const letter = tileBag.splice(Math.floor(Math.random() * tileBag.length), 1)[0];
    const tile = createTileElement(letter);

    $('<div class="rack-slot"></div>')
      .css('left', `${30 + i * 85}px`)
      .append(tile)
      .appendTo('#rack');
  }
}

function initBoard() {
  const container = $('#board-container');
  container.empty();
  for (let i = 0; i < 15; i++) {
    $('<div class="drop-zone"></div>')
      .css('left', `${i * 75}px`)
      .attr('data-index', i)
      .attr('data-bonus', scoreMultipliers[i])
      .droppable({
        accept: '.tile',
        drop: function(e, ui) {
          if ($(this).children().length === 0) {
            const dropped = $(ui.helper).clone().removeClass('ui-draggable-dragging');
            $(this).append(dropped);
            ui.draggable().draggable('disable').parent().empty();
          }
        }
      }).appendTo(container);
  }
}

function calculateScore() {
  let wordScore = 0, wordMultiplier = 1, used = [];
  $('.drop-zone').each(function() {
    const tile = $(this).children('.tile');
    if (tile.length) {
      const l = tile.data('letter');
      let val = tileValues[l];
      const bonus = $(this).data('bonus');
      if (bonus === '2L') val *= 2;
      if (bonus === '2W') wordMultiplier *= 2;
      wordScore += val;
      used.push(+$(this).data('index'));
    }
  });
  used.sort((a,b)=>a-b);
  for (let i = 1; i < used.length; i++) {
    if (used[i] !== used[i-1] + 1) return 0;
  }
  return wordScore * wordMultiplier;
}

$('#submit').click(() => {
  const wordScore = calculateScore();
  if (wordScore === 0) return alert('Invalid word. Letters must be contiguous.');
  totalScore += wordScore;
  $('#score').text(totalScore);
  initBoard();
  dealRack();
});

$('#restart').click(() => {
  totalScore = 0;
  $('#score').text(0);
  initTileBag();
  initBoard();
  dealRack();
});

initTileBag();
initBoard();
dealRack();