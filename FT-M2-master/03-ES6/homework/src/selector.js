var traverseDomAndCollectElements = function (matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien

  // TU CÓDIGO AQUÍ
  if(matchFunc(startEl)) {
    resultSet.push(startEl);
  } 

  for(let i = 0; i < startEl.children.length; i++) {
    let aux = traverseDomAndCollectElements(matchFunc, startEl.children[i]);
    resultSet = [...resultSet, ...aux]
  }

  return resultSet;
};



// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function (selector) {
  // tu código aquí
  // 'h2'
  // # -> id
  // . -> class
  // tag.class -> tag class
  //  -> tag

  if(selector[0] === '#') return 'id';
  if(selector[0] === '.') return 'class';
  if(selector.includes('.')) return 'tag.class';

  return 'tag';
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function (selector) 
  { // 'h2'
    let selectorType = selectorTypeMatcher(selector); // 'tag'
    let matchFunction;
  
    if (selectorType === "id") { // 'id' === 'id'
    
      matchFunction = function(element) { // <div id='price'></div>
        return selector === `#${element.id}`; // '#price'
      }
  
    } else if (selectorType === "class") { // 'class' === 'class'
  
      matchFunction = function(element) { 
        // <img class="thumbnail lead lightback"/>
        let classes = element.classList; // ['thumbnail', 'lead', 'lightback']
        
        for(let i = 0; i < classes.length; i++) {
          if(`.${classes[i]}` === selector) return true;
          // '.thumbnail' === '.thumbnail'
        }
  
        return false;
      }
  
    } else if (selectorType === "tag.class") { 
      // 'tag.class'==='tag.class'
  
      matchFunction = (element) => {
        // element -> <img class="thumbnail lead lightback"/>
        // selector -> 'img.thumbnail'
  
        let [tagName, className ] = selector.split('.');
        
        let primerLlamado = matchFunctionMaker(tagName); // esto retorna la fn MATCHFUNCTION para evaluar el TAG
        let llamadoDos = primerLlamado(element); // llamo a MATCHFUNCTION pasándole el elemento
        let segundoLlamado = matchFunctionMaker(`.${className}`); //  esto retorna la fn MATCHFUNCTION para evaluar el CLASS
        let llamadoCuatro = segundoLlamado(element); // llamo a MATCHFUNCTION pasándole el elemento
  
        return llamadoDos && llamadoCuatro; // 
        // return matchFunctionMaker(tagName)(element) && matchFunctionMaker(`.${className}`)(element);
         //               TRUE                      &&                   TRUE               => TRUE
      }
  
    } else if (selectorType === "tag") { // 'tag' === 'tag'
  
      matchFunction = (element) => { // <h2></h2>
        return element.tagName.toLowerCase() === selector;
              // 'H2'.toLowerCase() -> 'h2' === 'h2'
      }
  
    }
    return matchFunction;
  };

var $ = function (selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
