//const fss = require("fs");
//const filePath = '.data/randomness.json';

const myInMemoryDb = {
  memory: {}
};

const maxTries = 3;
const maxMemory = 10;


const getMemory = (category) => {
  const memory = myInMemoryDb.memory;
  
  if (memory.hasOwnProperty(category) && Array.isArray(memory[category])) {
    return memory[category];
  }

  return [];
  
 // if (fss.existsSync(filePath)) {
 //   return JSON.parse(fss.readFileSync(filePath, "utf-8" ));
 // }
 // else {
//    return {};
 // }
}

const saveMemory = (category, list) => {
  myInMemoryDb.memory[category] = list;
 // fss.writeFileSync(filePath, JSON.stringify(memory), { encoding:"utf-8" });
}


const findNumber = (list, count) => {
  
  let item = 0;
  for (let i = 0; i < (maxTries*count); i++) 
  {
    item = Math.floor(Math.random() * count);
    let nextItem = (item==(count-1)?0:item + 1);
    
    if (!list.includes(item)) {
      
      return item;
      
    }
    
    if (!list.includes(nextItem)) {
      return nextItem;
    }
    
    
  }
  
  // we couldn't find a list, so use a value that is at the start of the list
  // which is going to be at least maxMemory old
  return list[0];
  
  
}

const getRandomIndex = (category, count) => {
  
  
  
  const list = getMemory(category);
  
  const result = findNumber(list, count);
  
  list.push(result);
  
  if (list.length > Math.min(maxMemory, count)) {
    list.shift();
  }
  
  saveMemory(category, list);

  
  return result;
}

  


module.exports = {
  getRandomIndex: getRandomIndex
};