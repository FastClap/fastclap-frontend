import React, { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { fromRange } from 'xpath-range';
import { Rangy } from 'rangy';

import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

import './App.css';

interface UserAnnotations {
  startOffset: number;
  endOffset: number;
  startContainer: string;
  endContainer: string;
  highlightId: any;
}

function App() {
  const [userAnnotations, setUserAnnotations] = useState<UserAnnotations>();

  const stringToParse =
    '      1. INT. NUIT. CHAMBRE/ APPARTEMENT PARISIEN.\n\nRaphaëlle, dite Raf, visage de caractère, 50 ans, a les yeux\ngrands ouverts. On sent qu’elle n’arrive pas à dormir. Elle se\ntourne, se retourne, dans son lit.\nElle attrape son téléphone portable sur la table de chevet,\nconsulte l’écran : il est 5 heures 30. Elle se redresse, puis\nécrit à toute vitesse un texto :\n\n                        RAF\n         On a passé dix ans ensemble. DIX ans. On\n         parle de se séparer et toi ça te fait ni\n         chaud ni froid. T’es vraiment une salope.\n\nElle efface les deux derniers mots et écrit à la place :\n« dégueulasse » puis efface à nouveau et écrit « dure » puis\n« très dure ». Elle envoie le texto. On entend une vibration\nde bip de téléphone de l’autre côté du lit.\nRaf enchaîne aussi sec et en envoie un autre.\n\n                        RAF\n         T’en as vraiment rien à foutre de notre\n         histoire ! C’est ça ?\n\nOn entend de nouveau des petits bruits de réception de textos.\nRaf, déterminée, continue sans trop réfléchir.\n\n                        RAF\n         T’as pas de sentiments. T’es horrible.\n\nRaf, entrainée par l’ivresse des textos, enchaîne.\n\n                        RAF\n         Je me demande comment j’ai pu rester avec\n         toi aussi longtemps sans m’en rendre\n         compte.\n\nElle renvoie un texto rageur. On entend de nouveau la petite\nvibration du texto qui vient d’arriver.\nRaf se penche alors de l’autre côté du lit.\nOn découvre une touffe de cheveux semblant appartenir à la\ndestinataire des messages.\n\n                        RAF\n         Comment tu fais pour aussi bien dormir ?\n\n\n\n\n                                                             1\n\f';

  function surroundSelection() {
    const span = document.createElement('span');
    span.style.fontWeight = 'bold';
    span.style.color = 'green';
    span.id = 'highlight';

    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel?.rangeCount) {
        const range = sel.getRangeAt(0).cloneRange();
        if (range.commonAncestorContainer.parentElement?.id === 'highlight') {
          range.commonAncestorContainer.parentElement.replaceWith(
            ...range.commonAncestorContainer.parentElement.childNodes
          );
          return;
        }
        range.surroundContents(span);
        console.log(range);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  const getSelection = () => {
    if (window.getSelection()) {
      console.log(window.getSelection()?.toString());
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const xpath = fromRange(range);
      const { startOffset, endOffset, startContainer, endContainer } = getXpathParameters(xpath);

      const result = document
        .evaluate(xpath.start, document, null, XPathResult.ANY_TYPE, null)
        .iterateNext();

      console.log('range', range);

      const userAnnotations: UserAnnotations = {
        startOffset: startOffset,
        endOffset: endOffset,
        startContainer: startContainer,
        endContainer: endContainer,
        highlightId: uuidv4()
      };

      console.log(userAnnotations);
      setUserAnnotations(userAnnotations);

      return window.getSelection();
    }

    if (document.getSelection()) {
      console.log(document.getSelection());
      return document.getSelection();
    }

    return null;
  };

  const getXpathParameters = (xpath: any) => {
    const startOffset = xpath.startOffset;
    const endOffset = xpath.endOffset;
    let startContainer = xpath.start;
    // /div[2]/p[7]/text()[1] -> /div[2]/p[7]/text[1]
    startContainer = startContainer.replace(/(|)/g, '');
    let endContainer = xpath.end;
    endContainer = endContainer.replace(/(|)/g, '');
    return { startOffset, endOffset, startContainer, endContainer };
  };

  return (
    <div className="App">
      <div onMouseUp={surroundSelection}>{stringToParse}</div>
    </div>
  );
}

export default App;
