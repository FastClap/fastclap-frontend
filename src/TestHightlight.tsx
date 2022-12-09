import { useState } from 'react';

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight
} from './react-pdf-highlighter';

import { Spin } from 'antd';
import { EventEmitter } from 'stream';

import type { IHighlight, NewHighlight } from './react-pdf-highlighter';

import { testHighlights as _testHighlights } from './HighLight/test-highlight';

const TestHighlight = () => {
  const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;
  const [url, setUrl] = useState<string>('https://arxiv.org/pdf/1708.08021.pdf');
  const [highlights, setHighlights] = useState(testHighlights[url]);

  const getNextId = () => String(Math.random()).slice(2);

  const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length);

  const resetHash = () => {
    document.location.hash = '';
  };

  const HighlightPopup = ({ comment }: { comment: { text: string; emoji: string } }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const scrollViewerTo = (highlight: any) => {};

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    console.log('Saving highlight', highlight);

    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  const componentDidMount = () => {
    window.addEventListener('hashchange', scrollToHighlightFromHash, false);
  };

  return (
    <div>
      <PdfLoader url={url} beforeLoad={<Spin />}>
        {(pdfDocument: any) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            highlightTransform={(
              highlight,
              index,
              setTip,
              hideTip,
              viewportToScaled,
              screenshot,
              isScrolledTo
            ) => {
              const component = (
                <Highlight
                  isScrolledTo={isScrolledTo}
                  position={highlight.position}
                  comment={highlight.comment}
                />
              );

              return (
                <Popup
                  popupContent={<HighlightPopup {...highlight} />}
                  onMouseOver={(popupContent) => setTip(highlight, (highlight) => popupContent)}
                  onMouseOut={hideTip}
                  key={index}
                  // eslint-disable-next-line react/no-children-prop
                  children={component}
                />
              );
            }}
            onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (
              <Tip
                onOpen={transformSelection}
                onConfirm={(comment) => {
                  console.log(comment, position, content);
                  addHighlight({ content, position, comment });

                  hideTipAndSelection();
                }}
              />
            )}
            highlights={highlights}
            onScrollChange={() => {
              return <div></div>;
            }}
            scrollRef={(scrollTo) => {
              scrollToHighlightFromHash();
            }}
            enableAreaSelection={(event: any) => event.altKey}></PdfHighlighter>
        )}
      </PdfLoader>
    </div>
  );
};

export default TestHighlight;
