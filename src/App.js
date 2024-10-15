import React, {useState} from 'react';
import './App.css';

function App() {

  const [rowsNumber, setRowsNumber] = useState(3);
  const [referenceString, setReferenceString] = useState('');
  const [showResults, setShowResults] = useState(false);

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
      let mark = false;
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
        mark = true;
      }
      //marca con un f, a la posición que se reemplazó la página 
      fifoChartArray.push([...fifoFrames]);
      if(mark){
        const index = fifoChartArray.length - 1;
        fifoChartArray[index][fifoFrames.indexOf(currentPage)] = `${currentPage}f`;
      }
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
      let mark = false;
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
        mark = true;
      } else {
        // Actualiza la página en la cola
        const index = queue.indexOf(currentPage);
        queue.splice(index, 1);
        queue.push(currentPage);
      }
      lruChartArray.push([...lruFrames]);
      if(mark){
        const index = lruChartArray.length - 1;
        lruChartArray[index][lruFrames.indexOf(currentPage)] = `${currentPage}f`;
      }

    }
    setLrusFault(faultsCounter);
    setLruChart(rotateMatrix(lruChartArray));
  }

  //--------------------------------------------------------------------------------
  
  const [optimalChart, setOptimalChart] = useState([]);
  const [optimalsFault,setOptimalsFault] = useState(0);
  const optimal = () => {
    const referenceArray = referenceStringToArray();
    const rowsNumberToInteger = parseInt(rowsNumber);
    const frames = rowsNumberToInteger;
    let optimalFrames = Array(frames).fill(null); 
    let faultsCounter = 0; 
    let optimalChartArray = [];
  
    for (let i = 0; i < referenceArray.length; i++) {
      let currentPage = referenceArray[i];
      let mark = false;
  
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
        mark = true;
      }
  
      optimalChartArray.push([...optimalFrames]);
      if(mark){
        const index = optimalChartArray.length - 1;
        optimalChartArray[index][optimalFrames.indexOf(currentPage)] = `${currentPage}f`;
      }
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
      let mark = false;

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
        mark = true;
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
      if(mark){
        const index = secondChanceChartArray.length - 1;
        secondChanceChartArray[index][secondChanceFrames.indexOf(currentPage)] = `${currentPage}f`;
      }
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

  const isReady = () => {
    if (referenceString !== '' && rowsNumber !== '') {
      setShowResults(true);
    }
    else {
      alert('Por favor, llena todos los campos');
    }
  }

  //--------------------------------------------------------------------------------

  return (
    <div style={{height:'100vh',width:'100vw', background:'white',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
      
      <h1 style={{textShadow: '0 0 1vh #8080803d',margin:'2vh'}}>Algoritmos de asignación de memoria</h1>
      <div id='inputsSelector' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <label style={{margin:'1vh'}}>Ingresa la cadena de referencia</label>
        <input type='text' value={referenceString} onChange={(e)=>setReferenceString(e.target.value)} placeholder='Ejemplo: 1 2 3 4 1 2 5 1 2 3 4 5' style={{width:'30%',borderRadius:'1vh',padding:'1ch',border:'.2vh solid #8080803d',display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',boxShadow:'0 0 1vh #8080803d'}} />
        <label style={{margin:'1vh'}}>Selecciona el número de filas</label>
        <input type='number' value={rowsNumber} onChange={(e)=>setRowsNumber(e.target.value)} min={2} max={10} style={{width:'30%',borderRadius:'1vh',padding:'1ch',border:'.2vh solid #8080803d',display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',boxShadow:'0 0 1vh #8080803d'}} />
        <button onClick={()=>{fifo();lru();optimal();secondChance();isReady()}} style={{margin:'1vh',borderRadius:'1vh',padding:'1ch',border:'none',display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',background:'#005eff',color:'white',fontWeight:'500',boxShadow:'0 0 1vh #005eff',fontSize:'2ch',marginTop:'1ch',letterSpacing:'.15vw'}}>Calcular</button>
      </div>

      {
        showResults && (
        <div className='animation' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
        <div id='fifoChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
          <h2>FIFO</h2>
          <table style={{borderCollapse: 'collapse', margin: 'auto'}}>
            <thead>
              <tr>
                {
                  referenceStringToArray().map((item, index) => {
                    return (
                      <th key={index} style={{width: '2vw'}}>
                        {item}
                      </th>
                    );
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                fifoChart.map((frame, index) => {
                  return (
                    <tr key={index}>
                      {
                        frame.map((item, index) => {
                          return (
                            <td 
                              key={index} 
                              style={{
                                width: '2vw', 
                                border: '1px solid black', 
                                textAlign: 'center', 
                                color: 'black',
                                padding: '5px',
                                background: typeof item === 'string' && item.includes('f') ? 'rgba(255,0,0,0.6)' : 'white'
                              }}>
                              {typeof item === 'string' ? item.replace('f','') : item}
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <p>Fallos: {fifosFault}</p>
        </div>

        <div id='lruChart' style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
          <h2>LRU</h2>
          <table style={{borderCollapse: 'collapse', margin: 'auto'}}>
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
                          return                           <td 
                          key={index} 
                          style={{
                            width: '2vw', 
                            border: '1px solid black', 
                            textAlign: 'center', 
                            color: 'black',
                            padding: '5px',
                            background: typeof item === 'string' && item.includes('f') ? '#0040ff99' : 'white'
                          }}>{typeof item === 'string' ? item.replace('f','') : item}</td>
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
          <table style={{borderCollapse: 'collapse', margin: 'auto'}}>
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
                          return <td 
                          key={index} 
                          style={{
                            width: '2vw', 
                            border: '1px solid black', 
                            textAlign: 'center', 
                            color: 'black',
                            padding: '5px',
                            background: typeof item === 'string' && item.includes('f') ? '#2eff0099' : 'white'
                          }}>{typeof item === 'string' ? item.replace('f','') : item}</td>
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
          <table style={{borderCollapse: 'collapse', margin: 'auto'}}>
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
                          return                           <td 
                          key={index} 
                          style={{
                            width: '2vw', 
                            border: '1px solid black', 
                            textAlign: 'center', 
                            color: 'black',
                            padding: '5px',
                            background: typeof item === 'string' && item.includes('f') ? '#e500ff99' : 'white'
                          }}>{typeof item === 'string' ? item.replace('f','') : item}</td>
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
        )
      }

    </div>
  );
}

export default App;
