import "./FileUpload.css";

const FileUpload = ({ setUploadedFile, setSrtContent }) => {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.name.endsWith(".srt")) {
        setUploadedFile(file);
  
        const reader = new FileReader();
        reader.onload = (e) => {
          setSrtContent(e.target.result);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid .srt file");
      }
    };
  
    return (
      <input type="file" accept=".srt" onChange={handleFileUpload} className="file-input" />
    );
  };
  
  export default FileUpload;
  