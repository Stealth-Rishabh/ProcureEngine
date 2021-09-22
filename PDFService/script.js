let pdf = new jsPDF("p", "mm", "a4");

const filename = "ThisIsYourPDFFilename.pdf";

function recGeneratePdf(pages, idx) {
  const page = pages[idx];
  if (idx < pages.length && page) {
    setTimeout(() => {
      html2canvas(page, { logging: true, useCORS: true }).then((canvas) => {
        console.log(`Generation page ${idx}`);
        if (idx !== 0) {
          pdf.addPage();
        }
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);
        recGeneratePdf(pages, idx + 1);
      });
    }, 0);
  }
  else
  {
    pdf.save(filename);
  }
}

function print() {
    const pages = document.querySelectorAll("#divGenerateReport");
  recGeneratePdf(Array.from(pages), 0);
}

document.getElementById("createPDF").addEventListener("click", print);
