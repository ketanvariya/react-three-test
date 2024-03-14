import React, { Component } from 'react'
import "../../css/home.css"
import{ useState } from 'react';
import potrace from 'potrace';
console.log(potrace,
  "potrace")
export default class HomeView extends Component {
    render() {
        return (
            <div >
              <div className='container' >
                <div id='container3D'></div>
              </div>
            </div>
          )
    }
}



export function ImageToSvgConverter() {
  const [svgData, setSvgData] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const tracedSvg = traceImage(img);
          setSvgData(tracedSvg);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const traceImage = (image) => {
    const bitmap = potrace.trace(image);
    const svgData = potrace.getSVG(bitmap);
    return svgData;
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {svgData && (
        <div>
          <h2>Converted SVG:</h2>
          {/* Render the SVG using dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: svgData }} />
        </div>
      )}
    </div>
  );
}

