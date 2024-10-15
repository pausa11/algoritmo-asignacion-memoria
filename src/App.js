import React, {useState, useEffect} from 'react';

function App() {

  const [rowsNumber, setRowsNumber] = useState(3);
  const [referenceString, setReferenceString] = useState('');

  const referenceStringToArray = () => {
    return referenceString.split(' ');
  }

  //--------------------------------------------------------------------------------

  const [fifoChart, setFifoChart] = useState([]);
  const [fifosFault,setFifosFault] = useState(0);
  const fifo = () => {
    const referenceArray = referenceStringToArray();
    const frames = rowsNumber;
    let fifoFrames = Array(frames).fill(null); 
    let faultsCounter = 0;
    let fifoChartArray = []; 
    let queue = []; 

    for (let i = 0; i < referenceArray.length; i++) {
      let currentPage = referenceArray[i];

      // Si la página no está en los marcos
      if (!fifoFrames.includes(currentPage)) {
        if (queue.length < frames) {
          // Aún hay espacio en los marcos
          fifoFrames[queue.length] = currentPage;
        } else {
          // Reemplaza la página más antigua (primera en la cola)
          const oldestPage = queue.shift();
          const replaceIndex = fifoFrames.indexOf(oldestPage);
          fifoFrames[replaceIndex] = currentPage;
        }
        queue.push(currentPage);
        faultsCounter++;
      }
      fifoChartArray.push([...fifoFrames]);
    }
    setFifosFault(faultsCounter);
    setFifoChart(rotateMatrix(fifoChartArray));
  };

  //--------------------------------------------------------------------------------
  
  const [lruChart, setLruChart] = useState([]);
  const [lrusFault,setLrusFault] = useState(0);
  const lru = () => {
    const referenceArray = referenceStringToArray();
    const frames = rowsNumber;
    let lruFrames = Array(frames).fill(null); 
    let faultsCounter = 0;
    let lruChartArray = []; 
    let queue = []; 

    for (let i = 0; i < referenceArray.length; i++) {
      let currentPage = referenceArray[i];

      // Si la página no está en los marcos
      if (!lruFrames.includes(currentPage)) {
        if (queue.length < frames) {
          // Aún hay espacio en los marcos
          lruFrames[queue.length] = currentPage;
        } else {
          // Reemplaza la página menos recientemente usada
          const leastRecentPage = queue.shift();
          const replaceIndex = lruFrames.indexOf(leastRecentPage);
          lruFrames[replaceIndex] = currentPage;
        }
        queue.push(currentPage);
        faultsCounter++;
      } else {
        // Actualiza la página en la cola
        const index = queue.indexOf(currentPage);
        queue.splice(index, 1);
        queue.push(currentPage);
      }
      lruChartArray.push([...lruFrames]);
    }
    setLrusFault(faultsCounter);
    setLruChart(rotateMatrix(lruChartArray));
  }

  //--------------------------------------------------------------------------------
  
  const [optimalChart, setOptimalChart] = useState([]);
  const [optimalsFault,setOptimalsFault] = useState(0);
  const optimal = () => {
    const referenceArray = [6, 1, 7, 1, 2, 1, 5, 6, 0, 1, 7, 1, 1, 6, 0, 7, 0, 1, 2, 6, 1]; 
    const rowsNumberToInteger = parseInt(rowsNumber);
    const frames = rowsNumberToInteger;
    let optimalFrames = Array(frames).fill(null); 
    let faultsCounter = 0; 
    let optimalChartArray = [];
  
    for (let i = 0; i < referenceArray.length; i++) {
      let currentPage = referenceArray[i];
  
      if (!optimalFrames.includes(currentPage)) {
        if (optimalFrames.includes(null)) {
          const nullIndex = optimalFrames.indexOf(null);
          optimalFrames[nullIndex] = currentPage;
        } else {
          let replaceIndex = 0;
          let maxDistance = -1;
  
          for (let j = 0; j < optimalFrames.length; j++) {
            const page = optimalFrames[j];
            const distance = referenceArray.slice(i + 1).indexOf(page);
  
            console.log(`Page: ${page}, Distance: ${distance}`);
  
            if (distance === -1) {
              replaceIndex = j;
              break;
            }
  
            if (distance > maxDistance) {
              replaceIndex = j;
              maxDistance = distance;
            }
          }
          optimalFrames[replaceIndex] = currentPage;
        }
  
        faultsCounter++;
      }
  
      optimalChartArray.push([...optimalFrames]);
    }
  
    setOptimalsFault(faultsCounter);
    setOptimalChart(rotateMatrix(optimalChartArray));
  };
  

  //--------------------------------------------------------------------------------

  const [upgradedChart, setUpgradedChart] = useState([]);
  const [upgradedsFault, setUpgradedsFault] = useState(0);

  const secondChance = () => {
    const referenceArray = referenceStringToArray();
    const frames = rowsNumber;
    let secondChanceFrames = Array(frames).fill(null);
    let faultsCounter = 0;
    let secondChanceChartArray = [];
    let queue = [];

    for (let i = 0; i < referenceArray.length; i++) {
      let currentPage = referenceArray[i];

      // Si la página no está en los marcos
      if (!secondChanceFrames.includes(currentPage)) {
        if (queue.length < frames) {
          // Aún hay espacio en los marcos
          secondChanceFrames[queue.length] = currentPage;

          // Si la página no está en la cola, se le da una segunda oportunidad
          if (!queue.includes(currentPage)) {
            queue.push(currentPage);
          }
        }
        else {
          // Reemplaza la página que no se usará por más tiempo
          let replaced = false;
          while (!replaced) {
            const oldestPage = queue.shift();
            const replaceIndex = secondChanceFrames.indexOf(oldestPage);
            if (secondChanceFrames[replaceIndex] !== null) {
              secondChanceFrames[replaceIndex] = currentPage;
              queue.push(currentPage);
              replaced = true;
            }
          }
        }
        faultsCounter++;
      }
      else {
        // Actualiza la página en la cola
        const index = queue.indexOf(currentPage);
        if (index !== -1) {
          queue.splice(index, 1);
          queue.push(currentPage);
        }
      }
      secondChanceChartArray.push([...secondChanceFrames]);
    }
    setUpgradedsFault(faultsCounter);
    setUpgradedChart(rotateMatrix(secondChanceChartArray));
  }
  
  //--------------------------------------------------------------------------------

  const rotateMatrix = (matrix) => {
    const rows = matrix.length;
    const cols = rowsNumber;
    let rotatedMatrix = [];

    for (let i = 0; i < cols; i++) {
      let newRow = [];
      for (let j = 0; j < rows; j++) {
        newRow.push(matrix[j][i]);
      }
      rotatedMatrix.push(newRow);
    }
    return rotatedMatrix;
  };

  //--------------------------------------------------------------------------------

  return (
    <div style={{height:'100vh',width:'100vw', background:'white',display:'flex',flexDirection:'column',alignItems:'center'}}>
      
      <h1>Algoritmo de remplazo de páginas</h1>

      <div id='inputsSelector' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <label>Ingresa la cadena de referencia</label>
        <input type='text' value={referenceString} onChange={(e)=>setReferenceString(e.target.value)} placeholder='Ejemplo: 1 2 3 4 1 2 5 1 2 3 4 5' />
        <label>Selecciona el número de filas</label>
        <input type='number' value={rowsNumber} onChange={(e)=>setRowsNumber(e.target.value)} min={2} max={10} />
        <button onClick={()=>{fifo();lru();optimal();secondChance()}}>Calcular</button>
      </div>

      <div id='fifoChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <h2>FIFO</h2>
        <table>
          <thead>
            <tr >
              {
                referenceStringToArray().map((item,index)=>{
                  return <th key={index} style={{width:'2vw'}}>{item}</th>
                }) 
              }
            </tr>
          </thead>
          <tbody>
            {
              fifoChart.map((frame,index)=>{
                return (
                  <tr key={index}>
                    {
                      frame.map((item,index)=>{
                        return <td key={index} style={{width:'2vw'}}>{item}</td>
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <p>Fallos: {fifosFault}</p>
      </div> 

      <div id='lruChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <h2>LRU</h2>
        <table>
          <thead>
            <tr >
              {
                referenceStringToArray().map((item,index)=>{
                  return <th key={index} style={{width:'2vw'}}>{item}</th>
                }) 
              }
            </tr>
          </thead>
          <tbody>
            {
              lruChart.map((frame,index)=>{
                return (
                  <tr key={index}>
                    {
                      frame.map((item,index)=>{
                        return <td key={index} style={{width:'2vw'}}>{item}</td>
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <p>Fallos: {lrusFault}</p>
      </div> 

      <div id='optimalChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <h2>Óptimo</h2>
        <table>
          <thead>
            <tr >
              {
                referenceStringToArray().map((item,index)=>{
                  return <th key={index} style={{width:'2vw'}}>{item}</th>
                }) 
              }
            </tr>
          </thead>
          <tbody>
            {
              optimalChart.map((frame,index)=>{
                return (
                  <tr key={index}>
                    {
                      frame.map((item,index)=>{
                        return <td key={index} style={{width:'2vw'}}>{item}</td>
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <p>Fallos: {optimalsFault}</p>
      </div>

      <div id='upgradedChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <h2>Mejorado</h2>
        <table>
          <thead>
            <tr >
              {
                referenceStringToArray().map((item,index)=>{
                  return <th key={index} style={{width:'2vw'}}>{item}</th>
                }) 
              }
            </tr>
          </thead>
          <tbody>
            {
              upgradedChart.map((frame,index)=>{
                return (
                  <tr key={index}>
                    {
                      frame.map((item,index)=>{
                        return <td key={index} style={{width:'2vw'}}>{item}</td>
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <p>Fallos: {upgradedsFault}</p>
      </div>

    </div>
  );
}

export default App;
