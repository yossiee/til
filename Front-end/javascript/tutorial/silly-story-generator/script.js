let customName = document.getElementById('customname');
let randomize = document.querySelector('.randomize');
let story = document.querySelector('.story');

randomize.addEventListener('click', result);

const storytext = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
const insertX = [
  "Willy the Goblin",
  "Big Daddy",
  "Father Christmas"
];
const insertY = [
  "the soup kitchen",
  "Disneyland",
  "the White House"
];
const insertZ = [
  "spontaneously combusted",
  "melted into a puddle on the sidewalk",
  "turned into a slug and crawled away"
];

function result() {
  let newStory = storytext;
  let xItem = randomValueFromArray(insertX);
  let yItem = randomValueFromArray(insertY);
  let zItem = randomValueFromArray(insertZ);

  newStory = newStory.replace(':insertx:', xItem);
  newStory = newStory.replace(':insertx:', xItem);
  newStory = newStory.replace(':inserty:', yItem);
  newStory = newStory.replace(':insertz:', zItem);

  if (customName.value !== '') {
    const name = customName.value
    newStory = newStory.replace('Bob', name);
  }
  if (document.getElementById('uk').chicked) {
    const weight = Math.round(300*0.0714286) + ' stone';
    const temparature = Math.round((94-32)*5/9) + ' centigrade';
    newStory = newStory.replace('300 pounds', weight);
    newStory  = newStory.replace('94 fahrenheit', temparature);
  }

  story.textContent = newStory;
  story.style.visibility = 'visible';
}

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}
