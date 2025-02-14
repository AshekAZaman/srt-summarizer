import "./SrtPreview.css";

const SrtPreview = ({ srtContent }) => {
    return (
      <div className="srt-preview">
        <h3>Extracted Subtitle Text:</h3>
        <p>{srtContent.substring(0, 500)}...</p>
      </div>
    );
  };
  
  export default SrtPreview;
  