import React from 'react';
import domtoimage from 'dom-to-image';
import { jsPDF } from "jspdf";

const GenericPdfDownloader = ({rootElementId , downloadFileName}) => {

    const onButtonClick = () => {
        let domElement = document.getElementById(rootElementId);
        domtoimage.toPng(domElement)
          .then(function (dataUrl) {
            const pdf = new jsPDF();
            pdf.addImage(dataUrl, 'PNG', 10, 20, 200, 250);
            pdf.save(downloadFileName+".pdf");
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
      };

    return <button  className="btn btn-outline-primary w-xl mx-3" onClick={onButtonClick}>Download Pdf</button>

}

export default GenericPdfDownloader;