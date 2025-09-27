
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
  
}

const saveMemory = (category, list) => {
  myInMemoryDb.memory[category] = list;
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