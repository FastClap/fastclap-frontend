import { Document, Page, pdfjs } from 'react-pdf';
import PDFile from './Test.pdf';

import workerFilePath from 'pdfjs-dist/build/pdf.worker.min.js';

pdfjs.GlobalWorkerOptions.workerSrc = workerFilePath;

const TestPDF = () => {
  return (
    <Document file={PDFile}>
      <Page />
    </Document>
  );
};

export default TestPDF;
