const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },
  scene: { preload, create, update }
};
const game = new Phaser.Game(config);
let player, cursors, platforms, goal, levelText, spikes;
let currentLevel = 1;
let maxLevel = 10;
let leftBtn, rightBtn, jumpBtn;
let movingLeft = false, movingRight = false;
function preload() {
  this.load.image('ball', 'https://i.imgur.com/zL4Krbz.png');
  this.load.image('platform', 'https://i.imgur.com/tgZz0Ib.png');
  this.load.image('goal', 'https://i.imgur.com/7xjyfpv.png');
  this.load.image('spike', 'https://i.imgur.com/xXBcU7b.png');
}
function create() {
  createLevel.call(this, currentLevel);
  cursors = this.input.keyboard.createCursorKeys();
  leftBtn = document.getElementById('left');
  rightBtn = document.getElementById('right');
  jumpBtn = document.getElementById('jump');
  leftBtn.addEventListener('touchstart', () => movingLeft = true);
  leftBtn.addEventListener('touchend', () => movingLeft = false);
  rightBtn.addEventListener('touchstart', () => movingRight = true);
  rightBtn.addEventListener('touchend', () => movingRight = false);
  jumpBtn.addEventListener('touchstart', () => {
    if (player.body.touching.down) player.setVelocityY(-500);
  });
}
function update() {
  if (cursors.left.isDown || movingLeft) player.setVelocityX(-200);
  else if (cursors.right.isDown || movingRight) player.setVelocityX(200);
  else player.setVelocityX(0);
  if ((cursors.up.isDown) && player.body.touching.down) player.setVelocityY(-500);
}
function createLevel(level) {
  this.physics.world.colliders.destroy();
  this.physics.world.overlapColliders = [];
  this.scene.restart();
  platforms = this.physics.add.staticGroup();
  spikes = this.physics.add.staticGroup();
  const layout = [
    { x: 200, y: 500 },
    { x: 500, y: 400 },
    { x: 800, y: 300 },
    { x: 400 + level * 30, y: 200 }
  ];
  layout.forEach(pos => platforms.create(pos.x, pos.y, 'platform'));
  spikes.create(600, 550, 'spike');
  goal = this.physics.add.staticImage(900, 250, 'goal');
  player = this.physics.add.image(100, 100, 'ball');
  player.setBounce(0.6);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, spikes, () => this.scene.restart(), null, this);
  this.physics.add.overlap(player, goal, () => {
    currentLevel++;
    if (currentLevel <= maxLevel) this.scene.restart();
    else {
      this.add.text(200, 200, '🎉 All Levels Complete! 🎉', { fontSize: '32px', fill: '#fff' });
      this.scene.pause();
    }
  }, null, this);
  levelText = this.add.text(20, 20, 'Level ' + level, { fontSize: '24px', fill: '#fff' });
}